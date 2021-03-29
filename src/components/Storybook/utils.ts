import { ArgType, TableAnnotation } from '@storybook/components';

const Types = {
  Int: { summary: 'int', detail: 'non floating number (example: `2`, `1`, `0`, `-1`, `-2`)' },
  Uint: { summary: 'uint', detail: 'non floating positive number (example: `2`, `1`, `0`)' },
  Hex: { summary: 'hex', detail: 'string contianing only hexadecimal character (example: `0123456789abcdef`)' },
}

export const Args = {

  Types,

  type: (summary: string, detail?: string) => ({ summary, detail }),

  definedTypes(summary: string, types: any[]) {
    return this.type(summary, types.map(String).join('\n'))
  },

  prop(name: string, description: string, type?: TableAnnotation['type'] | string): ArgType {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
      }
    }
  },

  requiredProp(name: string, description: string, type?: TableAnnotation['type'] | string): ArgType {
    return {
      name,
      description,
      type: { required: true },
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
      }
    }
  },

  param(name: string, description: string, type?: TableAnnotation['type'] | string): ArgType {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'params'
      }
    }
  },

  requiredParam(name: string, description: string, type?: TableAnnotation['type'] | string): ArgType {
    return {
      name,
      description,
      type: { required: true },
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'params'
      }
    }
  },

  returns(name: string, description: string, type?: TableAnnotation['type'] | string) {
    return {
      name,
      description,
      table: {
        type: typeof type === 'string' ? Args.type(type) : type,
        category: 'returns'
      }
    }
  }
}