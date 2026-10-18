import type React from 'react'

import type { Network } from '@dcl/schemas/dist/dapps/network'

export type BalanceClickEvent = React.MouseEvent<
  HTMLButtonElement | HTMLAnchorElement,
  MouseEvent
>

/**
 * decentraland-ui2 has called `onClickBalance` with two shapes over time:
 * the legacy `UserMenu` passes `(event, network)`, while the current
 * `Navbar` (its `UserCardPanel`) passes only `(network)`, with no click event.
 * Normalise both, so the handler never treats the network string as an event.
 */
export default function resolveBalanceClick(
  eventOrNetwork?: BalanceClickEvent | Network,
  network?: Network
): { event?: BalanceClickEvent; network?: Network } {
  if (typeof eventOrNetwork === 'string') {
    return { network: eventOrNetwork }
  }

  return { event: eventOrNetwork, network }
}
