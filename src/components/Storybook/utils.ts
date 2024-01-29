export type TypeAnnotation = {
  summary: string
  detail?: string
  required?: boolean
}

export type TypeAnnotationParam =
  | TypeAnnotation
  | string
  | number
  | bigint
  | boolean
  | null

export type ArgType = {
  name?: string
  description?: string
  defaultValue?: any
  [key: string]: any
}

const Types = {
  Raw: (summary: string, detail?: string) => ({ summary, detail }),
  Number: {
    summary: 'number',
  },
  String: {
    summary: 'string',
  },
  Boolean: {
    summary: 'boolean',
  },
  Int: {
    summary: 'number (format: int)',
    detail: 'non floating number (example: `2`, `1`, `0`, `-1`, `-2`)',
  },
  Uint: {
    summary: 'number (format: uint)',
    detail: 'non floating positive number (example: `2`, `1`, `0`)',
  },
  Hex: {
    summary: 'string (format: hex)',
    detail:
      'string contianing only hexadecimal character (example: `0123456789abcdef`)',
  },
  ReactNode: {
    summary: 'React.ReactNode',
    detail:
      'type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined',
  },
  Enum: (name: string, value: Record<string, any>) => {
    const values = Object.keys(value)
    return {
      summary: name,
      detail:
        values.length === 0
          ? undefined
          : values
              .map((key) => `${name}.${key} = ${JSON.stringify(value[key])}`)
              .join('\n'),
    }
  },
  Environment: (name: string, defaultValue?: string) => {
    const summary = `env(${JSON.stringify(name)}${
      defaultValue === undefined ? '' : `, ${JSON.stringify(defaultValue)}`
    })`
    const details = [
      `env(${JSON.stringify(name)})`,
      `env(${JSON.stringify('GATSBY_' + name)})`,
      `env(${JSON.stringify('REACT_APP_' + name)})`,
      `env(${JSON.stringify('STORYBOOK_' + name)})`,
    ]

    if (defaultValue !== undefined) {
      details.push(JSON.stringify(defaultValue))
    }

    return { summary, detail: details.join(' || \n') }
  },
  ComponentType: (props: string) => {
    return {
      summary: `React.ComponentType<${props}>`,
      detail: `React.ComponentClass<${props}> | React.FunctionComponent<${props}>`,
    }
  },
}

export const Args = {
  Types,

  type: (summary: string, detail?: string) => ({ summary, detail }),

  definedTypes(summary: string, types: any[]) {
    return this.type(summary, types.map(String).join('\n'))
  },

  Type: (t?: TypeAnnotationParam): TypeAnnotation | undefined => {
    if (t === undefined) {
      return undefined
    }

    if (t == null) {
      return { summary: 'null' }
    }

    switch (typeof t) {
      case 'string':
      case 'number':
      case 'bigint':
      case 'boolean':
        return { summary: JSON.stringify(t) }

      default:
        return t
    }
  },

  Row(
    name: string,
    description: string | false | undefined,
    props: {
      type?: TypeAnnotationParam
      defaultValue?: TypeAnnotationParam
      required?: boolean
      category?: string
    } = {}
  ): ArgType {
    return {
      name,
      description: description || undefined,
      type: props.required ? { required: true } : {},
      table: {
        type: this.Type(props.type),
        defaultValue: this.Type(props.defaultValue),
        category: props.category,
      },
    }
  },

  Prop(
    name: string,
    description: string | false | undefined,
    props: {
      type?: TypeAnnotationParam
      defaultValue?: TypeAnnotationParam
      required?: boolean
    } = {}
  ): ArgType {
    return this.Row(name, description, { ...props, category: 'props' })
  },

  HTMLProps(name: string) {
    return this.Prop(
      '...', //undefined as any, //`React.HTMLProps<${name}>`,
      `also extends all props from [HTMLProps](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/1349b640d4d07f40aa7c1c6931f18e3fbf667f3a/types/react/index.d.ts#L1339) and [${name}](https://developer.mozilla.org/en-US/docs/Web/API/${name})`,
      {
        type: {
          summary: `React.HTMLProps<${name}>`,
          detail: `React.AllHTMLAttributes<${name}> & React.ClassAttributes<${name}>`,
        },
      }
    )
  },

  Environment(
    name: string,
    description: string | false | undefined,
    props: {
      defaultValue?: TypeAnnotationParam
      required?: boolean
    } = {}
  ): ArgType {
    return this.Row(name, description, {
      ...props,
      type: this.Types.Raw(
        JSON.stringify(name),
        [
          JSON.stringify(name),
          JSON.stringify('GATSBY_' + name),
          JSON.stringify('REACT_APP_' + name),
          JSON.stringify('STORYBOOK_' + name),
        ].join(' || \n')
      ),
      category: 'environment',
    })
  },

  prop(
    name: string,
    description: string,
    type?: TypeAnnotation | string
  ): ArgType {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'props',
      },
    }
  },

  requiredProp(
    name: string,
    description: string,
    type?: TypeAnnotation | string
  ): ArgType {
    return {
      name,
      description,
      type: { required: true },
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
      },
    }
  },

  param(
    name: string,
    description: string,
    type?: TypeAnnotation | string
  ): ArgType {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'params',
      },
    }
  },

  requiredParam(
    name: string,
    description: string,
    type?: TypeAnnotation | string
  ): ArgType {
    return {
      name,
      description,
      type: { required: true },
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'params',
      },
    }
  },

  returns(name: string, description: string, type?: TypeAnnotation | string) {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'returns',
      },
    }
  },
}
