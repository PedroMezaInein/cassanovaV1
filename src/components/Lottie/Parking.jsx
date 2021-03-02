import React, { Component } from 'react'
import * as animationData from '../../assets/animate/car.json'
import Lottie from 'react-lottie';

class Sending extends Component{
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
                {/* <Lottie options = { defaultOptions }
                    isStopped = { false }
                    isPaused = { false } /> */}
            </div>
        )
    }
}

export default Sending