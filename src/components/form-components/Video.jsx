import React, { Component } from 'react';
import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css'; // import css

class Video extends Component{

    render(){
        const {src } = this.props
        
        return(
            <Player
                src={src}
            >
                <BigPlayButton position="center" />
            </Player>
        )
    }
}

export default Video
