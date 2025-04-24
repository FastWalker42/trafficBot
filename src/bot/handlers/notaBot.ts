import { Context } from 'grammy'
import {
  getUserChannels,
  userKeyboard,
} from '../utils/keyboardBuilder'
import { approveReferral } from '../services/referalService'

export default async (ctx: Context) => {
  const channelsArray = await getUserChannels(ctx)
  if (channelsArray.length !== 0) {
    await ctx.reply(
      `Подпишитесь на эти каналы, затем нажмите кнопку "ПРОДОЛЖИТЬ"`,
      { reply_markup: userKeyboard(channelsArray) }
    )
  } else {
    await approveReferral(ctx)
    ctx.reply(
      `<b>🎉 Вы участвуете в розыгрыше!</b>
    
    Приглашайте друзей, повышая шанс выигрыша:
    <code>t.me/VeinStarsBot?start=${ctx.callbackQuery!.from.id}</code>
    (нажмите на ссылку чтобы скопировать)`,
      {
        message_effect_id: '5046509860389126442',
      }
    )
  }
}
