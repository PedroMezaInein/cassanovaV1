import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class PrestamosCard extends Component {
    render() {
        const { prestamo } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    prestamo.empleado ?
                                        <p className="font-size-h3 mb-0">EMPLEADO:&nbsp;<strong className="font-size-h4"> {prestamo.empleado.nombre}</strong></p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-4"></div>
                        <div className="row row-paddingless mb-2">
                            {
                                prestamo.fecha ?
                                    <div className="col">
                                        <div className="d-flex justify-content-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-primary icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(prestamo.fecha)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                prestamo.monto ?
                                    <div className="col">
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
                                                        value={prestamo.monto}
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
                                prestamo.acumulado ?
                                    <div className="col">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    <NumberFormat
                                                        value={prestamo.acumulado}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div>{value}</div>}
                                                    />
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">Acumulado</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                prestamo.restante ?
                                    <div className="col">
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
                                                        value={prestamo.restante}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div>{value}</div>}
                                                    />
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">RESTANTE</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            prestamo.descripcion ?
                                <div className="mt-5">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                        <strong >Descripción: </strong>{prestamo.descripcion}
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                    {
                        prestamo.adjuntos ?
                            <div className="mt-2 d-flex justify-content-center">
                                <div className="col-md-6">
                                    <ItemSlider items={prestamo.adjuntos} item='' />
                                </div>
                            </div>
                            : ''
                    }
                </Card>
            </div>
        )
    }
}