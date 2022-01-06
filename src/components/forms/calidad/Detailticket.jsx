import React, { Component } from 'react';
import moment from 'moment'
import 'moment/locale/es' 

class DetailsTickets extends Component {

    formatDay (fecha){
        let fecha_instalacion = moment(fecha);
        let format = fecha_instalacion.locale('es').format("DD MMM YYYY");
        return format.replace('.', '');
    }

    getactiveClass = () => {
        const { instalacion } = this.props
        switch(instalacion.tipo){
            case 'Instalación':
                return 'color-instalacion'
            case 'Mantenimiento preventivo':
                return 'color-mantenimiento-preventivo'
            default:
                return 'color-mantenimiento'
        }
    }
    printHour(start, end){
        let hora_inicio= moment(start).format("LT")
        let hora_final= moment(end).format("LT")
        return `${hora_inicio} a ${hora_final}`
    }

    render() {
        const { instalacion } = this.props
        return (
            <>
            
                {
                    
                    instalacion&&
                    <div className="card-body py-5 mx-4 mt-7">
                        <div className="text-center mb-5">
                            <span className={`font-size-h4 font-weight-bolder text-gray-700 letter-spacing-4px ${this.getactiveClass()}`}>
                                DATOS DE TICKET {instalacion.instalacion.identificador}
                            </span>
                        </div>
                        <div className="d-flex flex-center">
                            <div className={`d-flex ${instalacion.tipo !== 'Mantenimiento correctivo' ? 'justify-content-between' : 'justify-content-center'} mx-auto w-xl-900px`}>
                                <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
                                    <div className="text-center">
                                        <i className={`flaticon2-calendar-5 icon-3x ${this.getactiveClass()}`}></i>
                                        <div className="mt-1">
                                            <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center">
                                                <div className="min-w-70px">{this.formatDay(instalacion.instalacion.fecha_programada)}</div>
                                            </div>
                                            <span className="text-dark-50 font-weight-light">FECHA</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                        <>
                                            <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
                                                <div className="text-center">
                                                    <i className={`flaticon-clock-2 icon-3x ${this.getactiveClass()}`}></i>
                                                    <div className="mt-1">
                                                        <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center" >
                                                            <div className="min-w-50px">{this.printHour(instalacion.instalacion.event.googleEvent.start.dateTime) } </div>
                                                        </div>
                                                        <span className="text-dark-50 font-weight-light">DURACIÓN</span>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                        </>
                                }
                            </div>
                        </div>
                        <div className="text-dark-75 font-weight-bolder mt-8">
                            <span className="text-center font-size-h5 mb-7 d-block">TECNICO QUE ASISTE ->{instalacion.instalacion.tecnico_asiste}</span>
                            {
                                <span className="mb-3 d-block">
                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>DESCRIPCION: </span>{instalacion.instalacion.descripcion}</div>

                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>DESCRIPCION DE SOLUCION: </span>{instalacion.instalacion.descripcion_solucion}</div>
                                </span>
                            }                            
                        </div> 

                        <div className="text-dark-75 font-weight-bolder mt-8">
                            <span className="text-center font-size-h5 mb-7 d-block">DETALLES DE EVENTO </span>
                            
                                <span className="mb-3 d-block">
                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>SOLICITO: </span>{instalacion.instalacion.solicito}</div>
                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>RECIBE DE SOLUCION: </span>{instalacion.instalacion.recibe}</div><br />
                                    
                                     <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>CONFIRMACION: </span>{ instalacion.instalacion.event.googleEvent.attendees[0] ? instalacion.instalacion.event.googleEvent.attendees[0].email : 'NO HAy EMAIL'} </div>
                                     <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>ESTATUS: </span> { instalacion.instalacion.event.googleEvent.attendees[0].responseStatus === 'needsAction' ? 'NO HAY CONFIRMACION' : 'CONFIRMADO'} </div><br />
                                     
                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>CONFIRMACION: </span>{ instalacion.instalacion.event.googleEvent.attendees[1] ? instalacion.instalacion.event.googleEvent.attendees[1].email : 'NO HAy EMAIL'} </div>
                                    <div className="font-weight-light text-justify"><span className={`font-weight-bold ${this.getactiveClass()}`}>ESTATUS: </span> { instalacion.instalacion.event.googleEvent.attendees[1] ? instalacion.instalacion.event.googleEvent.attendees[1].responseStatus === 'needsAction' ? 'NO HAY CONFIRMACION' : 'CONFIRMADO' : 'SIN REGISTRO'} </div>

                                </span>
                            
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default DetailsTickets;