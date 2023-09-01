// TODO(#323): remove on v6, use radash debounce instead https://radash-docs.vercel.app/docs/curry-debounce
export type Callback = (...args: any) => void

/** @deprecated use radash debounce instead https://radash-docs.vercel.app/docs/curry-debounce */
export default function debounce<C extends Callback>(
  callback: C,
  timeout = 300
): C {
  let timer: null | ReturnType<typeof setTimeout> = null

  return function debounceInstance(...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => callback(...args), timeout)
  } as C
}
