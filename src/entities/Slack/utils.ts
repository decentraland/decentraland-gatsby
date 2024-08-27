import isURL from 'validator/lib/isURL'

import env from '../../utils/env'
import logger from '../Development/logger'

const SLACK_WEBHOOK = env('SLACK_WEBHOOK', '')

if (!isURL(SLACK_WEBHOOK)) {
  logger.log(`missing config SLACK_WEBHOOK`)
}

// TODO: should we use @slack/web-api?
export async function sendToSlack(body: {}) {
  if (!isURL(SLACK_WEBHOOK)) {
    return
  }

  try {
    const response = await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()

    if (response.status >= 400) {
      logger.error(`Slack bad request: ${data} (${response.status})`)
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Slack service error: ` + error.message, error)
    }
  }
}
