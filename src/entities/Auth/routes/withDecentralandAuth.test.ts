import { WithAuth } from '../types'
import { withAuth } from './withDecentralandAuth'

test(`should be compatible with express.Request + auth middleware`, async () => {
  const expressRequestMock: WithAuth = { auth: 'user', authMetadata: {} } as any
  const auth = await withAuth(expressRequestMock)
  expect(auth.auth).toBe(expressRequestMock.auth)
  expect(auth.authMetadata).toBe(expressRequestMock.authMetadata)
})
