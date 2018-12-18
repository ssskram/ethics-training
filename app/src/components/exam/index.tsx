
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as user from '../../store/user'
import * as myCourses from '../../store/myCourses'
import * as messages from '../../store/messages'
import * as types from './../../store/types'
import Answers from './answerSelection'
import Helper from './helper'
import Question from './question'
import DirectionalButtons from './directionalButtons'
import Messages from '../utilities/messages'
import { Line } from 'rc-progress'
import Spinner from '../utilities/spinner'
import Hydrate from '../utilities/hydrateStore'
const examContent = require('./examContent')

interface actionProps {
    clearMessage: () => void,
    newMessage: (newMessage) => void,
    newCourse: (user) => {},
    updateCourseProgress: (course, forwardProgress) => void,
    loadMyCourses: (user) => object
    loadUser: () => object,
    closeForm: () => void
}

type props =
    types.user &
    types.myCourses &
    types.message &
    actionProps

interface state {
    examContent: types.examContent,
    highpoint: number
    forwardProgress: number
    answerCorrect: boolean
    activeExam: object
}

export class Exam extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            examContent: examContent,
            activeExam: undefined,
            highpoint: 0,
            forwardProgress: 0,
            answerCorrect: undefined,
        }
    }

    async componentDidMount() {
        if (this.props.myCourses) {
            this.searchForOpenExam(this.props.myCourses)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.myCourses != this.props.myCourses) {
            this.searchForOpenExam(nextProps.myCourses)
        }
    }

    async searchForOpenExam(myCourses) {
        const activeExam = myCourses.find(course => course.completed == false)
        if (activeExam) {
            this.setHighpoint(activeExam)
            this.setActiveExam(activeExam)
        } else {
            if (this.props.user) {
                const newExam = await this.props.newCourse(this.props.user)
                this.setActiveExam(newExam)
            }
        }
    }

    setHighpoint(activeExam) {
        this.setState({
            highpoint: activeExam.highPoint,
            forwardProgress: activeExam.highPoint
        })
    }

    setActiveExam(activeExam) {
        this.setState({
            activeExam: activeExam
        })
    }

    checkAnswer(correct, answer) {
        this.props.clearMessage()
        if (answer == correct) {
            this.next()
        } else {
            this.setState({
                answerCorrect: false
            })
        }
    }

    next() {
        if (this.state.forwardProgress < 24) {
            this.setState({
                forwardProgress: this.state.forwardProgress + 1,
                highpoint: this.state.forwardProgress + 1,
                answerCorrect: undefined
            })
            this.props.updateCourseProgress(this.state.activeExam, this.state.forwardProgress + 1)
        } else {
            this.props.newMessage("Congratulations! You're all finished")
            this.props.updateCourseProgress(this.state.activeExam, 100)
            this.props.closeForm()
        }
    }


    back() {
        this.props.clearMessage()
        this.setState({
            forwardProgress: this.state.forwardProgress - 1,
            answerCorrect: undefined
        })
    }

    saveAndClose() {
        this.props.newMessage('Your progress has been saved.')
        this.props.closeForm()
    }

    public render() {
        const {
            examContent,
            forwardProgress,
            answerCorrect
        } = this.state

        if (!this.props.myCourses) {
            return <div>
                <Spinner notice='...loading your course history...' />
                <Hydrate />
            </div>
        }

        return (
            <div className='text-center'>
                <br />
                <Messages />
                {forwardProgress > 0 &&
                    <Line
                        percent={forwardProgress / 24 * 100}
                        strokeWidth="2"
                        trailWidth="2"
                        strokeColor="rgb(44, 62, 80)"
                    />
                }
                <h3><br /><b>{examContent[forwardProgress].module}</b></h3>
                <Question
                    examQuestion={examContent[forwardProgress]}
                />
                <Helper
                    correct={answerCorrect}
                    examQuestion={examContent[forwardProgress]}
                />
                <Answers
                    correct={answerCorrect}
                    examQuestion={examContent[forwardProgress]}
                    checkAnswer={this.checkAnswer.bind(this)}
                />
                <DirectionalButtons
                    back={this.back.bind(this)}
                    examQuestion={examContent[forwardProgress]}
                    saveClose={this.saveAndClose.bind(this)}
                />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user,
        ...state.myCourses,
        ...state.messages
    }),
    ({
        ...user.actionCreators,
        ...myCourses.actionCreators,
        ...messages.actionCreators
    })
)(Exam)