import React, { Component } from 'react';
import moment from 'moment'
import 'moment/locale/es' 

class DetailsInstalacion extends Component {

    formatDay (fecha){
        let fecha_instalacion = moment(fecha);
        let format = fecha_instalacion.locale('es').format("DD MMM YYYY");
        return format.replace('.', '');
    }
    render() {
        const { instalacion } = this.props
        return (
            <>
                {
                    instalacion&&
                    <div className="card-body py-5 mx-4 mt-7">
                        <div className="text-center mb-5">
                            <span className={`font-size-h4 font-weight-bolder text-gray-700 letter-spacing-4px ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}>DATOS DE INSTALACIÓN</span>
                        </div>
                        <div className="d-flex flex-center">
                            <div className="d-flex justify-content-between mx-auto w-xl-900px">
                                <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
                                    <div className="text-center">
                                        <i className={`flaticon2-calendar-5 icon-3x ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}></i>
                                        <div className="mt-1">
                                            <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center">
                                                <div className="min-w-70px">{this.formatDay(instalacion.instalacion.fecha)}</div>
                                            </div>
                                            <span className="text-dark-50 font-weight-light">FECHA</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
                                    <div className="text-center">
                                        <i className={`flaticon-clock-2 icon-3x ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}></i>
                                        <div className="mt-1">
                                            <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center" >
                                                <div className="min-w-50px">{instalacion.instalacion.duracion} {instalacion.instalacion.duracion === 1 ? 'AÑO':'AÑOS'}</div>
                                            </div>
                                            <span className="text-dark-50 font-weight-light">DURACIÓN</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="octagon d-flex flex-center h-150px w-150px bg-white mx-2">
                                    <div className="text-center">
                                        <i className={`flaticon-calendar-with-a-clock-time-tools icon-3x ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}></i>
                                        <div className="mt-1">
                                            <div className="font-size-h6 font-weight-bolder text-gray-800 d-flex align-items-center justify-content-center">
                                                <div className="min-w-50px">{instalacion.instalacion.periodo} {instalacion.instalacion.periodo === 1 ? 'MES':'MESES'}</div>
                                            </div>
                                            <span className="text-dark-50 font-weight-light">PERIODO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-dark-75 font-weight-bolder mt-8">
                            <span className="text-center font-size-h5 mb-7 d-block">{instalacion.instalacion.equipo.texto}</span>
                            {
                                instalacion.instalacion.equipo.observaciones &&
                                <span className="mb-3 d-block">
                                    <span className={`font-weight-bold ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}>OBSERVACIONES: </span><span className="font-weight-light text-justify ">{instalacion.instalacion.equipo.observaciones}</span>
                                </span>
                            }
                            {
                                instalacion.instalacion.proyecto.nombre&&
                                <span className="mb-3 d-block">
                                    <span className={`${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}>PROYECTO: </span><span>{instalacion.instalacion.proyecto.nombre}</span>
                                </span>
                            }
                            {
                                instalacion.contadorPeriodo&&
                                <span className="mb-3 d-block">
                                    <span className={`${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}>PERIODO: </span><span>{instalacion.contadorPeriodo} DE {(instalacion.instalacion.duracion*12)/instalacion.instalacion.periodo} MESES</span>
                                </span>
                            }
                            {
                                instalacion.instalacion.equipo.ficha_tecnica &&
                                <span className="d-block text-right">
                                    <u><a rel="noopener noreferrer"  href={instalacion.instalacion.equipo.ficha_tecnica} target="_blank" className={`font-weight-bolder text-hover-primary ${instalacion.tipo === 'Instalación' ? 'color-instalacion' : 'color-mantenimiento'}`}>FICHA TECNICA</a></u>
                                </span>
                            }
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default DetailsInstalacion;