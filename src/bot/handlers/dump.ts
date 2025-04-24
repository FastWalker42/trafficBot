import { Context } from 'vm'
import { dumpDatabaseToJson } from '../../db/methods'
import { InputFile } from 'grammy'

export default async (ctx: Context) => {
  const dump = await dumpDatabaseToJson()
  const json = JSON.stringify(dump, null, 2)

  const file = new InputFile(Buffer.from(json), 'db_dump.json')

  await ctx.replyWithDocument(file)
}
