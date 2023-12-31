import React from 'react'
import { geolocated, geoPropTypes } from "react-geolocated";

class ChecadorButton extends React.Component{

    render(){
        const { checador, actualizarChecadorAxios, coords } = this.props
        if(checador.length){
			if(checador[0].fecha_fin === null)
				return(
                    <span className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary align-self-center" onClick = { (e) => { e.preventDefault(); actualizarChecadorAxios('salida');  } } >
                        <i className="fas fa-sign-in-alt text-primary px-0"></i>
                        <span className="pl-2 ocultar-checador">CHECAR SALIDA</span>
                        <br />
                        {
                            process.env.NODE_ENV !== 'production' ?
                                coords ?
                                    <span className="pl-2 ocultar-checador">{coords.latitude}; {coords.longitude}</span>
                                : ''
                            : ''
                        }
                    </span>
				)
		}else{
			return(
                <span className="btn btn-sm btn-bg-light btn-icon-success btn-hover-success font-weight-bolder text-success align-self-center" onClick = { (e) => { e.preventDefault(); actualizarChecadorAxios('entrada'); } }>
                    <i className="fas fa-sign-in-alt text-success px-0"></i>
                    <span className="pl-2 ocultar-checador">CHECAR ENTRADA</span>
                    <br />
                    {
                        process.env.NODE_ENV !== 'production' ?
                            coords ?
                                <span className="pl-2 ocultar-checador">{coords.latitude}; {coords.longitude}</span>
                            : ''
                        : ''
                    }
                </span>
			)
		}
    }
}

ChecadorButton.propTypes = { ...ChecadorButton.propTypes, ...geoPropTypes };

export default geolocated({ positionOptions: { enableHighAccuracy: true, }, watchPosition: true, suppressLocationOnMount: true })(ChecadorButton);