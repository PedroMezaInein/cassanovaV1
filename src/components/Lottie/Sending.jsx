import React, { Component } from 'react'
import * as animationData from '../../assets/animate/plane.json'
import * as animationData2 from '../../assets/animate/arbol.json'
import * as navidad from '../../assets/animate/navidad.json'
import * as valentine from '../../assets/animate/valentines-day.json'
import * as Mujer from '../../assets/animate/diaDeLaMujer.json'
import * as Abeja from '../../assets/animate/abeja.json'
import * as pride from '../../assets/animate/17maylgbt.json'
import * as Biodiversidad from '../../assets/animate/biodiversidad.json'
import * as prideLoader from '../../assets/animate/pride-loader.json'
import * as spiderman from '../../assets/animate/spiderman.json'
import * as casa from '../../assets/animate/casa.json'
import * as hallowen from '../../assets/animate/hallowen.json'
import * as franke from '../../assets/animate/franke.json'

import Lottie from 'react-lottie';

class Sending extends Component{
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: new Date().getMonth() === 11 ? animationData2.default : franke.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="mx-auto">
                <Lottie options={defaultOptions}
                    height={200}
                    width={200}
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Sending