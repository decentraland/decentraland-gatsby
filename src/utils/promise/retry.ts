export default async function retry<T>(
  times: number,
  fun: () => Promise<T>
): Promise<T> {
  while (times > 0) {
    try {
      const result = await fun()
      return result
    } catch (err) {
      console.error(err)
      if (times === 1) {
        throw err
      }
    }

    times--
  }

  throw new Error(`Cannot resolve promise`)
}
