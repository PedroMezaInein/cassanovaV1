import React, { Component } from 'react'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
import { ItemSlider } from '../../../components/singles'
export default class ImssCard extends Component {
    render() {
        const { imss } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    imss.empresa ?
                                        <p className="font-size-h3 mb-0">EMPRESA:&nbsp;<strong className="font-size-h4"> {imss.empresa.name}</strong></p>
                                        : ''
                                }
                            </div>
                            {
                                imss.created_at ?
                                    <div className="d-flex justify-content-end mr-2">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder"><Moment format="DD/MM/YYYY">{imss.created_at}</Moment></div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="separator separator-solid mb-4"></div>
                    </div>
                    {
                        imss.adjuntos ?
                            <div className="mt-2 d-flex justify-content-center">
                                <div className="col-md-8">
                                    <ItemSlider items={imss.adjuntos} item='' />
                                </div>
                            </div>
                            : ''
                    }
                </Card>
            </div>
        )
    }
}