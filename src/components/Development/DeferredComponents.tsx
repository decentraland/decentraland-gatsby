import React from 'react'

import useAsyncState from '../../hooks/useAsyncState'

export function createFrom<P extends {}>(
  promise: () => Promise<React.ComponentClass<P> | React.FunctionComponent<P>>
) {
  return (props: P & { fallback?: React.ReactNode }) => {
    const [Component] = useAsyncState(promise, [])
    return Component && <Component {...props} />
  }
}

export function createFromDefault<P extends {}>(
  promise: () => Promise<{
    default: React.ComponentClass<P> | React.FunctionComponent<P>
  }>
) {
  return (props: P & { fallback?: React.ReactNode }) => {
    const [Component] = useAsyncState(promise, [])
    return Component && <Component.default {...props} />
  }
}

export function createFromImport<N extends string, P extends {}>(
  name: N,
  promise: () => Promise<
    Record<N, React.ComponentClass<P> | React.FunctionComponent<P>>
  >
) {
  return (props: P & { fallback?: React.ReactNode }) => {
    const [Import] = useAsyncState(promise, [])
    if (!Import || !Import[name]) {
      return null
    }

    const Component = Import[name] as
      | React.ComponentClass<P>
      | React.FunctionComponent<P>
    return <Component {...props} />
  }
}

const Button = createFromImport(
  'Button',
  () => import('decentraland-ui/dist/components/Button/Button')
)
const Rollbar = createFromDefault(() => import('./Rollbar'))
export const r = <Rollbar />
export const b = <Button />
