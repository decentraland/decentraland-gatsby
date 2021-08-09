import { useMemo } from 'react'
import flatten from 'flat'
import {createIntl, createIntlCache} from 'react-intl'
import { createFormatMessage } from '../utils/react/intl'

const localCache =  createIntlCache()
export default function useLocalFormatMessage<M extends Record<string, string>>(messages: Partial<M> | undefined, defualtMessages: M, namespace: string) {
  const msg: M = useMemo(() => {
    return flatten({ '@growth': { [namespace]: { ...defualtMessages, ...messages } } })
  }, [ messages, defualtMessages ])

  const intl = useMemo(() => createIntl({ locale: 'en', messages: msg }, localCache), [ msg ])
  return useMemo(() => createFormatMessage(intl), [intl])
}