import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { dayDMY } from '../../../functions/setters'
export default class ContratoCard extends Component {
    render() {
        const { contrato } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    contrato.nombre ?
                                        <p className="font-size-h3 mb-0">Nombre:&nbsp;<strong className="font-size-h4"> {contrato.nombre}</strong></p>
                                        : ''
                                }
                                {
                                    contrato.cliente ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">{contrato.tipo}:&nbsp;<strong className="font-size-h6"> {contrato.cliente.empresa} </strong></p>
                                        : contrato.proveedor ?
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">{contrato.tipo}:&nbsp;<strong className="font-size-h6"> {contrato.proveedor.razon_social} </strong></p>
                                            : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                contrato.empresa ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{contrato.empresa.name}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">EMPRESA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                contrato.monto ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    <NumberFormat
                                                        value={contrato.monto}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div>{value}</div>}
                                                    />
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">MONTO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                contrato.tipo_contrato ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Tools.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{contrato.tipo_contrato.tipo}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE CONTRATO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="row row-paddingless mb-4">
                            {
                                contrato.fecha_inicio ?
                                    <div className="col-md-4">
                                        <div className="d-flex justify-content-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-info icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(contrato.fecha_inicio)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA DE INICIO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                contrato.fecha_fin ?
                                    <div className="col-md-4">
                                        <div className="d-flex justify-content-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-primary icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(contrato.fecha_fin)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA DE FINAL</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            contrato.descripcion ?
                                <div className="mt-5">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                        <strong >Descripción: </strong>{contrato.descripcion}
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                </Card>
            </div>
        )
    }
}