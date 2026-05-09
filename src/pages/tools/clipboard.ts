export function showToast(message: string) {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg z-50'
  toast.textContent = message
  document.body.appendChild(toast)

  toast.style.opacity = '0'
  toast.style.transform = 'translateY(-20px)'
  toast.style.transition = 'opacity 0.3s, transform 0.3s'

  setTimeout(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  }, 10)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(-20px)'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

export function copyToClipboard(text: string) {
  if (!text) {
    showToast('没有可复制的内容')
    return
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('复制成功！')
      })
      .catch(() => {
        fallbackCopyTextToClipboard(text)
      })
  } else {
    fallbackCopyTextToClipboard(text)
  }
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showToast('复制成功！')
    } else {
      showToast('复制失败，请手动复制')
    }
  } catch {
    showToast('复制失败，请手动复制')
  } finally {
    document.body.removeChild(textArea)
  }
}
