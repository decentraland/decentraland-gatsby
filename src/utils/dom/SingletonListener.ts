import { hash } from 'immutable'
import rollbar from '../development/rollbar'
import segment from '../development/segment'

export type TargetListener = Pick<
  HTMLElement,
  'addEventListener' | 'removeEventListener'
>

export type EventMap = HTMLElementEventMap & WindowEventMap
export type Event = keyof EventMap

export type Listener<K extends Event = any> = (
  this: HTMLElement,
  ev: EventMap[K]
) => any
export type Callback<D extends {}> = (this: HTMLElement, data: D) => any

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

  public readonly target: T | null = null
  private listeners = new Map<string, Listener[]>()
  private callbacks = new Map<string, Listener>()

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

  constructor(target: T | null = null) {
    this.target = target
  }

  /**
   * Create a physical subscription to a target event
   * @param event
   */
  private subscribe(event: Event | string) {
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
        } catch (err) {
          console.error(`Error executing listener: ${err.message}`, err)
          rollbar((rollbar) =>
            rollbar.error(`Error executing listener: ${err.message}`, err)
          )
          segment((analytics) =>
            analytics.track('error', {
              ...err,
              message: `Error executing listener: ${err.message}`,
              stack: err.stack,
            })
          )
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
  private unsubscribe(event: Event | string) {
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
  dispatch<K extends Event>(event: K, data: EventMap[K]): Promise<void> {
    const target = this.target
    const callback = this.callbacks.get(event as Event)
    return Promise.resolve().then(() => {
      if (callback) {
        callback.call(target, data)
      }
    })
  }

  /**
   * Create a virtual subscription to the target
   *
   * @param event
   * @param listener
   */
  addEventListener<K extends Event>(event: K, listener: Listener<K>): this {
    const listeners = this.listeners.get(event) || []
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
  removeEventListener<K extends Event>(event: K, listener: Listener<K>): this {
    const listeners = this.listeners.get(event)

    if (!listeners || listeners.length === 0) {
      return this.unsubscribe(event)
    }

    const newListeners = listeners.filter((l) => l !== listener)

    if (newListeners.length === 0) {
      return this.unsubscribe(event)
    }

    this.listeners.set(event, newListeners)

    return this
  }
}
