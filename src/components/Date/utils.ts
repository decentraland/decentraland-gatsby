export type DateOptions = {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export enum Time {
  Millisecond = 1,
  Second = 1000,
  Minute = 1000 * 60,
  Hour = 1000 * 60 * 60,
  Day = 1000 * 60 * 60 * 24,
  Week = 1000 * 60 * 60 * 24 * 7,
}

const days = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
]

export function toDateOptions(date: Date): DateOptions {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
  }
}

export function date(options: Partial<DateOptions> = {}) {
  const final: DateOptions = {
    ...toDateOptions(new Date()),
    ...options,
  }

  return new Date(
    final.year,
    final.month - 1,
    final.day,
    final.hours,
    final.minutes,
    final.seconds,
    final.milliseconds
  )
}

export function now() {
  return new Date()
}

export function today() {
  return date({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
}

function short(value: string) {
  return value.slice(0, 3)
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1).toLowerCase()
}

export type ToNameOptions = {
  short?: boolean
  capitalized?: boolean
  utc?: boolean
}

export type ToNumberOptions = {
  utc?: boolean
}

/** @deprecated use `toPrefixedNumber` instead */
export function toFixedNumber(value: number) {
  return toPrefixedNumber(value, 2)
}

/** @deprecated use `utils/number/pad` instead */
export function toPrefixedNumber(value: number, length: number = 0) {
  let raw = String(value)
  let result = ''

  if (raw.startsWith('-')) {
    result += '-'
    raw = raw.slice(1)
  }

  const [integer, decimals] = raw.split('.')
  const prefix = '0'.repeat(Math.max(length - integer.length, 0))
  result += prefix + integer

  if (decimals) {
    result += '.' + decimals
  }

  return result
}

/** @deprecated use `utils/Datetime#getDatePadded` instead */
export function toDayNumber(date: Date, options: ToNumberOptions = {}) {
  const day = options.utc ? date.getUTCDate() : date.getDate()
  return day
}

/** @deprecated use `utils/Datetime#getDateName` instead */
export function toDayName(date: Date, options: ToNameOptions = {}) {
  const day = options.utc ? date.getUTCDay() : date.getDay()
  let result = days[day]

  if (options.short) {
    result = short(result)
  }

  if (options.capitalized) {
    result = capitalize(result)
  }

  return result
}

/** @deprecated use `utils/Datetime#getMonthName` instead */
export function toMonthName(date: Date, options: ToNameOptions = {}) {
  const month = options.utc ? date.getMonth() : date.getMonth()
  let result = months[month]

  if (options.short) {
    result = short(result)
  }

  if (options.capitalized) {
    result = capitalize(result)
  }

  return result
}

/** @deprecated use `utils/Datetime#getTimezoneName` instead */
export function toTimezoneName(value: Date) {
  const offset = value.getTimezoneOffset()
  const hour = toFixedNumber(Math.floor(offset / 60))
  const minutes = toFixedNumber(offset % 60)
  const diff = offset > 0 ? '-' : '+'

  return `GMT${diff}${hour}:${minutes}`
}

/** @deprecated use `utils/Datetime#toInputDate` instead */
export function toInputDate(date: Date): string {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, toFixedNumber(month), toFixedNumber(day)].join('-')
}

/** @deprecated use `utils/Datetime#toInputDate` instead */
export function toUTCInputDate(date: Date): string {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  return [year, toFixedNumber(month), toFixedNumber(day)].join('-')
}

/** @deprecated use `utils/Datetime@fromInputDate` instead */
export function fromInputDate(value: string, base: Date = today()) {
  if (!value) {
    return base
  }

  const [year, month, day] = value.split('-').map(Number)
  const newDate = new Date(base.getTime())
  newDate.setFullYear(year)
  newDate.setMonth(month - 1)
  newDate.setDate(day)
  return newDate
}

/** @deprecated use `utils/Datetime@fromInputDate` instead */
export function fromUTCInputDate(value: string, base: Date = today()) {
  if (!value) {
    return base
  }

  const [year, month, day] = value.split('-').map(Number)
  const newDate = new Date(base.getTime())
  newDate.setUTCFullYear(year)
  newDate.setUTCMonth(month - 1)
  newDate.setUTCDate(day)
  return newDate
}

/** @deprecated use `utils/Datetime#toInputTime` instead */
export function toInputTime(date: Date): string {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  const hours = date.getHours()
  const minutes = date.getMinutes()

  return [toFixedNumber(hours), toFixedNumber(minutes)].join(':')
}

/** @deprecated use `utils/Datetime#toInputTime` instead */
export function toUTCInputTime(date: Date): string {
  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  return [toFixedNumber(hours), toFixedNumber(minutes)].join(':')
}

/** @deprecated use `utils/Datetime@fromInputTime` instead */
export function fromInputTime(value: string, base: Date = today()) {
  if (!value) {
    return base
  }

  const [hours, minutes] = value.split(':').map(Number)
  const newDate = new Date(base.getTime())
  newDate.setHours(hours)
  newDate.setMinutes(minutes)
  return newDate
}

/** @deprecated use `utils/Datetime@fromInputTime` instead */
export function fromUTCInputTime(value: string, base: Date = today()) {
  if (!value) {
    return base
  }

  const [hours, minutes] = value.split(':').map(Number)
  const newDate = new Date(base.getTime())
  newDate.setUTCHours(hours)
  newDate.setUTCMinutes(minutes)
  return newDate
}

/** @deprecated use `utils/Datetime#toGoogleCalendar` instead */
export function toCalendarDate(date: Date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()
  return [
    year,
    toFixedNumber(month),
    toFixedNumber(day),
    'T',
    toFixedNumber(hours),
    toFixedNumber(minutes),
    toFixedNumber(seconds),
    'Z',
  ].join('')
}
