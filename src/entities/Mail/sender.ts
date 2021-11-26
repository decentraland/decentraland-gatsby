import { SES } from 'aws-sdk'
import chuck from '../../utils/array/chunk'
import { registerMetric } from '../Prometheus/metrics'
import { aws_ses_sent_total } from './metrics'
import { TemplateContent, Destination, TemplateAttributes } from './types'
import TemplateManager from './template'

export type Options = SES.Types.ClientConfiguration & {
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
    const results: SES.SendEmailResponse[] = []
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

      const result = await new Promise<SES.SendEmailResponse>(
        (resolve, reject) => {
          this.ses.sendEmail(params, (err, result) =>
            err ? reject(err) : resolve(result)
          )
        }
      )

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
    const results: SES.SendBulkTemplatedEmailResponse[] = []
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

      const result = await new Promise<SES.SendBulkTemplatedEmailResponse>(
        (resolve, reject) => {
          this.ses.sendBulkTemplatedEmail(params, (err, data) =>
            err ? reject(err) : resolve(data)
          )
        }
      )

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
