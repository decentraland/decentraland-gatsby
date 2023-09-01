export type Func = (...args: any[]) => any

export default class TimeInterval {
  #timeout: number
  #callback: Func
  #timer: NodeJS.Timeout | undefined
  constructor(callback: Func, timeout: number) {
    this.#timeout = timeout
    this.#callback = callback
  }

  setCallback(callback: Func) {
    this.#callback = callback
  }

  start() {
    if (!this.#timer) {
      this.#timer = setInterval(() => {
        this.#callback()
      }, this.#timeout)
    }
    return this
  }

  stop() {
    if (this.#timer) {
      clearInterval(this.#timer)
      this.#timer = undefined
    }
    return this
  }
}
