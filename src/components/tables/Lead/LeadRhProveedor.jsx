import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'
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
                        return ''
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
        const { leads, onClickPrev, onClickNext, openModalFormRRHHP, options, changeOrigen,openModalEditarRRHHP, clickOneLead} = this.props
        return (
            <>
                <div className="d-flex justify-content-end">
                    <span className="btn btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success" onClick = { openModalFormRRHHP } >
                        <i className="fas fa-user-plus text-pink mb-1"></i> Nuevo
                    </span>
                </div>
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="7" className = 'text-pink p-2 text-center text-uppercase'>
                                        RRHH Y PROVEEDORES
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-pink text-pink">
                                    <th style={{ minWidth: "206px" }}>
                                        <span>Nombre</span>
                                    </th>
                                    <th style={{ minWidth: "180px" }} className="text-center">Fecha</th>
                                    <th style={{ minWidth: "152px" }} className="text-center">Tipo</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Empresa</th>
                                    <th style={{ minWidth: "150px" }} className="text-center">Origen</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Comentario</th>
                                    <th></th>
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
                                                    <td className="pl-0 py-8 white-space-nowrap">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 mr-3">
                                                                <span className="symbol-label font-size-h5 bg-light-pink text-pink">{lead.nombre.charAt(0)}</span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-pink mb-1 font-size-lg cursor-pointer">{lead.nombre}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <div className="w-max-content mx-auto">
                                                            <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                            {
                                                                lead.fecha_cancelacion_rechazo !== null &&
                                                                <>
                                                                    <span>{lead.rechazado? 'Rechazo':'Cancelado'}: </span>
                                                                    <span className="text-muted font-weight-bold font-size-sm">
                                                                        { setDateTableLG(lead.fecha_cancelacion_rechazo) }
                                                                    </span>
                                                                </>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="w-max-content mx-auto">
                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">
                                                                {
                                                                    lead.proveedor ? 'PROVEEDOR' :
                                                                        lead.rh ? 'BOLSA DE TRABAJO' : ''
                                                                }
                                                            </span>
                                                        </div>
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
                                                    <td className="text-center">
                                                            <div className="text-dark-75 font-weight-bolder font-size-lg">
                                                                {
                                                                    lead.origen ?
                                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                                            <Dropdown>
                                                                                <Dropdown.Toggle
                                                                                    style={
                                                                                        {
                                                                                            backgroundColor: '#F3F6F9', color: '#80808F', border: 'transparent', padding: '2.8px 5.6px',
                                                                                            width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '11.5px',
                                                                                            fontWeight: 500
                                                                                        }
                                                                                    }
                                                                                >
                                                                                    {lead.origen.origen.toUpperCase()}
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu className="p-0">
                                                                                    <Dropdown.Header>
                                                                                        <span className="font-size-sm">Elige una opción</span>
                                                                                    </Dropdown.Header>
                                                                                    {
                                                                                        options.origenes.map((origen, key) => {
                                                                                            return (
                                                                                                <div key={key}>
                                                                                                    <Dropdown.Item className="p-0" key={key} onClick={() => { changeOrigen(origen.value, lead.id) }} >
                                                                                                        <span className="navi-link w-100">
                                                                                                            <span className="navi-text">
                                                                                                                <span className="label label-xl label-inline  text-gray rounded-0 w-100 font-weight-bolder">
                                                                                                                    {origen.text}
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </Dropdown.Item>
                                                                                                    <Dropdown.Divider className="m-0" style={{ borderTop: '1px solid #fff' }} />
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </span>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </td>
                                                    <td className="text-justify">
                                                        <span className="text-muted font-weight-bold font-size-sm">
                                                            {lead.comentario}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                    <OverlayTrigger overlay={<Tooltip>EDITAR INFORMACIÓN GENERAL</Tooltip>}>
                                                        <span onClick={(e) => { openModalEditarRRHHP(lead) }}className="btn btn-default btn-icon btn-sm">
                                                            <i className="fas fa-edit icon-md"></i>
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