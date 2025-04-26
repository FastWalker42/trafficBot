import { Bot } from 'grammy'

import startHandler from './start'

import msgHandler from './msg'
import callbackHandler from './callback'

import { adminCheck } from '../middlewares/adminCheck'
import { adminsList } from '../services/adminService'
import dumpHandler from './dump'

export default (bot: Bot) => {
  bot.catch(({ error }) => {
    console.error('Global Bot Error:', error)
  })

  bot.command('start', startHandler)
  bot.command('dump', adminCheck, dumpHandler)
  bot.command('admins', adminCheck, adminsList)

  bot.on('callback_query:data', callbackHandler)

  bot.on('message', msgHandler)
}
