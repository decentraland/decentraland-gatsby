import isMobile from './isMobile'

describe('isMobile', () => {
  test('should return true when the user agent is mobile', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    expect(isMobile(ua)).toBe(true)
  })

  test('should return false when the user agent is not mobile', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
    expect(isMobile(ua)).toBe(false)
  })

  test('should check window if the user agent is not provided', () => {
    expect(isMobile()).toBe(false)
  })
})
