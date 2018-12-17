
// when next button is clicked, post highpoint change
// when back button is click, default answer to correct if question is less than highpoint
// when closed and picked back up, select question by high point ID
// if next module != this module, throw encouraging modal...or something?

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
const examContent = require('./examContent')

interface actionProps {
    clearMessage: () => void,
    newMessage: (newMessage) => void,
    newCourse: () => {},
    updateCourseProgress: (course) => void
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
    activeExam: {}
}

export class Exam extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            examContent: examContent,
            activeExam: {},
            highpoint: 0,
            forwardProgress: 0,
            answerCorrect: undefined
        }
    }

    componentDidMount() {
        const activeExam = this.props.myCourses.find(course => course.completed == false)
        if (activeExam) {
            this.setHighpoint(activeExam)
            this.setActiveExam(activeExam)
            this.props.newMessage("Welcome back!  Here's where you left off:")
        } else {
            const newExam = this.props.newCourse()
            this.setActiveExam(newExam)
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
        this.setState({
            forwardProgress: this.state.forwardProgress + 1,
            highpoint: this.state.forwardProgress + 1,
            answerCorrect: undefined
        })
        this.props.clearMessage()
        this.props.updateCourseProgress(this.state.forwardProgress)
    }


    back() {
        this.props.clearMessage()
        this.setState({
            forwardProgress: this.state.forwardProgress - 1,
            answerCorrect: undefined
        })
    }

    public render() {
        const {
            examContent,
            forwardProgress,
            answerCorrect,
        } = this.state
        
        return (
            <div className='text-center'>
                <br />
                <Messages />
                <Question
                    examQuestion={examContent[forwardProgress]}
                />
                <Answers
                    correct={answerCorrect}
                    examQuestion={examContent[forwardProgress]}
                    checkAnswer={this.checkAnswer.bind(this)}
                />
                <Helper
                    correct={answerCorrect}
                    examQuestion={examContent[forwardProgress]}
                />
                <DirectionalButtons
                    back={this.back.bind(this)}
                    examQuestion={examContent[forwardProgress]}
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