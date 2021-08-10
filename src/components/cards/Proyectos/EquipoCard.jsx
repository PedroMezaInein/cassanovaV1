import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import ItemSlider from '../../singles/ItemSlider';
export default class SolicitudCompraCard extends Component {
    render() {
        const { equipo } = this.props
        return (
            <Card className="card card-without-box-shadown border-0">
                <div>
                    <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-4">
                        <div className="mr-2">
                            {
                                equipo.proveedor ?
                                    <p className="font-size-h4 mb-0">Proveedor:&nbsp;<strong className="font-size-h5"> {equipo.proveedor.razon_social}</strong></p>
                                    : <></>
                            }
                            {
                                equipo.partida ?
                                    <p className="font-size-h5 text-muted font-size-lg mt-0">Partida:&nbsp;<strong className="font-size-h6"> {equipo.partida.nombre} </strong></p>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className="separator separator-solid mb-4"></div>
                    <div className="row row-paddingless mb-4 d-flex justify-content-between">
                        {
                            equipo.equipo ?
                                <div className="col-md-auto align-self-center mb-3">
                                    <div className="d-flex justify-content-start align-items-center mr-2">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <i className="flaticon2-calendar-8 text-info icon-lg"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{equipo.equipo}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Equipo</div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }
                        {
                            equipo.modelo ?
                                <div className="col-md-auto align-self-center mb-3">
                                    <div className="d-flex align-items-center mr-2">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{equipo.modelo}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Modelo </div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }
                        {
                            equipo.marca ?
                                <div className="col-md-auto align-self-center">
                                    <div className="d-flex align-items-center mr-2">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{equipo.marca}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Marca </div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                    {
                        equipo.observaciones ?
                            <div className="mt-5">
                                <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                    <strong >Descripción: </strong>{equipo.observaciones}
                                </div>
                            </div>
                            : ''
                    }
                    {
                        equipo.ficha_tecnica ?
                            <>
                                <div className="separator separator-dashed my-8"></div>
                                <div className="w-80 mx-auto">
                                    <ItemSlider  items={[{ url: equipo.ficha_tecnica, name: 'ficha_tecnica.pdf' }]}/>
                                </div>
                            </>
                        :''
                    }
                </div>
            </Card>
        )
    }
}