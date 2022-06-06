import React, { Children, memo, useCallback, useEffect, useRef } from 'react'

import usePatchState from '../../hooks/usePatchState'
import TokenList from '../../utils/dom/TokenList'
import Next from './Next'
import Prev from './Prev'

import './Carousel.css'

export type CarouselProps = React.HTMLProps<HTMLDivElement> & {
  onMove?: (index: number) => void
  progress?: boolean
  time?: number | false
  autoResize?: boolean
}

export type CarouselState = {
  current: number
  running: boolean
  timer: number | null
  carouselScrollHeight: string | undefined
  touchStart: number
  touchEnd: number
}

export default memo(function Carousel({
  className,
  children,
  progress,
  onMove,
  time,
  autoResize,
  ...props
}: CarouselProps) {
  const timeout = !progress ? (time ?? 5000) || false : false
  const size = Children.count(children)

  const childrenRefs = useRef(new Array(size))

  const [state, patchState] = usePatchState<CarouselState>({
    current: 0,
    timer: null,
    running: true,
    carouselScrollHeight: undefined,
    touchStart: 0,
    touchEnd: 0,
  })

  useEffect(() => {
    if (state.current > size) {
      handleMove(0)
    }
  }, [size])

  useEffect(() => {
    if (timeout && state.running) {
      patchState({
        timer: setTimeout(handleNext, timeout) as any,
      })
    }

    return () => {
      if (state.timer) {
        clearTimeout(state.timer)
      }
    }
  }, [state.running, state.current, timeout])

  const handleTimerOn = useCallback(
    () => patchState({ running: true }),
    [state]
  )
  const handleTimerOff = useCallback(() => {
    if (state.timer) {
      clearTimeout(state.timer)
    }

    patchState({ timer: null, running: false })
  }, [state])

  const handleMove = useCallback(
    (to: number) => {
      if (autoResize) {
        let height = 0

        height = childrenRefs.current[to]

        patchState({ current: to, carouselScrollHeight: height + 'px' })
      } else {
        let height = 0
        childrenRefs.current.map((element) => {
          height = Math.max(element, height)
        })
        patchState({ current: to, carouselScrollHeight: height + 'px' })
      }

      if (onMove) {
        onMove(to)
      }
    },
    [state, onMove]
  )

  const handleNext = useCallback(() => {
    const next = state.current >= size - 1 ? 0 : state.current + 1
    handleMove(next)
  }, [state, handleMove])

  const handlePrev = useCallback(() => {
    const prev = state.current <= 0 ? size - 1 : state.current - 1
    handleMove(prev)
  }, [state, handleMove])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleTimerOff()
    patchState({
      touchStart: e.targetTouches[0].clientX,
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    patchState({
      touchEnd: e.targetTouches[0].clientX,
    })
  }

  const handleTouchEnd = () => {
    handleTimerOn()
    if (state.touchStart - state.touchEnd > 150) {
      handleNext()
    }

    if (state.touchStart - state.touchEnd < -150) {
      handlePrev()
    }
  }

  return (
    <div {...props} className={TokenList.join(['Carousel', className])}>
      <div className="Carousel__Items">
        <div
          className="Carousel__Scroll"
          onMouseEnter={handleTimerOff}
          onMouseLeave={handleTimerOn}
          style={{ height: state.carouselScrollHeight }}
          onTouchStart={(touchStartEvent) => handleTouchStart(touchStartEvent)}
          onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
          onTouchEnd={() => handleTouchEnd()}
        >
          {Children.map(children, (child, i) => (
            <div
              key={'item:' + i}
              ref={(el) => {
                childrenRefs.current[i] = el?.scrollHeight
              }}
              className={TokenList.join([
                'Carousel__Item',
                i === 0 && 'Carousel__Item--first',
                i < state.current && 'Carousel__Item--on-left',
                i === state.current && 'Carousel__Item--active',
                i > state.current && 'Carousel__Item--on-right',
              ])}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {size > 1 && (
        <div className="Carousel__List">
          {Children.map(children, (_, i) => (
            <div
              key={'list:' + i}
              onClick={() => handleMove(i)}
              className={TokenList.join([
                progress && i <= state.current && 'active',
                !progress && i === state.current && 'active',
              ])}
            >
              <div />
            </div>
          ))}
        </div>
      )}
      {size > 1 && (
        <div
          onClick={handleNext}
          className={TokenList.join([
            'Carousel__Next',
            progress && state.current === size - 1 && 'disabled',
          ])}
        >
          <Next />
        </div>
      )}
      {size > 1 && (
        <div
          onClick={handlePrev}
          className={TokenList.join([
            'Carousel__Prev',
            progress && state.current === 0 && 'disabled',
          ])}
        >
          <Prev />
        </div>
      )}
    </div>
  )
})
