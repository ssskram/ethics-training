import * as React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class Menu extends React.Component {

    public render() {
        return (
            <Nav>
                <LinkContainer to={'/'} exact>
                    <NavItem>Step 1: Review course material</NavItem>
                </LinkContainer>
                <LinkContainer to={'/'}>
                    <NavItem>Step 2: Complete the exam</NavItem>
                </LinkContainer>
                <LinkContainer to={'/'}>
                    <NavItem><b>Gift disclosures</b></NavItem>
                </LinkContainer>
            </Nav>
        )
    }
}
