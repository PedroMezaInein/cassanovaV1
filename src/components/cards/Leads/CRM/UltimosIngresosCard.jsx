import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import moment from 'moment'
export default class UltimosContactosCard extends Component {
    diffCommentDate = (contacto) => {
        var now = new Date();
        var then = new Date(contacto.created_at);
        var diff = moment.duration(moment(now).diff(moment(then)));
        var months = parseInt(moment(now).diff(moment(then), 'month'))
        var days = parseInt(diff.asDays());
        var hours = parseInt(diff.asHours());
        var minutes = parseInt(diff.asMinutes());
        if (months) {
            if (months === 1)
                return '1 mes'
            else
                return `${months} meses`
        }
        else {
            if (days) {
                if (days === 1)
                    return '1 día'
                else
                    return `${days} días`
            }
            else {
                if (hours) {
                    if (hours === 1)
                        return '1 hora'
                    else
                        return `${hours} horas`
                }
                else {
                    if (minutes) {
                        if (minutes === 1)
                            return '1 minuto'
                        else
                            return `${minutes} minutos`
                    }
                    else {
                        return 'Hace un momento'
                    }
                }
            }
        }
    }
    isActiveButton(direction){
        const { ultimos_ingresados} = this.props
        if(ultimos_ingresados.total_paginas>1){
            if(direction==='prev'){
                if(ultimos_ingresados.numPage>0){
                    return true;
                }
            }else{
                if(ultimos_ingresados.numPage<10){
                    if(ultimos_ingresados.numPage < ultimos_ingresados.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { ultimos_ingresados, onClick, onClickPrev} = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Últimos ingresados</span>
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
                    <div className="timeline timeline-5 text-dark-50">
                        {
                            ultimos_ingresados.data.map((contacto, key) => {
                                return (
                                    <div className="timeline-item" key={key}>
                                        <div className="timeline-label"> {this.diffCommentDate(contacto)}</div>
                                        <div className="timeline-badge"><span className="bg-primary w-50 h-50"></span></div>
                                        <div className="timeline-content">
                                            <a href={`tel:+${contacto.telefono}`} className="text-dark-75 font-weight-bolder text-hover-primary mb-1">{contacto.nombre}</a>
                                            {
                                                contacto.servicios.map((servicio, key1) => {
                                                    return (
                                                        // <span key={key1}> - {servicio.servicio.length>0?servicio.servicio:'Sin servicio'}</span>
                                                        <span key={key1}> - {servicio.servicio}</span>
                                                    )
                                                })
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