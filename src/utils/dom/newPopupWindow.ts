const sizes = {
  'small': { width: 600, height: 250 },
  'large': { width: 600, height: 600 },
}

export default function newPopupWindow(url: string, size: keyof typeof sizes = 'small') {
  const { width, height } = sizes[size] || sizes['small']
  const top = Math.ceil(window.outerHeight / 2 - height / 2)
  const left = Math.ceil(window.outerWidth / 2 - width / 2)
  window.open(
    url,
    'sharer',
    `toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
  )
}