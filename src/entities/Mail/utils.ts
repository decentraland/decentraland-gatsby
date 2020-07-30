import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cherio from 'cherio'
import htmlmin from 'htmlmin'
import juice from 'juice'
import { readFile } from 'fs'
import { promisify } from 'util'
import { Template, TemplateProps } from './types'

const read = promisify(readFile)

export async function readTemplate(path: string, name: string): Promise<Template> {
  const TemplateName = name
  const target = path + '/' + name + '.html'
  const html = await read(target, 'utf8')
  const $ = cherio.load(html)

  const SubjectPart = $('title').text().trim() as string
  const TextPart = $('noscript').text().trim() as string
  const HtmlPart = htmlmin(juice($.html().trim() as string || ''))

  return {
    TemplateName,
    SubjectPart,
    TextPart,
    HtmlPart,
  }
}

export async function renderTemplate(element: React.ReactElement<TemplateProps>): Promise<Template> {
  const TemplateName = element.props && element.props.name || '';
  const SubjectPart = element.props && element.props.subject || '';
  const TextPart = element.props && element.props.text || '';
  const HtmlPart = await new Promise<string>((resolve, reject) => {
    const stream = ReactDOMServer.renderToNodeStream(element)
    let result = ''

    stream.setEncoding('utf8')
    stream.on('error', reject)
    stream.on('data', (chunk: string) => { result += chunk })
    stream.on('end', (chunk: string) => {
      if (chunk) {
        result = result += chunk
      }

      resolve(htmlmin(juice(result)))
    })
  })

  return {
    TemplateName,
    SubjectPart,
    TextPart,
    HtmlPart,
  }
}
