import React from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import isEmail from 'validator/lib/isEmail'

import usePatchState from '../../hooks/usePatchState'
import TokenList from '../../utils/dom/TokenList'
import env from '../../utils/env'
import { StyleNamespace } from '../../variables'
import Input from './Input'

import 'isomorphic-fetch'

import './Subscribe.css'

export type SubscribeData = {
  email: string
  interest?: string
  lang?: string
}

export type SubscribeProps = {
  className?: string
  action?: string
  method?: 'POST' | 'GET'
  intl?: {
    cta?: string
    inputError?: string
    serverError?: string
  }

  lang?: string
  interest?: string
  placeholder?: string
  defaultValue?: string

  onSubmit?: (
    event: React.FormEvent<HTMLFormElement>,
    data: SubscribeData
  ) => void
  onSubscribe?: (data: SubscribeData) => void

  disabled?: boolean
  loading?: boolean
  primary?: boolean
  inverted?: boolean
  basic?: boolean
  error?: ErrorKind
}

export type SubscribeState = {
  email: string
  loading: boolean
  error: ErrorKind
}

export enum ErrorKind {
  None,
  InvalidEmail,
  ServerError,
}

const DEFAULT_ACTION = env(
  'SUBSCRIBE_TARGET',
  'https://subscription.decentraland.org/subscribe'
)

export default function Subscribe(props: SubscribeProps) {
  const [state, patchState] = usePatchState({
    email: '',
    loading: false,
    error: ErrorKind.None,
  })
  const intl = {
    cta: 'Sign up',
    inputError: 'Invalid email',
    serverError: 'Server error',
    ...props.intl,
  }

  const placeholder = props.placeholder || 'email@domain.com'
  const action = props.action || DEFAULT_ACTION
  const loading = props.loading || state.loading
  const error = props.error || state.error

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    patchState({ email: event.target.value, error: ErrorKind.None })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const data: SubscribeData = {
      email: state.email,
    }

    if (props.interest) {
      data.interest = props.interest
    }

    if (props.lang) {
      data.lang = props.lang
    }

    if (props.onSubmit) {
      props.onSubmit(event, data)
      if (event.isDefaultPrevented()) {
        return
      }
    }

    event.preventDefault()
    if (!isEmail(data.email)) {
      patchState({ error: ErrorKind.InvalidEmail })
      return
    }

    patchState({ loading: true })
    const req =
      props.method === 'GET'
        ? fetch(
            action +
              '?' +
              new URLSearchParams(data as Record<string, string>).toString()
          )
        : fetch(action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

    req
      .then((response) => {
        patchState({
          loading: false,
          error:
            response.status >= 400 ? ErrorKind.ServerError : ErrorKind.None,
        })
        if (props.onSubscribe) {
          props.onSubscribe(data)
        }
      })
      .catch(() => patchState({ loading: false, error: ErrorKind.ServerError }))
  }

  let inputMessage: string | undefined
  switch (error) {
    case ErrorKind.InvalidEmail:
      inputMessage = intl.inputError
      break
    case ErrorKind.ServerError:
      inputMessage = intl.serverError
      break
  }

  return (
    <form
      className={TokenList.join([StyleNamespace, 'Subscribe', props.className])}
      action={action}
      onSubmit={handleSubmit}
    >
      <Input
        defaultValue={props.defaultValue}
        placeholder={placeholder}
        error={!!inputMessage}
        message={inputMessage}
        disabled={props.disabled || loading}
        value={state.email}
        onChange={handleChange}
      />
      <Button
        primary={props.primary}
        inverted={props.inverted}
        basic={props.basic}
        disabled={props.disabled}
        loading={loading}
        type="submit"
      >
        {intl.cta}
      </Button>
    </form>
  )
}
