// TODO v3: Move react directory
import React from 'react'

export type CreateIdProps = Pick<React.HTMLProps<HTMLElement>, 'id' | 'children'>

export function createId(props: CreateIdProps): string | undefined {
  if (props.id) {
    return props.id
  }

  if (props.children && typeof props.children === 'string') {
    let id = String(props.children).replace(/\W+/gi, '-').toLowerCase()

    if (id[0] === '-') {
      id = id.slice(1)
    }

    if (id[id.length - 1] === '-') {
      id = id.slice(0, -1)
    }

    return id
  }

  return undefined
}