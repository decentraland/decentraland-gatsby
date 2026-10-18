import { Network } from '@dcl/schemas/dist/dapps/network'

import resolveBalanceClick, { BalanceClickEvent } from './resolveBalanceClick'

describe('resolveBalanceClick', () => {
  describe('when the Navbar calls it with only the network', () => {
    it('should return the network and no event', () => {
      expect(resolveBalanceClick(Network.MATIC)).toStrictEqual({
        network: Network.MATIC,
      })
    })
  })

  describe('when the legacy UserMenu calls it with the event and the network', () => {
    it('should return both', () => {
      const event = {
        preventDefault: jest.fn(),
      } as unknown as BalanceClickEvent

      expect(resolveBalanceClick(event, Network.ETHEREUM)).toStrictEqual({
        event,
        network: Network.ETHEREUM,
      })
    })
  })

  describe('when it is called with no arguments', () => {
    it('should return neither', () => {
      expect(resolveBalanceClick()).toStrictEqual({
        event: undefined,
        network: undefined,
      })
    })
  })
})
