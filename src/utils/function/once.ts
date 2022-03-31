export default function once<F extends (...args: any[]) => any>(f: F): F {
  let value: null | { result: ReturnType<F> } = null

  return function (...args: any[]) {
    if (!value) {
      value = { result: f(...args) }
    }

    return value.result
  } as F
}
