export type HandleOnClick = (event: React.MouseEvent<HTMLElement>, ...extra: any[]) => void

export default function trackOnClick(handleClick: HandleOnClick) {
  return (event: React.MouseEvent<HTMLElement>, ...extra: any[]) => {
    if (window.analytics) {
      const element = event.currentTarget
      const name = (element as HTMLInputElement).name || null
      const value = (element as HTMLInputElement).value || null
      const href = (element as HTMLAnchorElement).href || null
      window.analytics.track("click", {
        text: element.innerText.trim() ||
          element.title.trim(),
        name,
        value,
        href,
        location: location.toString(),
      })
    }

    handleClick && handleClick(event, ...extra)
  }
}
