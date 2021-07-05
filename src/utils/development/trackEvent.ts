import segment from './segment'

export type HandleEvent = (
  event: React.SyntheticEvent<HTMLElement>,
  ...extra: any[]
) => any

export default function trackEvent<H extends HandleEvent>(handle: H) {
  return (event: React.MouseEvent<HTMLElement>, ...extra: any[]) => {
    segment((analytics) => {
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

    handle && handle(event, ...extra)
  }
}
