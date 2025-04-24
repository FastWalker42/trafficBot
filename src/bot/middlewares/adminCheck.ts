import { Context, NextFunction } from 'grammy'
import { checkUser } from '../../db/methods'

export const adminCheck = async (
  ctx: Context,
  next: NextFunction
) => {
  const user = await checkUser(ctx.from!.id)
  if (!user?.is_admin) {
    await ctx.reply('❌ У тебя нет прав на это действие.')
    return
  }
  return next()
}
