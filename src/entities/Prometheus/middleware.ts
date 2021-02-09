import { Request, Response } from "express";
import { middleware } from "../Route/handle";
import { regiterMetrics, http_request_duration_seconds, HttpRequestLabels } from "./metrics";

export function withMetrics() {
  regiterMetrics(http_request_duration_seconds)

  return middleware(async (req: Request, res:Response) => {
    const method = req.method

    const endTimer = http_request_duration_seconds.startTimer({ method })
    res.on('close', function saveMetrics() {
      const labels: Partial<Omit<HttpRequestLabels, 'method'>> = {statusCode: res.statusCode}
      if (req.route && req.route.path) {
        labels.path = req.route.path
      }

      endTimer(labels)
    })
  })
}