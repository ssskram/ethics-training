import * as React from 'react'

export default class Messages extends React.Component<any, {}> {
    
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
