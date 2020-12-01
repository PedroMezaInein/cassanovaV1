import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { setDateTableLG } from '../../../functions/setters'
import { questionAlert } from '../../../functions/alert'
class LeadRhProveedor extends Component {
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
    canSendFirstEmail = lead => {
        if (lead.prospecto) {
            if (lead.prospecto.contactos) {
                if (lead.prospecto.contactos.length) {
                    let aux = true
                    lead.prospecto.contactos.map((contacto) => {
                        if (contacto.comentario === 'SE ENVIÓ CORREO PARA SOLICITAR UNA PRIMERA LLAMADA.') {
                            aux = false
                        }
                    })
                    return aux
                }
                return true
            }
            return true
        }
        return true
    }
    render() {
        const { leads, onClickPrev, onClickNext, sendEmail } = this.props
        return (
            <>
                <div className="tab-content">
                    <div className="table-responsive-lg">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="7" className = 'text-pink p-2 text-center text-uppercase'>
                                        RRHH Y PROVEEDORES
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-pink text-pink">
                                    <th style={{ minWidth: "100px" }} className="pl-7">
                                        <span>Nombre</span>
                                    </th>
                                    <th style={{ minWidth: "140px" }}>Fecha</th>
                                    <th style={{ minWidth: "100px" }}>Tipo</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total === 0 ?
                                        <tr>
                                            <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                        </tr>
                                        :
                                        leads.data.map((lead, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 mr-3">
                                                                <span className="symbol-label font-size-h5 bg-light-pink text-pink">{lead.nombre.charAt(0)}</span>
                                                            </div>
                                                            <div>
                                                                <a href={`mailto:+${lead.email}`} className="text-dark-75 font-weight-bolder text-hover-pink mb-1 font-size-lg">{lead.nombre}</a>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                    </td>
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                            {
                                                                lead.proveedor ? 'PROVEEDOR' :
                                                                    lead.rh ? 'BOLSA DE TRABAJO' : ''
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            lead.empresa.isotipos.length > 0 ?
                                                                lead.empresa.isotipos.map((isotipo, key) => {
                                                                    return (
                                                                        <OverlayTrigger key={key} overlay={<Tooltip>{lead.empresa.name}</Tooltip>}>
                                                                            <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                                                <div className="symbol symbol-40 symbol-circle">
                                                                                    <img alt="Pic" src={isotipo.url} />
                                                                                </div>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                    )
                                                                })
                                                                : <span className="text-dark-75 font-weight-bolder">{lead.empresa.name}</span>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className = { leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between" } >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm">
                                    Página { parseInt(leads.numPage) + 1} de { leads.total_paginas }
                                </div>
                            : ''
                        }
                        <div>
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
                    </div>
                </div >
            </>
        )
    }
}

export default LeadRhProveedor