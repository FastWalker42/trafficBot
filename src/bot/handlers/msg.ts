import { Context } from 'grammy'
import { checkUser, setUserState } from '../../db/methods'
import { handleAddChannel } from '../services/channelService'
import { adminMenu, handleAddAdmin } from '../services/adminService'
import { msgSpamAll } from '../services/spamService'

export default async (ctx: Context) => {
  const { id } = ctx.from!

  const user = await checkUser(id)

  if (user?.is_admin) {
    if (user?.state === 'prospam_all') {
      await msgSpamAll(ctx)
      await setUserState(id, 'none')
      await adminMenu(ctx)
    } else if (user?.state === 'opchannel_input') {
      await handleAddChannel(ctx)
    } else if (user?.state === 'admin_input') {
      await handleAddAdmin(ctx)
    }
  }
}
