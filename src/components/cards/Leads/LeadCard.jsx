import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { dayDMY } from '../../../functions/setters'
export default class LeadCard extends Component {
    render() {
        const { lead, border } = this.props
        return (
            <div className={border} >{/*  className="mt-4 mb-5"*/}
                <div className="col-md-12">
                    <Card className="card card-without-box-shadown border-0">
                        <p className="font-size-h5 text-muted font-size-lg mt-0">Nombre:&nbsp;<strong className="font-size-h6">{lead.nombre}</strong></p>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="mb-4">
                            <div className="row row-paddingless mb-4">
                                <div className="col-md-3">
                                    <div className="d-flex justify-content-start">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.empresa.name}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Empresa</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex justify-content-start mr-2">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/iPhone-X.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <a target="_blank" href={`tel:+${lead.telefono}`} className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary" rel="noopener noreferrer">{lead.telefono}</a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">TELÉFONO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex justify-content-start mr-2">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <i className="flaticon2-calendar-8 text-info icon-lg"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(lead.created_at)}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex align-items-start mr-2">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Mail.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <a target="_blank" href={`mailto:+${lead.email}`} className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary" rel="noopener noreferrer">{lead.email}</a>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Correo electrónico</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-paddingless">
                                <div className="col-md-3">
                                    <div className="d-flex align-items-start mr-2">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Folder-cloud.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{lead.origen.origen}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Origen</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="d-flex align-items-start mr-2">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Tools.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <ul className="list-inline mb-0 font-size-h6 text-dark-75 font-weight-bolder">
                                                {
                                                    lead.servicios
                                                        ? lead
                                                            .servicios
                                                            .map((servicio, key) => {
                                                                return (
                                                                    <li className="list-inline-item" key={key}>&#8226; {servicio.servicio}</li>
                                                                )
                                                            })
                                                        :
                                                        <li className="list-inline-item">No hay servicios registrados</li>
                                                }
                                            </ul>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Servicios</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light" >
                            <strong >Comentario: </strong>{lead.comentario}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}