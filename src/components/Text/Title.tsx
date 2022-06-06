import React, { memo } from 'react'

import TokenList from '../../utils/dom/TokenList'
import { createId } from '../../utils/react/createId'
import { StyleNamespace } from '../../variables'

import './Title.css'

export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  small?: boolean
}

export default memo(function Title({ small, ...props }: TitleProps) {
  return (
    <h2
      id={createId(props)}
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Title',
        small && 'Title--small',
        props.className,
      ])}
    />
  )
})
