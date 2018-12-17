import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as messages from '../../store/messages'

export class Messages extends React.Component<any, {}> {

    componentWillUnmount() {
        this.props.clearMessage()
    }
    
    createMarkup() {
        return { __html: this.props.message };
    }

    public render() {

        return (
            this.props.message ? (
                <div role="alert" className="alert alert-success">
                    <h3 dangerouslySetInnerHTML={this.createMarkup()}></h3>
                </div>
            ) : null
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages
    }),
    ({
        ...messages.actionCreators
    })
)(Messages)