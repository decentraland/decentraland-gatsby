export default async function delay(time: number): Promise<void>
export default async function delay<T>(
  time: number,
  value?: Promise<T>
): Promise<T>
export default async function delay<T>(time: number, value?: T): Promise<T>
export default async function delay<T>(time: number, value?: T): Promise<T> {
  return Promise.resolve().then(
    () => new Promise((resolve) => setTimeout(() => resolve(value as T), time))
  )
}
