import Time, { extend } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'
import pluralGetSet from 'dayjs/plugin/pluralGetSet'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import './plugin'

extend(utc)
extend(isToday)
extend(isTomorrow)
extend(isYesterday)
extend(isBetween)
extend(isSameOrAfter)
extend(isSameOrBefore)
extend(pluralGetSet)
extend(customParseFormat)
extend(relativeTime)
extend(timezone)
extend(duration)
extend((_options, Dayjs, factory) => {
  const Constants = {
    Millisecond: 1,
    Second: 1000 /* milliseconds */,
    Minute: 1000 /* milliseconds */ * 60 /* seconds */,
    Hour: 1000 /* milliseconds */ * 60 /* seconds */ * 60 /* minutes */,
    Day:
      1000 /* milliseconds */ *
      60 /* seconds */ *
      60 /* minutes */ *
      24 /* hours */,
    Week:
      1000 /* milliseconds */ *
      60 /* seconds */ *
      60 /* minutes */ *
      24 /* hours */ *
      7 /* days */,
  }

  const Formats = Object.freeze({
    GoogleCalendar: 'YYYYMMDDTHHmmss[Z]',
    InputDate: 'YYYY-MM-DD',
    InputTime: 'HH:mm',
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

  Object.assign(factory, Constants, {
    Formats,
    isTime: factory.isDayjs,
    date,
    from: factory,
  })

  // console.log(Dayjs.prototype as any)
  const parse = (Dayjs.prototype as any).parse
  Object.assign(Dayjs.prototype, {
    parse: function (cfg: any) {
      if (
        typeof cfg.date === 'string' &&
        typeof cfg.args[0] === 'string' &&
        cfg.args[1] === Formats.InputTime
      ) {
        cfg.date = '1970-01-01 ' + cfg.date
        cfg.utc = true
        cfg.args[0] = cfg.date
        cfg.args[1] = Formats.InputDate + ' ' + Formats.InputTime
      }

      parse.bind(this)(cfg)
    },
  })

  Dayjs.prototype.getTime = function timeGetTime() {
    return this.toDate().getTime()
  }

  Dayjs.prototype.toJSON = function timeToJSON() {
    return this.toDate().toJSON()
  }
})

export default Time
