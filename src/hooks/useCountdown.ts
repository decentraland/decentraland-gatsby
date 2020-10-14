import { useEffect, useState, useMemo } from 'react';
import { Time } from '../components/Date/utils';

export type CountDown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  time: number
  countingUp: boolean
}

export default function useCountdown(until: Date, each: number = Time.Second, countUp: boolean = false): CountDown {

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let timeout: number;
    let interval: number;
    const initialDiff = now % each;

    function update() {
      const now = Date.now()
      const diff = now % each;
      setNow(now - diff)

      if (!countUp && now >= until.getTime() && interval) {
        clearInterval(interval)
      }
    }

    timeout = setTimeout(() => {
      interval = setInterval(update, each) as any
      update()
    }, initialDiff) as any

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }

      if (interval) {
        clearInterval(interval)
      }
    }
  }, [ until.getTime() ])

  let time = until.getTime() - now
  if (!countUp && time < 0) {
    time = 0
  }

  return useMemo(() => {
    const days = Math.abs(time / Time.Day) | 0
    const hours = Math.abs((time % Time.Day) / Time.Hour) | 0
    const minutes = Math.abs((time % Time.Hour) / Time.Minute) | 0
    const seconds = Math.abs((time % Time.Minute) / Time.Second) | 0
    const milliseconds = Math.abs(time % Time.Second) | 0

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      time,
      countingUp: time < 0
    }

  }, [time])

}