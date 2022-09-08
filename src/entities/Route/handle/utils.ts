import type { Request } from 'express'

export function defaultStatusCode(req: Request) {
  switch (req.method) {
    case 'PATCH':
    case 'POST':
    case 'PUT':
      return 201

    case 'DELETE':
    case 'GET':
    default:
      return 200
  }
}
