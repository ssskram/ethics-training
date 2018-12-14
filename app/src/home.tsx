import * as React from 'react'
import HydrateStore from './components/utilities/hydrateStore'

const icon = require('./images/pgh.png')

export default class Home extends React.Component<any, any> {

    render() {
        return (
            <div className='text-center'>
                <HydrateStore />
                <br />
                <br/>
                <img src={icon as string} style={{ height: '200px' }}></img>
                <h1>Welcome to the Ethics Training Program</h1>
                <h3>This annual program is <b>mandatory</b> for all employees of the City of Pittsburgh</h3>
                <br />
                <br />
                <h2><b>Step 1:</b> Watch the training video</h2>
                <h2><b>Step 1:</b> Complete the exam</h2>
                <h4>The exam is comprised of three modules and can be saved to be completed at a later time</h4>
            </div>
        )
    }
}