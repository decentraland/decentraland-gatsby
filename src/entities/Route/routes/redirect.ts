import { Request as RequestExpress, Response } from 'express'

import { Request } from '../types'

export default function redirect(to: string, status = 302) {
  return (_: Request, res: Response) => {
    res.status(status).redirect(to)
  }
}
