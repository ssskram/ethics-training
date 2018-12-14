import * as React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default class Menu extends React.Component {

    public render() {
        return (
            <Nav>
                <LinkContainer to={'/courseContent'} exact>
                    <NavItem>Training video</NavItem>
                </LinkContainer>
                <LinkContainer to={'/exam'}>
                    <NavItem>New exam</NavItem>
                </LinkContainer>
                <LinkContainer to={'/giftDisclosure'}>
                    <NavItem>Gift disclosure</NavItem>
                </LinkContainer>
            </Nav>
        )
    }
}
