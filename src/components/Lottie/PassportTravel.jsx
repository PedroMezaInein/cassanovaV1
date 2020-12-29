import React, { Component } from 'react'
import * as animationData from '../../assets/animate/passport-travel.json'
import Lottie from 'react-lottie';

class PassportTravel extends Component{
    render(){
        const defaultOptions = {
            loop: false,
            autoplay: true, 
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="mx-auto">
                <Lottie 
                    options = { defaultOptions }
                    isStopped = { false }
                    isPaused = { false }
                    height={234}
                    width={300}
                />
            </div>
        )
    }
}

export default PassportTravel