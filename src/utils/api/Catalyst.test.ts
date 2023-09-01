import { AuthIdentity, AuthLinkType, Authenticator } from '@dcl/crypto'

import Catalyst from './Catalyst'

const TEST_IDENTITY: AuthIdentity = {
  ephemeralIdentity: {
    address: '0x84452bbFA4ca14B7828e2F3BBd106A2bD495CD34',
    publicKey:
      '0x0420c548d960b06dac035d1daf826472eded46b8b9d123294f1199c56fa235c89f2515158b1e3be0874bfb15b42d1551db8c276787a654d0b8d7b4d4356e70fe42',
    privateKey:
      '0xbc453a92d9baeb3d10294cbc1d48ef6738f718fd31b4eb8085efe7b311299399',
  },
  expiration: new Date('3021-10-16T22:32:29.626Z'),
  authChain: [
    {
      type: AuthLinkType.SIGNER,
      payload: '0x7949f9f239d1a0816ce5eb364a1f588ae9cc1bf5',
      signature: '',
    },
    {
      type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
      payload: `Decentraland Login\nEphemeral address: 0x84452bbFA4ca14B7828e2F3BBd106A2bD495CD34\nExpiration: 3021-10-16T22:32:29.626Z`,
      signature:
        '0x39dd4ddf131ad2435d56c81c994c4417daef5cf5998258027ef8a1401470876a1365a6b79810dc0c4a2e9352befb63a9e4701d67b38007d83ffc4cd2b7a38ad51b',
    },
  ],
}

describe('utils/api/Catalyst', () => {
  test(`should hava a default prop Url`, () => {
    expect(Catalyst.Url).toBeTruthy()
  })

  describe(`.verifySignature()`, () => {
    test(`should verify authChains created with "Authenticator.createSimpleAuthChain()"`, async () => {
      const finalPayload = `Mw485mHs`
      const signature = `0xd8b76035f09faab4e723ce49b9688947b608709f8cd8a70298c10954a4e2bec857d52ee46af53e923c17fea7a6d2cab3144ce10e9960847b37e77323b5c20dcf1b`
      const ownerAddress = TEST_IDENTITY.authChain[0].payload

      const authChain = Authenticator.createSimpleAuthChain(
        finalPayload,
        TEST_IDENTITY.authChain[0].payload,
        signature
      )

      const response = await Catalyst.getInstance().verifySignature(
        authChain,
        finalPayload
      )

      expect(response).toEqual({ ownerAddress, valid: true })
    })

    test(`should verify authChains created with "Authenticator.signPayload()"`, async () => {
      const finalPayload = 'nz81Djv1'
      const authChain = Authenticator.signPayload(TEST_IDENTITY, finalPayload)
      const ownerAddress = Authenticator.ownerAddress(TEST_IDENTITY.authChain)

      const response = await Catalyst.getInstance().verifySignature(
        authChain,
        finalPayload
      )

      expect(response).toEqual({ ownerAddress, valid: true })
    })
  })

  describe(`.get()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      expect(catalyst).toBeInstanceOf(Catalyst)
    })
  })

  describe(`.getAny()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = await Catalyst.getAny()
      expect(catalyst).toBeInstanceOf(Catalyst)
    })
  })

  describe(`.from()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.from(Catalyst.Url)
      expect(catalyst).toBeInstanceOf(Catalyst)
    })
  })

  describe(`.getProfile()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const profile = await catalyst.getProfile(
        '0x05d48ee3e815bf376fc79d283301cfdef872e280'
      )
      expect((profile?.ethAddress || '').toLowerCase()).toEqual(
        '0x05d48ee3e815bf376fc79d283301cfdef872e280'
      )
    })
  })

  describe(`.getProfiles()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const profiles = await catalyst.getProfiles([
        '0x05d48ee3e815bf376fc79d283301cfdef872e280',
      ])
      expect(Array.isArray(profiles)).toBe(true)
      expect(profiles.length).toBe(1)
      expect((profiles[0]?.ethAddress || '').toLowerCase()).toEqual(
        '0x05d48ee3e815bf376fc79d283301cfdef872e280'
      )
    })
  })

  describe.skip(`.getStatus() / .getCommsStatus() [deprecated]`, () => {
    test.skip(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const status = await catalyst.getStatus()
      expect(typeof status.name).toEqual('string')
      const commsStatus = await catalyst.getCommsStatus()
      expect(typeof commsStatus.version).toEqual('string')
    })
  })

  describe(`.getAbout()`, () => {
    test.skip(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const about = await catalyst.getAbout()
      expect(typeof about.configurations.realmName).toEqual('string')
      expect(typeof about.content.commitHash).toEqual('string')
      expect(typeof about.lambdas.commitHash).toEqual('string')
      expect(typeof about.comms.commitHash).toEqual('string')
      expect(typeof about.bff.commitHash).toEqual('string')
    })
  })

  describe(`.getContentStatus()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const status = await catalyst.getContentStatus()
      expect(typeof status.version).toEqual('string')
    })
  })

  describe(`.getContentStatus()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const status = await catalyst.getLambdasStatus()
      expect(typeof status.version).toEqual('string')
    })
  })

  describe(`.getEntityScenes()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const scenes = await catalyst.getEntityScenes(['0,0'])
      expect(Array.isArray(scenes)).toBe(true)
      expect(scenes.every((scene) => typeof scene.id === 'string')).toBe(true)
    })
  })

  describe.skip(`.getServer()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const servers = await catalyst.getServers()
      expect(Array.isArray(servers)).toBe(true)
      expect(servers.every((server) => typeof server.id === 'string')).toBe(
        true
      )
    })
  })

  describe(`.getPeers()`, () => {
    test.skip(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const peers = await catalyst.getPeers()
      expect(Array.isArray(peers)).toBe(true)
      expect(peers.every((peer) => typeof peer.id === 'string')).toBe(true)
    })
  })

  describe.skip(`.getBanNames()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const names = await catalyst.getBanNames()
      expect(Array.isArray(names)).toBe(true)
      expect(names.every((name) => typeof name === 'string')).toBe(true)
    })
  })

  describe.skip(`.getPOIs()`, () => {
    test(`should return an instance of a Catalyst`, async () => {
      const catalyst = Catalyst.getInstance()
      const pois = await catalyst.getPOIs()
      expect(Array.isArray(pois)).toBe(true)
      expect(
        pois.every(
          (poi) =>
            poi.length === 2 &&
            typeof poi[0] === 'number' &&
            typeof poi[1] === 'number'
        )
      ).toBe(true)
    })
  })
})
