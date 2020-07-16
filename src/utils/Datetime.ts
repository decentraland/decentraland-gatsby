import pad from "./number/pad";

export type DatetimeOptions = {
  utc?: boolean
}

export type NameOptions = {
  short?: boolean,
  capitalized?: boolean,
}

export default class Datetime extends Date {

  static Millisecond = 1;
  static Second = 1000;
  static Minute = 1000 * 60;
  static Hour = 1000 * 60 * 60;
  static Day = 1000 * 60 * 60 * 24;
  static Week = 1000 * 60 * 60 * 24 * 7;
  static Days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ]

  static Months = [
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
    'DECEMBER'
  ]

  static Now(options: DatetimeOptions = {}) {
    return new Datetime(Date.now(), options)
  }

  static Today(options: DatetimeOptions = {}) {
    const date = new Datetime(Date.now(), options)
    date.setHours(0, 0, 0, 0)
    return date
  }

  static parseName(value: string, options: NameOptions = {}) {
    if (options.short) {
      value = value.slice(0, 3)
    }

    if (options.capitalized) {
      value = value[0].toUpperCase() + value.slice(1).toLowerCase()
    }

    return value
  }

  static from(value: Date | string | number = Date.now(), options: DatetimeOptions = {}) {
    if (value instanceof Date) {
      return new Datetime(value.getTime(), options)
    } else if (typeof value === 'string') {
      return new Datetime(Datetime.parse(value), options)
    } else {
      return new Datetime(value, options)
    }
  }

  constructor(time: number = Date.now(), public options: DatetimeOptions = {}) {
    super(time)
  }

  getDate() {
    return this.options.utc ? super.getUTCDate() : super.getDate()
  }

  getDatePadded(digits: number = 2) {
    return pad(this.getDate(), digits)
  }

  getDateName(options: NameOptions = {}) {
    const d = this.getDate()
    const name = Datetime.Days[d]
    return Datetime.parseName(name, options)
  }

  setDate(value: number) {
    return this.options.utc ? super.setUTCDate(value) : super.setDate(value)
  }

  getDay() {
    return this.options.utc ? super.getUTCDay() : super.getDay()
  }

  getFullYear() {
    return this.options.utc ? super.getUTCFullYear() : super.getFullYear()
  }

  setFullYear(year: number, month?: number, date?: number) {
    return this.options.utc ? super.setUTCFullYear(year, month, date) : super.setFullYear(year, month, date)
  }

  getHours() {
    return this.options.utc ? super.getUTCHours() : super.getHours()
  }

  getHoursPadded(digits: number = 2) {
    return pad(this.getHours(), digits)
  }

  setHours(hours: number, min?: number, sec?: number, ms?: number) {
    return this.options.utc ? super.setUTCHours(hours, min, sec, ms) : super.setHours(hours, min, sec, ms)
  }

  getMilliseconds() {
    return this.options.utc ? super.getUTCMilliseconds() : super.getMilliseconds()
  }

  getMillisecondsPadded(digits: number = 2) {
    return pad(this.getMilliseconds(), digits)
  }

  setMilliseconds(ms: number) {
    return this.options.utc ? super.setUTCMilliseconds(ms) : super.setMilliseconds(ms)
  }

  getMinutes() {
    return this.options.utc ? super.getUTCMinutes() : super.getMinutes()
  }

  getMinutesPadded(digits: number = 2) {
    return pad(this.getMinutes(), digits)
  }

  setMinutes(min: number, sec?: number | undefined, ms?: number | undefined) {
    return this.options.utc ? super.setUTCMinutes(min, sec, ms) : super.setMinutes(min, sec, ms)
  }

  getMonth() {
    return this.options.utc ? super.getUTCMonth() : super.getMonth()
  }

  getMonthPadded(digits: number = 2) {
    return pad(this.getMonth(), digits)
  }

  getMonthNumber() {
    return this.getMonth() + 1
  }

  getMonthNumberPadded(digits: number = 2) {
    return pad(this.getMonthNumber(), digits)
  }

  getMonthName(options: NameOptions = {}) {
    const m = this.getMonth()
    const name = Datetime.Months[m]
    return Datetime.parseName(name, options)
  }

  setMonth(month: number, date?: number) {
    return this.options.utc ? super.setUTCMonth(month, date) : super.setMonth(month, date)
  }

  getSeconds() {
    return this.options.utc ? super.getUTCSeconds() : super.getSeconds()
  }

  getSecondsPadded(digits: number = 2) {
    return pad(this.getSeconds(), digits)
  }

  setSeconds(sec: number, ms?: number | undefined) {
    return this.options.utc ? super.setUTCSeconds(sec, ms) : super.setSeconds(sec, ms)
  }

  getTimezoneName() {
    if (this.options.utc) {
      return 'UTC'
    }

    const offset = this.getTimezoneOffset()
    if (offset === 0) {
      return 'UTC'
    }

    return 'GMT' + pad(offset / 60, 2) + ':' + pad(Math.abs(offset % 60), 2)
  }

  toInputDate() {
    if (Number.isNaN(this.getTime())) {
      return ''
    }

    return [
      this.getFullYear(),
      this.getMonthNumberPadded(),
      this.getDatePadded(),
    ].join('-')
  }

  static fromInputDate(value: string | null | undefined, base: Datetime | Date = Datetime.Now(), options: DatetimeOptions = {}) {
    if (!value) {
      return base
    }

    const newDate = new Datetime(base.getTime(), { ...(base as Datetime).options, ...options })
    const [year, month, day] = value.split('-').map(Number)
    newDate.setFullYear(year)
    newDate.setMonth(month - 1)
    newDate.setDate(day)
    return newDate
  }

  toInputTime() {
    if (Number.isNaN(this.getTime())) {
      return ''
    }

    return [
      this.getHoursPadded(),
      this.getMinutesPadded()
    ].join(':')
  }

  static fromInputTime(value: string | null | undefined, base: Datetime | Date = Datetime.Now(), options: DatetimeOptions = {}) {
    if (!value) {
      return base
    }

    const newDate = new Datetime(base.getTime(), { ...(base as Datetime).options, ...options })
    const [hours, minutes] = value.split(':').map(Number)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    return newDate
  }

  toGoogleCalendar() {
    const year = this.getUTCFullYear()
    const month = this.getUTCMonth() + 1
    const day = this.getUTCDate()
    const hours = this.getUTCHours()
    const minutes = this.getUTCMinutes()
    const seconds = this.getUTCSeconds()
    return [
      year,
      pad(month, 2),
      pad(day, 2),
      'T',
      pad(hours, 2),
      pad(minutes, 2),
      pad(seconds, 2),
      'Z'
    ].join('')
  }

}