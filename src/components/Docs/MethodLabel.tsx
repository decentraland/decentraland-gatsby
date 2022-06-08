import React, { useMemo } from 'react'

import Label from 'semantic-ui-react/dist/commonjs/elements/Label'

export type MethodLabelProps = {
  method?:
    | 'GET'
    | 'OPTIONS'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | string
}

export default React.memo(function MethodLabel(props: MethodLabelProps) {
  const color = useMemo(() => {
    switch ((props.method || '')?.toLowerCase()) {
      case 'get':
        return 'green'
      case 'post':
        return 'blue'
      case 'put':
        return 'purple'
      case 'patch':
        return 'pink'
      case 'delete':
        return 'red'
      case 'head':
        return 'grey'
      default:
        return undefined
    }
  }, [props.method])

  if (!color) {
    return <>{props.method || ''}</>
  }

  return <Label color={color}>{props.method || ''}</Label>
})
