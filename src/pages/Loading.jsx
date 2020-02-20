import React, { Component } from 'react'
import * as animationData from '../assets/animate/loading.json'
import Lottie from 'react-lottie';

class Loading extends Component{
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
            <div className="">
                 <Lottie options={defaultOptions}
                    height={400}
                    width={400}
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Loading