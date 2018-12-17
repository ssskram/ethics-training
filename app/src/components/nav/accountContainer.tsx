import * as React from 'react'
import logout from '../../functions/logout'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from './../../store/types'
import * as user from '../../store/user'

type props = {
    user: types.user,
    loadUser: () => void
}

export class AccountContainer extends React.Component<props, {}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadUser()
    }

    render() {
        const {
            user
        } = this.props

        return (
            <div className='accountcontainer'>
                <div className="account"><b>{user.name}</b></div>
                <div className="account">{user.organization}</div>
                <div className='logout'>
                    <button onClick={logout} id="logout" className='btn btn-link navbar-logout-btn'>
                        <span className='glyphicon glyphicon-user nav-glyphicon'></span>Logout
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user
    }),
    ({
        ...user.actionCreators
    })
)(AccountContainer);