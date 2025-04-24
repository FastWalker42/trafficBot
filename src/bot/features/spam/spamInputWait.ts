import { Context } from 'grammy'
import { cancelAdminKb } from '../../utils/keyboardBuilder'
import { getUserCount, setUserState } from '../../../db/methods'

const guideText = `<blockquote expandable>🔰 Рассылка поддерживает HTML форматирование и разметку кнопок. 
<b>Пустая строка между кнопками производит перенос (пример ниже):</b>

["любая_ссылка", "строка1"]

["любая_ссылка", "строка2"]
["любая_ссылка", "строка2"]</blockquote>`

export default async (ctx: Context) => {
  await setUserState(ctx.from!.id, 'prospam_all')

  await ctx.reply(
    `📤 РАССЫЛКА ПО ВСЕМ
Всего пользователей в базе: 👤 ${await getUserCount()}
Жду ваше сообщение для рассылки
${guideText}`,
    {
      reply_markup: cancelAdminKb(),
    }
  )
}
