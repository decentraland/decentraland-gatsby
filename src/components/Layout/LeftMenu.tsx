import React from 'react'

import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'

export default React.memo(function LeftMenu({
  activePage,
}: {
  activePage?: string
}) {
  return (
    <>
      <Menu.Item
        active={activePage === 'marketplace'}
        href="https://market.decentraland.org"
      >
        Marketplace
      </Menu.Item>
      <Menu.Item
        active={activePage === 'builder'}
        href="https://builder.decentraland.org"
      >
        Builder
      </Menu.Item>
      <Menu.Item
        active={activePage === 'docs'}
        href="https://docs.decentraland.org"
      >
        Docs
      </Menu.Item>
      <Menu.Item
        active={activePage === 'places'}
        href="https://places.decentraland.org"
      >
        Places
      </Menu.Item>
      <Menu.Item
        active={activePage === 'events'}
        href="https://events.decentraland.org"
      >
        Events
      </Menu.Item>
      <Menu.Item
        active={activePage === 'dao'}
        href="https://dao.decentraland.org"
      >
        Dao
      </Menu.Item>
      <Menu.Item
        active={activePage === 'blog'}
        href="https://decentraland.org/blog"
      >
        Blog
      </Menu.Item>
    </>
  )
})
