export default function once<F extends (...args: any[]) => any>(f: F): F {

  const execution = {
    executed: false,
    result: undefined as any
  }

  return function (...args: any[]) {
    if (execution.executed) {
      return execution.result
    }

    const result = f(...args)
    execution.result = result
    execution.executed = true
    return result
  } as F
}