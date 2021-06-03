import React, { Component } from 'react'
import Lottie from 'react-lottie';

class CommonLottie extends Component{
    render(){
        const { animationData } = this.props
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        console.log(animationData)
        return(
            <div className="mx-auto">
                <Lottie  options = { defaultOptions } isStopped = { false } isPaused = { false } />
            </div>
        )
    }
}

export default CommonLottie