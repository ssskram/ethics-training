import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    correct: boolean
}
export default class DirectionalButtons extends React.Component<props, any> {

    componentDidMount() {
        console.log(this.props.correct)
    }

    public render() {

        return (
            <div className='row'>
                <div className='col-sm-6'>
                    <button className='btn btn-success'>Back</button>
                </div>
                <div className='col-sm-6'>
                    <button disabled={!this.props.correct} className='btn btn-success'>Next</button>
                </div>
            </div>
        )
    }
}