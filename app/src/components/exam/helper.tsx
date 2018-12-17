
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean
}

export default class Helper extends React.Component<props, any> {

    public render() {

        return (
            <div className='col-md-12'>
                {this.props.correct == false &&
                    <div style={{fontSize: '1.5em'}} className='alert alert-danger'>
                        {this.props.examQuestion.helper}
                    </div>
                }
                <br />
            </div>
        )
    }
}