import { Context, InlineKeyboard } from 'grammy'
import {
  addChannel,
  checkUser,
  deleteChannel,
} from '../../db/methods'
import validateId from '../utils/validateId'
import { parseCallbackData } from '../utils/parseCallBack'

export async function channelMenu(ctx: Context) {
  const channelId = parseCallbackData(ctx.callbackQuery!.data!)

  const channelData = await ctx.api.getChat(validateId(channelId))
  const channel = await ctx.api.getChat(channelId)

  await ctx.reply(
    `Канал: <a href='${
      channel.username
        ? `https://t.me/${channel.username}/`
        : channel.invite_link
    }'>${channelData.title ? channelData.title : '❓'}</a>`,
    {
      reply_markup: new InlineKeyboard()
        .text('❌ Удалить', `del-${channelId}`)
        .row()
        .text('Назад в меню ⤵️', `adminMenu`),
    }
  )
}

export async function handleAddChannel(ctx: Context) {
  //@ts-ignore
  const channelId = ctx.message!.forward_origin!.chat.id
  const channel = await ctx.api.getChat(channelId)

  if (!channel.username && !channel.invite_link) {
    await ctx.reply(`🔐 КАНАЛ ПРИВАТНЫЙ ‼️
Боту нужна админка для добавления юзеров`)
  } else {
    await addChannel(channelId)
    await ctx.reply(`<b>✅ ДОБАВЛЕН канал <a href='${
      channel.username
        ? `https://t.me/${channel.username}/`
        : channel.invite_link
    }'>${channel.title}</a></b>
`)
  }
}

export async function handleDeleteChannel(ctx: Context) {
  const user = await checkUser(ctx.from!.id)

  if (!user?.is_admin) {
    return ctx.reply('❌ У тебя нет прав на это действие.')
  }

  const data = ctx.callbackQuery?.data
  if (!data?.startsWith('del-')) return

  const channelId = data.replace('del-', '')

  const channel = await ctx.api.getChat(validateId(channelId))
  await deleteChannel(channelId)

  await ctx.reply(
    `<b>❌ КАНАЛ УДАЛЁН: <a href='${
      channel.username
        ? `https://t.me/${channel.username}/`
        : channel.invite_link || ''
    }'>${channel.title}</a></b>`
  )
}

export async function channelInputWait(ctx: Context) {
  const { id } = ctx.from!

  const user = await checkUser(id)
  if (!user?.is_admin) {
    await ctx.reply('❌ У тебя нет прав на это действие.')
    return
  }

  await ctx.reply(
    `<b>📊 ДОБАВЛЕНИЕ КАНАЛА 🤖</b>
<blockquote>📩 перешлите любое сообщение из канала.

<b>❗️для приватных каналов нужно выдать боту права добавлять пользователей</b></blockquote>
`,
    {
      reply_markup: new InlineKeyboard().text(
        'Отменить',
        'adminMenu'
      ),
    }
  )
}
