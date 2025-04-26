export function parseCallbackData(data: string): string {
  return data.substring(data.indexOf('-') + 1)
}
