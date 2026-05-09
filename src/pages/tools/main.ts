import { copyToClipboard } from './clipboard'
import { formatJSON, formatKotlinDataString, formatProtobufMessage, formatXML } from './formatters'
import {
  highlightCurrentBlock,
  performSearch,
  showHighlightAndScroll,
  syncScroll,
  updateLineNumbers,
  updateMatchDisplay
} from './search'
import {
  initCurrentDate,
  timestampToTime,
  timeToTimestamp,
  updateCurrentTimestamp
} from './timestamp'

const formatBtn = document.getElementById('format-btn')
const clearBtn = document.getElementById('clear-btn')
const searchInput = document.getElementById('search-input') as HTMLInputElement
const searchNextBtn = document.getElementById('search-next-btn')
const textInput = document.getElementById('text-input') as HTMLTextAreaElement
const lineNumbersEl = document.getElementById('line-numbers')
const matchInfo = document.getElementById('match-info') as HTMLSpanElement
const formatRadios = document.querySelectorAll(
  "input[name='format-type']"
) as NodeListOf<HTMLInputElement>
const tabButtons = document.querySelectorAll('.tab-button')
const tabContents = document.querySelectorAll('.tab-content')

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tabName = (button as HTMLElement).dataset.tab
    tabButtons.forEach((btn) => {
      btn.classList.remove('border-b-2', 'border-blue-600', 'text-blue-600')
    })
    tabContents.forEach((content) => content.classList.add('hidden'))
    button.classList.add('border-b-2', 'border-blue-600', 'text-blue-600')
    document.getElementById(`tab-${tabName}`)?.classList.remove('hidden')
    searchInput.value = ''
    matchInfo.textContent = '0 / 0'
    allMatches = []

    const url = new URL(window.location.href)
    url.searchParams.set('tab', tabName as string)
    history.replaceState(null, '', url.toString())
  })
})

function getTabFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('tab')
}

function initTab() {
  const tabFromUrl = getTabFromUrl()
  let initialTab = 'format'

  if (tabFromUrl === 'timestamp') {
    initialTab = 'timestamp'
  }

  tabButtons.forEach((button) => {
    const tabName = (button as HTMLElement).dataset.tab
    if (tabName === initialTab) {
      button.classList.add('border-b-2', 'border-blue-600', 'text-blue-600')
    } else {
      button.classList.remove('border-b-2', 'border-blue-600', 'text-blue-600')
    }
  })

  tabContents.forEach((content) => content.classList.add('hidden'))
  document.getElementById(`tab-${initialTab}`)?.classList.remove('hidden')
}

initTab()

clearBtn.addEventListener('click', () => {
  textInput.value = ''
  searchInput.value = ''
  matchInfo.textContent = '0 / 0'
  updateLineNumbers(lineNumbersEl, textInput)
})

formatRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    textInput.value = ''
    searchInput.value = ''
    matchInfo.textContent = '0 / 0'
    updateLineNumbers(lineNumbersEl, textInput)
  })
})

let formatDebounceTimer: ReturnType<typeof setTimeout>
textInput.addEventListener('input', () => {
  clearTimeout(formatDebounceTimer)
  formatDebounceTimer = setTimeout(() => {
    if (textInput.value.trim()) {
      formatBtn.click()
    }
  }, 1000)
})

formatBtn.addEventListener('click', () => {
  const formatType = Array.from(formatRadios).find((radio) => radio.checked)?.value
  const text = textInput.value

  if (!text.trim()) {
    alert('请输入要格式化的文本')
    return
  }

  try {
    switch (formatType) {
      case 'json':
        textInput.value = formatJSON(textInput.value)
        break
      case 'xml':
        textInput.value = formatXML(textInput.value.trim())
        break
      case 'protobuf':
        textInput.value = formatProtobufMessage(textInput.value.trim())
        break
      case 'kotlin-data':
        textInput.value = formatKotlinDataString(textInput.value.trim())
        break
      default:
        alert('请选择格式化类型')
    }
    searchInput.value = ''
    matchInfo.textContent = '0 / 0'
    textInput.scrollTop = 0
    updateLineNumbers(lineNumbersEl, textInput)
  } catch (error) {
    alert('格式化失败：' + (error as Error).message)
  }
})

