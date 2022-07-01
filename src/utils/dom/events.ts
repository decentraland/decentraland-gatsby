/** Checks if a MouseEvent is opening a new tab */
export function isMeta(event: React.MouseEvent<any>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

/** Returns the event name associated with an element or name of the event there isn't any */
export function getMouseEventName(event: React.MouseEvent<any>) {
  const el = event.currentTarget as HTMLAnchorElement
  const dataset = el.dataset || {}
  return dataset.event || event.type.toLowerCase()
}

/** Returns all data associated with an element  */
export function getMouseEventData(event: React.MouseEvent<any>) {
  const el: HTMLAnchorElement = event.currentTarget
  const target = el.target || undefined
  const dataset: Record<string, string | undefined> = el.dataset || {}
  const data = {
    location: location.toString(),
    text: el.innerText.trim() || el.title.trim(),
    rel: el.rel || undefined,
    target,
    href:
      el.getAttribute('href') ||
      el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
      el.getAttribute('xlink:href') ||
      undefined,
  } as const

  return { ...dataset, ...data } as typeof data & typeof dataset
}
