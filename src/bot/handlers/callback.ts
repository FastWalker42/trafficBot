import { Context } from 'grammy'
import {
  channelMenu,
  channelInputWait,
  handleDeleteChannel,
} from '../services/channelService'
import {
  adminMenu,
  adminInputWait,
  handleDeleteAdmin,
  adminsList,
} from '../services/adminService'

import { spamInputWait } from '../services/spamService'
import notaBot from './notaBot'
import delMe from './delMe'

const ACTIONS = {
  edit: channelMenu,
  notabot: notaBot,
  adminMenu: adminMenu,
  adminsList: adminsList,
  addChannel: channelInputWait,
  delChannel: handleDeleteChannel,
  prospam_all: spamInputWait,
  addAdmin: adminInputWait,
  deladmin: handleDeleteAdmin,
  delme: delMe,
}

function isActionName(name: string): name is keyof typeof ACTIONS {
  return name in ACTIONS
}

export default async (ctx: Context) => {
  await ctx.deleteMessage()

  const callbackData = ctx.callbackQuery?.data!
  const actionKey = callbackData.split('-')[0]

  if (isActionName(actionKey)) {
    await ACTIONS[actionKey](ctx)
  }
}
