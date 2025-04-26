import { Context } from 'grammy'
import {
  channelMenu,
  handleAddChannel,
  handleDeleteChannel,
} from '../services/channelService'
import {
  adminMenu,
  handleDeleteAdmin,
} from '../services/adminService'

import { spamInputWait } from '../services/spamService'
import notaBot from './notaBot'
import delMe from './delMe'

const ACTIONS = {
  edit: channelMenu,
  notabot: notaBot,
  adminMenu: adminMenu,
  addChannel: handleAddChannel,
  prospam_all: spamInputWait,
  del: handleDeleteChannel,
  deladmin: handleDeleteAdmin,
  delme: delMe,
}

function isActionName(name: string): name is keyof typeof ACTIONS {
  return name in ACTIONS
}

export default async (ctx: Context) => {
  await ctx.deleteMessage()

  const callbackData = ctx.callbackQuery?.data
  if (!callbackData) return

  const actionKey = callbackData.split('-')[0]

  if (isActionName(actionKey)) {
    await ACTIONS[actionKey](ctx)
  }
}
