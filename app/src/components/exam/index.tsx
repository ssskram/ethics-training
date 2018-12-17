
// when next button is clicked, post highpoint change
// when back button is click, default answer to correct if question is less than highpoint
// when closed and picked back up, select question by high point ID
// if next module != this module, throw encouraging modal...or something?

import * as React from 'react'
import { Redirect } from 'react-router-dom'
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
const examContent = require('./examContent')

interface actionProps {
    clearMessage: () => void,
    newMessage: (newMessage) => void,
    newCourse: () => {},
    updateCourseProgress: (course, forwardProgress) => void
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
    activeExam: {},
    redirect: boolean
}

export class Exam extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            examContent: examContent,
            activeExam: {},
            highpoint: 0,
            forwardProgress: 0,
            answerCorrect: undefined,
            redirect: false
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
        if (this.state.forwardProgress < 24) {
            this.setState({
                forwardProgress: this.state.forwardProgress + 1,
                highpoint: this.state.forwardProgress + 1,
                answerCorrect: undefined
            })
            this.props.clearMessage()
            this.props.updateCourseProgress(this.state.activeExam, this.state.forwardProgress)
        } else {
            this.props.newMessage("Congratulations! You're all finished")
            this.props.updateCourseProgress(this.state.activeExam, 100)
            this.setState({
                redirect: true
            })
        }
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
            redirect
        } = this.state

        if (redirect) {
            return <Redirect push to={'/'} />
        }

        return (
            <div className='text-center'>
                <br />
                {forwardProgress > 0 &&
                    <div>
                        <Line percent={forwardProgress / 24 * 100} strokeWidth="4" strokeColor="#D3D3D3" />
                        <br />
                        <h2>Module: <b>{examContent[forwardProgress].module}</b></h2>
                    </div>
                }
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
                    confirmSave={this.props.newMessage.bind(this)}
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