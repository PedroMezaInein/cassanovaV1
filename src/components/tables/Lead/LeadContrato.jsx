import React, { Component } from 'react'
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'
import { questionAlert } from '../../../functions/alert'

class LeadContrato extends Component {
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

    hasProyecto = lead => {
        if(lead)
            if(lead.prospecto)
                if(lead.prospecto.proyecto)
                    return true
        return false
    }

    render() {
        const { leads, onClickPrev, onClickNext, changePageDetails, clickOneLead, openModalSee, changePageEditProyecto, changeContinuidadLead } = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr>
                                <th colSpan="7" className = 'text-green p-2 text-center text-uppercase'>
                                    LEADS CONTRATADOS
                                </th>
                            </tr>
                            <tr className="text-uppercase bg-light-green text-green">
                                <th style={{ minWidth: "100px" }}>
                                    <span>Nombre del cliente y proyecto</span>
                                </th>
                                <th style={{ minWidth: "120px" }}>Fecha</th>
                                <th style={{ minWidth: "100px" }}>Origen</th>
                                <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Fase</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                <th style={{ minWidth: "175px" }} className="text-center">Continuidad</th>
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
                                                        <div className="symbol symbol-45 symbol-light-success mr-3">
                                                            <span className="symbol-label font-size-h5">{lead.nombre.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg cursor-pointer">{lead.nombre}</span>
                                                            {
                                                                this.hasProyecto(lead) ?
                                                                    <a href = {`/proyectos/proyectos?id=${lead.prospecto.proyecto.id}`}>
                                                                        <span className="text-muted font-weight-bolder text-hover-primary d-block">
                                                                            { lead.prospecto.proyecto.nombre }
                                                                        </span>
                                                                    </a>
                                                                :
                                                                    <span className="text-muted font-weight-bold d-block">
                                                                        {
                                                                            lead.prospecto.tipo_proyecto ?
                                                                                lead.prospecto.tipo_proyecto.tipo
                                                                            : ''
                                                                        }
                                                                    </span>
                                                            }
                                                            
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="font-size-lg text-left font-weight-bolder">
                                                    <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                    <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">
                                                        {setDateTableLG(lead.prospecto.contactos[0].created_at)}
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
                                                <td>
                                                    <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                        {
                                                            lead.prospecto.vendedores.map((vendedor, index) => {
                                                                return (
                                                                    <OverlayTrigger key={index} overlay={<Tooltip>{vendedor.name}</Tooltip>}>
                                                                        <div className="symbol symbol-35 symbol-circle">
                                                                            <img alt="Pic" src={vendedor.avatar ? vendedor.avatar : "/default.jpg"} />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td className="text-center">
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
                                                    <span className="label label-md label-light-success label-inline font-weight-bold" style={{fontSize: '10.7px'}}>CONTRATADO</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className = { `text-hover label label-md label-inline font-weight-bold ${lead.prospecto.continuidad === 0 ? 'label-light-danger' : 'label-light-info'}` } 
                                                        style={{fontSize: '10.7px'}}
                                                        onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'CAMBIARÁS LA CONTINUIDAD DEL LEAD', () => changeContinuidadLead(lead)) }} >
                                                        {
                                                            lead.prospecto.continuidad ? 'Contratar otra fase' : 'Terminado'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="pr-0 text-center">
                                                    <div className = 'dropdown-container dropdown-container__success'>
                                                        <DropdownButton menualign="right" title={<i className="fas fa-chevron-down icon-nm p-0"></i>}
                                                            id = 'dropdown-button-drop-left__success'>
                                                            <Dropdown.Item className="text-hover-success dropdown-success" 
                                                                onClick={(e) => { changePageDetails(lead) }}  >
                                                                <span className="navi-icon">
                                                                    <i className="flaticon2-plus pr-3 text"></i>
                                                                </span>
                                                                <span className="navi-text align-self-center">VER MÁS</span>
                                                            </Dropdown.Item>
                                                            {
                                                                this.hasProyecto(lead) &&
                                                                    <Dropdown.Item className="text-hover-success dropdown-success" 
                                                                        onClick={(e) => { openModalSee(lead.prospecto.proyecto) }}  >
                                                                        <span className="navi-icon">
                                                                            <i className="far fa-eye pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">VER PROYECTO</span>
                                                                    </Dropdown.Item>
                                                            }
                                                            {
                                                                this.hasProyecto(lead) &&
                                                                    <Dropdown.Item className = 'text-hover-success dropdown-success'
                                                                        onClick = { (e) => { changePageEditProyecto(lead.prospecto.proyecto) } }>
                                                                        <span className="navi-icon">
                                                                            <i className="flaticon-edit-1 pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">EDITAR PROYECTO</span>
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
                                <span className="btn btn-icon btn-xs btn-light-success mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-success mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default LeadContrato