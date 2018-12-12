import * as React from 'react';
import classNames from 'classnames'

export default class Input extends React.Component<any, any> {

    public render() {

        const conditionalClass = classNames({
            'form-control': true,
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}{this.props.required == true && <span style={{color: 'red', fontSize: '20'}}>*</span>}</h4>
                    <input type='search'
                        className={conditionalClass}
                        value={this.props.value}
                        name={this.props.name}
                        id={this.props.name}
                        placeholder={this.props.placeholder}
                        onChange={this.props.callback.bind(this)}>
                    </input>
                </div>
            </div>
        )
    }
}
