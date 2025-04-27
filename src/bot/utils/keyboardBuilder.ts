import { Context, InlineKeyboard, Keyboard } from 'grammy'
import { getAdmins, getAllChannels } from '../../db/methods'
import processChannel from './processChannel'
import validateId from './validateId'

export const getUserChannels = async (
  ctx: Context
): Promise<string[]> => {
  const channels = await getAllChannels()
  const userId = ctx.from!.id

  const tasks = channels.map((raw) =>
    processChannel(raw, ctx, userId)
  )
  const results = await Promise.all(tasks)

  return results.filter((link): link is string => !!link)
}

export const userKeyboard = (links: string[]) => {
  const kb = new InlineKeyboard()

  links.forEach((link, index) => {
    kb.url(`Канал ${index + 1}`, link)
    if (index % 2 !== 0) {
      kb.row()
    }
  })

  kb.text('✅ ПРОДОЛЖИТЬ', 'notabot')

  return kb
}

export const adminChannels = async (ctx: Context) => {
  const channels = await getAllChannels()

  const kb = new InlineKeyboard()

  for (let [index, channel] of channels.entries()) {
    const channelData = await ctx.api.getChat(validateId(channel))

    kb.text(`${channelData.title ?? '❓'}`, `edit-${channel}`)
    if (index % 2 !== 0) {
      kb.row()
    }
  }

  kb.text('➕ Добавить канал', 'addChannel').row()
  kb.text('📥 Запустить рассылку', 'prospam_all').row()

  kb.text('♻️ Обновить меню', 'adminMenu').row()

  return kb
}

export const editAdminsKeyboard = async (ctx: Context) => {
  const kb = new InlineKeyboard()
  const admins = await getAdmins()
  const currentUserId = ctx.from?.id

  for (const adminId of admins) {
    const isCurrentUser = currentUserId === adminId
    const label = `🆔${adminId}${isCurrentUser ? ' (ВЫ)' : ''}`
    const deleteCallback = isCurrentUser
      ? 'delme'
      : `deladmin-${adminId}`

    kb.text(label, `admin-${adminId}`)
      .text(
        isCurrentUser ? '🔒 Удалить' : '❌ Удалить',
        deleteCallback
      )
      .row()
  }

  kb.text('➕ Добавить админа', 'addAdmin')

  return kb
}

export const cancelAdminKb = new InlineKeyboard().text(
  '❌ Назад в меню',
  'adminMenu'
)

export const addAdminKb = new Keyboard()
  .requestUsers('Добавить админа', 34334, {
    user_is_bot: false,
  })
  .row()
  .requestChat('Добавить канал в ОП', 3, {
    chat_is_channel: true,
  })
  .resized(true)
