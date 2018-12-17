
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
const examContent = require('./examContent')

interface actionProps {
    clearMessage: () => void,
    newMessage: (newMessage) => void,
    newCourse: () => void,
    updateCourse: (highpoint) => void
}

type props =
    types.user &
    types.myCourses &
    types.message &
    actionProps

interface state {
    examContent: types.examContent,
    highpoint: number
    answer: string
    answerCorrect: boolean
}

export class Exam extends React.Component<props, state> {
    constructor(props) {
        super(props)
        this.state = {
            examContent: examContent,
            highpoint: 0,
            answerCorrect: true,
            answer: undefined
        }
    }

    componentDidMount() {
        const activeExam = this.props.myCourses.find(course => course.completed == "false")
        if (activeExam) {
            this.setHighpoint(activeExam)
        } else {
            this.props.newCourse()
        }
    }

    setHighpoint(activeExam) {
        this.setState({
            highpoint: activeExam.highPoint
        })
    }

    checkAnswer(correct, answer) {
        if (answer == correct) {
            this.setState({ answerCorrect: true, answer })
        } else {
            this.setState({ answerCorrect: false, answer })
        }
    }

    public render() {
        const {
            examContent,
            highpoint,
            answerCorrect,
            answer
        } = this.state

        return (
            <div className='text-center'>
                <br />
                <Question
                    examQuestion={examContent[highpoint]}
                />
                <Answers
                    correct={answerCorrect}
                    highpoint={highpoint}
                    examQuestion={examContent[highpoint]}
                    checkAnswer={this.checkAnswer.bind(this)}
                />
                <Helper
                    answer={answer}
                    correct={answerCorrect}
                    examQuestion={examContent[highpoint]}
                />
                <DirectionalButtons
                    correct={answerCorrect}
                    examQuestion={examContent[highpoint]}
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