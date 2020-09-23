import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
export default class UsuariosCard extends Component {
    render() {
        const { user } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    user.empleado ?
                                            <p className="font-size-h3 mb-0">Empleado:&nbsp;<strong className="font-size-h4"> {user.empleado.nombre}</strong></p>
                                        : ''
                                }
                                {
                                    user.name ?
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">Usuario:&nbsp;<strong className="font-size-h6"> {user.name} </strong></p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                user.email ?
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Mail-notification.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{user.email}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">CORREO ELECTRÓNICO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                user.tipo ?
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{user.tipo === 1 ? 'Administrador' : user.tipo === 2 ? 'Empleado' : user.tipo === 3 ? 'Cliente' : ''}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE USUARIO</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="row row-paddingless mb-4">
                            {
                                user.departamentos ?
                                    <div className="col-md-12">
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Interselect.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-justify">
                                                <ul className="list-inline mb-0 font-size-lg text-dark-75 font-weight-bolder">
                                                    {
                                                        user.departamentos ?
                                                            user.departamentos.map((departamento, key) => {
                                                                return (
                                                                    <li className="list-inline-item" key={key}>&#8226; {departamento.nombre}</li>
                                                                )
                                                            })
                                                            : <span>-</span>
                                                    }
                                                </ul>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">DEPARTAMENTO(S) </div>
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