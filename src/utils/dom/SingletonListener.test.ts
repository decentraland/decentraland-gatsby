import SingletonListener from './SingletonListener'

const createTarget = () => {
  let target = new SingletonListener({
    addEventListener: () => null,
    removeEventListener: () => null,
  })

  jest.spyOn(target, 'addEventListener')
  jest.spyOn(target, 'removeEventListener')

  return target as SingletonListener<any> & {
    addEventListener: jest.SpyInstance<any>
    removeEventListener: jest.SpyInstance<any>
  }
}

describe(SingletonListener.name, () => {
  let handleMock1 = jest.fn()
  let handleMock2 = jest.fn()

  const data = {} as any
  const target = createTarget()
  const listener = new SingletonListener(target)

  test('#from', () => {
    const listener1 = SingletonListener.from(target)
    const listener2 = SingletonListener.from(target)
    expect(listener1).not.toBe(listener)
    expect(listener2).not.toBe(listener)
    expect(listener1).toBe(listener2)
  })

  test('addEventListener', () => {
    listener.addEventListener('click', handleMock1)
    listener.addEventListener('click', handleMock2)
    listener.addEventListener('blur', handleMock1)
    listener.addEventListener('blur', handleMock1)
    listener.addEventListener('blur', handleMock2)
    listener.addEventListener('blur', handleMock2)
    listener.addEventListener('blur', handleMock2)

    expect(listener.size).toBe(7)
    expect(target.addEventListener.mock.calls.length).toBe(2)
  })

  test('dispatch', async () => {
    await target.dispatch('click', data)
    expect(handleMock1.mock.calls.length).toEqual(1)
    expect(handleMock2.mock.calls.length).toEqual(1)

    await target.dispatch('blur', data)
    expect(handleMock1.mock.calls.length).toBe(3)
    expect(handleMock2.mock.calls.length).toBe(4)
  })

  test('removeEventListener', () => {
    listener.removeEventListener('click', handleMock1)
    expect(listener.size).toBe(6)
    expect(target.removeEventListener.mock.calls.length).toBe(0)

    listener.removeEventListener('click', handleMock2)
    expect(listener.size).toBe(5)
    expect(target.removeEventListener.mock.calls.length).toBe(1)

    listener.removeEventListener('blur', handleMock1)
    expect(listener.size).toBe(3)
    expect(target.removeEventListener.mock.calls.length).toBe(1)

    listener.removeEventListener('blur', handleMock2)
    expect(listener.size).toBe(0)
    expect(target.removeEventListener.mock.calls.length).toBe(2)
  })
})
