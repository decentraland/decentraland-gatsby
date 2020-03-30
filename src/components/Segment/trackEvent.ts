import track from "./track"

export type HandleOnClick = (event: React.MouseEvent<HTMLElement>, ...extra: any[]) => void

export default function trackEvent(handleClick: HandleOnClick) {
  return (event: React.MouseEvent<HTMLElement>, ...extra: any[]) => {
    track((analytics) => {
      const type = event.type
      const element = event.currentTarget
      const text = element.innerText.trim() || element.title.trim()
      const name = (element as HTMLInputElement).name || null
      const value = (element as HTMLInputElement).value || null
      const href = (element as HTMLAnchorElement).href || null
      analytics.track(type, {
        text,
        name,
        value,
        href,
        location: location.toString(),
      })
    })

    handleClick && handleClick(event, ...extra)
  }
}
