import { PluginFunc, ConfigType } from 'dayjs'

declare module 'dayjs' {
  // export function ddd(config?: ConfigType, format?: string): Dayjs
  export const Millisecond: number
  export const Second: number
  export const Minute: number
  export const Hour: number
  export const Day: number
  export const Week: number
  export const Formats: {
    GoogleCalendar: string,
    DateInput: string,
    TimeInput: string,
  }

  export function date(value?: undefined | null): null
  export function date(value: string | number | Date | Dayjs): Date
  export function date(value?: undefined | null | string | number | Date | Dayjs): Date | null

  interface Dayjs {
    getTime(): number
    toJSON(): string
  }
}
