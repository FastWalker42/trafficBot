import { Context, InlineKeyboard } from 'grammy'
import { checkUser } from '../../../db/methods'

export default async (ctx: Context) => {
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
