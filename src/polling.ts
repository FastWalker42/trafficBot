import 'dotenv/config'
import bot from './bot'

bot.start({
  onStart: () => console.log('Bot started!'),
  drop_pending_updates: true,
})
