import React, {Component} from 'react'
import {Card} from '../../singles'
import {P} from '../../texts'
import Moment from 'react-moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default class LeadCard extends Component {
    render() {
        const {lead, children} = this.props
        return (
            <Card className="mx-md-5 my-3">
                <div className="row mx-0">
                    <div className="col-md-6 mb-3">
                        <P color="dark-blue">
                            {lead.nombre}
                        </P>
                        <hr/>
                        <P color="dark-blue">
                            <a target="_blank" href={`tel:+${lead.telefono}`}>
                                <FontAwesomeIcon icon={faPhone} className="mr-2"/> {lead.telefono}
                            </a>
                        </P>
                        <hr/>
                        <P color="dark-blue">
                            <a target="_blank" href={`mailto:+${lead.email}`}>
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2"/> {lead.email}
                            </a>
                        </P>
                        <hr/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <P color="dark-blue">
                            <strong className="text-color__gold mr-1">Empresa:</strong>
                            {lead.empresa.name}
                        </P>
                        <hr/>
                        <P color="dark-blue">
                            <strong className="text-color__gold mr-1">Origen:</strong>
                            {lead.origen.origen}
                        </P>
                        <hr/>
                        <P color="dark-blue">
                            <strong className="text-color__gold mr-1">Fecha:</strong>
                            <Moment format="DD/MM/YYYY">
                                {lead.created_at}
                            </Moment>
                        </P>
                        <hr/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <P color="dark-blue">
                            <strong className="text-color__gold mr-1">Comentario:</strong><br/>
                            <div className="px-2">
                                {lead.comentario}
                            </div>

                        </P>
                        <hr/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <P color="dark-blue">
                            <strong className="text-color__gold mr-1">Servicios:</strong><br/>
                            <div className="px-2">
                                <ul>
                                    {
                                        lead.servicios
                                            ? lead
                                                .servicios
                                                .map((servicio, key) => {
                                                    return (
                                                        <li key={key}>
                                                            {servicio.servicio}
                                                        </li>
                                                    )
                                                })
                                            : <li>No hay servicios registrados</li>
                                    }
                                </ul>
                            </div>
                        </P>
                        <hr/>
                    </div>
                </div>
            </Card>
        )
    }
}