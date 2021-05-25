import React, { Component } from 'react'
import * as animationData from '../../assets/animate/money-transactions.json'
import Lottie from 'react-lottie';

class Files extends Component {
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
                    width={370}
                    isStopped={false}
                    isPaused={false}
                />
            </div>
        )
    }
}

export default Files