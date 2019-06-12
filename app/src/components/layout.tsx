import * as React from "react";
import { Col, Grid, Row } from "react-bootstrap";
import NavMenu from "./nav";

export default props => (
  <Grid fluid>
    <Row>
      <NavMenu />
    </Row>
    <Row>
      <Col sm={12}>{props.children}</Col>
    </Row>
  </Grid>
);
