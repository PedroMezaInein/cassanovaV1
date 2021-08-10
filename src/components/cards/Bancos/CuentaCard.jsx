import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import NumberFormat from 'react-number-format'
import { dayDMY } from '../../../functions/setters'
export default class CuentaCard extends Component {
    render() {
        const { cuenta } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-3">
                            <div className="mr-2">
                                {
                                    cuenta.nombre ?
                                        <p className="font-size-h3 mb-0">NOMBRE DE LA CUENTA:&nbsp;<strong className="font-size-h4"> {cuenta.nombre}</strong></p>
                                        : ''
                                }
                                {
                                    cuenta.numero ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">NÚMERO DE CUENTA:&nbsp;<strong className="font-size-h6"> {cuenta.numero}</strong> </p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                cuenta.created_at ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-primary icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(cuenta.created_at)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cuenta.banco ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Credit-card.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cuenta.banco.nombre}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">BANCO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cuenta.tipo ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cuenta.tipo.tipo}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="row row-paddingless">
                            {
                                cuenta.estatus ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cuenta.estatus.estatus}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">ESTATUS</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cuenta.empresa_principal ?
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
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{cuenta.empresa_principal.name}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">EMPRESA PRINCIPAL</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                cuenta.balance ?
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
                                                        value={cuenta.balance}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        renderText={value => <div>{value}</div>}
                                                    />
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">Balance</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            cuenta.empresa?
                                cuenta.empresa.length > 0?
                                    <div className="row row-paddingless my-4">
                                        <div className="col-md-12">
                                            <div className="d-flex align-items-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-justify">
                                                    <ul className="list-inline mb-0 font-size-lg text-dark-75 font-weight-bolder">
                                                        {
                                                            cuenta.empresa ?
                                                                cuenta.empresa.map((empresa, key) => {
                                                                    return (
                                                                        <li className="list-inline-item" key={key}>&#8226; {empresa.name}</li>
                                                                    )
                                                                })
                                                                : <span>-</span>
                                                        }
                                                    </ul>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">EMPRESA(S) </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : ''
                            : ''
                        }
                        {
                            cuenta.usuarios?
                                cuenta.usuarios.length > 0?
                                    <div className="row row-paddingless my-4">
                                        <div className="col-md-12">
                                            <div className="d-flex align-items-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Group.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-justify">
                                                    <ul className="list-inline mb-0 font-size-lg text-dark-75 font-weight-bolder">
                                                        {
                                                            cuenta.usuarios ?
                                                                cuenta.usuarios.map((usuario, key) => {
                                                                    return (
                                                                        <li className="list-inline-item" key={key}>&#8226; {usuario.name}</li>
                                                                    )
                                                                })
                                                                : <span>-</span>
                                                        }
                                                    </ul>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Usuario(S) </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : ''
                            : ''
                        }
                        {
                            cuenta.descripcion ?
                                <div className="mt-4">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                        <strong >Descripción: </strong>{cuenta.descripcion}
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