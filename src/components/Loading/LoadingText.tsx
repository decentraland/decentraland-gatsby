import React from 'react'

import TokenList from '../../utils/dom/TokenList'

import './LoadingText.css'

export type LoadingTextProps = {
  type: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  size: 'small' | 'medium' | 'large' | 'full'
  className?: string
  lines?: number
}

export default React.memo(function LoadingText(props: LoadingTextProps) {
  const { type, size, lines, className } = props
  return (
    <>
      {Array.from(Array(lines || 1), (_, index) => (
        <div
          key={index}
          className={TokenList.join([
            'loading-text',
            className,
            type,
            size === 'small' && 'loading-text--small',
            size === 'medium' && 'loading-text--medium',
            size === 'large' && 'loading-text--large',
            size === 'full' && 'loading-text--full',
          ])}
        />
      ))}
    </>
  )
})
