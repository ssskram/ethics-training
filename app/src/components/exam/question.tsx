
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion
}

export default class Question extends React.Component<props, any> {

    public render() {
        return (
            <div className='text-center'>
                <br />
                <h1>{this.props.examQuestion.question}</h1>
            </div>
        )
    }
}