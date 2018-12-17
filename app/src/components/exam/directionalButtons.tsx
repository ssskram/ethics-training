import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean,
    next: () => void
    back: () => void
}
export default class DirectionalButtons extends React.Component<props, any> {

    public render() {
        return (
            <div className='row'>
                <div className='col-sm-3'>
                    {this.props.examQuestion.id > 0 &&
                        <button onClick={() => this.props.back()} className='btn btn-success'>Back</button>
                    }
                </div>
                <div className='col-sm-6'>
                    {this.props.examQuestion.id > 0 &&
                        <button className='btn btn-primary'>Save and close</button>
                    }
                </div>
                <div className='col-sm-3'>
                    <button onClick={() => this.props.next()} disabled={!this.props.correct} className='btn btn-success'>Next</button>
                </div>
            </div>
        )
    }
}