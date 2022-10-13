import React, { Component } from 'react'
/* import * as animationData from '../../assets/animate/update.json' */
import * as animationHalloween from '../../assets/animate/halloween.json'
import Lottie from 'react-lottie';

class Update extends Component{
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationHalloween.default,
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
                />
            </div>
        )
    }
}

export default Update