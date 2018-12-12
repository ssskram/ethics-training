import * as React from 'react'
import PhoneInput from 'react-phone-number-input/basic-input'

export default class Phone extends React.Component<any, any> {

    public render() {
        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}{this.props.required == true && <span style={{ color: 'red', fontSize: '20' }}>*</span>}</h4>
                    <PhoneInput type='search'
                        className="form-control"
                        country="US"
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.props.callback.bind(this)} />
                </div>
            </div>
        )
    }
}