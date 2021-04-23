import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { Construir, Tarea, Lead, Cuestionario, Portapapeles, Ticket, Vacaciones, Solicitud, Cancel, Money } from '../../assets/images/notification'
class Notificacion extends Component {

    state = {
        audio: ''
    }

    componentDidMount(){
        let { audio } = this.state
        audio = new Audio(toAbsoluteUrl('/sounds/alert2.mp3'));
        audio.load();
        audio.loop = true;
        audio.play();
        this.setState({...this.state, audio: audio})
    }

    componentWillUnmount(){
        let { audio } = this.state
        audio.pause();
        this.setState({...this.state, audio: ''})
    }

    setIcon = tipo => {
        /* return toAbsoluteUrl('/images/png/icon.png'); */
        switch(tipo){
            case 'lead':
                return Lead // toAbsoluteUrl('/images/svg/notificaciones/lead.svg');
            case 'tarea':
                return Tarea /* toAbsoluteUrl('/images/svg/notificaciones/tarea.svg'); */
            case 'ticket':
                return Ticket // toAbsoluteUrl('/images/svg/notificaciones/ticket.svg');
            case 'vacaciones':
                return Vacaciones // toAbsoluteUrl('/images/svg/notificaciones/vacaciones.svg');
            case 'solicitud vacaciones':
                return Solicitud //toAbsoluteUrl('/images/svg/notificaciones/solicitud-vacaciones.svg');
            case 'cuestionario':
                return Cuestionario //toAbsoluteUrl('/images/svg/notificaciones/qa.svg');
            case 'cancel':
                return Cancel // toAbsoluteUrl('/images/svg/notificaciones/cancelar.svg');
            case 'proyecto':
                return Construir // toAbsoluteUrl('/images/svg/notificaciones/construir.svg');
            case 'money':
                return Money
            default:
                return Portapapeles // toAbsoluteUrl('/images/svg/portapapeles.svg');
        }
    }

    render() {
        const { data } = this.props
        return (
            <div className="row mx-0 align-items-center">
                {/* <AudioApp /> */}
                <div className="col-2 d-flex justify-content-center align-items-center">
                    <span className="svg-icon svg-icon-lg svg-icon-success mx-2">
                        <SVG className = 'w-100' src = { this.setIcon(data.tipo) } />
                    </span>
                </div>
                <div className="col-10"> <div className="text-left text-white text-bold font-bold"> { data.texto } </div> </div>
            </div>
        );
    }
}

export default Notificacion;