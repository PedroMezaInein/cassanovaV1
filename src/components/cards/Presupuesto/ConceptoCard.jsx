import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
export default class ConceptoCard extends Component {
    render() {
        const { concepto } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-4">
                            <div className="mr-2">
                                {
                                    concepto.subpartida ?
                                        <>
                                            {
                                                concepto.subpartida.partida ?
                                                    <p className="font-size-h3 mb-0">PARTIDA:&nbsp;<strong className="font-size-h4">{concepto.subpartida.partida.nombre}</strong></p>
                                                    : ''
                                            }
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">SUBPARTIDA:&nbsp;<strong className="font-size-h6"> {concepto.subpartida.nombre} </strong></p>
                                        </>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                concepto.proveedor ?
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
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{concepto.proveedor.razon_social}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">PROVEEDOR</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                concepto.costo || concepto.costo === 0 ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
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
                                                        value={concepto.costo}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div>{value}</div>}
                                                    />
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">COSTO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                concepto.unidad ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/dollar.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{concepto.unidad.nombre}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">UNIDAD</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            concepto.descripcion ?
                                <div className="mt-5">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                        <strong >Descripción: </strong>{concepto.descripcion}
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