# components/Development

This is a set of component meant to be used in the [`gatsby-ssr.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/) file exposed by the [`onPreRenderHTML`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#onPreRenderHTML) function

```javascript
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import Segment from 'decentraland-gatsby/dist/components/Development/Segment'

/**
 * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#onPreRenderHTML
 */
export function onPreRenderHTML({
  getPostBodyComponents,
  replacePostBodyComponents,
}) {
  replacePostBodyComponents([
    ...getPostBodyComponents(),
    <Segment key="segment" trackPage={false} />,
  ])
}
```
