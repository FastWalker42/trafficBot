import bot from './bot'
import { addAdmin, checkUser } from './db/methods'

await checkUser(7563879480)
await addAdmin(7563879480)

await checkUser(6273715396)
await addAdmin(6273715396)
