import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { diffCommentDate } from '../../../../functions/functions';

export default class UltimosContactosCard extends Component {

    isActiveButton(direction){
        const { ultimos_contactados} = this.props
        if(ultimos_contactados.total_paginas>1){
            if(direction==='prev'){
                if(ultimos_contactados.numPage>0){
                    return true;
                }
            }else{
                if(ultimos_contactados.numPage<10){
                    if(ultimos_contactados.numPage < ultimos_contactados.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    render() {
        const { ultimos_contactados, onClick, onClickPrev, clickOneLead } = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Últimos contactados</span>
                    </div>
                    <div className="card-toolbar">
                        { this.isActiveButton('prev')?
                            <span className='btn btn-icon btn-xs btn-light-primary mr-2 my-1' onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            :''
                        }
                        { this.isActiveButton('next')?
                            <span className='btn btn-icon btn-xs btn-light-primary mr-2 my-1' onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            :''
                        }
                        
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-5 text-dark-50">
                        {
                            ultimos_contactados.data.map((contacto, key) => {
                                return (
                                    <div className="timeline-item text-hover" key={key}
                                        onClick = { ( e ) => { e.preventDefault(); clickOneLead(contacto.prospecto.lead.id) } }>
                                        <div className="timeline-label">
                                            {diffCommentDate(contacto.prospecto.contactos[0])}
                                        </div>
                                        <div className="timeline-badge"><span className="bg-primary w-50 h-50"></span></div>
                                        <div className="timeline-content">
                                            <a href={`tel:+${contacto.prospecto.lead.telefono}`} className="text-dark-75 font-weight-bolder text-hover-primary mb-1">{contacto.prospecto.lead.nombre}</a>
                                            {
                                                contacto.prospecto ?
                                                    contacto.prospecto.lead ?
                                                        <span>
                                                            <span>
                                                                {contacto.prospecto.lead.empresa ? <span className="text-black-50 font-weight-bolder">- <u>{contacto.prospecto.lead.empresa.name}</u></span>: ''}
                                                            </span>
                                                            &nbsp;
                                                        </span>
                                                    :''
                                                :''
                                            }
                                            {
                                                contacto.prospecto ?
                                                    contacto.prospecto.lead ?
                                                        contacto.prospecto.lead.servicios.length > 0 ?
                                                            contacto.prospecto.lead.servicios.map((servicio, key1) => {
                                                                return (
                                                                    <span key={key1}> - <span className={servicio.servicio==="Quiero ser proveedor"?"crm-proveedor":""}>{servicio.servicio}.</span></span>
                                                                )
                                                            })
                                                        :<span> - Sin servicio</span>
                                                    :''
                                                :''
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Card.Body>
            </Card>
        )
    }
}