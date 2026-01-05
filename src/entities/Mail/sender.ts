import {
  SES,
  SESClientConfig,
  SendBulkTemplatedEmailResponse,
  SendEmailResponse,
} from '@aws-sdk/client-ses'

import { aws_ses_sent_total } from './metrics'
import TemplateManager from './template'
import { Destination, TemplateAttributes, TemplateContent } from './types'
import chuck from '../../utils/array/chunk'

export type Options = Omit<SESClientConfig, 'region'> & {
  region?: string
  source?: string
  path?: string
  bulk?: boolean
}

export default class Sender {
  ses: SES
  templateLoaded: Map<string, boolean> = new Map()
  templateContent: Map<string, TemplateContent> = new Map()
  template: TemplateManager
  bulk: boolean
  metrics: boolean
  path: string
  source: string
  email: string
  region?: string

  static Batch = 50

  constructor({ path, bulk, source, ...options }: Options) {
    this.ses = new SES(options)
    this.source = source || ''
    this.path = path ?? process.cwd()
    this.bulk = bulk ?? false
    this.template = new TemplateManager(this.ses, this.path)

    if (options.region) {
      this.region = options.region
    }

    const emailMatch = this.source.match(/<(.*)>/i)
    this.email = emailMatch ? emailMatch[1] : this.source
  }

  async send(destinations: Destination[], data: TemplateAttributes) {
    return this.bulk
      ? this.sendBulk(destinations, data)
      : this.sendAll(destinations, data)
  }

  private async sendAll(destinations: Destination[], data: TemplateAttributes) {
    const results: SendEmailResponse[] = []
    for (const destination of destinations) {
      const { email, replacement } = destination
      const Message = await this.template.getRawTemplate(data.template, {
        ...data.defaultReplacement,
        ...replacement,
      })
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message,
        Source: this.source,
      }

      const result = await this.ses.sendEmail(params)

      aws_ses_sent_total.inc(
        {
          bulk: 0,
          region: this.region || 'default',
          email: this.email,
        },
        1
      )
      results.push(result)
    }

    return results
  }

  private async sendBulk(
    destinations: Destination[],
    data: TemplateAttributes
  ) {
    const results: SendBulkTemplatedEmailResponse[] = []
    const DefaultTemplateData = JSON.stringify(data.defaultReplacement || {})
    const Template = await this.template.getRemoteTemplate(data.template)

    for (const chunkDestinations of chuck(destinations, Sender.Batch)) {
      const params = {
        Destinations: chunkDestinations.map((destination) => {
          const { email, replacement } = destination
          return {
            Destination: { ToAddresses: [email] },
            ReplacementTemplateData: JSON.stringify(replacement),
          }
        }),
        Source: this.source,
        Template,
        DefaultTemplateData,
      }

      const result = await this.ses.sendBulkTemplatedEmail(params)

      aws_ses_sent_total.inc(
        {
          bulk: 1,
          region: this.region || 'default',
          email: this.email,
        },
        destinations.length
      )
      results.push(result)
    }

    return results
  }
}
