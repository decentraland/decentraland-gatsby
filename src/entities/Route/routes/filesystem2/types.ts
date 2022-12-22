import type stream from 'stream'

export class Response<
  B extends Buffer | stream.Readable = Buffer | stream.Readable
> {
  status: number
  headers: Record<string, string>
  body: B

  static merge(
    origin: Response,
    ...partials: (Partial<Response> | null | false | undefined)[]
  ): Response {
    const target = {
      ...origin,
      headers: { ...origin.headers },
    }

    for (const partial of partials) {
      if (partial) {
        if (partial.status) {
          target.status = partial.status
        }

        if (partial.headers) {
          target.headers = {
            ...target.headers,
            ...partial.headers,
          }
        }

        if (partial.body) {
          target.body = partial.body
        }
      }
    }

    return target
  }
}

export type FileReader = (
  base: string,
  path: string,
  options?: Partial<Response>
) => Promise<Response>
