import React from 'react'
import { createId } from '../../utils/react/createId'
import { StyleNamespace } from '../../variables'
import TokenList from '../../utils/dom/TokenList'
import './Title.css'

export type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  small?: boolean
}

export default React.memo(function Title({ small, ...props }: TitleProps) {
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
