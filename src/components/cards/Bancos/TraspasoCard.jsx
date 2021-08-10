import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import NumberFormat from 'react-number-format'
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class TranspasoCard extends Component {
    render() {
        const { traspaso } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    traspaso.origen ?
                                        <p className="font-size-h3 mb-0">CUENTA ORIGEN:&nbsp;<strong className="font-size-h4"> {traspaso.origen.nombre}</strong> - NO.CUENTA: <strong className="font-size-h4"> {traspaso.origen.numero}</strong> </p>
                                        : ''
                                }
                                {
                                    traspaso.destino ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">CUENTA DESTINO:&nbsp;<strong className="font-size-h6"> {traspaso.destino.nombre}</strong> - NO.CUENTA: <strong className="font-size-h6"> {traspaso.destino.numero}</strong> </p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                traspaso.cantidad ?
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
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    <NumberFormat
                                                        value={traspaso.cantidad}
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
                                traspaso.user ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{traspaso.user.name}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">Usuario</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                traspaso.updated_at ?
                                    <div className="col-md-4">
                                        <div className="d-flex justify-content-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-primary icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(traspaso.updated_at)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            traspaso.adjunto ?
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-10">
                                        <ItemSlider items={[traspaso.adjunto]} item='' />
                                    </div>
                                </div>
                                : ''
                        }
                        {
                            traspaso.comentario ?
                                <div className="mt-4">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                        <strong >Comentario: </strong>{traspaso.comentario}
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