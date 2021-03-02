import React, { Component } from 'react'
import * as animationData from '../../assets/animate/no-files.json'
import Lottie from 'react-lottie';

class NoFiles extends Component{
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
                {/* <Lottie options={defaultOptions}
                    height={200}
                    width={325}
                    isStopped={false}
                    isPaused={false}/> */}
            </div>
        )
    }
}

export default NoFiles