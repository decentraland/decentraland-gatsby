/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import Segment from 'decentraland-gatsby/dist/components/Development/Segment'
import Rollbar from 'decentraland-gatsby/dist/components/Development/Rollbar'
export { wrapPageElement, wrapRootElement } from './gatsby-browser'

/**
 * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#onPreRenderHTML
 */
export function onPreRenderHTML(
  {
    pathname,
    getHeadComponents,
    replaceHeadComponents,
    getPreBodyComponents,
    replacePreBodyComponents,
    getPostBodyComponents,
    replacePostBodyComponents,
  },
  pluginOptions
) {
  const headComponents = getHeadComponents().map((component) => {
    if (component.type !== 'style' || !component.props['data-href']) {
      return component
    }

    return (
      <link
        rel="stylesheet"
        id={component.props.id}
        href={component.props['data-href']}
      />
    )
  })

  const postBodyComponents = [...getPostBodyComponents()]

  if (process.env.GATSBY_SEGMENT_KEY) {
    postBodyComponents.push(
      <Segment
        key="segment"
        analyticsKey={process.env.GATSBY_SEGMENT_KEY}
        trackPage={false}
      />
    )
  } else {
    console.warn('Missing GATSBY_SEGMENT_KEY environment')
  }

  if (process.env.GATSBY_ROLLBAR_TOKEN) {
    postBodyComponents.push(<Rollbar key="rollbar" />)
  } else {
    console.warn('Missing GATSBY_ROLLBAR_TOKEN environment')
  }

  replaceHeadComponents(headComponents)
  replacePostBodyComponents(postBodyComponents)
}
