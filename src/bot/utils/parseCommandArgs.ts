export function parseCommandArgs(text?: string): string | null {
  if (!text) return null
  const [, arg] = text.trim().split(/ (.+)/)
  return arg ?? null
}
