export class Response {
  status: number
  headers: Record<string, string>
  body: Buffer

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
