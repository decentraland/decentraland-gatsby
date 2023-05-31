import { worldContent } from '../../__mocks__/content'
import ContentServer from './ContentServer'

const contentSceneWorld = jest.spyOn(
  ContentServer.getInstance(),
  'getContentEntity'
)

describe('utils/api/ContentServer', () => {
  test(`should hava a default prop Url`, () => {
    expect(ContentServer.Url).toBeTruthy()
  })

  describe(`.getInstance()`, () => {
    test(`should return an instance of a ContentServer`, async () => {
      const content = ContentServer.getInstance()
      expect(content).toBeInstanceOf(ContentServer)
    })
  })

  describe(`.getContentEntity()`, () => {
    test(`should return an instance of a ContentServer`, async () => {
      const contentScene = await ContentServer.getInstance().getContentEntity(
        'bafkreih62bkfpytlitkkcwle5jjo5doiv2xuifeturmnmmhrnrugjsguee'
      )
      contentSceneWorld.mockResolvedValueOnce(Promise.resolve(worldContent))
      expect(contentScene).toEqual(worldContent)

      expect(contentSceneWorld.mock.calls.length).toBe(1)
    })
  })
})
