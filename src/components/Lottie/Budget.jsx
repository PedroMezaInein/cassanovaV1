import React, { Component } from 'react'
import * as animationData from '../../assets/animate/Budget.json'
import Lottie from 'react-lottie';

class Budget extends Component{
    render(){
        const defaultOptions = {
            loop: true,
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
                    height={250}
                    width={300}
                />
            </div>
        )
    }
}

export default Budget