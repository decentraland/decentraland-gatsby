import { useEffect, useMemo, useState } from 'react';
import Datetime from '../utils/Datetime';

type State<T> = {
  executed: boolean,
  value: T | null,
  timeout: ReturnType<typeof setTimeout> | null
}

export default function useTimeout<T>(fun: () => T, at: Date): T | null {
  const initialValue: State<T> = useMemo(() => {
    if (at.getTime() <= Date.now()) {
      return {
        executed: true,
        value: fun(),
        timeout: null
      }
    }

    return { executed: false, value: null, timeout: null }
  }, [])

  const [state, setState] = useState<State<T>>(initialValue)
  const execute = () => {
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
        timeout: setTimeout(execute, Math.min(time, Datetime.Day))
      })
    }

    return setState({
      executed: true,
      value: fun(),
      timeout: null
    })
  }

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
  }, [ at.getTime() ])
  return state.value
}