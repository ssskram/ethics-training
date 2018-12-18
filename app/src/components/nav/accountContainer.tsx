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
            <div style={{ marginTop: '10px', marginLeft: '20px', marginRight: '10px' }} className="navbar-right">
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <span style={{ color: '#fff' }}><b><span className='glyphicon glyphicon-user nav-glyphicon'></span>{user.name}</b></span>
                        <button onClick={logout} type="submit" className="btn btn-link navbar-logout-btn">Logout</button>
                    </li>

                </ul>
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
)(AccountContainer)