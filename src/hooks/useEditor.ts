import { useState } from 'react'
import omit from 'lodash.omit'

export type Editor<P extends {} = {}> = (state: P, newProps: Partial<P>) => P
export type EditorError<P extends {} = {}> = Partial<Record<keyof P | '*', string>>
export type Validator<P extends {} = {}> = (state: P, props: (keyof P | '*')[]) => EditorError<P>
export type PropValidator<P extends {} = {}> = (state: P, props: keyof P | '*') => EditorError<P>

type EditorState<P extends {} = {}> = {
  value: P,
  error: EditorError<P>,
  validated: boolean
}

export default function useEditor<P extends {} = {}>(
  editor: Editor<P>,
  validator: Validator<P>,
  initialState: P
) {

  const [ state, setState ] = useState<EditorState<P>>({ value: initialState, error: {}, validated: false })
  function set(newProps: Partial<P>) {
    const value = editor(state.value, newProps)
    if (state.value !== value) {
      const keys = Object.keys(newProps) as (keyof P)[]
      const error = clear({
        ...omit(state.error, keys) as EditorError<P>,
        ...validator(value, keys),
      })

      setState({ value, error, validated: false })
    }
  }

  function validate() {
    const keys = [
      ...Object.keys(state.value),
      '*'
    ] as (keyof P | '*')[]

    const error = clear(validator(state.value, keys))
    if (Object.keys(error).length === 0) {
      setState({ value: state.value, error, validated: true })
    } else {
      setState({ value: state.value, error, validated: false })
    }
  }

  function error(err: EditorError<P>) {
    err = clear(err)
    if (Object.keys(err).length > 0) {
      setState({
        value: state.value,
        validated: false,
        error: { ...state.error, ...err }
      })
    }
  }

  return [ state, { set, validate, error } ] as const
}

function clear<P>(err: EditorError<P>): EditorError<P> {
  const keys = Object.keys(err)
  const emptyKeys = keys.filter(key => err[key] === undefined || err[key] === null)
  return omit(err, emptyKeys)
}

export function assert<T>(value: true, onError: T): null;
export function assert<T>(value: false, onError: T): T;
export function assert<T>(value: boolean, onError: T): T | null;
export function assert<T>(value: boolean, onError: T): T | null {
  return value ? null : onError
}

export function createValidator<P extends {} = {}>(map: Record<keyof P | '*', PropValidator<P>>): Validator<P> {
  return function (state, props) {
    let error: EditorError<P> = {}
    for (const prop of props) {
      if (typeof map[prop] === 'function') {
        error = {
          ...clear(map[prop](state, prop)),
          ...error
        }
      }
    }
    return error
  }
}
