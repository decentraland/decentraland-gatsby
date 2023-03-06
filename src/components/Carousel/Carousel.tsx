import React, { useCallback, useEffect, useRef, useState } from 'react'

import TokenList from '../../utils/dom/TokenList'
import mod from '../../utils/number/mod'
import TimeInterval from '../../utils/timer/timeInterval'
import Next from './Next'
import Prev from './Prev'

import './Carousel.css'

export enum IndicatorType {
  Bullet = 'bullet',
  Dash = 'dash',
}
export type CarouselProps = React.HTMLProps<HTMLDivElement> & {
  /** @deprecated it may differe with the actual move */
  onMove?: (index: number) => void
  progress?: boolean
  time?: number | false
  autoResize?: boolean
  indicatorType?: IndicatorType
}

export type CarouselState = {
  current: number
  carouselScrollHeight: string | undefined
  touchStart: number
  touchEnd: number
  timer: TimeInterval | null
}

/** @deprecated */
export default React.memo(function Carousel({
  className,
  children,
  progress,
  onMove,
  time,
  autoResize,
  indicatorType: indicatorsType,
  ...props
}: CarouselProps) {
  const size = React.Children.count(children)

  const childrenRefs = useRef(new Array(size))

  const [state, setState] = useState<CarouselState>({
    current: 0,
    carouselScrollHeight: undefined,
    touchStart: 0,
    touchEnd: 0,
    timer: null,
  })

  useEffect(() => {
    if (state.current > size) {
      handleMove(0)
    }
  }, [size, state.current])

  useEffect(() => {
    if (Number(time ?? 5000) > 0) {
      setState((prev) => {
        const newTimer = new TimeInterval(() => {
          handleMove(1)
        }, Number(time ?? 5000)).start()

        return {
          ...prev,
          timer: newTimer,
        }
      })
    }
    return () => {
      setState((prev) => {
        prev.timer?.stop()
        return { ...prev, timer: null }
      })
    }
  }, [time])

  const handleTimerOn = useCallback(() => {
    state.timer?.start()
  }, [state.timer])
  const handleTimerOff = useCallback(() => {
    state.timer?.stop()
  }, [state.timer])

  const handleMove = useCallback(
    (diff: number) => {
      if (autoResize) {
        let height = 0

        setState((prev) => {
          const next = mod(prev.current + diff, childrenRefs.current.length)
          height = childrenRefs.current[next]
          return {
            ...prev,
            current: next,
            carouselScrollHeight: height + 'px',
          }
        })
      } else {
        let height = 0
        childrenRefs.current.map((element) => {
          height = Math.max(element, height)
        })
        setState((prev) => ({
          ...prev,
          current: mod(prev.current + diff, childrenRefs.current.length),
          carouselScrollHeight: height + 'px',
        }))
      }

      if (onMove) {
        onMove(mod(state.current + diff, childrenRefs.current.length))
      }
    },
    [state, onMove]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setState((prev) => {
        prev.timer?.stop()
        return {
          ...prev,
          touchStart: e.targetTouches[0].clientX,
          touchEnd: e.targetTouches[0].clientX,
        }
      })
    },
    []
  )

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setState((prev) => ({
      ...prev,
      touchEnd: e.targetTouches[0].clientX,
    }))
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      handleTimerOn()
      if (state.touchStart - state.touchEnd > 150) {
        handleMove(1)
      }

      if (state.touchStart - state.touchEnd < -150) {
        handleMove(-1)
      }
    },
    [state]
  )

  return (
    <div
      {...props}
      className={TokenList.join([
        'Carousel',
        className,
        indicatorsType === IndicatorType.Dash && 'dash-indicators',
      ])}
    >
      <div className="Carousel__Items">
        <div
          className="Carousel__Scroll"
          onMouseEnter={handleTimerOff}
          onMouseLeave={handleTimerOn}
          style={{ height: state.carouselScrollHeight }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {React.Children.map(children, (child, i) => (
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
          {React.Children.map(children, (_, i) => (
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
          onClick={() => {
            handleMove(1)
          }}
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
          onClick={() => {
            handleMove(-1)
          }}
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
