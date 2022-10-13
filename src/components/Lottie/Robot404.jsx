import React, { Component } from 'react'
/* import * as animationData from '../../assets/animate/robot-404.json' */
import * as animationData from '../../assets/animate/404Halloween.json'
import Lottie from 'react-lottie';

class Robot404 extends Component {
    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <div className="mx-auto">
                <Lottie
                    options={defaultOptions}
                    width={345}
                    height={'auto'}
                    isStopped={false}
                    isPaused={false}
                />
            </div>
        )
    }
}

export default Robot404