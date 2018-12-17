
import * as React from 'react'
import * as types from './../../store/types'

type props = {
    examQuestion: types.examQuestion
}

export default class Question extends React.Component<props, any> {

    createMarkup() {
        return { __html: this.props.examQuestion.question.replace(/\n/g, '<br /><br />') };
    }

    public render() {
        const length = this.props.examQuestion.question.length
        return (
            <div className='text-center'>
                {length <= 100 &&
                    < h1 dangerouslySetInnerHTML={this.createMarkup()}></h1>
                }
                {length > 100 && length <= 300 &&
                    < h2 dangerouslySetInnerHTML={this.createMarkup()}></h2>
                }
                {length > 300 &&
                    < h3 dangerouslySetInnerHTML={this.createMarkup()}></h3>
                }
            </div>
        )
    }
}