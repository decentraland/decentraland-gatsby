export type Callback = (...args: any) => void

export default function debounce<C extends Callback>(
  callback: C,
  timeout: number = 300
): C {
  let timer: null | ReturnType<typeof setTimeout> = null

  return function debounceInstance(...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => callback(...args), timeout)
  } as C
}
