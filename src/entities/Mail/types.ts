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

export type SendOptions<R extends Record<string, string> = Record<string, string>> = {
  destinations: (string | Destination<R>)[],
  template: string,
  defaultReplacement?: R
}

export type Destination<R extends Record<string, string> = Record<string, string>> = {
  email: string,
  replacement: R
}