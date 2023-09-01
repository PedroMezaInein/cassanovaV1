import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { printResponseErrorAlert } from '../../functions/alert';
import { apiGet, catchErrors } from '../../functions/api';
import { diffCommentDate } from '../../functions/functions';

class SinContacto extends Component {
    state = {
        leads: {
            data: [],
            total: 0,
            totalPages: 0,
            numPage: 0,
            total_paginas: 0
        }
    }

    componentDidMount = () => {
        this.getLeads()
    }

    componentDidUpdate = ( prev ) => {
        const { flag } = this.props
        const { flag: prevFlag } = prev
        if(flag !== prevFlag)
            this.getLeads()
    }

    getLeads = async () => {
        const { leads } = this.state
        const { at } = this.props
        apiGet(`crm/timeline/ultimos-prospectos-sin-contactar/${leads.numPage}`, at).then((response) => {
            const { contactos, total } = response.data
            leads.data = contactos
            leads.total = total
            leads.total_paginas = Math.ceil(total / 5)
            this.setState({ ...this.state, leads })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }
    onClickNext = (e) => {
        e.preventDefault()
        const { leads } = this.state
        if (leads.numPage < leads.total_paginas - 1) {
            this.setState({
                numPage: leads.numPage++
            })
            this.getLeads()
        }
    }
    onClickprev = (e) => {
        e.preventDefault()
        const { leads } = this.state
        if (leads.numPage > 0) {
            this.setState({
                numPage: leads.numPage--
            })
            this.getLeads()
        }
    }
    isActiveButton(direction) {
        const { leads } = this.state
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) { return true; }
            } else {
                if (leads.numPage < 10) {
                    if (leads.numPage <= leads.total_paginas - 1) { return true; }
                }
            }
        }
        return false;
    }
    render() {
        const { leads } = this.state
        const { clickOneLead } = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <Card.Title className="align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Sin contacto en + 3 días</span>
                    </Card.Title>
                    <div className="card-toolbar">
                        {
                            this.isActiveButton('prev') ?
                                <span className="btn btn-icon btn-xs btn-light-danger mr-2" onClick={this.onClickprev}>
                                    <i className="ki ki-bold-arrow-back icon-xs" />
                                </span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-danger" onClick={this.onClickNext}>
                                    <i className="ki ki-bold-arrow-next icon-xs" />
                                </span>
                                : ''
                        }
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    <div className="timeline timeline-5 text-dark-50 timeline-danger">
                        {
                            leads.data.map((contacto, key) => {
                                return (
                                    <div className="timeline-item cursor-pointer-hover" key={key} onClick={(e) => { e.preventDefault(); clickOneLead(contacto.id) }}>
                                        <div className="timeline-label">
                                            {
                                                contacto.prospecto.contactos?
                                                    diffCommentDate(contacto.prospecto.contactos[0])
                                                :<></>
                                            }
                                        </div>
                                        <div className="timeline-badge"><span className="bg-danger w-50 h-50"></span></div>
                                        <div className="timeline-content text-justify">
                                            <a href={`tel:+${contacto.telefono}`} className="text-dark-75 font-weight-bolder text-hover-danger mb-1">{contacto.nombre}</a>
                                            <span>
                                                &nbsp;
                                                <span>
                                                    {contacto.empresa ? <span className="text-black-50 font-weight-bolder">- <u>{contacto.empresa.name}</u></span> : ''}
                                                </span>
                                                &nbsp;
                                            </span>
                                            {
                                                contacto.servicios.length > 0 ?
                                                    contacto.servicios.map((servicio, key1) => {
                                                        return (
                                                            <span key={key1}> - <span className={servicio.servicio === "Quiero ser proveedor" ? "crm-proveedor" : ""}>{servicio.servicio}.</span></span>
                                                        )
                                                    })
                                                    : <span> - Sin servicio.</span>
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

export default SinContacto