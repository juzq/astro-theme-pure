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

  const tokens = tokenizeProtobuf(protobufContent)

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]

    if (token === '{') {
      indent++
      i++
    } else if (token === '}') {
      indent--
      result.push('  '.repeat(indent) + '}')
      i++
    } else if (i + 1 < tokens.length && tokens[i + 1] === '{') {
      result.push('  '.repeat(indent) + token + ' {')
      indent++
      i += 2
    } else {
      result.push('  '.repeat(indent) + token)
      i++
    }
  }

  return result.join('\n')
}

function tokenizeProtobuf(text: string): string[] {
  const tokens: string[] = []
  let i = 0

  while (i < text.length) {
    const char = text[i]

    if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      i++
    } else if (char === '{' || char === '}') {
      tokens.push(char)
      i++
    } else {
      let token = ''
      while (i < text.length) {
        const c = text[i]
        if (c === '{' || c === '}' || c === ' ' || c === '\t' || c === '\n' || c === '\r') {
          break
        }
        token += c
        i++
      }

      if (token.endsWith(':')) {
        let value = ''
        while (i < text.length && (text[i] === ' ' || text[i] === '\t')) {
          i++
        }
        while (i < text.length) {
          const c = text[i]
          if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '{' || c === '}') {
            break
          }
          value += c
          i++
        }
        tokens.push(token + (value ? ' ' + value : ''))
      } else {
        tokens.push(token)
      }
    }
  }

  return tokens
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
        if (c === '(' || c === ')' || c === '[' || c === ']' || c === ',' || c === ' ' || c === '\t' || c === '\n' || c === '\r') {
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
