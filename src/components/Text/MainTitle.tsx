import React from 'react'

import TokenList from '../../utils/dom/TokenList'
import { createId } from '../../utils/react/createId'
import { StyleNamespace } from '../../variables'

import './MainTitle.css'

export type MainTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export default React.memo(function MainTitle(props: MainTitleProps) {
  return (
    <h1
      id={createId(props)}
      {...props}
      className={TokenList.join([StyleNamespace, 'MainTitle', props.className])}
    />
  )
})
