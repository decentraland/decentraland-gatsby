import { useEffect, useMemo, useState } from 'react';

type State<T> = {
  executed: boolean,
  value: T | null,
  timeout: ReturnType<typeof setTimeout> | null
}

export default function useTimeout<T>(fun: () => T, until: Date): T | null {
  const initialValue: State<T> = useMemo(() => {
    if (until.getTime() <= Date.now()) {
      return {
        executed: true,
        value: fun(),
        timeout: null
      }
    }

    return { executed: false, value: null, timeout: null }
  }, [])

  const [state, setState] = useState<State<T>>(initialValue)
  const execute = () => setState({ 
    executed: true,
    value: fun(),
    timeout: null
  })

  useEffect(() => {
    if (state.executed) {
      return
    }

    if (state.timeout) {
      clearTimeout(state.timeout)
    }

    if (until.getTime() <= Date.now()) {
      execute()
    } else {
      setTimeout(execute, until.getTime() - Date.now())
    }
  }, [ until.getTime() ])
  return state.value
}