import { Context } from 'grammy'
import { adminChannels } from '../utils/keyboardBuilder'
import { setUserState } from '../../db/methods'

export default async (ctx: Context) => {
  await setUserState(ctx.from!.id, 'none')

  await ctx.reply(
    `МЕНЮ АДМИНА
📊 ПРИВЯЗАННЫЕ КАНАЛЫ

/dump - дамп всей базы в JSON формат (для удобной рассылки скриптом извне или парсинга)
`,
    {
      reply_markup: await adminChannels(ctx),
    }
  )
}
