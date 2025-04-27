import { Context, InlineKeyboard } from 'grammy'
import {
  addChannel,
  checkUser,
  deleteChannel,
  setUserState,
} from '../../db/methods'
import validateId from '../utils/validateId'
import { parseCallbackData } from '../utils/parseCallBack'
import { cancelAdminKb } from '../utils/keyboardBuilder'
import { adminMenu } from './adminService'

const channelEditKb = (channelId: number | string) => {
  return new InlineKeyboard()
    .text('❌ Удалить', `delChannel-${channelId}`)
    .row()
    .text('Назад в меню ⤵️', `adminMenu`)
}

export async function channelMenu(ctx: Context) {
  const channelId = parseCallbackData(ctx.callbackQuery!.data!)

  const channelData = await ctx.api.getChat(validateId(channelId))
  const channel = await ctx.api.getChat(channelId)

  await ctx.reply(
    `Канал: <a href='${
      channel.username
        ? `https://t.me/${channel.username}/`
        : channel.invite_link
    }'>${channelData.title ?? '❓'}</a>`,
    {
      reply_markup: channelEditKb(channelId),
    }
  )
}

export async function handleAddChannel(ctx: Context) {
  try {
    if (ctx.message?.forward_origin) {
      //@ts-ignore
      const channelId = ctx.message!.forward_origin.chat.id
      const channel = await ctx.api.getChat(channelId)

      if (!channel.username && !channel.invite_link) {
        await ctx.reply(`🔐 КАНАЛ ПРИВАТНЫЙ ‼️
Боту нужна админка для добавления юзеров`)
      } else {
        await addChannel(channelId)
        await ctx.reply(
          `<b>✅ ДОБАВЛЕН канал <a href='${
            channel.username
              ? `https://t.me/${channel.username}/`
              : channel.invite_link
          }'>${channel.title}</a></b>
`
        )
        await adminMenu(ctx)
      }
    } else {
      ctx.reply(
        '⚠️ Перешлите сообщение ИЗ КАНАЛА чтобы добавить его.',
        { reply_markup: cancelAdminKb }
      )
    }
  } catch (error) {
    ctx.reply('❌ Бота нет в канале', { reply_markup: cancelAdminKb })
  }
}

export async function handleDeleteChannel(ctx: Context) {
  const user = await checkUser(ctx.from!.id)

  if (!user?.is_admin) {
    return ctx.reply('❌ У тебя нет прав на это действие.')
  }

  const channelId = parseCallbackData(ctx.callbackQuery?.data!)

  const channel = await ctx.api.getChat(validateId(channelId))
  await deleteChannel(channelId)

  await ctx.reply(
    `<b>❌ КАНАЛ УДАЛЁН: <a href='${
      channel.username
        ? `https://t.me/${channel.username}/`
        : channel.invite_link || ''
    }'>${channel.title}</a></b>`
  )
  await adminMenu(ctx)
}

export async function channelInputWait(ctx: Context) {
  const { id } = ctx.from!

  const user = await checkUser(id)
  if (!user?.is_admin) {
    await ctx.reply('❌ У тебя нет прав на это действие.')
    return
  }

  await setUserState(ctx.from!.id, 'opchannel_input')

  await ctx.reply(
    `<b>📊 ДОБАВЛЕНИЕ КАНАЛА 🤖</b>
<blockquote>📩 перешлите любое сообщение из канала.

<b>❗️для приватных каналов нужно выдать боту права добавлять пользователей</b></blockquote>
`,
    {
      reply_markup: cancelAdminKb,
    }
  )
}
