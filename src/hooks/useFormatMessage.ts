import { useCallback } from 'react'
import { useIntl } from 'react-intl'

export default function useFormatMessage() {
  const intl = useIntl()

  return useCallback(
    function format<V extends {}>(id?: string | null, values?: V) {
      if (!id || !intl.messages[id]) {
        return id || ''
      }

      return intl.formatMessage({ id }, { ...values })
    },
    [intl]
  )
}

export { useIntl }
