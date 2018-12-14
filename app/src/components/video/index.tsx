
import * as React from 'react'
import YouTube from 'react-youtube'
import { Helmet } from "react-helmet"

const backgroundColor = 'body { background-color: black; }'

export default class Video extends React.Component<any, any> {

    public render() {
        const opts = {
            width: '100%',
            height: '100%',
            playerVars: {
                autoplay: 1
            }
        }
        return (
            <div className='text-center' style={{ height: '95vh' }}>
                <Helmet>
                    <style>{backgroundColor}</style>
                </Helmet>
                <YouTube
                    videoId="HRJ_VB5Kn_Y"
                    opts={opts}
                />
            </div>
        )
    }
}