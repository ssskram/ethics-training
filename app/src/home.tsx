import * as React from 'react'
import HydrateStore from './components/utilities/hydrateStore'

export default class Home extends React.Component<any, any> {

    render() {
        return (
            <div>
                <HydrateStore />
                Content and stuff!
            </div>
        )
    }
}