import { Context } from 'grammy'
import { addAdmin, deleteAdmin, setUserState } from '../../db/methods'
import { parseCommandArgs } from '../utils/parseCommandArgs'
import {
  adminChannels,
  editAdminsKeyboard,
} from '../utils/keyboardBuilder'
import { parseCallbackData } from '../utils/parseCallBack'

export async function adminMenu(ctx: Context) {
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

export async function adminsList(ctx: Context) {
  await ctx.reply('Список админов', {
    reply_markup: await editAdminsKeyboard(ctx),
  })
}

export async function handleAddAdmin(ctx: Context) {
  const arg = parseCommandArgs(ctx.message?.text)
  await addAdmin(Number(arg))
  await ctx.reply(`Админ ${arg} добавлен!`)
}

export async function handleDeleteAdmin(ctx: Context) {
  const data = ctx.callbackQuery!.data!

  const adminId = Number(parseCallbackData(data))
  const success = await deleteAdmin(adminId)

  if (success) {
    await ctx.reply(`✅ Админ ${adminId} удалён!`)
  } else {
    await ctx.reply(`❌ Не удалось удалить админа ${adminId}.`)
  }
}
