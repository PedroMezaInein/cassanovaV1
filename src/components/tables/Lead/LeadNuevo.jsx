import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton, Button } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class LeadNuevo extends Component {
    isActiveButton(direction) {
        const { lead_web } = this.props
        if (lead_web.total_paginas > 1) {
            if (direction === 'prev') {
                if (lead_web.numPage > 0) {
                    return true;
                }
            } else {
                if (lead_web.numPage < 10) {
                    if (lead_web.numPage < lead_web.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { lead_web, onClickPrev, onClickNext, sendEmail } = this.props
        console.log(lead_web.data, 'lead_web.data')
        return (
            <>
                <div className="tab-content">
                    <div className="table-responsive-lg">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr className="text-uppercase bg-light-pink text-pink">
                                    <th style={{ minWidth: "231px" }} className="pl-7">
                                        <span>Nombre del cliente y proyecto</span>
                                    </th>
                                    <th style={{ minWidth: "100px" }}>Empresa</th>
                                    <th style={{ minWidth: "100px" }} >Servicios</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                    <th style={{ minWidth: "80px" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lead_web.data.map((lead, key) => {
                                        return (
                                            <tr key={key}>
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 mr-3">
                                                            <span className="symbol-label font-size-h5 bg-light-pink text-pink">{lead.nombre.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <a href={`mailto:+${lead.email}`} className="text-dark-75 font-weight-bolder text-hover-pink mb-1 font-size-lg">{lead.nombre}</a>
                                                            {/* <span className="text-muted font-weight-bold d-block">Proyecto X</span> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="d-flex justify-content-start">
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{lead.empresa.name}</span>
                                                </td>
                                                <td>
                                                    {
                                                        lead.servicios.length > 0 ?
                                                            lead.servicios.map((servicio, key) => {
                                                                return (
                                                                    <div key={key}><span className="text-dark-75 font-weight-bolder d-block font-size-lg">{servicio.servicio}</span><br/></div>
                                                                )
                                                            })
                                                            : <span className="text-dark-75 font-weight-bolder d-block font-size-lg">Sin servicios</span>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <span className="label label-md label-light-primary label-inline font-weight-bold">EN ESPERA</span>
                                                </td>
                                                <td className="pr-0 text-right">
                                                    {/* <OverlayTrigger overlay={<Tooltip>Enviar correo</Tooltip>}>
                                                        <a href='/leads/crm/info/info' className="btn btn-default btn-icon btn-sm mr-2">
                                                            <i className="flaticon2-plus icon-nm"></i>
                                                        </a>
                                                        </OverlayTrigger> 
                                                    */}
                                                    <OverlayTrigger overlay={<Tooltip>ENVIAR CORREO</Tooltip>}>
                                                        <span onClick = { (e) => { sendEmail(lead) } }
                                                            className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                                            <span className="svg-icon svg-icon-md ">{/* svg-icon-primary */}
                                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                                            </span>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>AGENDAR LLAMADA</Tooltip>}>
                                                        <a href="#" className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                                            <span className="svg-icon svg-icon-md">
                                                                <SVG src={toAbsoluteUrl('/images/svg/Active-call.svg')} />
                                                            </span>
                                                        </a>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>SEGUIMIENTO (SCRIPT)</Tooltip>}>
                                                        <a href="#" className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                                            <span className="svg-icon svg-icon-md">
                                                                <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                            </span>
                                                        </a>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-end">
                        {
                            this.isActiveButton('prev') ?
                                <span className="btn btn-icon btn-xs btn-light-pink mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-pink mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                </div >
            </>
        )
    }
}


export default LeadNuevo