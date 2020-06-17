
import React from "react"
import { useLocation } from "@reach/router"

import Layout from "../components/Layout/Layout"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import SEO from "../components/seo"
import url from '../utils/url'
import useSiteStore from '../hooks/useSiteStore'
import * as segment from '../utils/segment'
import useAnalytics from "../hooks/useAnalytics"

import './index.css'

const invertedAdd = require('../images/inverted-add.svg')

export type IndexPageState = {
  updating: Record<string, boolean>
}

export default function IndexPage(props: any) {
  const location = useLocation()
  const eventId = url.getEventId(location)
  const siteStore = useSiteStore(props.location)
  const currentEvent = eventId && siteStore.events.getEntity(eventId) || null

  const title = currentEvent && currentEvent.name || "Decentraland Events"
  const path = url.toUrl(location.pathname, location.search)

  useAnalytics((analytics) => {
    const name = currentEvent ? segment.Page.Event : segment.Page.Home
    analytics.page(name, { title, path })
  }, [path])

  return (
    <Layout {...props}>
      <SEO title={title} />
      <Container></Container>
    </Layout>
  )
}
