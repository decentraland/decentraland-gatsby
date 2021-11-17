import { useEffect, useState } from 'react'
import Time from '../utils/date/Time'

type State = {
  result: boolean
  timeout: null | ReturnType<typeof setTimeout>
}

function createTimeoutState(at: Pick<Date, 'getTime'>): State {
  return {
    result: at.getTime() < Date.now(),
    timeout: null,
  }
}

function getNextTimeout(at: Pick<Date, 'getTime'>) {
  const now = Date.now()
  const time = at.getTime() - now
  return Math.min(Math.max(time, 0), Time.Day)
}

export default function useTimeout(at: Pick<Date, 'getTime'>): boolean {
  const [state, setState] = useState<State>(() => createTimeoutState(at))

  useEffect(() => {
    if (state.result) {
      return
    }

    let cancelled = false
    if (!state.timeout) {
      const timeout = setTimeout(() => {
        if (!cancelled) {
          setState(createTimeoutState(at))
        }
      }, getNextTimeout(at))

      setState({
        ...state,
        timeout,
      })
    }

    return () => {
      cancelled = true
    }
  }, [state])

  return state.result
}
