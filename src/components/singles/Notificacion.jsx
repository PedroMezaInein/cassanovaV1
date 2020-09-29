import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"

class Notificacion extends Component {

    setIcon = tipo => {
        switch(tipo){
            case 'lead':
                return toAbsoluteUrl('/images/svg/notificaciones/lead.svg');
            case 'tarea':
                return toAbsoluteUrl('/images/svg/notificaciones/tarea.svg');
            case 'ticket':
                return toAbsoluteUrl('/images/svg/notificaciones/ticket.svg');
            default:
                return toAbsoluteUrl('/images/svg/portapapeles.svg');
        }
    }
    render() {
        const { data } = this.props
        return (
            <div>
                <span className="svg-icon svg-icon-lg svg-icon-success mx-3">
                    <SVG src = { this.setIcon(data.tipo) } />
                </span>
                <span>
                    {
                        data.texto
                    }
                </span>
            </div>
        );
    }
}

export default Notificacion;