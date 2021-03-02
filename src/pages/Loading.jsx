import React, { Component } from 'react'
import * as animationData from '../assets/animate/paperplane.json'
import * as animationData2 from '../assets/animate/reno.json'
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
        const defaultOptionsReno = {
            loop: true,
            autoplay: true, 
            animationData: animationData2.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="">
                <Lottie 
                    options = { new Date().getMonth() === 11 ? defaultOptionsReno : defaultOptions}
                    height={400}
                    width={400}
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Loading