import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
// import { ItemSlider } from '../../../components/singles'
export default class EmpresaCard extends Component {
    // setAdjuntosLogos = () => {
    //     const { empresa } = this.props
    //     let aux = [];
    //     empresa.isotipos.map((isotipo) => {
    //         aux.push({
    //             name: isotipo.name,
    //             url: isotipo.url
    //         })
    //         return false
    //     })
    //     empresa.letras.map((letra) => {
    //         aux.push({
    //             name: letra.name,
    //             url: letra.url
    //         })
    //         return false
    //     })
    //     empresa.logos.map((logo) => {
    //         aux.push({
    //             name: logo.name,
    //             url: logo.url
    //         })
    //         return false
    //     })
    //     empresa.logos_blanco.map((logo_blanco) => {
    //         aux.push({
    //             name: logo_blanco.name,
    //             url: logo_blanco.url
    //         })
    //         return false
    //     })
    //     return aux
    // }
    render() {
        const { empresa } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    empresa.name ?
                                            <p className="font-size-h3 mb-0">EMPRESA:&nbsp;<strong className="font-size-h4"> {empresa.name}</strong></p>
                                        : ''
                                }
                                {
                                    empresa.razon_social ?
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">RAZÓN SOCIAL:&nbsp;<strong className="font-size-h6"> {empresa.razon_social} </strong></p>
                                        : ''
                                }
                            </div>
                            {
                                empresa.rfc ?
                                    <div>
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{empresa.rfc}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">RFC</div>
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