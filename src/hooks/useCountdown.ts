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
  }, [])

  let time = until.getTime() - now
  if (!countUp && time < 0) {
    time = 0
  }

  return useMemo(() => {
    const days = Math.abs(Math.floor(time / Time.Day))
    const hours = Math.abs(Math.floor((time % Time.Day) / Time.Hour))
    const minutes = Math.abs(Math.floor((time % Time.Hour) / Time.Minute))
    const seconds = Math.abs(Math.floor((time % Time.Minute) / Time.Second))
    const milliseconds = Math.abs(time % Time.Second)

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