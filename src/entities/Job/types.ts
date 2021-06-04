export type JobAttributes<P extends object = {}> = {
  id: string
  name: string
  payload: P
  run_at: Date
  created_at: Date
}

export type CronTime = keyof typeof TimePresets | string | Date

export const TimePresets = {
  '@yearly': '0 0 0 1 0 *',
  '@monthly': '0 0 0 1 * *',
  '@weekly': '0 0 0 * * 0',
  '@daily': '0 0 0 * * *',
  '@eachDay': '0 0 0 * * *',
  '@hourly': '0 0 * * * *',
  '@eachHour': '0 0 * * * *',
  '@each2Hour': '0 0 */2 * * *',
  '@each3Hour': '0 0 */3 * * *',
  '@each4Hour': '0 0 */4 * * *',
  '@each6Hour': '0 0 */6 * * *',
  '@each12Hour': '0 0 */12 * * *',
  '@minutely': '0 * * * * *',
  '@eachMinute': '0 * * * * *',
  '@each5Minute': '0 */5 * * * *',
  '@each10Minute': '0 */10 * * * *',
  '@each15Minute': '0 */15 * * * *',
  '@each30Minute': '0 */30 * * * *',
  '@secondly': '* * * * * *',
  '@eachSecond': '* * * * * *',
  '@each5Second': '*/5 * * * * *',
  '@each10Second': '*/10 * * * * *',
  '@each15Second': '*/15* * * * *',
  '@each30Second': '*/30* * * * *',
  '@weekdays': '0 0 0 * * 1-5',
  '@weekends': '0 0 0 * * 0,6',
}

export type JobSettings = {
  concurrency?: number
  memory?: boolean
  cron?: CronTime
}

export type NextFunction = () => Promise<void>

export type ScheduleFunction = (
  jobName: string,
  date: Date,
  payload?: object
) => Promise<void>
export type UpdatePayloadFunction = (
  id: string,
  payload?: object
) => Promise<void>
