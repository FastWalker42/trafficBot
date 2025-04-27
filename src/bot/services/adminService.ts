import { Context } from 'grammy'
import {
  addAdmin,
  checkUser,
  deleteAdmin,
  setUserState,
} from '../../db/methods'
import {
  adminChannels,
  editAdminsKeyboard,
  cancelAdminKb,
} from '../utils/keyboardBuilder'
import { parseCallbackData } from '../utils/parseCallBack'

export async function adminMenu(ctx: Context) {
  await setUserState(ctx.from!.id, 'none')
  await ctx.reply(
    `МЕНЮ АДМИНА
📊 ПРИВЯЗАННЫЕ КАНАЛЫ

/dump - дамп всей базы в JSON формат (для удобной рассылки скриптом извне или парсинга)
/admins - управление админами
`,
    {
      reply_markup: await adminChannels(ctx),
    }
  )
}

export async function adminsList(ctx: Context) {
  await setUserState(ctx.from!.id, 'none')
  await ctx.reply('Список админов', {
    reply_markup: await editAdminsKeyboard(ctx),
  })
}

export async function handleAddAdmin(ctx: Context) {
  if (!ctx.message!.text) return

  const adminId = ctx.message!.text
  try {
    const userData = await ctx.api.getChat(adminId)
    await addAdmin(Number(adminId))
    await ctx.reply(`✅ Админ ${adminId} добавлен!`)
    await adminMenu(ctx)
  } catch (error) {
    await ctx.reply(`⚠️ Не удалось добавить админа ${adminId}`, {
      reply_markup: cancelAdminKb,
    })
  }
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

export async function adminInputWait(ctx: Context) {
  const { id } = ctx.from!

  const user = await checkUser(id)
  if (!user?.is_admin) {
    await ctx.reply('❌ У тебя нет прав на это действие.')
    return
  }

  await setUserState(ctx.from!.id, 'admin_input')

  await ctx.reply(
    `<b>🔰 ДОБАВЛЕНИЕ АДМИНА 🤖</b>
Отправьте ID админа. Получить ID можно в этом боте: @username_to_id_bot`,
    {
      reply_markup: cancelAdminKb,
    }
  )
}
