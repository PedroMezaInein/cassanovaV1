import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { setDateTableLG } from '../../../../functions/setters'
export default class EnProcesoCard extends Component {
    isActiveButton(direction){
        const { en_proceso} = this.props
        if(en_proceso.total_paginas>1){
            if(direction==='prev'){
                if(en_proceso.numPage>0){
                    return true;
                }
            }else{
                if(en_proceso.numPage<10){
                    if(en_proceso.numPage < en_proceso.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { en_proceso, onClick, onClickPrev} = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">En proceso</span>
                    </div>
                    <div className="card-toolbar">
                        { this.isActiveButton('prev')?
                            <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            :''
                        }
                        { this.isActiveButton('next')?
                            <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            :''
                        }
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-justified timeline-4 text-dark-75" id="amarrillo">
                        <div className="timeline-items py-0">
                            {
                                en_proceso.data.map((element, index) => {
                                    return(
                                        <div className="timeline-item mb-4 pl-30px" key = { index } >
                                            <div className="timeline-badge border border-5 border-white bg-light-primary">
                                                {
                                                    element.departamento.nombre==='TI'?<i className="fas fa-laptop-code text-primary pt-1px icon-1-26rem"></i>:
                                                        element.departamento.nombre==='ADMINISTRACION'?<i className="fas fa-user-cog text-primary pl-2px pt-1px icon-1-2rem"></i>:
                                                            element.departamento.nombre==='CALIDAD'?<i className="fas fa-award text-primary icon-lg"></i>:
                                                                element.departamento.nombre==='COMPRAS'?<i className="flaticon2-shopping-cart text-primary pt-1px pr-2px icon-lg"></i>:
                                                                    element.departamento.nombre==='CONTABILIDAD'?<i className="fas fa-calculator text-primary icon-1-26rem"></i>:
                                                                        element.departamento.nombre==='FISCAL'?<i className="flaticon2-list text-primary pt-3px pl-2px icon-1-7rem"></i>:
                                                                            element.departamento.nombre==='MERCADOTECNIA'?<i className="fas fa-mail-bulk text-primary"></i>:
                                                                                element.departamento.nombre==='PERSONAL'?<i className="fas fa-user text-primary icon-lg pr-1px"></i>:
                                                                                    element.departamento.nombre==='PROYECTOS'?<i className="flaticon2-sheet text-primary pt-2px pl-4px icon-1-39rem"></i>:
                                                                                        element.departamento.nombre==='RECURSOS HUMANOS'?<i className="fas fa-users text-primary icon-md"></i>:
                                                                                            element.departamento.nombre==='VENTAS'?<i className="flaticon-price-tag text-primary icon-lg"></i>:
                                                                        ''
                                                }
                                            </div>
                                            <div className="px-2 mb-0">
                                            <span className="font-size-xs text-dark font-weight-bolder">{setDateTableLG(element.created_at)}
                                                {
                                                    element.fecha_limite?
                                                    <span className="text-primary">- {setDateTableLG(element.fecha_limite)}</span>
                                                    :''
                                                }
                                            </span>
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