import * as React from 'react'
import HydrateStore from './components/utilities/hydrateStore'
import Messages from './components/utilities/messages'
import { connect } from 'react-redux'
import { ApplicationState } from './store'
import * as messages from './store/messages'
import Video from './components/video'
import Exam from './components/exam'
import { thisTypeAnnotation } from 'babel-types';

const icon = require('./images/pgh.png')

const firstContainer = {
    height: '90vh',
    verticalAlign: 'middle',
    display: 'table-cell'
}
const firstChild = {
    display: "inline-block"
}

const secondContainer = {
    height: '120vh',
    backgroundColor: 'rgb(44, 62, 80)',
    width: "100vw",
    position: "relative" as 'relative',
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center'
}
const secondChild = {
    alignSelf: 'center',
    width: '100%'
}

const thirdContainer = {
    height: '100vh',
    verticalAlign: 'middle',
    display: 'table-cell'
}
const thirdChild = {
    display: "inline-block"
}

export class Home extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onExam: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    openForm() {
        this.setState({
            onExam: true
        })
        this.props.clearMessage()
    }

    closeForm() {
        this.setState({
            onExam: false
        })
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    render() {
        const {
            onExam
        } = this.state

        return (
            <div className='text-center'>
                <HydrateStore />
                <div style={firstContainer}>
                    <div style={firstChild}>
                        <img src={icon as string} style={{ height: '200px' }}></img>
                        <h1>Welcome to the Ethics Training Program</h1>
                        <h3>This annual program is <b>mandatory</b> for all employees of the City of Pittsburgh</h3>
                        <Messages />
                    </div>
                </div>
                <div style={secondContainer}>
                    <div style={secondChild}>
                        <h1><span style={{ color: '#fff' }}><b>Step 1</b><br />Watch this video</span></h1>
                        <br />
                        <Video />
                    </div>
                </div>
                <div style={thirdContainer}>
                    <div style={thirdChild}>
                        <h1 style={{ marginTop: '100px' }}><b>Step 2:</b><br />Complete the exam</h1>
                        <h4>The exam is comprised of three modules and can be saved to be completed at a later time</h4>
                        {onExam == false &&
                            <button style={{ marginBottom: '100px' }} onClick={this.openForm.bind(this)} className='btn btn-primary'>
                                <span style={{ fontSize: '1.5em' }}>Take the exam</span>
                            </button>
                        }
                        {onExam == true &&
                            <Exam closeForm={this.closeForm.bind(this)} />
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
    }),
    ({
        ...messages.actionCreators,
    })
)(Home)