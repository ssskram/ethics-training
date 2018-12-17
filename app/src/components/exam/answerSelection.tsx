
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean
    checkAnswer: (correct, answer) => void
}

const green = {
    borderColor: '#5cb85c',
    borderWidth: '1px',
    boxShadow: '1px 1px 1px 1px #5cb85c'
}

export default class Answers extends React.Component<props, any> {

    public render() {
        const selection =
            <div>
                {this.props.examQuestion.answers.map((answer, key) => {

                    // green border applied to correct answer when helper text is thrown
                    let greenBorder
                    if (this.props.correct == false && answer == this.props.examQuestion.correct) {
                        greenBorder = green
                    } else greenBorder = {}

                    return <div key={key} style={greenBorder} className='col-md-6 col-md-offset-3 panel panel-button'>
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