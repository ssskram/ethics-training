import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import AccountContainer from './accountContainer'

export default class NavMenu extends React.Component<any, any> {

  public render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <Link to={'/'} className="navbar-brand">PGH Ethics Training</Link>
          </div>
          <Navbar.Collapse>
            <AccountContainer />
          </Navbar.Collapse>
        </div>
      </nav>
    )
  }
}