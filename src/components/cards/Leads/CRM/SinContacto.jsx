import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import moment from 'moment'
export default class SinContacto extends Component {
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
                return 'Un mes'
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
    render() {
        const { prospectos_sin_contactar, onClick, onClickPrev } = this.props
        console.log(prospectos_sin_contactar.data)
        return (
            <Card className="card-custom card-stretch gutter-b py-2 bg-danger-o-50">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Leads sin contacto en más de una semana</span>
                    </div>
                    <div className="card-toolbar">
                        <a href="#" className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></a>
                        <a href="#" className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></a>
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-5 text-dark-50 timeline-danger">
                        {
                            prospectos_sin_contactar.data.map((contacto, key) => {
                                return (
                                    <div className="timeline-item" key={key}>
                                        <div className="timeline-label"> {this.diffCommentDate(contacto)}</div>
                                        <div className="timeline-badge bg-danger-50"><span className="bg-primary w-50 h-50"></span></div>
                                        <div className="timeline-content">
                                            <a href={`tel:+${contacto.telefono}`} className="text-dark-75 font-weight-bolder text-hover-danger mb-1">{contacto.nombre}</a>
                                        </div>
                                        {
                                            // contacto.servicios.map((servicio, key1) => {
                                            //     return (
                                            //         <div key={key1} className="timeline-content">
                                            //             <a href="tel:+5500112233" className="text-dark-75 font-weight-bolder text-hover-primary mb-1">{contacto.nombre}</a> - {servicio.servicio}
                                            //         </div>
                                            //     )
                                            // })
                                        }
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