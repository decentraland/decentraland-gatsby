import type { Request } from 'express'

export type AuthData = {
  auth: string | undefined
  authMetadata: Record<string, string | number> | undefined
}

export type WithAuth<R extends Request = Request> = R & AuthData
