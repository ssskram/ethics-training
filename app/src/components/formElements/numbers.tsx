import * as React from 'react';
import CurrencyInput from 'react-currency-input';
import classNames from 'classnames'

export default class Numbers extends React.Component<any, any> {

    public render() {
        const conditionalClass = classNames({
            'form-control': true,
        })

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}{this.props.required == true && <span style={{ color: 'red', fontSize: '20' }}>*</span>}</h4>
                    <CurrencyInput type='search'
                        selectAllOnFocus={false}
                        autoFocus={false}
                        className={conditionalClass}
                        prefix={this.props.prefix}
                        precision="0"
                        value={this.props.value}
                        onChangeEvent={this.props.callback.bind(this)} />
                </div>
            </div>
        )
    }
}
