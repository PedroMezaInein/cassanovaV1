import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { AudioApp } from '../singles'

class Notificacion extends Component {

    setIcon = tipo => {
        switch(tipo){
            case 'lead':
                return toAbsoluteUrl('/images/svg/notificaciones/lead.svg');
            case 'tarea':
                return toAbsoluteUrl('/images/svg/notificaciones/tarea.svg');
            case 'ticket':
                return toAbsoluteUrl('/images/svg/notificaciones/ticket.svg');
            case 'vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/vacaciones.svg');
            case 'solicitud vacaciones':
                return toAbsoluteUrl('/images/svg/notificaciones/solicitud-vacaciones.svg');
            case 'cuestionario':
                return toAbsoluteUrl('/images/svg/notificaciones/qa.svg');
            case 'cancel':
                return toAbsoluteUrl('/images/svg/notificaciones/cancelar.svg');
            default:
                return toAbsoluteUrl('/images/svg/portapapeles.svg');
        }
    }

    render() {
        const { data } = this.props
        return (
            <div className="row mx-0">
                <AudioApp />
                <div className="col-3 d-flex justify-content-center align-items-center">
                    <span className="svg-icon svg-icon-lg svg-icon-success mx-2">
                        <SVG className = 'w-100' src = { this.setIcon(data.tipo) } />
                    </span>
                </div>
                <div className="col-9"> <div className="text-center"> { data.texto } </div> </div>
            </div>
        );
    }
}

export default Notificacion;