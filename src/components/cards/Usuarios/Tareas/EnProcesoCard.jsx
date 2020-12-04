import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
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
        console.log(en_proceso, 'en proceso')
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
                                    console.log(element, 'element')
                                    return(
                                        <div className="timeline-item mb-4 pl-30px" key = { index } >
                                            <div className="timeline-badge border border-5 border-white bg-light-primary">
                                                <i className="fas fa-laptop-code text-primary icon-1rem"></i>
                                            </div>
                                            <div className="px-2 mb-0">
                                                <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-primary">28/12/2020</span></span>
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