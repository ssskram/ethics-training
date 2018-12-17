import * as React from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import NavMenu from './nav'

export default props => (
  <Grid fluid>
    <Row>
      <NavMenu />
    </Row>
    <Row>
      {props.children}
    </Row>
  </Grid>
)
