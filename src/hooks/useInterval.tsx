import { useEffect, useState } from 'react';

export default function useInterval<T>(fun: () => T, interval: number): T {
  const [ value, setValue ] = useState(fun())

  useEffect(() => {
    const timer = setInterval(() => setValue(fun()), interval)
    return () => clearInterval(timer)
  }, [ interval ])

  return value
}
