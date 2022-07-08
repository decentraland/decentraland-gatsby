import React, { useCallback } from 'react'

import { track } from '../../utils/development/segment'
import {
  getMouseEventData,
  getMouseEventName,
  isMeta,
} from '../../utils/dom/events'
import { isBlankTarget, isLocalLink } from '../../utils/dom/links'

export type Handler = (event: React.MouseEvent<any>, ...extra: any[]) => void

/**
 * Proxy and useCallback and send an event each time it is call,
 * it also extract props automatically from the event and the event target
 *
 * @example: tracking click event
 *
 * The following code will dispatch an event each time the anchor get clicks
 *
 * ```tsx
 * export function Component() {
 *   const handleClick = useTrackLinkContext()
 *   /// analytics.track('click', { location: '...', href: '...', text: 'click here' })
 *
 *   return <a href="..." onClick={handleClick}>click here</a>
 * }
 * ```
 *
 * @example: tracking extra data
 *
 * To send more date to segment you can use [`dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) to do it
 *
 * ```tsx
 * export function Component() {
 *   const handleClick = useTrackLinkContext()
 *   /// analytics.track('click', { ..., ref: 'email' })
 *
 *   return <a href="..." data-ref="email" onClick={handleClick}>click here</a>
 * }
 * ```
 *
 * @example: tracking a custom event
 *
 * To send a custom event to segment you can defined on the `dataset-event` prop
 *
 * ```tsx
 * export function Component() {
 *   const handleClick = useTrackLinkContext()
 *   /// analytics.track('custom_event', { ... })
 *
 *   return <a data-event="custom_event"  href="..." onClick={handleClick}>click here</a>
 * }
 * ```
 */
export default function useTrackLinkContext<H extends Handler>(
  callback?: H,
  deps: React.DependencyList = []
): H {
  return useCallback(
    ((event: React.MouseEvent<any>, ...extra: any[]) => {
      const name = getMouseEventName(event)
      const data = getMouseEventData(event)

      if (callback) {
        callback(event, ...extra)
      }

      if (
        !isLocalLink(data.href) &&
        !isBlankTarget(data.target) &&
        !isMeta(event) &&
        !event.defaultPrevented
      ) {
        event.preventDefault()
        track(name, data, () => {
          window.location.href = data.href!
        })
      } else {
        track(name, data)
      }
    }) as H,
    deps
  )
}
