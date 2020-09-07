import React, { Component } from 'react'
import { Card } from '../../singles'
import { P, Small, B } from '../../texts'
import Moment from 'react-moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

export default class ProyectoCard extends Component {
    render() {
        const { data, children } = this.props
        return (
            <div>
                {
                    data.lead ? 
                        <Card className="mx-md-5 my-3">
                            <div className="row mx-0">
                                <div className="col-md-12 mb-3">
                                    <P className="text-center" color="gold">
                                        Lead
                                    </P>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Small color="dark-blue">
                                        <B color="gold" className="pr-1">Nombre:</B><br />
                                        {
                                            data.lead.nombre
                                        }
                                    </Small>
                                    <hr />
                                    <Small color="dark-blue">
                                        <B color="gold" className="pr-1">Teléfono:</B><br />
                                        <a target="_blank" href={`tel:+${data.lead.telefono}`}>
                                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                            {
                                                data.lead.telefono
                                            }
                                        </a>
                                    </Small>
                                    <hr />
                                    <Small color="dark-blue">
                                        <B color="gold" className="pr-1">Correo:</B><br />
                                        <a target="_blank" href={`mailto:+${data.lead.email}`}>
                                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                            {
                                                data.lead.email
                                            }
                                        </a>
                                    </Small>
                                    <hr />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Small color="dark-blue">
                                        <B color="gold" className="pr-1">Empresa:</B><br />
                                        {
                                            data.lead.empresa.name
                                        }
                                    </Small>
                                    <hr />
                                    {
                                        data.lead.origen ?
                                            <>
                                                <Small color="dark-blue">
                                                    <B color="gold" className="mr-1">Origen:</B><br />
                                                    {
                                                        data.lead.origen.origen
                                                    }
                                                </Small>
                                                <hr />
                                            </>
                                        : ''
                                    }
                                    <Small color="dark-blue">
                                        <Small>
                                            <B color="gold" className="mr-1">Fecha:</B><br />
                                        </Small>
                                        <Moment format="DD/MM/YYYY">
                                            {
                                                data.lead.created_at
                                            }
                                        </Moment>
                                    </Small>
                                    <hr />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Small color="dark-blue">
                                        <B className="mr-1" color="gold">Comentario:</B><br />
                                        {
                                            data.lead.comentario
                                        }
                                    </Small>
                                    <hr />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="text-color__dark-blue">
                                        <Small>
                                            <B color="gold" className="mr-1">Servicios:</B><br />
                                        </Small>
                                        <div className="px-2">
                                            <ul>
                                                {
                                                    data.lead.servicios ? data.lead.servicios.map((servicio, key) => {
                                                        return (
                                                            <li key={key}>
                                                                <Small color="dark-blue">
                                                                    {servicio.servicio}
                                                                </Small>
                                                            </li>
                                                        )
                                                    }) :
                                                    <li>
                                                        <Small color="dark-blue">
                                                            No hay servicios registrados
                                                        </Small>
                                                    </li>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </Card>
                    : ''
                }
                <Card className="mx-md-5 my-3">
                    <div className="row mx-0">
                        <div className="col-md-12 mb-3">
                            <P className="text-center" color="gold">
                                Prospecto
                            </P>
                        </div>
                        <div className="col-md-6">
                            <Small>
                                <B color="gold">
                                    Cliente:
                                </B>
                            </Small>
                            <br />
                            <Small color="dark-blue">
                                {
                                    data.cliente.empresa
                                }
                            </Small>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <Small>
                                <B color="gold">
                                    Vendedor:
                                </B>
                            </Small>
                            <br />
                            <Small color="dark-blue">
                                {
                                    data.vendedor.name
                                }
                            </Small>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <Small>
                                <B color="gold">
                                    Tipo:
                                </B>
                            </Small>
                            <br />
                            <Small color="dark-blue">
                                {
                                    data.tipo_proyecto.tipo
                                }
                            </Small>
                            <hr />
                        </div>
                        <div className="col-md-12">
                            <Small>
                                <B color="gold">
                                    Descripción:
                                </B>
                            </Small>
                            <br />
                            <Small color="dark-blue">
                                {
                                    data.descripcion
                                }
                            </Small>
                            <hr />
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}