import cherio from 'cherio'
import { readFile } from 'fs'
import { promisify } from 'util'

const read = promisify(readFile)

export type TemplateContent = {
  Body: {
    Html: {
      Charset: string,
      Data: string
    },
    Text: {
      Charset: string,
      Data: string
    }
  },
  Subject: {
    Charset: string,
    Data: string
  }
}

export type Template = {
  TemplateName: string,
  SubjectPart: string,
  HtmlPart: string,
  TextPart: string,
}

export async function readTemplate(path: string, name: string): Promise<Template> {
  const TemplateName = name
  const target = path + '/' + name + '.html'
  const html = await read(target, 'utf8')
  const $ = cherio.load(html)

  const SubjectPart = $('title').text().trim() as string
  const TextPart = $('noscript').text().trim() as string
  const HtmlPart = $('body').html().trim() as string

  return {
    TemplateName,
    SubjectPart,
    TextPart,
    HtmlPart,
  }
}