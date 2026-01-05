import ContentServer from './ContentServer'
import { worldContent } from '../../__mocks__/content'

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
      const mock = jest.fn(fetch)
      const server = ContentServer.getInstance().setFetcher(mock)

      mock.mockResolvedValue(
        new Response(JSON.stringify(worldContent), { status: 200 })
      )
      const content = await server.getContentEntity(
        'bafkreih62bkfpytlitkkcwle5jjo5doiv2xuifeturmnmmhrnrugjsguee'
      )
      expect(content).toEqual(worldContent)
      expect(mock.mock.calls.length).toBe(1)
      expect(mock.mock.calls[0]).toEqual([
        'https://worlds-content-server.decentraland.org/contents/bafkreih62bkfpytlitkkcwle5jjo5doiv2xuifeturmnmmhrnrugjsguee',
        {},
      ])
    })
  })
})
