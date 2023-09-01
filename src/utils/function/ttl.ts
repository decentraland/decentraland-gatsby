// TODO(#323): remove on v6, use radash memo instead https://radash-docs.vercel.app/docs/curry-memo
/** @deprecated use radash memo instead https://radash-docs.vercel.app/docs/curry-memo */
export default function ttl<F extends (...args: any[]) => any>(
  f: F,
  time: number
): F {
  const execution = {
    latest: 0,
    result: undefined as any,
  }

  return function (...args: any[]) {
    const now = Date.now()
    if (execution.latest + time > now) {
      return execution.result
    }

    const result = f(...args)
    execution.result = result
    execution.latest = now
    return result
  } as F
}
