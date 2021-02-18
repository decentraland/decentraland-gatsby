import Time from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import pluralGetSet from 'dayjs/plugin/pluralGetSet'
import './extend'

Time.extend(utc)
Time.extend(isToday)
Time.extend(isTomorrow)
Time.extend(isYesterday)
Time.extend(isBetween)
Time.extend(isSameOrAfter)
Time.extend(isSameOrBefore)
Time.extend(pluralGetSet)
Time.extend((_options, Dayjs, factory) => {
  const Constants = {
    Millisecond: 1,
    Second: 1000 /* milliseconds */,
    Minute: 1000 /* milliseconds */ * 60 /* seconds */,
    Hour: 1000 /* milliseconds */ * 60 /* seconds */ * 60 /* minutes */,
    Day: 1000 /* milliseconds */ * 60 /* seconds */ * 60 /* minutes */ * 24 /* hours */,
    Week: 1000 /* milliseconds */ * 60 /* seconds */ * 60 /* minutes */ * 24 /* hours */ * 7 /* days */,
  }

  const Formats = Object.freeze({
    GoogleCalendar: 'YYYYMMDDTHHmmss[Z]',
    DateInput: 'YYYY-MM-DD',
    TimeInput: 'HH:mm',
  })

  function date(value?: null | number | string | Date | Time.Dayjs) {
    if (value === null || value === undefined) {
      return null
    }

    if (value instanceof Date) {
      return value
    }

    return Time(value).toDate()
  }

  Object.assign(factory, Constants, { Formats, date })

  Dayjs.prototype.getTime = function timeGetTime() {
    return this.toDate().getTime()
  }

  Dayjs.prototype.toJSON = function timeToJSON() {
    return this.toDate().toJSON()
  }
})

export default Time