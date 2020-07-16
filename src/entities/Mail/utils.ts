import cherio from 'cherio'
import htmlmin from 'htmlmin'
import { readFile } from 'fs'
import { promisify } from 'util'
import { Template } from './types'

const read = promisify(readFile)

export async function readTemplate(path: string, name: string): Promise<Template> {
  const TemplateName = name
  const target = path + '/' + name + '.html'
  const html = await read(target, 'utf8')
  const $ = cherio.load(html)

  const SubjectPart = $('title').text().trim() as string
  const TextPart = $('noscript').text().trim() as string
  const HtmlPart = htmlmin($('body').html().trim() as string || '')

  return {
    TemplateName,
    SubjectPart,
    TextPart,
    HtmlPart,
  }
}