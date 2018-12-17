
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean
    checkAnswer: (correct, answer) => void
}

export default class Answers extends React.Component<props, any> {

    public render() {
        const selection =
            <div>
                {this.props.examQuestion.answers.map((answer, key) => {
                    return <div key={key} className='col-md-6 col-md-offset-3 panel'>
                        <div onClick={() => this.props.checkAnswer(this.props.examQuestion.correct, answer)} className='panel-body'>
                            <h4>{answer}</h4>
                        </div>
                    </div>
                })}
            </div>

        return (
            <div className='text-center'>
                <br />
                {selection}
            </div>
        )
    }
}