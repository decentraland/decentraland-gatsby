import { useCallback, useEffect, useMemo, useState } from 'react'
import Time from '../utils/date/Time'

type State<T> = {
  executed: boolean
  value: T | null
  timeout: ReturnType<typeof setTimeout> | null
}

export default function useTimeout<T>(
  fun: () => T,
  at: Pick<Date, 'getTime'>
): T | null {
  const [state, setState] = useState<State<T>>(() => {
    if (at.getTime() <= Date.now()) {
      return {
        executed: true,
        value: fun(),
        timeout: null,
      }
    }

    return { executed: false, value: null, timeout: null }
  })

  const execute = useCallback((): void => {
    if (state.executed) {
      return
    }

    if (state.timeout) {
      clearTimeout(state.timeout)
    }

    if (at.getTime() > Date.now()) {
      const time = at.getTime() - Date.now()
      return setState({
        executed: false,
        value: null,
        timeout: setTimeout(execute, Math.min(time, Time.Day)),
      })
    }

    return setState({
      executed: true,
      value: fun(),
      timeout: null,
    })
  }, [state, at.getTime()])

  useEffect(() => {
    if (state.executed) {
      return
    }

    execute()

    return () => {
      if (state.timeout) {
        clearTimeout(state.timeout)
      }
    }
  }, [execute, at.getTime()])

  return state.value
}
