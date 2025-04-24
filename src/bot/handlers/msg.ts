import { Context } from 'grammy'
import { checkUser, setUserState } from '../../db/methods'
import { handleAddChannel } from '../services/channelService'
import adminMenu from './adminMenu'

import makeProspamAll from '../features/spam/msgSpamAll'

export default async (ctx: Context) => {
  const { id } = ctx.from!

  const user = await checkUser(id)

  if (user?.is_admin) {
    if (user?.state === 'prospam_all') {
      await makeProspamAll(ctx)
      await setUserState(id, 'none')
      await adminMenu(ctx)
    } else {
      await handleAddChannel(ctx)
    }
  }
}
