import * as React from 'react'

const placeholder = require('./../../images/image-placeholder.png')

export default class LoadingImage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: placeholder
        }
    }

    onLoad() {
        this.setState({
            imagePath: this.props.src
        })
    }

    public render() {
        const { imagePath } = this.state;

        return (
            <div>
                <img style={this.props.style} className="img-responsive" src={imagePath} />
                <div className="hidden">
                    <img src={this.props.src} onLoad={this.onLoad.bind(this)} />
                </div>
            </div>

        )
    }
}

// props https://hackernoon.com/improve-your-ux-by-dynamically-rendering-images-via-react-onload-393fd4d0d946
