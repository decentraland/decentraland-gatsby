import React from 'react'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import Head from '../Head/Head'
import Title from '../Text/Title'
import Paragraph from '../Text/Paragraph'

export type NotFoundProps = {
  title?: string
  description?: string
  image?: string
}

export default React.memo(function NotFound(props: NotFoundProps) {
  const title = props.title || 'Not found'
  const description =
    props.description || "You just hit a route that doesn't exist..."
  const image =
    props.image || 'https://decentraland.org/images/decentraland.png'

  return (
    <Container>
      <Head title={title} description={description} image={image} />
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Title style={{ textTransform: 'uppercase' }}>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </div>
    </Container>
  )
})
