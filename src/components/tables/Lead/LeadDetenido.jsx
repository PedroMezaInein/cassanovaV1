import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'

class LeadDetenido extends Component {
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
        const { leads, onClickNext, onClickPrev, openModalWithInput, changeEstatus, changePageDetails, clickOneLead } = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr>
                                <th colSpan="7" className = 'text-gray p-2 text-center text-uppercase'>
                                    LEADS DETENIDOS
                                </th>
                            </tr>
                            <tr className="text-uppercase bg-light-gray text-gray">
                                <th style={{ minWidth: "174px" }}>
                                    <span>Nombre del cliente y proyecto</span>
                                </th>
                                <th style={{ minWidth: "120px" }} className="text-center">Fecha</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Fase</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
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
                                                <td className="pl-0 py-8 white-space-nowrap">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 mr-3">
                                                            <span className="symbol-label font-size-h5 bg-light-gray text-gray">
                                                                {lead.nombre.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-gray mb-1 font-size-lg cursor-pointer">
                                                                {lead.nombre}
                                                            </span>
                                                            <span className="text-muted font-weight-bold d-block">
                                                                {
                                                                    lead.prospecto.tipo_proyecto ?
                                                                        lead.prospecto.tipo_proyecto.tipo
                                                                        : ''
                                                                }
                                                            </span>
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
                                                                        lead.prospecto.contactos.length ?
                                                                            setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        lead.origen &&
                                                        <div className="w-max-content mx-auto">
                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                                {lead.origen.origen}
                                                            </span>
                                                        </div>
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        lead.empresa.isotipos.length > 0 ?
                                                            lead.empresa.isotipos.map((isotipo, key) => {
                                                                return (
                                                                    <OverlayTrigger rootClose key={key} overlay={<Tooltip>{lead.empresa.name}</Tooltip>}>
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
                                                <td>
                                                    <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                        {
                                                            lead.prospecto.vendedores.map((vendedor, index) => {
                                                                return (
                                                                    <OverlayTrigger rootClose key={index} overlay={<Tooltip>{vendedor.name}</Tooltip>}>
                                                                        <div className="symbol symbol-35 symbol-circle">
                                                                            <img alt="Pic" src={vendedor.avatar ? vendedor.avatar : "/default.jpg"} />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td className="text-center text-dark-75 font-weight-bold">
                                                    {
                                                        lead.prospecto ?
                                                            lead.prospecto.diseño ?
                                                                'Fase 1'
                                                            : lead.prospecto.obra ?
                                                                'Fase 2'
                                                            : ''
                                                        : ''
                                                    }
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        lead.estatus ?
                                                            <Dropdown>
                                                                <Dropdown.Toggle 
                                                                    style={
                                                                        {
                                                                            backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto, border: 'transparent', padding: '2.8px 5.6px',
                                                                            width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                            fontWeight: 500
                                                                        }
                                                                    }
                                                                >
                                                                    {lead.estatus.estatus.toUpperCase()}
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="p-0">
                                                                    <Dropdown.Header>
                                                                        <span className="font-size-sm">Elige una opción</span>
                                                                    </Dropdown.Header>
                                                                    <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); changeEstatus('En proceso', lead.id) }}>
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline label-light-info rounded-0 w-100">EN PROCESO</span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); openModalWithInput('Cancelado', lead.id) }} >
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline label-light-danger rounded-0 w-100">CANCELADO</span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); openModalWithInput('Rechazado', lead.id) }} >
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline label-light-danger rounded-0 w-100">RECHAZADO</span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        : ''
                                                    }
                                                </td>
                                                <td className="pr-0 text-center">
                                                    <OverlayTrigger rootClose overlay={<Tooltip>VER MÁS</Tooltip>}>
                                                        <span onClick={(e) => { changePageDetails(lead) }} className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-gray">
                                                            <i className="flaticon2-plus icon-nm"></i>
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
                                <span className="btn btn-icon btn-xs btn-light-gray mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-gray mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default LeadDetenido