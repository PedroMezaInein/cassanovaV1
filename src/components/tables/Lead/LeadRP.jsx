import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'

class LeadRP extends Component {
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
        const { leads, onClickNext, onClickPrev, openModalHistorial, openModalEditar, clickOneLead} = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr>
                                <th colSpan="7" className = 'text-orange p-2 text-center text-uppercase'>
                                    LEADS RELACIONES PÚBLICAS
                                </th>
                            </tr>
                            <tr className="text-uppercase bg-light-orange text-orange">
                                <th style={{ minWidth: "100px" }}>
                                    <span>Nombre del cliente</span>
                                </th>
                                <th style={{ minWidth: "140px" }} className="text-center">Fecha</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                {/* <th style={{ minWidth: "100px" }} className="text-center">Motivo</th> */}
                                <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
                                {/* <th style={{ minWidth: "100px" }} className="text-center">Estatus</th> */}
                                <th style={{ minWidth: "70px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leads.total === 0 ?
                                    <tr>
                                        <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                    </tr>
                                    :
                                    leads.data.map((lead, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 mr-3">
                                                            <span className="symbol-label font-size-h5 text-orange bg-light-orange">
                                                                {lead.nombre.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-orange mb-1 font-size-lg cursor-pointer">
                                                                {lead.nombre}
                                                            </span>
                                                            {
                                                                lead.prospecto ?
                                                                    lead.prospecto.tipo_proyecto ?
                                                                        <span className="text-muted font-weight-bold d-block">{lead.prospecto.tipo_proyecto.tipo}</span>
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-size-lg text-left font-weight-bolder">
                                                    <div className="w-max-content mx-auto">
                                                        <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                        <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">
                                                            {
                                                                lead.prospecto ?
                                                                    lead.prospecto.contactos ?
                                                                        lead.prospecto.contactos.length > 0 ?
                                                                            setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                            : ''
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {
                                                        lead.origen &&
                                                        <div className="w-max-content mx-auto">
                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                                {lead.origen.origen}
                                                            </span>
                                                        </div>
                                                    }
                                                </td>
                                                {/* <td className="text-justify">
                                                    <span className="text-muted font-weight-bold font-size-sm">
                                                        {lead.motivo}
                                                    </span>
                                                </td> */}
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
                                                {/* <td className="text-center">
                                                    {
                                                        lead.estatus ?
                                                            <span className="label label-md label-light-danger label-inline font-weight-bold" style={{fontSize: '10.7px'}}>{lead.estatus.estatus.toUpperCase()}</span>
                                                            : ''
                                                    }
                                                </td> */}
                                                <td className="pr-0 text-center">
                                                    <OverlayTrigger overlay={<Tooltip>EDITAR INFORMACIÓN GENERAL</Tooltip>}>
                                                        <span onClick={(e) => { openModalEditar(lead) }}
                                                            className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-orange">
                                                            <i className="fas fa-edit icon-md"></i>
                                                        </span>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger overlay={<Tooltip>HSITORIAL DE CONTACTO</Tooltip>}>
                                                        <span onClick={(e) => { openModalHistorial(lead) }} className="btn btn-default btn-icon btn-sm btn-hover-text-orange">
                                                            <i className="fas fa-clipboard-list icon-md"></i>
                                                        </span>
                                                    </OverlayTrigger>
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
                                <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default LeadRP