import { Context, InlineKeyboard } from 'grammy'
import { checkUser } from '../../db/methods'
import { adminMenu } from '../services/adminService'
import { handleReferral } from '../services/referalService'
import { parseCommandArgs } from '../utils/parseCommandArgs'

export default async (ctx: Context) => {
  const { id, first_name } = ctx.from!
  const text = ctx.message?.text

  if (!id) return

  const arg = parseCommandArgs(text)
  const user = await checkUser(id, Number(arg))

  if (user && arg) {
    await handleReferral(ctx, user, arg)
  }

  await ctx.replyWithPhoto(
    'https://i.ibb.co/DDtzWYpB/photo-2025-04-19-22-47-26.jpg',
    {
      caption: `Привет, ${first_name ?? 'друг'}!
      
Тебе доступен подарок 15 ⭐️, 
чтобы получить нажми на кнопку ниже👇`,
      reply_markup: new InlineKeyboard().text(
        '✅ Я не робот 🤖',
        'notabot'
      ),
    }
  )

  if (user?.is_admin) {
    await adminMenu(ctx)
  }
}
