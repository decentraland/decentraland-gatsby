
import React from "react"

import Layout from "../components/Layout/Layout"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import './index.css'

export default function IndexPage(props: any) {

  return (
    <Layout {...props}>
      <Container></Container>
    </Layout>
  )
}
