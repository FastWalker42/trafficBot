import { InlineKeyboard } from 'grammy'

export default (input: string) => {
  const keyboard = new InlineKeyboard()
  const buttonRegex = /^\s*\["([^"]+)",\s*"([^"]+)"\]\s*$/

  const lines = input.split('\n')
  const cleanedLines: string[] = []

  let currentRow: { text: string; url: string }[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    const match = line.match(buttonRegex)
    if (match) {
      const url = match[1]
      const text = match[2]
      currentRow.push({ text, url })
    } else {
      cleanedLines.push(lines[i])

      if (currentRow.length > 0) {
        keyboard.row(
          ...currentRow.map((b) => ({ text: b.text, url: b.url }))
        )
        currentRow = []
      }
    }

    const nextLine = lines[i + 1]?.trim()
    const nextIsEmpty = nextLine === '' || nextLine === undefined

    if (currentRow.length > 0 && nextIsEmpty) {
      keyboard.row(
        ...currentRow.map((b) => ({ text: b.text, url: b.url }))
      )
      currentRow = []
    }
  }

  if (currentRow.length > 0) {
    keyboard.row(
      ...currentRow.map((b) => ({ text: b.text, url: b.url }))
    )
  }

  const text = cleanedLines.join('\n').trim()
  return { text, keyboard }
}
