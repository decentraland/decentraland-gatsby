import logger from "./logger"

const mock = {
  log: jest.spyOn(logger, 'log'),
  error: jest.spyOn(logger, 'error'),
  warning: jest.spyOn(logger, 'warning'),
}

beforeEach(() => {
  mock.log.mockImplementation(() => { })
  mock.error.mockImplementation(() => { })
  mock.warning.mockImplementation(() => { })
})

afterEach(() => {
  mock.log.mockClear()
  mock.error.mockClear()
  mock.warning.mockClear()
})

test('logger should be a mock', () => {
  expect((logger as any).log.mock.calls).toEqual([])
  expect((logger as any).error.mock.calls).toEqual([])
  expect((logger as any).warning.mock.calls).toEqual([])
})

export default mock