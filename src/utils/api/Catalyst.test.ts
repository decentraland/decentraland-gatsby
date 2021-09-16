import Catalyst from './Catalyst'
import { Authenticator, AuthLinkType, AuthIdentity } from 'dcl-crypto'

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
      const ownerAddress = TEST_IDENTITY.authChain[0].payload
      const signature = `0xd8b76035f09faab4e723ce49b9688947b608709f8cd8a70298c10954a4e2bec857d52ee46af53e923c17fea7a6d2cab3144ce10e9960847b37e77323b5c20dcf1b`

      const authChain = Authenticator.createSimpleAuthChain(
        finalPayload,
        TEST_IDENTITY.authChain[0].payload,
        signature
      )

      const response = await Catalyst.get().verifySignature(
        authChain,
        finalPayload
      )

      expect(response).toEqual({ ownerAddress, valid: true })
    })

    test(`should verify authChains created with "Authenticator.signPayload()"`, async () => {
      const finalPayload = 'nz81Djv1'
      const ownerAddress = TEST_IDENTITY.authChain[0].payload
      const authChain = Authenticator.signPayload(TEST_IDENTITY, finalPayload)

      const response = await Catalyst.get().verifySignature(
        authChain,
        finalPayload
      )

      expect(response).toEqual({ ownerAddress, valid: true })
    })
  })
})
