export function formatJSON(text: string): string {
  const parsed = JSON.parse(text)
  return JSON.stringify(parsed, null, 2)
}

export function formatXML(text: string): string {
  let indent = 0
  let result = ''
  let inTag = false
  let tagContent = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '<') {
      if (tagContent.trim()) {
        result += '  '.repeat(indent) + tagContent.trim() + '\n'
        tagContent = ''
      }
      inTag = true
      tagContent += char
    } else if (char === '>') {
      tagContent += char
      inTag = false

      if (tagContent.startsWith('</')) {
        indent--
        result += '  '.repeat(indent) + tagContent + '\n'
      } else if (tagContent.endsWith('/>')) {
        result += '  '.repeat(indent) + tagContent + '\n'
      } else {
        result += '  '.repeat(indent) + tagContent + '\n'
        indent++
      }
      tagContent = ''
    } else if (inTag) {
      tagContent += char
    } else {
      tagContent += char
    }
  }

  if (tagContent.trim()) {
    result += '  '.repeat(indent) + tagContent.trim() + '\n'
  }

  return result
}

export function formatProtobufMessage(text: string): string {
  const match = text.match(/->\s*(.*?)\s*\|/s)
  const protobufContent = match ? match[1] : text

  const result: string[] = []
  let indent = 0
  let currentLine = ''

  let i = 0
  while (i < protobufContent.length) {
    const char = protobufContent[i]

    if (char === ' ') {
      if (currentLine) {
        currentLine += ' '
      }
      i++
    } else if (char === '{') {
      if (currentLine) {
        result.push('  '.repeat(indent) + currentLine.trim() + ' {')
        currentLine = ''
      } else {
        result.push('  '.repeat(indent) + '{')
      }
      indent++
      i++
    } else if (char === '}') {
      if (currentLine) {
        result.push('  '.repeat(indent) + currentLine.trim())
        currentLine = ''
      }
      indent--
      result.push('  '.repeat(indent) + '}')
      i++
    } else if (char === ';') {
      currentLine += char
      result.push('  '.repeat(indent) + currentLine.trim())
      currentLine = ''
      i++
    } else {
      currentLine += char
      i++
    }
  }

  if (currentLine.trim()) {
    result.push('  '.repeat(indent) + currentLine.trim())
  }

  return result.join('\n')
}

export function extractKotlinDataClass(text: string): string {
  const match = text.match(/[A-Z][A-Za-z0-9_]*\(/)
  if (!match || match.index === undefined) {
    return text
  }

  const startIndex = match.index
  const openParenIndex = startIndex + match[0].length - 1

  let depth = 0
  let endParenIndex = -1
  for (let i = openParenIndex; i < text.length; i++) {
    if (text[i] === '(') {
      depth++
    } else if (text[i] === ')') {
      depth--
      if (depth === 0) {
        endParenIndex = i
        break
      }
    }
  }

  if (endParenIndex === -1) {
    return text
  }

  return text.substring(startIndex, endParenIndex + 1)
}

export function formatKotlinDataString(text: string): string {
  const extracted = extractKotlinDataClass(text)

  const result: string[] = []
  let i = 0
  let indent = 0
  const tab = '  '
  let needIndent = false

  while (i < extracted.length) {
    const char = extracted[i]

    if (char === '(') {
      result.push(char)
      result.push('\n')
      indent++
      needIndent = true
      i++
    } else if (char === ')') {
      indent--
      result.push('\n')
      result.push(tab.repeat(indent) + char)
      needIndent = false
      i++
    } else if (char === '[') {
      result.push(char)
      result.push('\n')
      indent++
      needIndent = true
      i++
    } else if (char === ']') {
      indent--
      result.push('\n')
      result.push(tab.repeat(indent) + char)
      needIndent = false
      i++
    } else if (char === ',') {
      result.push(char)
      result.push('\n')
      needIndent = true
      i++
    } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      i++
    } else {
      let token = ''
      while (i < extracted.length) {
        const c = extracted[i]
        if (
          c === '(' ||
          c === ')' ||
          c === '[' ||
          c === ']' ||
          c === ',' ||
          c === ' ' ||
          c === '\t' ||
          c === '\n' ||
          c === '\r'
        ) {
          break
        }
        token += c
        i++
      }
      if (needIndent) {
        result.push(tab.repeat(indent) + token)
        needIndent = false
      } else {
        result.push(token)
      }
    }
  }

  return result.join('')
}
