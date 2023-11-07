import { TemplateContent } from './types'
import { readTemplate } from './utils'

import type { SES } from '@aws-sdk/client-ses'

export default class TemplateManager {
  loaded: Set<string> = new Set()
  content: Map<string, TemplateContent> = new Map()

  constructor(private ses: SES, private path: string) {}

  async getRemoteTemplate(name: string) {
    if (this.loaded.has(name)) {
      return name
    }

    const isDeployed = await this.isDeployed(name)
    if (isDeployed) {
      this.loaded.add(name)
      return name
    }

    await this.deploy(name)
    this.loaded.add(name)
    return name
  }

  async deploy(name: string) {
    const Template = await readTemplate(this.path, name)
    await this.ses.createTemplate({ Template })
  }

  async isDeployed(name: string) {
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

  async getRawTemplate(
    name: string,
    replacements: Record<string, string> = {}
  ) {
    if (!this.content.has(name)) {
      const template = await readTemplate(this.path, name)
      this.content.set(name, {
        Subject: { Charset: 'UTF-8', Data: template.SubjectPart },
        Body: {
          Html: { Charset: 'UTF-8', Data: template.HtmlPart },
          Text: { Charset: 'UTF-8', Data: template.TextPart },
        },
      })
    }

    const template = this.content.get(name)!

    return {
      ...template,
      Subject: {
        ...template.Subject,
        Data: this.applyReplacements(template.Subject.Data, replacements),
      },
      Body: {
        ...template.Body,
        Html: {
          ...template.Body.Html,
          Data: this.applyReplacements(template.Body.Html.Data, replacements),
        },
        Text: {
          ...template.Body.Text,
          Data: this.applyReplacements(template.Body.Text.Data, replacements),
        },
      },
    }
  }

  applyReplacements(
    template: string,
    replacements: Record<string, string> = {}
  ) {
    return template.replace(/\{\{\w+\}\}/gi, (match) => {
      const name = match.slice(2, -2)
      if (name in replacements) {
        return replacements[name]
      }

      throw new Error(`missing replacement ${name}`)
    })
  }
}
