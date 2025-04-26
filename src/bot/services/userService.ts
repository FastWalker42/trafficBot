import { Context } from 'grammy'
import { getAllChannels } from '../../db/methods'

const validStatus = ['member', 'administrator', 'creator']

export async function checkUserSub(ctx: Context): Promise<boolean> {
  const userId = ctx.from!.id
  const channels = await getAllChannels()

  for (const channel of channels) {
    try {
      const chatMember = await ctx.api.getChatMember(channel, userId)
      if (!validStatus.includes(chatMember.status)) {
        return false
      }
    } catch {
      return false
    }
  }

  return true
}
