import * as React from 'react';
import classNames from 'classnames'

export default class Textarea extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            height: '100px'
        }
    }

    setHeight(element) {
        let newHeight = element.target.scrollHeight
        if (newHeight > 98) {
            this.setState({
                height: newHeight + 'px'
            })
        }
        if (element.target.value == '') {
            this.setState({
                height: '100px'
            })
        }
    }

    public render() {
        const conditionalClass = classNames({
            'form-control': true,
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4>{this.props.header}{this.props.required == true && <span style={{ color: 'red', fontSize: '20' }}>*</span>}</h4>
                    <textarea
                        onKeyUp={this.setHeight.bind(this)}
                        onFocus={this.setHeight.bind(this)}
                        value={this.props.value}
                        className={conditionalClass}
                        placeholder={this.props.placeholder}
                        style={{ height: this.state.height }}
                        onChange={this.props.callback.bind(this)}>
                    </textarea>
                </div>
            </div>
        )
    }
}