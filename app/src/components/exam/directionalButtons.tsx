import * as React from 'react'
import * as types from './../../store/types'
import { Link } from 'react-router-dom'

type props = {
    examQuestion: types.examQuestion,
    back: () => void
    confirmSave: (string) => void
}
export default class DirectionalButtons extends React.Component<props, any> {

    public render() {
        return (
            <div className='row'>
                {this.props.examQuestion.id > 0 &&
                    <div>
                        <div className='col-sm-6'>
                            <button onClick={() => this.props.back()} className='btn btn-success'>Back</button>
                        </div>
                        <div className='col-sm-6'>
                            <Link onClick={() => this.props.confirmSave('Your progress has been saved. See you next time.')} to={'/'} className='btn btn-primary'>
                                Save and close
                            </Link>
                        </div>
                    </div>
                }
            </div>
        )
    }
}