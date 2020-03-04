export type TargetListener = Pick<HTMLElement, 'addEventListener' | 'removeEventListener'>

export type Event = keyof HTMLElementEventMap

export type Listener<K extends Event = any> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any

export default class SingletonListener<T extends TargetListener> {

  private listeners = new Map<Event, Listener[]>()
  private callbacks = new Map<Event, Listener>()

  get size() {
    let result = 0
    for (const listeners of this.listeners.values()) {
      result += listeners.length
    }
    return result
  }

  constructor(public readonly target: T) { }

  private subscribe(event: Event) {
    if (this.callbacks.has(event)) {
      console.warn(`Already subscribed to "${event}"`)
      return this
    }

    const _this = this
    const callback = function (this: HTMLElement, data: any) {
      const listeners = _this.listeners.get(event) || []

      for (const listener of listeners) {
        try {
          listener.call(this as any, data)
        } catch (error) {
          console.error(`Error executing listener: ${error.message}`, error)
        }
      }
    }

    this.target.addEventListener(event, callback)
    this.callbacks.set(event, callback)
    return this
  }

  private unsubscribe(event: Event) {
    const listeners = this.listeners.get(event)

    if (listeners && listeners.length) {
      this.listeners.set(event, [])
    }

    const callback = this.callbacks.get(event)

    if (callback) {
      this.target.removeEventListener(event, callback)
    }

    return this
  }

  dispatch(event: Event, data: any) {
    const callback = this.callbacks.get(event)
    if (callback) {
      callback.call(this.target, data)
    }
  }

  addEventListener<K extends Event>(event: K, listener: Listener<K>) {
    const listeners = this.listeners.get(event) || []
    listeners.push(listener)

    if (listeners.length === 1) {
      this.subscribe(event)
    }

    this.listeners.set(event, listeners)

    return this
  }

  removeEventListener<K extends Event>(event: K, listener: Listener<K>) {
    const listeners = this.listeners.get(event)

    if (!listeners || listeners.length === 0) {
      return this.unsubscribe(event)
    }

    const newListeners = listeners.filter(l => l !== listener)

    if (newListeners.length === 0) {
      return this.unsubscribe(event)
    }

    this.listeners.set(event, newListeners)

    return this
  }

}