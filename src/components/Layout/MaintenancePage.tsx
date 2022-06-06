import { Container } from 'decentraland-ui/dist/components/Container/Container'
import React from 'react'

import Paragraph from '../Text/Paragraph'
import Title from '../Text/Title'

export default function MaintenancePage() {
  return (
    <Container>
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Title>Site under maintenance</Title>
        <Paragraph>
          {' '}
          We will be back soon, sorry for the inconvenience...
        </Paragraph>
      </div>
    </Container>
  )
}
