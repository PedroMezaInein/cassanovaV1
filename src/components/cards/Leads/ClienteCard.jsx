import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { dayDMY } from '../../../functions/setters'
export default class ClienteCard extends Component {
    render() {
        const { cliente } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    cliente.empresa ?
                                            <p className="font-size-h3 mb-0">Empresa:&nbsp;<strong className="font-size-h4"> {cliente.empresa}</strong></p>
                                        : ''
                                }
                                {
                                    cliente.nombre ?
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">Nombre:&nbsp;<strong className="font-size-h6"> {cliente.nombre} </strong></p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        {
                            cliente.calle ?
                                <div className="row row-paddingless mb-4">
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Marker1.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    {
                                                        cliente.calle ?
                                                            <>{cliente.calle},</>
                                                            : ''
                                                    }
                                                    {cliente.colonia ?
                                                        <> colonia {cliente.colonia},</>
                                                        : ''
                                                    }
                                                    {
                                                        cliente.municipio ?
                                                            <> {cliente.municipio},</>
                                                            : ''
                                                    }
                                                    {
                                                        cliente.estado ?
                                                            <> {cliente.estado},</>
                                                            : ''
                                                    }
                                                    {
                                                        cliente.cp ?
                                                            <> CP:{cliente.cp}.</>
                                                            : ''
                                                    }
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">DIRECCIÓN</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }
                        <div className="row row-paddingless">
                            {
                                cliente.created_at ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-info icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(cliente.created_at)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cliente.rfc ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cliente.rfc}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">RFC</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cliente.perfil ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Shield-user.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cliente.perfil}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">PERFIL</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cliente.puesto ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cliente.puesto}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">PUESTO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}