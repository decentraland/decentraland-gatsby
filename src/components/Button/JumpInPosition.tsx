import React, { useCallback } from 'react'

import useTrackContext from '../../context/Track/useTrackContext'
import primaryJumpInIcon from '../../images/primary-jump-in.svg'
import secondaryPinIcon from '../../images/secondary-pin-small.svg'
import TokenList from '../../utils/dom/TokenList'
import { EventAttributes } from '../EventCard/EventCard'
import { ButtonEvent } from './utils'

import './JumpInPosition.css'

export type JumpInPositionProps = React.HTMLProps<HTMLAnchorElement> & {
  event?: EventAttributes
  compact?: boolean
}

export default function JumpInPosition({
  event,
  href,
  compact,
  ...props
}: JumpInPositionProps) {
  const track = useTrackContext()
  const to = href || '#'
  const isPosition = !href && !!event
  const position = isPosition ? event && `${event.x},${event.y}` : 'HTTP'

  const handleClick = useCallback(
    function (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
      if (props.onClick) {
        props.onClick(e)
      }

      if (!e.defaultPrevented) {
        track(ButtonEvent.JumpIn, {
          eventId: event?.id || null,
          trending: event?.trending || false,
          highlighted: event?.highlighted || false,
        })
      }
    },
    [event, track]
  )

  return (
    <a
      {...props}
      target="_blank"
      onClick={handleClick}
      href={to}
      className={TokenList.join([
        'jump-in-position',
        compact && 'jump-in-position--compact',
        props.className,
      ])}
    >
      <span className="jump-in-position__position">
        {isPosition && <img src={secondaryPinIcon} width="16" height="16" />}
        <span>{position}</span>
      </span>
      <span className="jump-in-position__icon">
        <img src={primaryJumpInIcon} width={16} height={16} />
      </span>
    </a>
  )
}
