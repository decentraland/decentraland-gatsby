import React, { useCallback, useEffect, useRef, useState } from 'react'

import TokenList from '../../utils/dom/TokenList'
import Next from '../Carousel/Next'

import './Accordion.css'

export type AccordionProps = Omit<React.HTMLProps<HTMLDivElement>, 'title'> & {
  open?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
}

export default React.memo(function Accordion({
  open,
  title,
  description,
  ...props
}: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ open: false, height: 0 })
  const withContent = !!props.children
  const isOpen = Boolean(open ?? state.open)
  const toggleOpen = useCallback(() => {
    setState((state) => {
      if (!withContent || ref.current === null || typeof open !== 'undefined') {
        return state
      }

      return {
        open: !state.open,
        height: !state.open ? ref.current.offsetHeight : 0,
      }
    })
  }, [ref.current, open, withContent])

  useEffect(() => {
    let interval: number
    if (ref.current && isOpen) {
      interval = setInterval(
        () =>
          setState((state) => ({
            ...state,
            height: ref.current?.offsetHeight ?? 0,
          })),
        1000
      ) as any
    }

    return () => {
      clearInterval(interval)
    }
  }, [ref.current, isOpen])

  return (
    <div
      {...props}
      className={TokenList.join([
        'Accordion',
        isOpen ? 'Accordion--open' : 'Accordion--close',
        props.className,
      ])}
    >
      <div className="Accordion__Title" onClick={toggleOpen}>
        <div className="Accordion__Title__Content">{title ?? ' '}</div>
        {description && (
          <div className="Accordion__Title__Description">{description}</div>
        )}
        {withContent && (
          <div className={'Accordion__Title__Action'}>
            <Next />
          </div>
        )}
      </div>
      <div
        style={{ height: state.height }}
        className={TokenList.join(['Accordion__Content'])}
      >
        <div ref={ref}>{props.children}</div>
      </div>
    </div>
  )
})
