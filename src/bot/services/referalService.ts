import { Context } from 'grammy'
import {
  checkUser,
  getUserById,
  increaseReferral,
  setUserSubscribed,
} from '../../db/methods'
import { User } from '../../db/types'

export async function handleReferral(
  ctx: Context,
  user: User,
  arg: string
) {
  if (!/^\d+$/.test(arg)) return

  const inviterId = Number(arg)
  if (!user?.is_newbie) return

  const inviter = await getUserById(inviterId)
  if (inviter) {
    await ctx.api.sendMessage(
      inviterId,
      `🔥⭐️ Кто-то перешёл по вашей ссылке!
Если он подпишется на каналы, вам засчитает реферала
👤 Всего рефералов: ${inviter.referals}`
    )
  }

  return
}

export async function approveReferral(ctx: Context) {
  const userData = await checkUser(ctx.from!.id)
  if (userData?.subscribed === 0) {
    const inviterId = userData!.invited_by

    await setUserSubscribed(ctx.from!.id, true)

    await increaseReferral(inviterId)
    const inviter = await getUserById(inviterId)

    if (inviter) {
      await ctx.api.sendMessage(
        inviter.user_id,
        `🥳 Реферал засчитан!
👤 Всего рефералов: ${inviter.referals}`
      )
    }
  }
}
