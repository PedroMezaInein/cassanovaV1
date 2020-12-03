import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
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
                    <div class="timeline timeline-justified timeline-4 text-dark-75" id="amarrillo">
                        <div class="timeline-items py-0">
                            <div class="timeline-item mb-4 pl-30px">
                                <div class="timeline-badge border border-5 border-white bg-light-warning">
                                    <i class="fas fa-laptop-code text-warning icon-1rem"></i>
                                </div>
                                <div class="px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-warning">28/12/2020</span></span>
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