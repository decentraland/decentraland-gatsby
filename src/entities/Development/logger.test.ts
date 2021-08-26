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

export default mock