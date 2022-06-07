import React, { useCallback, useEffect, useRef, useState } from 'react'

import TokenList from '../../utils/dom/TokenList'
import Next from '../Carousel/Next'

import './Accordion.css'

export type AccordionProps = {
  open?: boolean
  id?: string
  className?: string
  children?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}

export default React.memo(function Accordion(props: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)
  const withContent = !!props.children
  const isOpen = Boolean(props.open ?? open)

  useEffect(() => {
    if (ref.current !== null) {
      if (isOpen && height === 0) {
        setHeight(ref.current.offsetHeight)
      } else if (!isOpen && height !== 0) {
        setHeight(0)
      }
    }
  }, [props.open, open])

  useEffect(() => {
    let interval: number
    if (ref.current && isOpen) {
      interval = setInterval(() => {
        if (ref.current && height && ref.current.offsetHeight !== height) {
          setHeight(ref.current.offsetHeight)
        }
      }, 1000) as any
    }

    return () => {
      clearInterval(interval)
    }
  }, [ref.current, isOpen, height])

  const handleOpen = useCallback(() => {
    if (withContent && props.open === undefined) {
      setOpen(!open)
    }
  }, [withContent, open, props.open])

  return (
    <div
      id={props.id}
      className={TokenList.join([
        'Accordion',
        isOpen ? 'Accordion--open' : 'Accordion--close',
        props.className,
      ])}
    >
      <div className="Accordion__Title" onClick={handleOpen}>
        <div className="Accordion__Title__Content">
          {props.title ?? '&nbsp;'}
        </div>
        {props.description && (
          <div className="Accordion__Title__Description">
            {props.description}
          </div>
        )}
        {withContent && (
          <div className={'Accordion__Title__Action'}>
            <Next />
          </div>
        )}
      </div>
      <div
        style={{ height }}
        className={TokenList.join(['Accordion__Content'])}
      >
        <div ref={ref}>{props.children}</div>
      </div>
    </div>
  )
})
