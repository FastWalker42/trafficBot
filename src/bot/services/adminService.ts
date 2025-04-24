import { Context } from 'grammy'
import { addAdmin, removeAdmin } from '../../db/methods'
import { parseCommandArgs } from '../utils/parseCommandArgs'
import { editAdminsKeyboard } from '../utils/keyboardBuilder'
import { parseCallbackData } from '../utils/parseCallBack'

export async function adminsEditMenu(ctx: Context) {
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
  const success = await removeAdmin(adminId)

  if (success) {
    await ctx.reply(`✅ Админ ${adminId} удалён!`)
  } else {
    await ctx.reply(`❌ Не удалось удалить админа ${adminId}.`)
  }
}
