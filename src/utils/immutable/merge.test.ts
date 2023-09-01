import immutableMerge from './merge'

describe('src/utils/object/immutableMerge', () => {
  test(`should return the same object if nothing changed`, () => {
    const target = { data: 'value1' }
    expect(immutableMerge(target, {})).toBe(target)
    expect(immutableMerge(target, { data: 'value1' })).toBe(target)
  })

  test(`should return a new object of any value changed`, () => {
    const target = { data: 'value', data1: 'value1' }
    const merged = immutableMerge(target, { data1: 'valueA', data2: 'valueB' })
    expect(target).toBe(target)
    expect(target).toEqual({ data: 'value', data1: 'value1' })
    expect(target).not.toBe(merged)
    expect(merged).toEqual({ data: 'value', data1: 'valueA', data2: 'valueB' })
  })
})
