export default (channelId: string) =>
  channelId.startsWith('@') || channelId.startsWith('-')
    ? channelId
    : `@${channelId}`
