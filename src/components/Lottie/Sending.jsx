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

    getSeasonAnimation() {
        const month = new Date().getMonth();
        // Casos especiales para meses específicos
        if (month === 10) {
            // Noviembre -> Halloween
            return hallowen.default;
        } else if (month === 11) {
            // Diciembre -> Navidad
            return animationData2.default;
        } else if (month === 0) {
            // Enero -> Reyes Magos
            return prideLoader.default;
        }  else if (month === 2) {
            // Enero -> Reyes Magos
            return valentine.default;
        } 

        // Otras estaciones
        if (month >= 2 && month <= 4) {
            // Marzo, Abril, Mayo -> Primavera
            return Biodiversidad.default;
        } else if (month >= 5 && month <= 7) {
            // Junio, Julio, Agosto -> Verano
            return prideLoader.default;
        } else if (month >= 8 && month <= 9) {
            // Septiembre, Octubre -> Otoño
            return animationData.default;
        } else {
            // Febrero -> Invierno (si no es Reyes Magos)
            return animationData.default;
        }
    }

    render(){
         const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: this.getSeasonAnimation(),
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
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