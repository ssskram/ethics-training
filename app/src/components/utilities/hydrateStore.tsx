
// hydrates the wholeeeeee store

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as user from '../../store/user'
import * as myCourses from '../../store/myCourses'

class Hydrate extends React.Component<any, {}> {

    componentDidMount() {
        this.props.loadUser()
        this.props.loadMyCourses()
    }

    componentWillReceiveProps(nextProps) {
        // filter open course from myCourses
        // set state myCourses to response
    }

    public render() {
        return null
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user,
        ...state.myCourses
    }),
    ({
        ...user.actionCreators,
        ...myCourses.actionCreators
    })
)(Hydrate)