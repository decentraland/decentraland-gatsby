// TODO(2fd): replace for Formick on v6
import { useCallback, useMemo, useState } from 'react'

import omit from 'lodash/omit'

export type Editor<P extends {} = {}> = (state: P, newProps: Partial<P>) => P
export type EditorError<P extends {} = {}> = Partial<
  Record<keyof P | '*', string>
>
export type Validator<P extends {} = {}> = (
  state: P,
  props: (keyof P | '*')[]
) => EditorError<P>
export type PropValidator<P extends {} = {}> = (
  state: P,
  prop: keyof P | '*',
  props: (keyof P | '*')[]
) => EditorError<P>

type EditorState<P extends {} = {}> = {
  value: P
  error: EditorError<P>
  validated: boolean
}

export default function useEditor<P extends {} = {}>(
  editor: Editor<P>,
  validator: Validator<P>,
  initialState: P
) {
  const [state, setState] = useState<EditorState<P>>({
    value: initialState,
    error: {},
    validated: false,
  })

  const set = useCallback(
    (newProps: Partial<P>, options: { validate?: boolean } = {}) => {
      const value = editor(state.value, newProps)
      if (state.value !== value) {
        const keys = Object.keys(newProps) as (keyof P)[]
        const newError =
          options.validate === false ? {} : validator(value, keys)
        const error = clear({
          ...(omit(state.error, keys) as EditorError<P>),
          ...newError,
        })

        setState({ value, error, validated: false })
      }
    },
    [state]
  )

  const validate = useCallback(() => {
    const keys = [...Object.keys(state.value), '*'] as (keyof P | '*')[]

    const error = clear(validator(state.value, keys))
    if (Object.keys(error).length === 0) {
      setState({ value: state.value, error, validated: true })
    } else {
      setState({ value: state.value, error, validated: false })
    }
  }, [state])

  const error = useCallback(
    (err: EditorError<P>) => {
      err = clear(err)
      if (Object.keys(err).length > 0) {
        setState({
          value: state.value,
          validated: false,
          error: { ...state.error, ...err },
        })
      }
    },
    [state]
  )

  const actions = useMemo(
    () => ({ set, validate, error }),
    [set, validate, error]
  )

  return [state, actions] as const
}

function clear<P extends {}>(err: EditorError<P>): EditorError<P> {
  const emptyKeys = Object.keys(err).filter((key) => {
    const value = (err as Record<string, string>)[key]
    return value === undefined || value === null
  })

  return omit(err, emptyKeys)
}

export function assert<T>(value: true, onError: T): undefined
export function assert<T>(value: false, onError: T): T
export function assert<T>(value: boolean, onError: T): T | undefined
export function assert<T>(value: boolean, onError: T): T | undefined {
  return value ? undefined : onError
}

export function createValidator<P extends {} = {}>(
  map: Partial<Record<keyof P | '*', PropValidator<P>>>
): Validator<P> {
  return function (state, props) {
    let error: EditorError<P> = {}
    for (const prop of props) {
      const validator = map[prop]!
      if (typeof validator === 'function') {
        error = {
          ...clear(validator(state, prop, props)),
          ...error,
        }
      }
    }
    return error
  }
}
