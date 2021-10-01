import { navigate } from 'gatsby-plugin-intl'
declare global {
  interface Window {
    routeUpdate?: number
  }
}

export default function navigateBack(fallbackUrl: string = '/') {
  if ((window as any).routeUpdate) {
    window.history.back()
  } else {
    navigate(fallbackUrl)
  }
}
