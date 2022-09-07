import { NextHandleFunction } from 'connect'
import { Request, Response } from 'express'

/** @deprecated */

export default async function useMiddlaware(
  middlaware: NextHandleFunction,
  req: Request,
  res: Response
) {
  return new Promise<void>((resolve, reject) => {
    try {
      middlaware(req, res, (err?: any) => {
        err ? reject(err) : resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}
