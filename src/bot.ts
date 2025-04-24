import 'dotenv/config'
import { Bot } from 'grammy'
import { parseMode } from '@grammyjs/parse-mode'
import registerHandlers from './bot/handlers'

const bot = new Bot(process.env.BOT_TOKEN as string)
bot.api.config.use(parseMode('HTML'))

registerHandlers(bot)

export default bot
