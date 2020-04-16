import { useEffect, useState, useMemo } from 'react';
import { Time } from '../components/Date/utils';

export type CountDown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  time: number
}

export default function useCountdown(until: Date, each: number = Time.Second): CountDown {

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let timeout: number;
    let interval: number;
    const initialDiff = now % each;

    function update() {
      const now = Date.now()
      const diff = now % each;
      setNow(now - diff)

      if (now >= until.getTime() && interval) {
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
  }, [])

  const time = Math.max(until.getTime() - now, 0)
  return useMemo(() => {
    if (time === 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        time
      }
    }

    const days = Math.floor(time / Time.Day)
    const hours = Math.floor((time % Time.Day) / Time.Hour)
    const minutes = Math.floor((time % Time.Hour) / Time.Minute)
    const seconds = Math.floor((time % Time.Minute) / Time.Second)
    const milliseconds = time % Time.Second

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      time
    }

  }, [time])

}