import { SES } from 'aws-sdk'
import chuck from '../../utils/array/chunk';
import { readTemplate } from './utils';
import { TemplateContent, SendOptions, Destination } from './types';

export type Options = SES.Types.ClientConfiguration & {
  source?: string,
  path?: string,
  bulk?: boolean,
}

export default class Sender {
  ses: SES;
  templateLoaded: Map<string, boolean> = new Map
  templateContent: Map<string, TemplateContent> = new Map
  bulk: boolean;
  path: string;
  source: string;

  constructor({ path, bulk, source, ...options }: Options) {
    this.ses = new SES(options)
    this.source = source || ''
    this.path = path ?? process.cwd()
    this.bulk = bulk ?? false
  }

  async send(options: SendOptions) {
    return this.bulk ? this.sendBulk(options) : this.sendAll(options)
  }

  async sendAll(options: SendOptions) {
    const results: (SES.SendEmailResponse)[] = []
    for (const destination of options.destinations) {
      const { email, replacement } = this.destination(destination)
      const Message = await this.parseTemplate(options.template, { ...options.defaultReplacement, ...replacement })
      const params = {
        Destination: {
          ToAddresses: [email]
        },
        Message,
        Source: this.source
      };

      const result = await new Promise<SES.SendEmailResponse>((resolve, reject) => {
        this.ses.sendEmail(params, (err, result) => err ? reject(err) : resolve(result))
      })

      results.push(result)
    }

    return results
  }

  async sendBulk(options: SendOptions) {
    const results: SES.SendBulkTemplatedEmailResponse[] = []
    const DefaultTemplateData = JSON.stringify(options.defaultReplacement || {})
    await this.deployTemplate(options.template)
    for (const destinations of chuck(options.destinations, 50)) {
      const params = {
        Destinations: destinations.map(destination => {
          const { email, replacement } = this.destination(destination)
          return {
            Destination: { ToAddresses: [email] },
            ReplacementTemplateData: JSON.stringify(replacement)
          }
        }),
        Source: this.source,
        Template: options.template,
        DefaultTemplateData
      }


      const result = await new Promise<SES.SendBulkTemplatedEmailResponse>((resolve, reject) => {
        this.ses.sendBulkTemplatedEmail(params, (err, data) => err ? reject(err) : resolve(data))
      })

      results.push(result)
    }

    return results
  }

  async getTemplate(name: string) {
    if (!this.templateContent.has(name)) {
      const template = await readTemplate(this.path, name)
      this.templateContent.set(name, {
        Subject: { Charset: "UTF-8", Data: template.SubjectPart },
        Body: {
          Html: { Charset: "UTF-8", Data: template.HtmlPart },
          Text: { Charset: "UTF-8", Data: template.TextPart },
        }
      })
    }

    return this.templateContent.get(name)!
  }

  async checkTemplate(name: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.ses.getTemplate({ TemplateName: name }, (err, data) => {
        if (data) {
          return resolve(true)
        }

        if (err && err.code === 'TemplateDoesNotExist') {
          return resolve(false)
        }

        return reject(err)
      })
    })
  }

  async deployTemplate(name: string) {
    if (this.templateLoaded.get(name)) {
      return true
    }

    const templateExists = await this.checkTemplate(name)
    if (templateExists) {
      this.templateLoaded.set(name, true)
      return true
    }

    const Template = await readTemplate(this.path, name)
    await new Promise<SES.CreateTemplateResponse>((resolve, reject) => {
      this.ses.createTemplate({ Template }, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })

    this.templateLoaded.set(name, true)
    return true
  }

  async parseTemplate(name: string, replacements: Record<string, string> = {}) {
    const template = await this.getTemplate(name)

    return {
      ...template,
      Subject: {
        ...template.Subject,
        Data: this.replace(template.Subject.Data, replacements)
      },
      Body: {
        ...template.Body,
        Html: {
          ...template.Body.Html,
          Data: this.replace(template.Body.Html.Data, replacements)
        },
        Text: {
          ...template.Body.Text,
          Data: this.replace(template.Body.Text.Data, replacements)
        }
      }
    }
  }

  destination(value: string | Destination): Destination {
    if (typeof value === 'string') {
      return { email: value, replacement: {} }
    }

    return value
  }

  replace(template: string, replacements: Record<string, string> = {}) {
    return template.replace(/\{\{\w+\}\}/gi, (match) => {
      const name = match.slice(2, -2)
      if (name in replacements) {
        return replacements[name]
      }

      throw new Error(`missing replacement ${name}`)
    })
  }
}
