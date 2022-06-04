import React from 'react'

import Code from '../Text/Code'

export type ApiCodeProps = {
  note?: React.ReactNode
  data?: any
}

export default React.memo(function ApiCode(props: ApiCodeProps) {
  return (
    <Code note={props.note} language="json">
      {JSON.stringify(props.data, null, 2)}
    </Code>
  )
})
