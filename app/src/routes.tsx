import * as React from 'react'
import { Route } from 'react-router'
import Layout from './components/layout'
import Home from './home'
import GiftDisclosure from './components/giftDisclosure'

export
 default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/giftDisclosure' component={GiftDisclosure} />
  </Layout>
)