
// hydrates the wholeeeeee store

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as user from '../../store/user'
import * as myCourses from '../../store/myCourses'
import Spinner from '../utilities/spinner'

class Hydrate extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            spinner: true
        }
    }

    componentDidMount() {
        this.props.loadUser()
        if (this.props.user) {
            this.props.loadMyCourses(user)
            this.setState({ spinner: false })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user != nextProps.user) {
            this.props.loadMyCourses(user)
            this.setState({ spinner: false })
        }
    }

    public render() {
        return (
            <div>
                {this.state.spinner == true && <Spinner notice='...loading your course history...' />}
            </div>
        )
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