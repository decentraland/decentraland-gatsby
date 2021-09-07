import mock from 'fetch-mock'
import 'isomorphic-fetch'

afterEach(() => {
  mock.reset()
  mock.restore()
})

test('fetch should be a mock', async () => {
  const response = String(Math.random())
  mock.once('https://random.com/', new Response(response, { status: 200 }))
  const res = await fetch('https://random.com/')
  const raw = await res.text()

  expect(res.ok).toBeTruthy()
  expect(raw).toEqual(response)

  // expect(fetch as any).mock.calls).toEqual([])
})

export default mock
