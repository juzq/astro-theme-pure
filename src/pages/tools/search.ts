export function updateLineNumbers(
  lineNumbers: HTMLElement | null,
  textInput: HTMLTextAreaElement | null
) {
  if (!lineNumbers || !textInput) return

  const text = textInput.value
  const lineCount = text ? text.split('\n').length : 1
  let lineNumbersText = ''
  for (let i = 1; i <= lineCount; i++) {
    lineNumbersText += i + '\n'
  }
  lineNumbers.textContent = lineNumbersText
}

export function syncScroll(lineNumbers: HTMLElement | null, textInput: HTMLTextAreaElement | null) {
  if (!lineNumbers || !textInput) return
  lineNumbers.scrollTop = textInput.scrollTop
}

export function performSearch(
  searchInput: HTMLInputElement,
  textInput: HTMLTextAreaElement,
  matchInfo: HTMLSpanElement
): RegExpMatchArray | null {
  const searchText = searchInput.value.trim()
  const text = textInput.value
  const allMatches = searchText
    ? text.match(new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))
    : null

  if (!allMatches || allMatches.length === 0) {
    matchInfo.textContent = '0 / 0'
  }

  return allMatches
}

export function updateMatchDisplay(
  allMatches: RegExpMatchArray | null,
  currentMatchIndex: number,
  matchInfo: HTMLSpanElement
) {
  if (!allMatches || allMatches.length === 0) {
    matchInfo.textContent = '0 / 0'
    return
  }

  const currentDisplayIndex = (currentMatchIndex % allMatches.length) + 1
  matchInfo.textContent = `${currentDisplayIndex} / ${allMatches.length}`
}

export function showHighlightAndScroll(
  textInput: HTMLTextAreaElement,
  searchInput: HTMLInputElement,
  currentMatchIndex: number
) {
  const text = textInput.value
  const searchPattern = searchInput.value.trim()

  if (!searchPattern) {
    return
  }

  const regex = new RegExp(searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  regex.lastIndex = 0

  let match
  let matches: { start: number; end: number }[] = []
  while ((match = regex.exec(text)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length })
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }
  }

  if (matches.length > 0) {
    const targetIndex = currentMatchIndex % matches.length
    const targetMatch = matches[targetIndex]

    textInput.focus()
    textInput.setSelectionRange(targetMatch.start, targetMatch.end)

    textInput.scrollTop = Math.max(
      0,
      (targetMatch.start / text.length) * textInput.scrollHeight - textInput.clientHeight / 2
    )
  }
}
