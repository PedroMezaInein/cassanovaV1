import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import Moment from 'react-moment'
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { ItemSlider } from '../../../components/singles'
export default class EstadoCuentaCard extends Component {
    render() {
        const { estado } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    estado.cuenta ?
                                        <p className="font-size-h3 mb-0">CUENTA:&nbsp;<strong className="font-size-h4"> {estado.cuenta.nombre}</strong></p>
                                        : ''
                                }
                                {
                                    estado.cuenta ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">NO. CUENTA:&nbsp;<strong className="font-size-h6"> {estado.cuenta.numero}</strong> </p>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                estado.created_at ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder"><Moment format="DD/MM/YYYY">{estado.created_at}</Moment></div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                estado.id ?
                                    <div className="col">
                                        <div className="d-flex justify-content-center mr-2">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{estado.id}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">ID</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            estado.adjunto ?
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-6">
                                        <ItemSlider items={[estado.adjunto]} item='' />
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