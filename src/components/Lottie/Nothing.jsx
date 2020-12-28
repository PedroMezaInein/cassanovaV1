import React, { Component } from 'react'
import * as animationData from '../../assets/animate/tap.json'
import * as animationData2 from '../../assets/animate/reno-2.json'
import Lottie from 'react-lottie';

class Sending extends Component{
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: new Date().getMonth() === 11 ? animationData2.default : animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="mx-auto">
                <Lottie options={defaultOptions}
                    /* height={200} */
                    width = { window.innerWidth * 1 / 3 }
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Sending