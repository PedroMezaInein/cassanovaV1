import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
export default class CaducadasCard extends Component {
    isActiveButton(direction){
        const { caducadas} = this.props
        if(caducadas.total_paginas>1){
            if(direction==='prev'){
                if(caducadas.numPage>0){
                    return true;
                }
            }else{
                if(caducadas.numPage<10){
                    if(caducadas.numPage < caducadas.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { caducadas, onClick, onClickPrev} = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Caducadas</span>
                    </div>
                    <div className="card-toolbar">
                        { this.isActiveButton('prev')?
                            <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            :''
                        }
                        { this.isActiveButton('next')?
                            <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            :''
                        }
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    {/* <div class="timeline timeline-justified timeline-4 text-dark-75" id="nuevo">
                        <div class="timeline-items pb-0">
                            <div class="timeline-item pl-4 mb-4">
                                <div class="timeline-badge">
                                    <div class="bg-danger"></div>
                                </div>
                                <div class="px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    <span className="text-dark-75 font-weight-bolder">TI</span> - Desarrollo de back end para primera pantalla de presupuestos
                                </div>
                            </div>
                            <div class="timeline-item pl-4 mb-4">
                                <div class="timeline-badge">
                                    <div class="bg-danger"></div>
                                </div>
                                <div class="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Error al mostrar departamentos y proyectos de usuarios
                                </div>
                            </div>
                            <div class="timeline-item pl-4 mb-4">
                                <div class="timeline-badge">
                                    <div class="bg-danger"></div>
                                </div>
                                <div class="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                                </div>
                            </div>
                            <div class="timeline-item pl-4 mb-4">
                                <div class="timeline-badge">
                                    <div class="bg-danger"></div>
                                </div>
                                <div class="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Desarrollo de segunda pantalla para presupuestos
                                </div>
                            </div>
                            <div class="timeline-item pl-4 mb-4">
                                <div class="timeline-badge">
                                    <div class="bg-danger"></div>
                                </div>
                                <div class="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Generar tres paginas de reportes nuevos, reporte de ventas
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div class="timeline timeline-5">
                        <div class="timeline-item">
                            <div class="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div class="timeline-badge"><i class="fa fa-genderless text-danger"></i></div>
                            <div class="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                <span className="text-dark-75 font-weight-bolder">TI</span> - Desarrollo de back end para primera pantalla de presupuestos
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div class="timeline-badge"><i class="fa fa-genderless text-danger"></i></div>
                            <div class="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Error al mostrar departamentos y proyectos de usuarios
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div class="timeline-badge"><i class="fa fa-genderless text-danger"></i></div>
                            <div class="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div class="timeline-badge"><i class="fa fa-genderless text-danger"></i></div>
                            <div class="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Generar tres paginas de reportes nuevos, reporte de ventas
                            </div>
                        </div>
                    </div> */}
                    {/* <div class="timeline timeline-6" id="timeline-departamentos">
                        <div class="timeline-items">
                            <div class="timeline-item">
                                <div class="timeline-media bg-light-danger">
                                    <i class="fas fa-laptop-code text-danger icon-1rem"></i>
                                </div>
                                <div class="timeline-desc timeline-desc-bg-gray-200">
                                    <span class="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p class="text-justify font-weight-light pb-2 mb-2">
                                        <span className="text-dark-75 font-weight-bolder">TI</span> - Generar tres paginas de reportes nuevos, reporte de ventas
                                    </p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-media bg-light-danger">
                                    <i class="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div class="timeline-desc timeline-desc-bg-gray-200">
                                    <span class="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p class="text-justify font-weight-light pb-2 mb-2">
                                        Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                                    </p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-media bg-light-danger">
                                    <i class="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div class="timeline-desc timeline-desc-bg-gray-200">
                                    <span class="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p class="text-justify font-weight-light pb-2 mb-2">
                                        Error al mostrar departamentos y proyectos de usuarios
                                    </p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-media bg-light-danger">
                                    <i class="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div class="timeline-desc timeline-desc-bg-gray-200">
                                    <span class="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p class="text-justify font-weight-light pb-2 mb-2">
                                        Desarrollo de back end para primera pantalla de presupuestos
                                    </p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="timeline-media bg-light-danger">
                                    <i class="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div class="timeline-desc timeline-desc-bg-gray-200">
                                    <span class="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p class="text-justify font-weight-light pb-2 mb-2">
                                        Actualización aceptar vacaciones
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div class="timeline timeline-justified timeline-4 text-dark-75" id="amarrillo">
                        <div class="timeline-items py-0">
                            <div class="timeline-item mb-4 pl-30px">
                                <div class="timeline-badge border border-5 border-white bg-light-danger">
                                    <i class="fas fa-laptop-code text-danger icon-1rem"></i>
                                </div>
                                <div class="px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div class="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    <span className="text-dark-75 font-weight-bolder">TI</span> - Desarrollo de back end para primera pantalla de presupuestos
                                </div>
                            </div>
                        </div>
                    </div>
                    </Card.Body>
            </Card>
        )
    }
}