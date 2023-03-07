import React, { Component } from 'react'
import * as animationData from '../../assets/animate/plane.json'
import * as animationData2 from '../../assets/animate/arbol.json'
import * as navidad from '../../assets/animate/navidad.json'
import * as valentine from '../../assets/animate/valentines-day.json'
import * as Mujer from '../../assets/animate/diaDeLaMujer.json'
import Lottie from 'react-lottie';

class Sending extends Component{
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: new Date().getMonth() === 11 ? animationData2.default : Mujer.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="mx-auto">
                <Lottie options={defaultOptions}
                    height={200}
                    width={310}
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Sending