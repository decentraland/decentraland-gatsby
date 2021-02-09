import { Request, Response } from "express";
import { middleware } from "../Route/handle";
import { regiterMetrics, http_request_duration_seconds } from "./metrics";

export function withMetrics() {
  regiterMetrics(http_request_duration_seconds)

  return middleware(async (req: Request, res:Response) => {
    const method = req.method
    const path = req.route.path

    const endTimer = http_request_duration_seconds.startTimer({ method, path })
    res.on('close', function saveMetrics() {
      endTimer({ statusCode: res.statusCode })
    })
  })
}