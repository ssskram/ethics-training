
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
const courseContent = require('./courseContent')

interface actionProps {
    clearMessage: () => void,
    newCourse: () => void,
    updateCourse: () => void
}

type props =
    types.user &
    types.courses &
    types.message

export class Exam extends React.Component<props, any> {
    constructor(props) {
        super(props)
        this.state = {
            courseContent: courseContent as types.examContent,
            highpoint: 0,
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    setHighpoint(activeExam) {

    }

    public render() {
        const {
            courseContent,
            highpoint
        } = this.state

        return (
            <div className='text-center'>
                <br />
                <Question content={courseContent[highpoint]} />
                <Answers content={courseContent[highpoint]} />
                <Helper content={courseContent[highpoint]} />
                <DirectionalButtons content={courseContent[highpoint]} />
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