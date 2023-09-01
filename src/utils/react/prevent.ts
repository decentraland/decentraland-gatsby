// TODO(#323): remove on v6, move it into a hook: usePreventedCallback((e: React.MouseEvent<any>) => any)
import React from 'react'

export type Handle = (e: React.MouseEvent<any>, ...extra: any[]) => void

export default function prevent<H extends Handle>(handle?: Handle): H {
  return function (e: React.MouseEvent<any>, ...extra: any[]) {
    e.preventDefault()
    e.stopPropagation()
    if (handle) {
      handle(e, ...extra)
    }
  } as H
}
