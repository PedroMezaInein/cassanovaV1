import React, { Component } from 'react'
import { DropdownButton, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'
import { questionAlert } from '../../../functions/alert'
import { Modal } from '../../singles'
import { PresupuestoGenerado } from '../../forms'

class LeadNoContratado extends Component {

    state = {
        modal: {
            presupuesto: false
        },
        lead: ''
    }

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

    getMoveStatus = (lead) => {
        if(lead.presupuesto_diseño)
            return 'En negociación'
        if(lead.prospecto)
            if(lead.prospecto.tipo_proyecto)
                return 'En proceso'
        return 'En proceso'
    }

    hasContactos = (lead) => {
        if(lead)
            if(lead.prospecto)
                if(lead.prospecto.contactos)
                    if(lead.prospecto.contactos.length)
                        return true
        return false
    }

    hasPresupuesto= lead => {
        if(lead)
            if(lead.presupuesto_diseño)
                if(lead.presupuesto_diseño.pdfs)
                    if(lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }

    openModalPresupuesto = lead => {
        const { modal } = this.state
        modal.presupuesto = true
        this.setState({
            ...this.state,
            modal,
            lead: lead
        })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.presupuesto = false
        this.setState({
            ...this.state,
            modal,
            lead: ''
        })
    }

    render() {
        const { leads, onClickNext, onClickPrev, changePageDetails, changeEstatus, openModalHistorial, clickOneLead } = this.props
        const { modal, lead } = this.state
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr>
                                <th colSpan="7" className = 'text-danger p-2 text-center text-uppercase'>
                                    LEADS CANCELADOS/RECHAZADOS
                                </th>
                            </tr>
                            <tr className="text-uppercase bg-danger-o-30 text-danger">
                                <th style={{ minWidth: "100px" }}>
                                    <span>Nombre del cliente</span>
                                </th>
                                <th style={{ minWidth: "140px" }}>Fecha</th>
                                <th style={{ minWidth: "100px" }}>Origen</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Motivo</th>
                                <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
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
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 symbol-light-danger mr-3">
                                                            <span className="symbol-label font-size-h5">
                                                                {lead.nombre.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-danger mb-1 font-size-lg cursor-pointer">
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
                                                    <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                    {
                                                        lead.prospecto ?
                                                            lead.prospecto.contactos ?
                                                                lead.prospecto.contactos.length > 0 ?
                                                                    <>
                                                                        <span>Último contacto: </span>
                                                                        <span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.prospecto.contactos[0].created_at)}</span><br />
                                                                    </>
                                                                : ''
                                                            : ''
                                                        : ''
                                                    }
                                                    <span>{lead.rechazado? 'Rechazo':'Cancelado'}: </span><span className="text-muted font-weight-bold font-size-sm">
                                                        { setDateTableLG(lead.fecha_cancelacion_rechazo) }
                                                    </span>
                                                </td>
                                                <td>
                                                    {
                                                        lead.origen ?
                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                                {lead.origen.origen}
                                                            </span>
                                                            : ''
                                                    }
                                                </td>
                                                <td className="text-justify">
                                                    <span className="text-muted font-weight-bold font-size-sm">
                                                        { lead.motivos ? lead.motivos.motivo : lead.motivo }
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
                                                <td className="text-center">
                                                    {
                                                        lead.estatus ?
                                                            <span className="label label-md label-light-danger label-inline font-weight-bold" style={{fontSize: '10.7px'}}>{lead.estatus.estatus.toUpperCase()}</span>
                                                            : ''
                                                    }
                                                </td>
                                                <td className="pr-0 text-center">
                                                    {/* Icon */}
                                                    <div className="dropdown-container dropdown-container__danger">
                                                        <DropdownButton menualign = "right" title = { <i className="fas fa-chevron-down icon-nm p-0"></i> }
                                                            /* id = 'dropdown-button-drop-left-danger' */ >
                                                            <Dropdown.Item className = "text-hover-danger dropdown-danger" onClick={(e) => { changePageDetails(lead) }} >
                                                                <span className="navi-icon">
                                                                    <i className="flaticon2-plus pr-3 text"></i>
                                                                </span>
                                                                <span className="navi-text align-self-center">VER MÁS</span>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className = "text-hover-danger dropdown-danger" 
                                                                onClick={(e) => { 
                                                                    questionAlert(
                                                                        '¿ESTÁS SEGURO?', 
                                                                        `MOVERÁS AL LEAD ${lead.nombre} AL ESTATUS ${this.getMoveStatus(lead)}`,
                                                                        () => changeEstatus({
                                                                            id: lead.id,
                                                                            estatus: this.getMoveStatus(lead)
                                                                        })
                                                                    ) 
                                                                }}>
                                                                <span className="navi-icon">
                                                                    <i className="far fa-play-circle pr-3 text"></i>
                                                                </span>
                                                                <span className="navi-text align-self-center">REACTIVAR</span>
                                                            </Dropdown.Item>
                                                            {
                                                                this.hasContactos(lead) &&
                                                                    <Dropdown.Item className = "text-hover-danger dropdown-danger" 
                                                                        onClick={(e) => { openModalHistorial(lead) }}>
                                                                        <span className="navi-icon">
                                                                            <i className="far fa-list-alt pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">Historial de contacto</span>
                                                                    </Dropdown.Item>
                                                            }
                                                            {
                                                                this.hasPresupuesto(lead) &&
                                                                    <Dropdown.Item className = "text-hover-danger dropdown-danger" 
                                                                        onClick={(e) => { this.openModalPresupuesto(lead) }}>
                                                                        <span className="navi-icon">
                                                                            <i className="fas fa-file-invoice-dollar pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">Presupuesto de diseño</span>
                                                                    </Dropdown.Item>
                                                            }
                                                        </DropdownButton>
                                                    </div>
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
                <Modal show = { modal.presupuesto } handleClose = { this.handleClose } title = 'Presupuesto generados'>
                    {
                        lead ?
                            lead.presupuesto_diseño ?
                                lead.presupuesto_diseño.pdfs ?
                                    lead.presupuesto_diseño.pdfs.length ?
                                        <PresupuestoGenerado pdfs={lead.presupuesto_diseño.pdfs} />
                                        : ''
                                    : ''
                                : ''
                            : ''
                    }
                </Modal>
            </div>
        )
    }
}
export default LeadNoContratado