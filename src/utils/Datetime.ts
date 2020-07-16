import pad from "./number/pad";

export type DatetimeOptions = {
  utc?: boolean
}

export type NameOptions = {
  short?: boolean,
  capitalized?: boolean,
}

export default class Datetime {

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
    return new Datetime(new Date, options)
  }

  static Today(options: DatetimeOptions = {}) {
    const date = new Datetime(new Date, options)
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
      return new Datetime(new Date(value.getTime()), options)
    } else if (typeof value === 'string') {
      return new Datetime(new Date(Date.parse(value)), options)
    } else {
      return new Datetime(new Date(value), options)
    }
  }

  constructor(public date: Date = new Date, public options: DatetimeOptions = {}) {
  }

  getTime() {
    return this.date.getTime()
  }

  getUTCDate() {
    return this.date.getUTCDate()
  }

  getUTCDay() {
    return this.date.getUTCDay()
  }

  getUTCFullYear() {
    return this.date.getUTCFullYear()
  }

  getUTCHours() {
    return this.date.getUTCHours()
  }

  getUTCMilliseconds() {
    return this.date.getUTCMilliseconds()
  }

  getUTCMinutes() {
    return this.date.getUTCMinutes()
  }

  getUTCMonth() {
    return this.date.getUTCMonth()
  }

  getUTCSeconds() {
    return this.date.getUTCSeconds()
  }


  getDate() {
    return this.options.utc ? this.date.getUTCDate() : this.date.getDate()
  }

  getDatePadded(digits: number = 2) {
    return pad(this.getDate(), digits)
  }

  setDate(value: number) {
    return this.options.utc ? this.date.setUTCDate(value) : this.date.setDate(value)
  }

  getDay() {
    return this.options.utc ? this.date.getUTCDay() : this.date.getDay()
  }

  getDayName(options: NameOptions = {}) {
    const d = this.getDay()
    const name = Datetime.Days[d]
    return Datetime.parseName(name, options)
  }

  getFullYear() {
    return this.options.utc ? this.date.getUTCFullYear() : this.date.getFullYear()
  }

  setFullYear(year: number, month?: number, date?: number) {
    if (date !== undefined) {
      return this.options.utc ? this.date.setUTCFullYear(year, month, date) : this.date.setFullYear(year, month, date)
    } else if (month !== undefined) {
      return this.options.utc ? this.date.setUTCFullYear(year, month) : this.date.setFullYear(year, month)
    } else {
      return this.options.utc ? this.date.setUTCFullYear(year) : this.date.setFullYear(year)
    }
  }

  getHours() {
    return this.options.utc ? this.date.getUTCHours() : this.date.getHours()
  }

  getHoursPadded(digits: number = 2) {
    return pad(this.getHours(), digits)
  }

  setHours(hours: number, min?: number, sec?: number, ms?: number) {
    if (ms !== undefined) {
      return this.options.utc ? this.date.setUTCHours(hours, min, sec, ms) : this.date.setHours(hours, min, sec, ms)
    } else if (sec !== undefined) {
      return this.options.utc ? this.date.setUTCHours(hours, min, sec) : this.date.setHours(hours, min, sec)
    } else if (min !== undefined) {
      return this.options.utc ? this.date.setUTCHours(hours, min) : this.date.setHours(hours, min)
    } else {
      return this.options.utc ? this.date.setUTCHours(hours) : this.date.setHours(hours)
    }
  }

  getMilliseconds() {
    return this.options.utc ? this.date.getUTCMilliseconds() : this.date.getMilliseconds()
  }

  getMillisecondsPadded(digits: number = 2) {
    return pad(this.getMilliseconds(), digits)
  }

  setMilliseconds(ms: number) {
    return this.options.utc ? this.date.setUTCMilliseconds(ms) : this.date.setMilliseconds(ms)
  }

  getMinutes() {
    return this.options.utc ? this.date.getUTCMinutes() : this.date.getMinutes()
  }

  getMinutesPadded(digits: number = 2) {
    return pad(this.getMinutes(), digits)
  }

  setMinutes(min: number, sec?: number | undefined, ms?: number | undefined) {
    if (ms !== undefined) {
      return this.options.utc ? this.date.setUTCMinutes(min, sec, ms) : this.date.setMinutes(min, sec, ms)
    } else if (sec !== undefined) {
      return this.options.utc ? this.date.setUTCMinutes(min, sec) : this.date.setMinutes(min, sec)
    } else {
      return this.options.utc ? this.date.setUTCMinutes(min) : this.date.setMinutes(min)
    }
  }

  getMonth() {
    return this.options.utc ? this.date.getUTCMonth() : this.date.getMonth()
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
    if (date !== undefined) {
      return this.options.utc ? this.date.setUTCMonth(month, date) : this.date.setMonth(month, date)
    } else {
      return this.options.utc ? this.date.setUTCMonth(month) : this.date.setMonth(month)
    }
  }

  getSeconds() {
    return this.options.utc ? this.date.getUTCSeconds() : this.date.getSeconds()
  }

  getSecondsPadded(digits: number = 2) {
    return pad(this.getSeconds(), digits)
  }

  setSeconds(sec: number, ms?: number | undefined) {
    if (ms !== undefined) {
      return this.options.utc ? this.date.setUTCSeconds(sec, ms) : this.date.setSeconds(sec, ms)
    } else {
      return this.options.utc ? this.date.setUTCSeconds(sec) : this.date.setSeconds(sec)
    }
  }

  getTimezoneOffset() {
    return this.date.getTimezoneOffset()
  }

  getTimezoneName() {
    if (this.options.utc) {
      return 'UTC'
    }

    const offset = this.date.getTimezoneOffset()
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

  static fromInputDate(value: string | null | undefined, base: Date = new Date, options: DatetimeOptions = {}) {
    const newDate = new Datetime(new Date(base.getTime()), { ...options })
    if (!value) {
      return newDate
    }

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

  static fromInputTime(value: string | null | undefined, base: Date = new Date(), options: DatetimeOptions = {}) {
    const newDate = new Datetime(new Date(base.getTime()), { ...options })
    if (!value) {
      return newDate
    }

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