export function updateLineNumbers(
  lineNumbers: HTMLElement | null,
  textInput: HTMLTextAreaElement | null
) {
  if (!lineNumbers || !textInput) return

  const text = textInput.value
  const lines = text ? text.split('\n') : ['']
  const lineCount = lines.length

  let html = ''
  for (let i = 0; i < lineCount; i++) {
    html += `<div class="line-number-row" data-line="${i + 1}"><span class="line-num">${i + 1}</span></div>`
  }

  lineNumbers.innerHTML = html
}

export function highlightCurrentBlock(
  lineNumbers: HTMLElement | null,
  textInput: HTMLTextAreaElement | null
) {
  if (!lineNumbers || !textInput) return

  const text = textInput.value
  const cursorPos = textInput.selectionStart
  const lines = text.split('\n')

  // 计算光标所在行号（0-based）
  let currentLine = 0
  let pos = 0
  for (let i = 0; i < lines.length; i++) {
    if (pos + lines[i].length >= cursorPos) {
      currentLine = i
      break
    }
    pos += lines[i].length + 1
    if (i === lines.length - 1) currentLine = i
  }

  // 找到当前行所在的代码块范围
  const blockRange = findCurrentBlock(text, cursorPos)

  // 更新行号高亮
  const rows = lineNumbers.querySelectorAll('.line-number-row')
  rows.forEach((row) => {
    const lineNum = parseInt((row as HTMLElement).dataset.line || '0') - 1
    row.classList.remove('current-line', 'block-start', 'block-end', 'block-range')

    if (lineNum === currentLine) {
      row.classList.add('current-line')
    }

    if (blockRange) {
      if (lineNum === blockRange.startLine) {
        row.classList.add('block-start')
      }
      if (lineNum === blockRange.endLine) {
        row.classList.add('block-end')
      }
      if (lineNum >= blockRange.startLine && lineNum <= blockRange.endLine) {
        row.classList.add('block-range')
      }
    }
  })
}

function findCurrentBlock(
  text: string,
  cursorPos: number
): { startLine: number; endLine: number } | null {
  const openBrackets = '({['
  const closeBrackets = ')}]'

  // 从光标位置向前找最近的未匹配的开括号
  const bracketStack: { char: string; pos: number }[] = []
  let startBracketPos = -1
  let startBracketChar = ''

  for (let i = cursorPos - 1; i >= 0; i--) {
    const char = text[i]
    const closeIdx = closeBrackets.indexOf(char)
    const openIdx = openBrackets.indexOf(char)

    if (closeIdx !== -1) {
      bracketStack.push({ char, pos: i })
    } else if (openIdx !== -1) {
      if (bracketStack.length > 0) {
        const top = bracketStack.pop()
        if (top && closeBrackets.indexOf(top.char) === openIdx) {
          continue
        }
        bracketStack.push(top)
      }
      if (bracketStack.length === 0) {
        startBracketPos = i
        startBracketChar = char
        break
      }
    }
  }

  if (startBracketPos === -1) return null

  // 从开括号位置向后找匹配的闭括号
  const openIdx = openBrackets.indexOf(startBracketChar)
  const matchingClose = closeBrackets[openIdx]
  let depth = 0
  let endBracketPos = -1

  for (let i = startBracketPos; i < text.length; i++) {
    const char = text[i]
    if (char === startBracketChar) {
      depth++
    } else if (char === matchingClose) {
      depth--
      if (depth === 0) {
        endBracketPos = i
        break
      }
    }
  }

  if (endBracketPos === -1) return null

  // 计算行号
  const lines = text.split('\n')
  let startLine = 0
  let endLine = 0
  let pos = 0

  for (let i = 0; i < lines.length; i++) {
    if (pos <= startBracketPos && pos + lines[i].length >= startBracketPos) {
      startLine = i
    }
    if (pos <= endBracketPos && pos + lines[i].length >= endBracketPos) {
      endLine = i
    }
    pos += lines[i].length + 1
  }

  return { startLine, endLine }
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
