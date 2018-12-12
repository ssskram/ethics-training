import * as React from 'react'
import logout from '../../functions/logout'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as types from './../../store/types'
import * as user from '../../store/user'

interface actionProps {
    loadUser: () => void
}

type props = types.user & actionProps

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
        } = this.props;

        return (
            <div className='accountcontainer'>
                <div className="account">{user}</div>
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