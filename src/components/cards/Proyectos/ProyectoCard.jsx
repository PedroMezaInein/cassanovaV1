import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Tab, Nav } from 'react-bootstrap'
import { dayDMY } from '../../../functions/setters'

export default class ProyectoCard extends Component {
    render() {
        const { data } = this.props
        return (
            <div className="mb-5">
                <Tab.Container defaultActiveKey="first">
                    <Nav className="nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100 mt-3 ">
                        <Nav.Item>
                            <Nav.Link eventKey="first">LEAD</Nav.Link>
                        </Nav.Item>
                        {
                            data.descripcion || data.vendedores || data.tipo_proyecto !== null ?
                                <Nav.Item>
                                    <Nav.Link eventKey="second">PROSPECTO</Nav.Link>
                                </Nav.Item>
                                : ''
                        }
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            {
                                data.lead ?
                                    <div className="border-nav mt-0">
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">Nombre:&nbsp;<strong className="font-size-h6"> {data.lead.nombre} </strong></p>
                                        <div className="separator separator-solid mb-3"></div>
                                        <div className={data.lead.comentario !== null ? "mb-4" : ""}>
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
                                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.lead.empresa.name}</div>
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
                                                            <a rel="noopener noreferrer" target="_blank" href={`tel:+${data.lead.telefono}`} className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">{data.lead.telefono?data.lead.telefono:"-"}</a>
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
                                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(data.lead.created_at)}</div>
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
                                                            <a rel="noopener noreferrer" target="_blank" href={`mailto:+${data.lead.email}`} className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">{data.lead.email}</a>
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
                                                            {
                                                                data.lead.origen ?
                                                                    <>
                                                                        <div className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">{data.lead.origen.origen}</div>
                                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Origen</div>
                                                                    </>
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    data.lead.servicios.length > 0 ?
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
                                                                            data.lead.servicios ? data.lead.servicios.map((servicio, key) => {
                                                                                return (
                                                                                    <li className="list-inline-item" key={key}>&#8226; {servicio.servicio}</li>
                                                                                )
                                                                            }) :
                                                                                <li className="list-inline-item">No hay servicios registrados</li>
                                                                        }
                                                                    </ul>
                                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Servicios</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                        {
                                            data.lead.comentario !== null ?
                                                <div className="bg-gray-100 p-3 font-size-lg font-weight-light" >
                                                    <strong >Comentario: </strong>{data.lead.comentario}
                                                </div>
                                                : ''
                                        }
                                    </div>
                                    : ''
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <div className="border-nav mt-0">
                                {
                                    data.cliente ?
                                        <>
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">Cliente:&nbsp;<strong className="font-size-h6"> {data.cliente ? data.cliente.empresa : ''} </strong></p>
                                            <div className="separator separator-solid mb-3"></div>
                                        </>
                                        : ''
                                }
                                <div className={data.descripcion !== null ? "mb-4" : ""}>
                                    <div className={data.descripcion !== null ? "row row-paddingless mb-4" : "row row-paddingless"}>
                                        {
                                            data.tipo_proyecto !== null ?
                                                <div className="col-md-6">
                                                    <div className="d-flex justify-content-start">
                                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                            <div className="symbol-label">
                                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Bulb1.svg')} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.tipo_proyecto ? data.tipo_proyecto.tipo : ''}</div>
                                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Tipo</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        {
                                            data.vendedores !== null ?
                                                data.vendedores?
                                                <div className="col-md-6">
                                                    <div className="d-flex justify-content-start">
                                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                            <div className="symbol-label">
                                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {
                                                                
                                                                    data.vendedores.length === 1 ?
                                                                        data.vendedores.map((vendedor, key) => {
                                                                            return (
                                                                                <div key={key}>
                                                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{vendedor.name}</div>
                                                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Vendedor</div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                        :
                                                                        <>
                                                                            <ul className="list-inline mb-0 font-size-h6 text-dark-75 font-weight-bolder">
                                                                                {
                                                                                    data.vendedores.map((vendedor, key) => {
                                                                                        return (
                                                                                            <li className="list-inline-item" key={key}>&#8226; {vendedor.name}</li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Vendedores</div>
                                                                        </>
                                                                    
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                                : <div className="font-size-h6 text-dark-75 font-weight-bolder">No tiene vendedores</div>
                                        }
                                    </div>
                                </div>
                                {
                                    data.descripcion !== null ?
                                        <div className="bg-gray-100 p-3 font-size-lg font-weight-light" >
                                            <strong >Descripción: </strong>{data.descripcion}
                                        </div>
                                        : ''
                                }
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        )
    }
}