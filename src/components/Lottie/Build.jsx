import React, { Component } from 'react'
import * as animationData from '../../assets/animate/Build.json'
import Lottie from 'react-lottie';

class Build extends Component {
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
                    height={255}
                    isStopped={false}
                    isPaused={false}
                />
            </div>
        )
    }
}

export default Build