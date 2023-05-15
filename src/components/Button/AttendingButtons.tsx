import React, { useCallback, useMemo, useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'

import useAuthContext from '../../context/Auth/useAuthContext'
import useTrackContext from '../../context/Track/useTrackContext'
import useAsyncTask from '../../hooks/useAsyncTask'
import useFormatMessage from '../../hooks/useFormatMessage'
import useMobileDetector from '../../hooks/useMobileDetector'
import useTimeout from '../../hooks/useTimeout'
import facebookIcon from '../../images/icon-facebook.svg'
import twitterIcon from '../../images/icon-twitter.svg'
import notificationDisabledIcon from '../../images/notification-disabled.svg'
import notificationEnabledIcon from '../../images/notification-enabled.svg'
import closeIcon from '../../images/popup-close.svg'
import primaryJumpInIcon from '../../images/primary-jump-in.svg'
import shareIcon from '../../images/share.svg'
import newPopupWindow from '../../utils/dom/newPopupWindow'
import TokenList from '../../utils/dom/TokenList'
import facebookUrl from '../../utils/share/facebookUrl'
import twitterUrl from '../../utils/share/twitterUrl'
import { EventAttributes } from '../EventCard/EventCard'
import { ButtonEvent } from './utils'

import './AttendingButtons.css'

export type AttendingButtonsProps = {
  event?: EventAttributes
  href?: string
  loading?: boolean
  onUpdateAttendee: (id: string, attending: boolean) => void
  onNotify: (id: string, attending: boolean) => void
}

export default function AttendingButtons(props: AttendingButtonsProps) {
  const { event, loading, onUpdateAttendee, onNotify } = props
  const href = props.href || 'https://events.decentraland.org'

  const nextStartAt = useMemo(
    () =>
      new Date(event ? Date.parse(event.next_start_at.toString()) : Date.now()),
    [event?.next_start_at]
  )
  const isLive = useTimeout(nextStartAt)
  const [fallbackShare, setFallbackShare] = useState(false)
  const [, actions] = useAuthContext()
  const isMobile = useMobileDetector()
  const track = useTrackContext()
  const l = useFormatMessage()
  const approved = useMemo(() => !event || event.approved, [event])

  const [sharing, share] = useAsyncTask(async () => {
    if (event) {
      try {
        await (navigator as any).share({
          title: event.name,
          text: event.description,
          url: href,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }, [event])

  const handleShareFacebook = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()

      if (event) {
        track(ButtonEvent.Share, {
          eventId: event?.id || null,
          trending: event?.trending || false,
          highlighted: event?.highlighted || false,
          medium: 'facebook',
        })
        newPopupWindow(facebookUrl(href, event.description))
      }
    },
    [event, track]
  )

  const handleShareTwitter = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()

      if (event) {
        track(ButtonEvent.Share, {
          eventId: event?.id || null,
          trending: event?.trending || false,
          highlighted: event?.highlighted || false,
          medium: 'twitter',
        })
        newPopupWindow(twitterUrl(href, event.description))
      }
    },
    [event, track]
  )

  const handleShare = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()

      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        share()
      } else {
        track(ButtonEvent.ShareFallback, {
          eventId: event?.id || null,
          trending: event?.trending || false,
          highlighted: event?.highlighted || false,
        })
        setFallbackShare(true)
      }
    },
    [setFallbackShare, track]
  )

  const handleFallbackShareClose = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()
      setFallbackShare(false)
    },
    [setFallbackShare]
  )

  const handleStopPropagation = useCallback((e: React.MouseEvent<any>) => {
    e.stopPropagation()
  }, [])

  const handleAttend = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()
      event && onUpdateAttendee(event.id, !event.attending)
    },
    [event, onUpdateAttendee]
  )

  const handleNotify = useCallback(
    (e: React.MouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()
      event && onNotify(event.id, !event.notify)
    },
    [event, onNotify]
  )

  return (
    <div className="attending-buttons">
      {fallbackShare && (
        <Button
          inverted
          size="small"
          className="share fluid"
          onClick={handleShareFacebook}
        >
          <img src={facebookIcon} width="10" height="16" />
        </Button>
      )}
      {fallbackShare && (
        <Button
          inverted
          size="small"
          className="share fluid"
          onClick={handleShareTwitter}
        >
          <img src={twitterIcon} width="18" height="15" />
        </Button>
      )}
      {fallbackShare && (
        <Button
          inverted
          size="small"
          className="share"
          onClick={handleFallbackShareClose}
        >
          <img src={closeIcon} width="14" height="14" />
        </Button>
      )}

      {!fallbackShare && isLive && !loading && (actions.provider || !isMobile) && (
        <Button
          primary
          size="small"
          disabled={loading || sharing || !approved}
          onClick={handleStopPropagation}
          className="fluid"
          href={href}
          target="_blank"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span>{l('components.button.attending_buttons.jump_in')}</span>
          <img
            src={primaryJumpInIcon}
            width={14}
            height={14}
            style={{ marginLeft: '.5rem' }}
          />
        </Button>
      )}

      {!fallbackShare && !isLive && (actions.provider || !isMobile) && (
        <Button
          inverted
          size="small"
          onClick={handleAttend}
          loading={loading}
          disabled={loading || sharing || !approved}
          className={TokenList.join([
            'attending-status',
            'fluid',
            event?.attending && 'attending',
          ])}
        >
          {!event && ' '}
          {event &&
            event.attending &&
            l('components.button.attending_buttons.going')}
          {event &&
            !event.attending &&
            l('components.button.attending_buttons.want_to_go')}
        </Button>
      )}

      {!fallbackShare &&
        !isLive &&
        event?.attending &&
        (actions.provider || !isMobile) && (
          <Button
            inverted
            primary
            size="small"
            className="share"
            disabled={loading || sharing || !approved}
            onClick={handleNotify}
          >
            <img
              src={
                (event?.notify && notificationEnabledIcon) ||
                notificationDisabledIcon
              }
              width="22"
              height="22"
            />
          </Button>
        )}

      {!fallbackShare && (actions.provider || !isMobile) && (
        <Button
          inverted
          primary
          size="small"
          className="share"
          disabled={loading || sharing || !approved}
          onClick={handleShare}
        >
          <img src={shareIcon} width="14" height="14" />
        </Button>
      )}

      {!fallbackShare && !actions.provider && isMobile && (
        <Button
          inverted
          primary
          size="small"
          className="share fluid"
          disabled={loading || sharing || !approved}
          onClick={handleShare}
        >
          <img src={shareIcon} width="14" height="14" />{' '}
          {l('components.button.attending_buttons.share')}
        </Button>
      )}
    </div>
  )
}
