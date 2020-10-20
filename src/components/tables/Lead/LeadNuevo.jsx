import React, { Component } from 'react'
import { OverlayTrigger, Tooltip} from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class LeadNuevo extends Component {
    isActiveButton(direction) {
        const { leads } = this.props
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) {
                    return true;
                }
            } else {
                if (leads.numPage < 10) {
                    if (leads.numPage < leads.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { leads, onClickPrev, onClickNext, sendEmail } = this.props
        return (
            <>
                <div className="tab-content">
                    <div className="table-responsive-lg">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr className="text-uppercase bg-info-o-30 text-info">
                                    <th className="pl-7">
                                        <span>Nombre del cliente</span>
                                    </th>
                                    <th>Empresa</th>
                                    <th>Servicios</th>
                                    <th className="text-center">Estatus</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.data.map((lead, key) => {
                                        return (
                                            <tr key={key}>
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 mr-3">
                                                            <span className="symbol-label font-size-h5 bg-info-o-20 text-info">{lead.nombre.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <a href={`mailto:+${lead.email}`} className="text-dark-75 font-weight-bolder text-hover-info mb-1 font-size-lg">{lead.nombre}</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="pl-0 py-8">
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{lead.empresa.name}</span>
                                                </td>
                                                <td className="pl-0 py-8">
                                                    {
                                                        lead.servicios.length > 0 ?
                                                            lead.servicios.map((servicio, key) => {
                                                                return (
                                                                    <div className="d-flex align-items-center" key={key}><span className="text-dark-75 font-weight-bolder d-block font-size-lg">{servicio.servicio}</span><br/></div>
                                                                )
                                                            })
                                                            : <span className="text-dark-75 font-weight-bolder d-block font-size-lg">Sin servicios</span>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    <span className="label label-md label-light-info label-inline font-weight-bold">EN ESPERA</span>
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
                                                            className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-info">
                                                            <span className="svg-icon svg-icon-md ">{/* svg-icon-primary */}
                                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                                            </span>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>AGENDAR LLAMADA</Tooltip>}>
                                                        <a href="#" className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-info">
                                                            <span className="svg-icon svg-icon-md">
                                                                <SVG src={toAbsoluteUrl('/images/svg/Active-call.svg')} />
                                                            </span>
                                                        </a>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>SEGUIMIENTO (SCRIPT)</Tooltip>}>
                                                        <a href="#" className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-info">
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
                                <span className="btn btn-icon btn-xs btn-light-info mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-info mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                </div >
            </>
        )
    }
}


export default LeadNuevo