import * as React from 'react'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'

export default class Timepicker extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            time: null,
            isOpen: false
        }
    }

    componentDidMount() {
        if (this.props.value) {
            this.setState({
                time: this.props.value
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            if (this.props.value != nextProps.value) {
                this.setState({
                    time: nextProps.value
                })
            }
        } else {
            this.setState ({ time: null })
        }
    }

    toggleCalendar(e) {
        e && e.preventDefault()
        this.setState({
            time: null,
            isOpen: !this.state.isOpen
        })
    }

    handleChange(time) {
        this.props.callback(time)
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    public render() {

        const conditionalClass = classNames({
            'btn': true,
            'btn-datepicker': true,
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}{this.props.required == true && <span style={{color: 'red', fontSize: '20'}}>*</span>}</h4>
                    <button
                        className={conditionalClass}
                        onClick={this.toggleCalendar.bind(this)}>
                        {this.state.time == null &&
                            <span style={{color: '#aaa'}}>{this.props.placeholder}</span>
                        }
                        {this.state.time != null &&
                            this.state.time
                        }
                    </button>
                    {this.state.isOpen &&
                        <DatePicker
                            selected={this.state.time}
                            name={this.props.name}
                            id={this.props.name}
                            placeholderText={this.props.placeholder}
                            onChange={this.handleChange.bind(this)}
                            className={conditionalClass}
                            onClickOutside={this.toggleCalendar.bind(this)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeFormat='h:mm A'
                            dateFormat="LT"
                            timeCaption="Time"
                            withPortal
                            inline
                        />
                    }
                </div>
            </div>
        )
    }
}
