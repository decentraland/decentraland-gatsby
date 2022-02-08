import { createSearchableMatches } from '.'

describe('createSearchableMatches', () => {
  test('shold remove not word characters', () => {
    expect(
      createSearchableMatches(
        'Planetwide SOS Hackathon - Eylon Aviv of DAOstack and the Builders Collective'
      )
    ).toBe(
      'Planetwide SOS Hackathon Eylon Aviv of DAOstack and the Builders Collective'
    )

    expect(createSearchableMatches('🎅 CryptoPick NFT Xmas Drop🎅')).toBe(
      'CryptoPick Crypto Pick NFT Xmas Drop'
    )

    expect(
      createSearchableMatches('SuperRare - One Million Dollar Art Show & Party')
    ).toBe('SuperRare Super Rare One Million Dollar Art Show Party')
  })
})
