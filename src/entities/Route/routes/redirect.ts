import { Request, Response } from 'express'

export default function redirect(to: string, status = 302) {
  return (_: Request, res: Response) => {
    res.status(status).redirect(to)
  }
}
