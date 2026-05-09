export function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

export function updateCurrentTimestamp(
  secondsEl: HTMLElement | null,
  millisecondsEl: HTMLElement | null
) {
  const now = Date.now()
  const seconds = Math.floor(now / 1000)
  if (secondsEl) secondsEl.innerHTML = seconds.toString()
  if (millisecondsEl) millisecondsEl.innerHTML = (seconds * 1000).toString()
}

export function initCurrentDate(datetimeInput: HTMLInputElement | null) {
  if (!datetimeInput) return
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  datetimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
}

export function timestampToTime(
  timestamp: string,
  gmtTime: HTMLElement | null,
  cstTime: HTMLElement | null,
  relativeTime: HTMLElement | null
) {
  if (!timestamp) {
    if (gmtTime) gmtTime.innerHTML = ''
    if (cstTime) cstTime.innerHTML = ''
    if (relativeTime) relativeTime.innerHTML = ''
    return
  }

  let ts = parseInt(timestamp)
  if (ts.toString().length === 10) {
    ts *= 1000
  }

  const date = new Date(ts)

  if (gmtTime) {
    const gmtDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    gmtTime.innerHTML = formatDateTime(gmtDate)
  }

  if (cstTime) {
    const cstDate = new Date(date.getTime() + (8 * 60 + date.getTimezoneOffset()) * 60000)
    cstTime.innerHTML = formatDateTime(cstDate)
  }

  if (relativeTime) {
    const now = Date.now()
    const diff = now - ts
    const absDiff = Math.abs(diff)

    let relativeStr = ''
    const oneMinute = 60000
    const oneHour = 3600000
    const oneDay = 86400000
    const oneWeek = 604800000
    const fourWeeks = 2419200000
    const oneMonth = 2592000000
    const oneYear = 31536000000

    if (absDiff < oneMinute) {
      relativeStr = `${Math.floor(absDiff / 1000)}秒`
    } else if (absDiff < oneHour) {
      relativeStr = `${Math.floor(absDiff / oneMinute)}分钟`
    } else if (absDiff < oneDay) {
      relativeStr = `${Math.floor(absDiff / oneHour)}小时`
    } else if (absDiff < oneWeek) {
      relativeStr = `${Math.floor(absDiff / oneDay)}天`
    } else if (absDiff < fourWeeks) {
      relativeStr = `${Math.floor(absDiff / oneWeek)}周`
    } else if (absDiff < oneYear) {
      relativeStr = `${Math.floor(absDiff / oneMonth)}月`
    } else {
      relativeStr = `${Math.floor(absDiff / oneYear)}年`
    }

    relativeStr = diff > 0 ? `${relativeStr}前` : `${relativeStr}后`
    relativeTime.innerHTML = relativeStr
  }
}

export function timeToTimestamp(
  datetimeInput: HTMLInputElement | null,
  convertedSeconds: HTMLElement | null,
  convertedMilliseconds: HTMLElement | null
) {
  if (!datetimeInput) return

  const datetimeValue = datetimeInput.value
  if (!datetimeValue) {
    if (convertedSeconds) convertedSeconds.innerHTML = ''
    if (convertedMilliseconds) convertedMilliseconds.innerHTML = ''
    return
  }

  const date = new Date(datetimeValue)
  const timestampSeconds = Math.floor(date.getTime() / 1000)
  const timestampMilliseconds = date.getTime()

  if (convertedSeconds) convertedSeconds.innerHTML = timestampSeconds.toString()
  if (convertedMilliseconds) convertedMilliseconds.innerHTML = timestampMilliseconds.toString()
}
