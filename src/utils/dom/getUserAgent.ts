export default function getUserAgent() {
  return (
    window.navigator?.userAgent ||
    window.navigator?.vendor ||
    ((window as any).opera as string)
  )
}
