import React, { memo } from 'react'

import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Paragraph.css'
import './List.css'

export type ListProps = (
  | React.HTMLAttributes<HTMLUListElement>
  | React.HTMLAttributes<HTMLOListElement>
) & {
  ordered?: boolean
  depth?: number
}

export default memo(function List(props: ListProps) {
  if (props.ordered) {
    return (
      <ol
        {...props}
        className={TokenList.join([StyleNamespace, 'List', props.className])}
      />
    )
  } else {
    return (
      <ul
        {...props}
        className={TokenList.join([StyleNamespace, 'List', props.className])}
      />
    )
  }
})

export type ListItem = React.LiHTMLAttributes<HTMLLIElement>

export const ListItem = memo(function (props: ListItem) {
  return (
    <li
      {...props}
      className={TokenList.join([StyleNamespace, 'ListItem', props.className])}
    />
  )
})
