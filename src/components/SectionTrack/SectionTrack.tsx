import React, { useState } from 'react'

import { useInView } from 'react-intersection-observer'

import useTrackContext from '../../context/Track/useTrackContext'
import { SectionTrackEvent } from './utils'

import './SectionTrack.css'

export type SectionTrackProps = {
  sectionViewed: string
  extraData?: Record<string, string>
  onInView?: () => void
}

export default function SectionTrack(props: SectionTrackProps) {
  const { sectionViewed, extraData, onInView } = props
  const [viewed, setViewed] = useState(false)
  const track = useTrackContext()

  const [sectionInView] = useInView({
    threshold: 0.25,
    onChange: (inView, entry) => {
      if (inView && !viewed) {
        setViewed(true)
        onInView && onInView()

        track(SectionTrackEvent.SectionViewed, {
          sectionViewed,
          ...extraData,
          ...entry,
        })
      }
    },
  })

  return <div ref={sectionInView} className={'use-in-view__container'}></div>
}
