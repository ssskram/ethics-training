
import * as React from 'react'
import YouTube from 'react-youtube'

export default class Video extends React.Component<any, any> {

    public render() {
        const opts = {
            width: '100%',
            maxWidth: '500px',
            height: '500px'
        }
        return (
            <div className='text-center'>
                <YouTube
                    videoId="HRJ_VB5Kn_Y"
                    opts={opts}
                />
            </div>
        )
    }
}