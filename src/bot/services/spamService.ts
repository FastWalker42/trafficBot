import { Context } from 'grammy'
import { cancelAdminKb } from '../utils/keyboardBuilder'
import parseMessageBtns from '../utils/parseMessageBtns'
import {
  getUserCount,
  getUsersBatch,
  setUserState,
} from '../../db/methods'

const guideText = `<blockquote expandable>🔰 Рассылка поддерживает HTML форматирование и разметку кнопок. 
<b>Пустая строка между кнопками производит перенос (пример ниже):</b>

["любая_ссылка", "строка1"]

["любая_ссылка", "строка2"]
["любая_ссылка", "строка2"]</blockquote>`

export async function spamInputWait(ctx: Context) {
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

export async function msgSpamAll(ctx: Context) {
  const batchSize = 100
  let offset = 0
  let sent = 0

  while (true) {
    const users = await getUsersBatch(offset, batchSize)
    if (users.length === 0) break

    const msg = ctx.message!
    for (const user of users) {
      try {
        if (msg.photo) {
          const { text, keyboard } = parseMessageBtns(
            ctx.message!.caption!
          )

          await ctx.api.sendPhoto(
            user.user_id,
            msg.photo.at(-1)!.file_id,
            {
              caption: text,
              reply_markup: keyboard,
            }
          )
        } else if (msg.video) {
          const { text, keyboard } = parseMessageBtns(
            ctx.message!.caption!
          )

          await ctx.api.sendVideo(user.user_id, msg.video.file_id, {
            caption: text,
            reply_markup: keyboard,
          })
        } else {
          const { text, keyboard } = parseMessageBtns(
            ctx.message!.text!
          )

          await ctx.api.sendMessage(user.user_id, text, {
            reply_markup: keyboard,
          })
        }
        sent++
        await wait(30)
      } catch (err: any) {
        if (err.error_code === 403) {
          // заблокирован
        } else if (err.error_code === 429) {
          const delay = err.parameters?.retry_after ?? 5
          console.log(`⏳ Флудконтроль: пауза ${delay}s`)
          await wait(delay * 1000)
        } else {
          console.error(`❌ Ошибка user ${user.user_id}:`, err)
        }
      }
    }

    offset += batchSize
    await wait(500) // пауза между пачками
  }

  ctx.reply(`✅ Рассылка завершена. Отправлено: ${sent}`)
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