let currentMatchIndex = 0
let allMatches: RegExpMatchArray | null = null

let debounceTimer: ReturnType<typeof setTimeout>
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    allMatches = performSearch(searchInput, textInput, matchInfo)
    currentMatchIndex = 0
  }, 300)
})

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (!allMatches || allMatches.length === 0) {
      allMatches = performSearch(searchInput, textInput, matchInfo)
    }
    if (!allMatches || allMatches.length === 0) {
      return
    }
    showHighlightAndScroll(textInput, searchInput, currentMatchIndex)
    updateMatchDisplay(allMatches, currentMatchIndex, matchInfo)
    currentMatchIndex = (currentMatchIndex + 1) % allMatches.length
  }
})

searchNextBtn?.addEventListener('click', () => {
  if (!allMatches || allMatches.length === 0) {
    allMatches = performSearch(searchInput, textInput, matchInfo)
  }
  if (!allMatches || allMatches.length === 0) {
    return
  }
  showHighlightAndScroll(textInput, searchInput, currentMatchIndex)
  updateMatchDisplay(allMatches, currentMatchIndex, matchInfo)
  currentMatchIndex = (currentMatchIndex + 1) % allMatches.length
})

textInput.addEventListener('input', () => {
  updateLineNumbers(lineNumbersEl, textInput)
  highlightCurrentBlock(lineNumbersEl, textInput)
})
textInput.addEventListener('scroll', () => syncScroll(lineNumbersEl, textInput))
textInput.addEventListener('click', () => highlightCurrentBlock(lineNumbersEl, textInput))
textInput.addEventListener('keyup', () => highlightCurrentBlock(lineNumbersEl, textInput))

const currentTimestampSeconds = document.getElementById('current-timestamp-seconds')
const currentTimestampMilliseconds = document.getElementById('current-timestamp-milliseconds')
const copySecondsBtn = document.getElementById('copy-seconds-btn')
const copyMillisecondsBtn = document.getElementById('copy-milliseconds-btn')
const timestampInputEl = document.getElementById('timestamp-input') as HTMLInputElement
const gmtTime = document.getElementById('gmt-time')
const cstTime = document.getElementById('cst-time')
const relativeTime = document.getElementById('relative-time')
const datetimeInput = document.getElementById('datetime-input') as HTMLInputElement
const convertedTimestampSeconds = document.getElementById('converted-timestamp-seconds')
const convertedTimestampMilliseconds = document.getElementById('converted-timestamp-milliseconds')

if (timestampInputEl) {
  timestampInputEl.addEventListener('input', () => {
    timestampToTime(timestampInputEl.value, gmtTime, cstTime, relativeTime)
  })
}

if (datetimeInput) {
  datetimeInput.addEventListener('input', () => {
    timeToTimestamp(datetimeInput, convertedTimestampSeconds, convertedTimestampMilliseconds)
  })
}

if (copySecondsBtn) {
  copySecondsBtn.addEventListener('click', () => {
    if (currentTimestampSeconds) {
      copyToClipboard(currentTimestampSeconds.textContent || '')
    }
  })
}

if (copyMillisecondsBtn) {
  copyMillisecondsBtn.addEventListener('click', () => {
    if (currentTimestampMilliseconds) {
      copyToClipboard(currentTimestampMilliseconds.textContent || '')
    }
  })
}

searchInput.value = ''
matchInfo.textContent = '0 / 0'
updateLineNumbers(lineNumbersEl, textInput)
updateCurrentTimestamp(currentTimestampSeconds, currentTimestampMilliseconds)
initCurrentDate(datetimeInput)
timeToTimestamp(datetimeInput, convertedTimestampSeconds, convertedTimestampMilliseconds)

setInterval(
  () => updateCurrentTimestamp(currentTimestampSeconds, currentTimestampMilliseconds),
  1000
)
