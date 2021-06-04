import Time from './Time'

describe(`utils/date/Time`, () => {
  test(`parse time input`, () => {
    expect(Time('00:00', 'HH:mm').getTime()).toBe(0)
    expect(Time('00:01', 'HH:mm').getTime()).toBe(Time.Minute)
    expect(Time('01:00', 'HH:mm').getTime()).toBe(Time.Hour)
    expect(Time('23:59', 'HH:mm').getTime()).toBe(
      23 * Time.Hour + 59 * Time.Minute
    )
    expect(Time('24:00', 'HH:mm').getTime()).toBe(Time.Day)
    expect(Time.utc('00:00', 'HH:mm').getTime()).toBe(0)
    expect(Time.utc('00:01', 'HH:mm').getTime()).toBe(Time.Minute)
    expect(Time.utc('01:00', 'HH:mm').getTime()).toBe(Time.Hour)
    expect(Time.utc('23:59', 'HH:mm').getTime()).toBe(
      23 * Time.Hour + 59 * Time.Minute
    )
    expect(Time.utc('24:00', 'HH:mm').getTime()).toBe(Time.Day)
  })

  test(`parse date input`, () => {
    expect(Time.utc('2020-02-20', 'YYYY-MM-DD').toJSON()).toBe(
      `2020-02-20T00:00:00.000Z`
    )
  })

  test(`combine date input and time input`, () => {
    const time = Time.utc('23:59', Time.Formats.InputTime).getTime()
    const date = Time.utc('2020-02-20', Time.Formats.InputDate).getTime()
    expect(new Date(date + time).toJSON()).toBe(`2020-02-20T23:59:00.000Z`)
  })

  test(`helper for apis`, () => {
    expect(Time.date()).toBe(null)
    expect(Time.date(undefined)).toBe(null)
    expect(Time.date(null)).toBe(null)

    const date = new Date('2020-02-20T23:59:00.000Z')
    expect(Time.date(date)).toBe(date)
    expect(Time.date(date.toJSON())).toEqual(date)
    expect(Time.date(date.getTime())).toEqual(date)
    expect(Time.date(Time(date.getTime()))).toEqual(date)
    expect(Time.date(Time.utc(date.getTime()))).toEqual(date)
  })
})
