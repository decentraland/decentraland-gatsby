import React from 'react'

export type Handle = (e: React.MouseEvent<any>, ...extra: any[]) => void

export default function prevent<H extends Handle>(handle: Handle): H {
  return function (e: React.MouseEvent<any>, ...extra: any[]) {
    e.preventDefault()
    e.stopPropagation()
    handle(e, ...extra)
  } as H
}
