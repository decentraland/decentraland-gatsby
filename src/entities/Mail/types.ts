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

export type SendOptions<T extends string = string, R extends Record<string, string> = Record<string, string>> = {
  destinations: (string | Destination<R>)[],
  template: T,
  defaultReplacement?: R
}

export type Destination<R extends Record<string, string> = Record<string, string>> = {
  email: string,
  replacement: R
}