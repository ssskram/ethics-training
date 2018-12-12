import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import AccountContainer from './accountContainer'
import Menu from './menu'

export default class NavMenu extends React.Component<any, any> {

  public render() {
    return (
      <Navbar inverse fixedTop fluid collapseOnSelect style={{zIndex: 1000 as any}}>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>nodereactbp</Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Menu />
          <AccountContainer />
        </Navbar.Collapse>
      </Navbar>
    )
  }
}