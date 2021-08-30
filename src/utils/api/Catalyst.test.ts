import Catalyst from "./Catalyst"

describe('utils/api/Catalyst', () => {
  test(`Has a default url`, () => {
    expect(Catalyst.Url).toBeTruthy()
  })
})