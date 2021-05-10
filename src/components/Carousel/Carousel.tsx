import React, { useEffect } from 'react'
import usePatchState from '../../hooks/usePatchState'
import TokenList from '../../utils/dom/TokenList'
import './Carousel.css'

export type CarouselProps = React.HTMLProps<HTMLDivElement>
export type CarouselState = {
  current: number
  running: boolean
  timer: number | null
}

export function Next() {
  return <svg width="48" height="48" viewBox="0 0 48 48">
    <g fill="none" fillRule="evenodd" opacity=".32">
        <path d="M0 0H48V48H0z"/>
        <path fill="#736E7D" d="M34 24L21.242 36.457c-.742.724-1.944.724-2.686 0-.741-.724-.741-1.898 0-2.623L28.628 24l-10.072-9.834c-.741-.725-.741-1.899 0-2.623.742-.724 1.944-.724 2.686 0L34 24z"/>
    </g>
  </svg>
}

export function Prev() {
  return <svg width="48" height="48" viewBox="0 0 48 48">
    <g fill="none" fill-rule="evenodd" opacity=".32">
        <path d="M0 0H48V48H0z" transform="matrix(-1 0 0 1 48 0)"/>
        <path fill="#736E7D" d="M34 24L21.242 36.457c-.742.724-1.944.724-2.686 0-.741-.724-.741-1.898 0-2.623L28.628 24l-10.072-9.834c-.741-.725-.741-1.899 0-2.623.742-.724 1.944-.724 2.686 0L34 24z" transform="matrix(-1 0 0 1 48 0)"/>
    </g>
  </svg>
}

export default function Carousel({ className, children, ...props }: CarouselProps) {

  const size = React.Children.count(children)
  const [state, patchState] = usePatchState<CarouselState>({ current: 0, timer: null, running: true })

  useEffect(() => {
    if (state.running) {
      patchState({ timer: setTimeout(handleNext, 5000) as any })
    }

    return () => {
      if (state.timer) {
        clearTimeout(state.timer)
      }
    }

  }, [state.running, state.current])

  function handleTimerOn() {
    patchState({ running: true })
  }

  function handleTimerOff() {
    if (state.timer) {
      clearTimeout(state.timer)
    }
    patchState({ timer: null, running: false })
  }

  function handleMove(to: number) {
    patchState({ current: to })
  }

  function handleNext() {
    handleMove(state.current >= size - 1 ? 0 : state.current + 1)
  }

  function handlePrev() {
    handleMove(state.current <= 0 ? size - 1 : state.current - 1)
  }

  return <div {...props} className={TokenList.join(['Carousel', className])}>
    <div className="Carousel__Items">
      <div className="Carousel__Scroll" onMouseEnter={handleTimerOff} onMouseLeave={handleTimerOn}>
        {React.Children.map(children, (child, i) => <div
          key={'item:' + i}
          className={TokenList.join([
            "Carousel__Item",
            i === 0 && 'Carousel__Item--first',
            i < state.current && 'Carousel__Item--on-left',
            i === state.current && 'Carousel__Item--active',
            i > state.current && 'Carousel__Item--on-right',
          ])}
        >{child}</div>)}
      </div>
    </div>
    {size > 1 && <div className="Carousel__List">
      {React.Children.map(children, (_, i) => <div key={'list:' + i} onClick={() => handleMove(i)} className={TokenList.join([i === state.current && 'active'])}><div /></div>)}
    </div>}
    {size > 1 && <div className="Carousel__Next" onClick={handleNext}>
      <Next />
    </div>}
    {size > 1 && <div className="Carousel__Prev" onClick={handlePrev}>
      <Prev />
    </div>}
  </div>
}