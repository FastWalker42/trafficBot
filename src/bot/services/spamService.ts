import { Context } from 'grammy'
import { Message } from 'grammy/types'

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
      reply_markup: cancelAdminKb,
    }
  )
}

export async function msgSpamAll(ctx: Context) {
  const batchSize = 100
  let offset = 0
  let sent = 0

  const msg = ctx.message!

  let sendFn: (userId: number) => Promise<Message>

  if (msg.photo) {
    const { text, keyboard } = parseMessageBtns(msg.caption || '')
    sendFn = async (userId) =>
      ctx.api.sendPhoto(userId, msg.photo!.at(-1)!.file_id, {
        caption: text,
        reply_markup: keyboard,
      })
  } else if (msg.video) {
    const { text, keyboard } = parseMessageBtns(msg.caption || '')
    sendFn = async (userId) =>
      ctx.api.sendVideo(userId, msg.video!.file_id, {
        caption: text,
        reply_markup: keyboard,
      })
  } else if (msg.animation) {
    const { text, keyboard } = parseMessageBtns(msg.caption || '')
    sendFn = async (userId) =>
      ctx.api.sendAnimation(userId, msg.animation!.file_id, {
        caption: text,
        reply_markup: keyboard,
      })
  } else if (msg.text) {
    const { text, keyboard } = parseMessageBtns(msg.text)
    sendFn = async (userId) =>
      ctx.api.sendMessage(userId, text, {
        reply_markup: keyboard,
      })
  } else {
    await ctx.reply('❌ Поддерживаются только текст, фото и видео')
    return
  }

  while (true) {
    const users = await getUsersBatch(offset, batchSize)
    if (users.length === 0) break

    for (const user of users) {
      try {
        await sendFn(user.user_id)
        sent++
        await wait(30)
      } catch (err) {}
    }

    offset += batchSize
    await wait(500)
  }

  await ctx.reply(`✅ Отправлено: ${sent}`)
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
