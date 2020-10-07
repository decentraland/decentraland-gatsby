import { Response, Request } from 'express'

export default function redirect(to: string, status: number = 302) {
  return (_: Request, res: Response) => {
    res.status(status).redirect(to)
  }
}
