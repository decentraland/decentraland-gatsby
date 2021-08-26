import 'isomorphic-fetch'
import mock from 'fetch-mock'

afterEach(() => {
  mock.reset()
  mock.restore()
})

export default mock