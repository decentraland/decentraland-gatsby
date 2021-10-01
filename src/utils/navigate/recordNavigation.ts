declare global {
  interface Window {
    routeUpdate?: number
  }
}

export default function recordNavigation() {
  window.routeUpdate =
    window.routeUpdate === undefined ? 0 : window.routeUpdate + 1
}
