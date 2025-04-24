import { Context } from 'grammy'
import validateId from './validateId'

const validStatus = ['member', 'administrator', 'creator']

export default async (
  raw: string,
  ctx: Context,
  userId: number
): Promise<string | null> => {
  const channel = validateId(raw)

  try {
    const member = await ctx.api.getChatMember(channel, userId)
    if (validStatus.includes(member.status)) return null
  } catch {
    // Не подписан или ошибка — продолжаем
  }

  if (channel.startsWith('-')) {
    try {
      const invite = await ctx.api.createChatInviteLink(channel)
      return invite.invite_link
    } catch {
      return null
    }
  }

  return `https://t.me/${channel.replace(/^@/, '')}`
}
