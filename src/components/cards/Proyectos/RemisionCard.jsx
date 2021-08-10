import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import ItemSlider from '../../singles/ItemSlider';
import { dayDMY } from '../../../functions/setters'
export default class RemisionCard extends Component {
    render() {
        const { data, children, border} = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className={border}>
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-4">
                            <div className="mr-2">
                                <p className="font-size-h3 mb-0"><strong className="font-size-h4">REMISIÓN</strong></p>
                                {
                                    data.proyecto ?
                                        <p className="font-size-h5 text-muted font-size-lg mt-0">Proyecto:&nbsp;<strong className="font-size-h6"> {data.proyecto.nombre} </strong></p>
                                    : <></>
                                }
                            </div>
                            {children}
                        </div>
                        <div className="separator separator-solid mb-4"></div>
                        <div className="row row-paddingless mb-4">
                            {
                                data.created_at ?
                                    <div className="col-md-4">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <i className="flaticon2-calendar-8 text-info icon-lg"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{dayDMY(data.created_at)}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                            {
                                data.subarea ?
                                    <>
                                        {
                                            data.subarea.area ?
                                                <div className="col-md-4">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                            <div className="symbol-label">
                                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Layout-top-panel-6.svg')} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.area.nombre}</div>
                                                            <div className="font-size-sm text-muted font-weight-bold mt-1">ÁREA</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-info">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Folder-cloud.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.nombre}</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">SUBÁREA </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    : ''
                            }
                        </div>
                        {
                            ( data.descripcion !== "null" && data.descripcion !== null ) ?
                            <div className="mt-5">
                                <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4 text-justify">
                                    <strong >Descripción: </strong> {data.descripcion}
                                </div>
                            </div>
                            :''
                        }
                        
                        {
                            data.adjunto ?
                            <>
                                <div className="separator separator-dashed my-8"></div>
                                <div className="w-80 mx-auto">
                                    <ItemSlider items = { [data.adjunto] } />
                                </div>
                            </>
                            :''
                        }
                        
                    </div>
                </Card>
            </div>
        )
    }
}