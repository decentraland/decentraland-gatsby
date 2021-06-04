import { useMemo } from 'react'
import { useIntl } from 'gatsby-plugin-intl'
import { createFormatMessage } from '../utils/react/intl'

export default function useFormatMessage() {
  const intl = useIntl()
  return useMemo(() => createFormatMessage(intl), [intl])
}
