import * as nf from 'node-fetch'
const mock = jest.fn(nf.default) as any
globalThis.fetch = mock as any

export default mock
export { Response, Request } from 'node-fetch'
