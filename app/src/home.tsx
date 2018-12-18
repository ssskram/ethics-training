import * as React from 'react'
import HydrateStore from './components/utilities/hydrateStore'
import Messages from './components/utilities/messages'
import { connect } from 'react-redux'
import { ApplicationState } from './store'
import * as messages from './store/messages'
import * as myCourses from './store/myCourses'
import * as types from './store/types'
import Video from './components/video'
import Exam from './components/exam'

const icon = require('./images/pgh.png')

interface actionProps {
    clearMessage: () => void,
}

type props =
    types.message &
    types.myCourses &
    actionProps

interface state {
    onExam: boolean
}

export class Home extends React.Component<props, state> {
    private ref: React.RefObject<HTMLHeadingElement>
    constructor(props) {
        super(props)
        this.state = {
            onExam: false
        }
        this.ref = React.createRef()
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    openExam() {
        this.setState({ onExam: true })
        this.props.clearMessage()
        window.scrollTo({ top: this.ref.current.offsetTop - 20, behavior: "smooth" })
    }

    closeExam() {
        this.setState({ onExam: false })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    render() {
        const {
            onExam
        } = this.state

        let openExam
        if (this.props.myCourses) {
            openExam = this.props.myCourses.find(course => course.completed == false)
        }

        return (
            <div className='text-center'>
                <HydrateStore />
                <div className='home-container-1'>
                    <div className='home-child-1'>
                        <img src={icon as string} style={{ height: '200px' }}></img>
                        <h1>Welcome to the Ethics Training Program</h1>
                        <h3>This annual program is <b>mandatory</b> for all employees of the City of Pittsburgh</h3>
                        <Messages />
                    </div>
                </div>
                <div className='home-container-2'>
                    <div className='home-child-2'>
                        <h1><span style={{ color: '#fff' }}><b>Step 1</b><br />Watch this video</span></h1>
                        <br />
                        <Video />
                    </div>
                </div>
                <div className='home-container-1'>
                    <div className='home-child-1'>
                        <h1 ref={this.ref} style={{ marginTop: '100px' }}><b>Step 2:</b><br />Complete the exam</h1>
                        <h4>The exam is comprised of three modules and can be saved to be completed at a later time</h4>
                        {onExam == false &&
                            <button style={{ marginBottom: '100px' }} onClick={this.openExam.bind(this)} className='btn btn-primary'>
                                <span style={{ fontSize: '1.5em' }}>{openExam ? 'Continue the exam' : 'Take the exam'}</span>
                            </button>
                        }
                        {onExam == true &&
                            <div style={{ marginBottom: '200px' }}>
                                <Exam closeForm={this.closeExam.bind(this)} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
        ...state.myCourses
    }),
    ({
        ...messages.actionCreators,
        ...myCourses.actionCreators
    })
)(Home)