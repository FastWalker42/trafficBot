import { Context } from 'grammy'
import {
  channelMenu,
  handleDeleteChannel,
} from '../services/channelService'
import { handleDeleteAdmin } from '../services/adminService'

import adminMenu from './adminMenu'
import addChannel from '../features/op/opInputWait'
import spamInputWait from '../features/spam/spamInputWait'
import notaBot from './notaBot'
import delMe from './delMe'

const ACTIONS = {
  edit: channelMenu,
  notabot: notaBot,
  adminMenu: adminMenu,
  addChannel: addChannel,
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
