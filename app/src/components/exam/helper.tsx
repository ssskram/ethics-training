
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean,
    answer: string
}

export default class Helper extends React.Component<props, any> {

    public render() {

        return (
            <div className='col-md-12'>
                {!this.props.correct && this.props.answer &&
                    <div style={{fontSize: '1.5em'}} className='alert alert-danger'>
                        {this.props.examQuestion.helper}
                    </div>
                }
                <br />
            </div>
        )
    }
}