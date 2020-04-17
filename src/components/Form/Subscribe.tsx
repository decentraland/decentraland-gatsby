import React from 'react';
import fetch from 'isomorphic-fetch';
import Input from './Input';
import TokenList from '../../utils/TokenList';
import { StyleNamespace } from '../../variables';
import { Button } from 'decentraland-ui/dist/components/Button/Button';
import usePatchState from '../../hooks/usePatchState';
import isEmail from 'validator/lib/isEmail';

import './Subscribe.css'

export type SubscribeData = {
  email: string,
  interest?: string,
}

export type SubscribeProps = {
  className?: string,
  action?: string,

  intl?: {
    cta?: string,
    invalidEmail?: string,
    invalidInterest?: string,
    serverError?: string,
  },

  interest?: string,
  placeholder?: string,
  defaultValue?: string,

  onSubmit?: (event: React.FormEvent<HTMLFormElement>, data: SubscribeData) => void
  onSubscribe?: (data: SubscribeData) => void

  disabled?: boolean,
  loading?: boolean,
  primary?: boolean,
  inverted?: boolean,
  basic?: boolean
  error?: ErrorKind
}

export type SubscribeState = {
  email: string,
  loading: boolean,
  error: ErrorKind
}

export enum ErrorKind {
  None,
  InvalidEmail,
  InvalidInterest,
  ServerError,
}

const DEFAULT_ACTION = process.env.GATSBY_SUBSCRIBE_TARGET || 'https://decentraland.org/subscribe'

export default function Subscribe(props: SubscribeProps) {

  const [state, patchState] = usePatchState({ email: '', loading: false, error: ErrorKind.None })
  const intl = {
    cta: 'Sign up',
    invalidEmail: 'Invalid email',
    invalidInterest: 'Invalid interest',
    serverError: 'Server error',
    ...props.intl
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

    if (props.onSubmit) {
      props.onSubmit(event, data)
      if (event.isDefaultPrevented()) {
        return
      }
    }

    event.preventDefault();
    if (!isEmail(data.email)) {
      patchState({ error: ErrorKind.InvalidEmail })
      return
    }

    patchState({ loading: true })
    fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        patchState({ loading: false, error: response.status >= 400 ? ErrorKind.InvalidInterest : ErrorKind.None })
        if (props.onSubscribe) {
          props.onSubscribe(data)
        }
      })
      .catch(() => patchState({ loading: false, error: ErrorKind.ServerError }))
  }

  let inputMessage: string | undefined;
  switch (error) {
    case ErrorKind.InvalidInterest:
      inputMessage = intl.invalidInterest;
      break;
    case ErrorKind.InvalidEmail:
      inputMessage = intl.invalidEmail;
      break;
    case ErrorKind.ServerError:
      inputMessage = intl.serverError;
      break;
  }

  return <form className={TokenList.join([StyleNamespace, 'Subscribe', props.className])} action={action} onSubmit={handleSubmit}>
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
      type="submit">
      {intl.cta}
    </Button>
  </form>
}