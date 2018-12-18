import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion,
    back: () => void
    saveClose: () => void
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
                            <button onClick={() => this.props.saveClose()} className='btn btn-primary'>
                                Save and close
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}