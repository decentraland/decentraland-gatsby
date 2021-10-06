import React, { useCallback, useEffect } from 'react'
import usePatchState from '../../hooks/usePatchState'
import TokenList from '../../utils/dom/TokenList'
import './Carousel.css'
import Next from './Next'
import Prev from './Prev'

export type CarouselProps = React.HTMLProps<HTMLDivElement> & {
  onMove?: (index: number) => void
  progress?: boolean
  time?: number | false
}

export type CarouselState = {
  current: number
  running: boolean
  timer: number | null
}

export default React.memo(function Carousel({
  className,
  children,
  progress,
  onMove,
  time,
  ...props
}: CarouselProps) {
  const timeout = !progress ? (time ?? 5000) || false : false
  const size = React.Children.count(children)
  const [state, patchState] = usePatchState<CarouselState>({
    current: 0,
    timer: null,
    running: true,
  })

  useEffect(() => {
    if (state.current > size) {
      handleMove(0)
    }
  }, [size])

  useEffect(() => {
    if (timeout && state.running) {
      patchState({ timer: setTimeout(handleNext, timeout) as any })
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
      patchState({ current: to })
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

  return (
    <div {...props} className={TokenList.join(['Carousel', className])}>
      <div className="Carousel__Items">
        <div
          className="Carousel__Scroll"
          onMouseEnter={handleTimerOff}
          onMouseLeave={handleTimerOn}
        >
          {React.Children.map(children, (child, i) => (
            <div
              key={'item:' + i}
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
