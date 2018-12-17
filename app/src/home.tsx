import * as React from 'react'
import { Link } from 'react-router-dom'
import HydrateStore from './components/utilities/hydrateStore'
import Messages from './components/utilities/messages'
import { connect } from 'react-redux'
import { ApplicationState } from './store'
import * as messages from './store/messages'
import Video from './components/video'

const icon = require('./images/pgh.png')

export class Home extends React.Component<any, any> {

    componentWillUnmount() {
        this.props.clearMessage()
    }

    render() {
        return (
            <div className='text-center'>
                <HydrateStore />
                <br />
                <br />
                <img src={icon as string} style={{ height: '200px' }}></img>
                <h1>Welcome to the Ethics Training Program</h1>
                <h3>This annual program is <b>mandatory</b> for all employees of the City of Pittsburgh</h3>
                <br />
                <Messages /><br />
                <h2><b>Step 1:</b> Watch the training video</h2>
                <Video />
                <br/>
                <br/>
                <br/>
                <h2><b>Step 2:</b> Complete the exam</h2>
                <h4>The exam is comprised of three modules and can be saved to be completed at a later time</h4>
                <Link to={'/exam'} onClick={() => this.props.newMessage("Welcome back! Here's where you left off")} className='btn btn-primary'>Take the exam</Link>
                <br/>
                <br/>
                <br/>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
    }),
    ({
        ...messages.actionCreators,
    })
)(Home)