import { useMemo } from 'react'

export type Callback = (...args: any) => void

type Timer = {
  timeout: null | ReturnType<typeof setTimeout>
}

export default function useDebounce<C extends Callback>(callback: C, time: number = 300): C {
  const timer = useMemo<Timer>(() => ({ timeout: null }), [])

  return function debounce(...args: any[]) {
    if (timer.timeout) {
      clearTimeout(timer.timeout)
    }

    timer.timeout = setTimeout(() => callback(...args), time)
  } as C
}