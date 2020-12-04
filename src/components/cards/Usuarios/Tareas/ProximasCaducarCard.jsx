import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { setDateTableLG } from '../../../../functions/setters'
export default class ProximasCaducarCard extends Component {
    isActiveButton(direction){
        const { proximas_caducar} = this.props
        if(proximas_caducar.total_paginas>1){
            if(direction==='prev'){
                if(proximas_caducar.numPage>0){
                    return true;
                }
            }else{
                if(proximas_caducar.numPage<10){
                    if(proximas_caducar.numPage < proximas_caducar.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { proximas_caducar, onClick, onClickPrev} = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Próximas a caducar</span>
                    </div>
                    <div className="card-toolbar">
                        { this.isActiveButton('prev')?
                            <span className="btn btn-icon btn-xs btn-light-warning mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            :''
                        }
                        { this.isActiveButton('next')?
                            <span className="btn btn-icon btn-xs btn-light-warning mr-2 my-1" onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            :''
                        }
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-justified timeline-4 text-dark-75" id="amarrillo">
                        <div className="timeline-items py-0">
                            {
                                proximas_caducar.data.map((element, key) => {
                                    return(
                                        <div className="timeline-item mb-4 pl-30px" key = { key } >
                                            <div className="timeline-badge border border-5 border-white bg-light-warning">
                                                {
                                                    element.departamento.nombre==='TI'?<i className="fas fa-laptop-code text-warning pt-1px icon-1-26rem"></i>:
                                                        element.departamento.nombre==='ADMINISTRACION'?<i className="fas fa-user-cog text-warning pl-2px pt-1px icon-1-2rem"></i>:
                                                            element.departamento.nombre==='CALIDAD'?<i className="fas fa-award text-warning icon-lg"></i>:
                                                                element.departamento.nombre==='COMPRAS'?<i className="flaticon2-shopping-cart text-warning pt-1px pr-2px icon-lg"></i>:
                                                                    element.departamento.nombre==='CONTABILIDAD'?<i className="fas fa-calculator text-warning icon-1-26rem"></i>:
                                                                        element.departamento.nombre==='FISCAL'?<i className="flaticon2-list text-warning pt-3px pl-2px icon-1-7rem"></i>:
                                                                            element.departamento.nombre==='MERCADOTECNIA'?<i className="fas fa-mail-bulk text-warning"></i>:
                                                                                element.departamento.nombre==='PERSONAL'?<i className="fas fa-user text-warning icon-lg pr-1px"></i>:
                                                                                    element.departamento.nombre==='PROYECTOS'?<i className="flaticon2-sheet text-warning pt-2px pl-4px icon-1-39rem"></i>:
                                                                                        element.departamento.nombre==='RECURSOS HUMANOS'?<i className="fas fa-users text-warning icon-md"></i>:
                                                                                            element.departamento.nombre==='VENTAS'?<i className="flaticon-price-tag text-warning icon-lg"></i>:
                                                                        ''
                                                }
                                            </div>
                                            <div className="px-2 mb-0">
                                                {
                                                    element.fecha_limite?
                                                    <span className="text-warning">- {setDateTableLG(element.fecha_limite)}</span>
                                                    :''
                                                }
                                            </div>
                                            <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                                <span className="text-dark-75 font-weight-bolder">
                                                    { element.departamento.nombre }
                                                </span> - { element.titulo }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}