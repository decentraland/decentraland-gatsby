import { hash } from 'immutable'

export type TargetListener = Pick<HTMLElement, 'addEventListener' | 'removeEventListener'>

export type Event = keyof HTMLElementEventMap

export type Listener<K extends Event = any> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any

/**
 * SingletonListener
 * 
 * An event handler manager to minimize the number of subscription to DOM objects
 */
export default class SingletonListener<T extends TargetListener> {

  /**
   * instance store
   */
  static cache = new Map<number, SingletonListener<any>>()

  /**
   * Check for previous instance to return, otherwise create new one
   * 
   * @param target listener target
   */
  static from<T extends TargetListener>(target: T): SingletonListener<T> {
    const id = hash(target)
    if (!this.cache.has(id)) {
      this.cache.set(id, new SingletonListener(target))
    }

    return this.cache.get(id)!
  }

  private listeners = new Map<Event, Listener[]>()
  private callbacks = new Map<Event, Listener>()

  /**
   * return the total of subscription to this listener
   */
  get size() {
    let result = 0
    for (const listeners of this.listeners.values()) {
      result += listeners.length
    }
    return result
  }

  constructor(public readonly target: T | null = null) { }

  /**
   * Create a physical subscription to a target event
   * @param event 
   */
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

    if (this.target) {
      this.target.addEventListener(event, callback)
    }
    this.callbacks.set(event, callback)
    return this
  }

  /**
   * Remove a virtual subscription to a target event
   * if there aren't any more virtual subscription then
   * will remove the physical subscription
   * 
   * @param event 
   */
  private unsubscribe(event: Event) {
    const listeners = this.listeners.get(event)

    if (listeners && listeners.length) {
      this.listeners.set(event, [])
    }

    const callback = this.callbacks.get(event)

    if (callback) {
      this.callbacks.delete(event)
      if (this.target) {
        this.target.removeEventListener(event, callback)
      }
    }

    return this
  }

  /**
   * Dispatch and event to all virtual subscriptions
   * @param event 
   * @param data 
   */
  dispatch(event: Event | string, data: any) {
    const target = this.target
    const callback = this.callbacks.get(event as Event)
    return new Promise((resolve) => setTimeout(() => {
      if (callback && target) {
        callback.call(this.target, data)
      }

      resolve()
    }, 0))
  }

  /**
   * Create a virtual subscription to the target
   * 
   * @param event 
   * @param listener 
   */
  addEventListener<K extends Event>(event: K | string, listener: Listener<K>) {
    const listeners = this.listeners.get(event as K) || []
    listeners.push(listener)

    if (listeners.length === 1) {
      this.subscribe(event as K)
    }

    this.listeners.set(event as K, listeners)

    return this
  }

  /**
   * Remove a virtual subscription to the target 
   * @param event 
   * @param listener 
   */
  removeEventListener<K extends Event>(event: K | string, listener: Listener<K>) {
    const listeners = this.listeners.get(event as K)

    if (!listeners || listeners.length === 0) {
      return this.unsubscribe(event as K)
    }

    const newListeners = listeners.filter(l => l !== listener)

    if (newListeners.length === 0) {
      return this.unsubscribe(event as K)
    }

    this.listeners.set(event as K, newListeners)

    return this
  }
}