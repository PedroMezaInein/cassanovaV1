import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import Card from 'react-bootstrap/Card'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { dayDMY } from '../../../functions/setters'
export default class SolicitudCompraCard extends Component {
    render() {
        const { data, children } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-4">
                        <div className="mr-2">
                            {
                                data.proyecto ?
                                        <p className="font-size-h3 mb-0">Proyecto:&nbsp;<strong className="font-size-h4"> {data.proyecto.nombre}</strong></p>
                                    : ''
                            }
                            {
                                data.empresa ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">Empresa:&nbsp;<strong className="font-size-h6"> {data.empresa.name} </strong></p>
                                    : ''
                            }
                        </div>
                        {children}
                    </div>
                    <div className="separator separator-solid mb-3"></div>
                    <div className="mb-5">
                        <div className="row row-paddingless mb-4">
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-info">
                                                <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.monto ?
                                                <>
                                                    <NumberFormat
                                                        value={data.monto}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div className="font-size-h6 text-dark-75 font-weight-bolder"> {value} </div>} />
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Monto</div>
                                                </>
                                                : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.factura ? 'Con factura' : 'Sin factura'}</div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Factura</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-info">
                                                <SVG src={toAbsoluteUrl('/images/svg/dollar.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.tipo_pago ?
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.tipo_pago.tipo}</div>
                                                : ''
                                        }
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE PAGO</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <i className="flaticon2-calendar-8 text-primary icon-lg"></i>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.created_at ?
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    {dayDMY(data.created_at)}
                                                </div>
                                                : ''
                                        }
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row-paddingless">
                            <div className="col-md-3">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Layout-top-panel-6.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.subarea ?
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.area.nombre}</div>
                                                : ''
                                        }
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">ÁREA</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-info">
                                                <SVG src={toAbsoluteUrl('/images/svg/Layout-right-panel-2.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.subarea ?
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.nombre}</div>
                                                : ''
                                        }
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">SUB-ÁREA</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="d-flex align-items-center mr-2">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Clip.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            data.adjunto ?
                                                <a rel="noopener noreferrer"  href={data.adjunto.url} target="_blank">
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.adjunto.name}</div>
                                                </a>
                                                :
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">SIN ADJUNTO</div>
                                        }
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">Adjunto</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}