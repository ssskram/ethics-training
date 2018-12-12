import * as React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class Menu extends React.Component {

    public render() {
        return (
            <Nav>
                <LinkContainer to={'/'} exact>
                    <NavItem>Submit</NavItem>
                </LinkContainer>
                <LinkContainer to={'/MyRequests'}>
                    <NavItem>My Requests</NavItem>
                </LinkContainer>
                <LinkContainer to={'/AllRequests'}>
                    <NavItem>All Requests</NavItem>
                </LinkContainer>
            </Nav>
        )
    }
}
