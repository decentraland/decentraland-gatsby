import React, { memo } from 'react'

import TokenList from '../../utils/dom/TokenList'
import { createId } from '../../utils/react/createId'
import { StyleNamespace } from '../../variables'

import './SubTitle.css'

export type SubTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export default memo(function SubTitle(props: SubTitleProps) {
  return (
    <h3
      id={createId(props)}
      {...props}
      className={TokenList.join([StyleNamespace, 'SubTitle', props.className])}
    />
  )
})
