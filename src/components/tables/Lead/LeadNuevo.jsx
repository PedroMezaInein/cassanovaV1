import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'
import { questionAlert } from '../../../functions/alert'
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
        const { leads, onClickPrev, onClickNext, sendEmail, openModalWithInput, openModalEditar, changePageLlamadaSalida, options, changeOrigen, openModalHistorial,
            deleteDuplicado, moveToRelacionesPublicas, openModal, clickOneLead} = this.props
        return (
            <>
                <div className="tab-content">
                    <div className="table-responsive-lg">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="7" className='text-info p-2 text-center text-uppercase'>
                                        LEADS DE PÁGINA WEB
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-info-o-30 text-info">
                                    <th style={{ minWidth: "100px" }}>
                                        <span>Nombre del cliente</span>
                                    </th>
                                    <th style={{ minWidth: "140px" }} className="text-center">Fecha</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Servicios</th>
                                    <th style={{ minWidth: "95px" }} className="text-center">Empresa</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total ?
                                        leads.total === 0 ?
                                            <tr>
                                                <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                            </tr>
                                            :
                                            leads.data.map((lead, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td className="pl-0 py-8 white-space-nowrap">
                                                            <div className="d-flex align-items-center ">
                                                                <div className="symbol symbol-45 mr-3">
                                                                    <span className="symbol-label font-size-h5 bg-info-o-20 text-info">{lead.nombre.charAt(0)}</span>
                                                                </div>
                                                                <div>
                                                                    <span onClick = { ( e ) => { e.preventDefault(); clickOneLead(lead.id) } } className="text-dark-75 font-weight-bolder text-hover-info mb-1 font-size-lg cursor-pointer">{lead.nombre}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="font-size-lg text-center font-weight-bolder">
                                                            <div className="w-max-content mx-auto">
                                                                <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="w-max-content mx-auto">
                                                                <ul className="list-unstyled">
                                                                    {
                                                                        lead.servicios.length > 0 ?
                                                                            lead.servicios.map((servicio, key) => {
                                                                                return (
                                                                                    <li key={key} className="text-dark-75 font-weight-bolder">{servicio.servicio}</li>
                                                                                )
                                                                            })
                                                                        : <span className="text-dark-75 font-weight-bolder">Sin servicios</span>
                                                                    }
                                                                </ul>
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
                                                                            <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); openModalWithInput('En negociación', lead.id) }} >
                                                                                <span className="navi-link w-100">
                                                                                    <span className="navi-text">
                                                                                        <span className="label label-xl label-inline label-light-success rounded-0 w-100">EN NEGOCIACIÓN</span>
                                                                                    </span>
                                                                                </span>
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item className="p-0" onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'ESTE LEAD SERÁ MARCADO COMO DUPLICADO', () => deleteDuplicado(lead)) }} >
                                                                                <span className="navi-link w-100">
                                                                                    <span className="navi-text">
                                                                                        <span className="label label-xl label-inline label-light-warning rounded-0 w-100">LEAD DUPLICADO</span>
                                                                                    </span>
                                                                                </span>
                                                                            </Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                    : ''
                                                            }
                                                        </td>
                                                        <td className="pr-0 text-center">
                                                            <div className="dropdown-container dropdown-container__info">
                                                                <DropdownButton menualign="right"
                                                                        title={<i className="fas fa-chevron-down icon-nm p-0"></i>} >
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { openModalEditar(lead) }} >
                                                                        <span className="navi-icon">
                                                                            <i className="fas fa-edit pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">EDITAR INFORMACIÓN GENERAL</span>
                                                                    </Dropdown.Item>
                                                                    {
                                                                        this.canSendFirstEmail(lead) ?
                                                                            <Dropdown.Item className="text-hover-info dropdown-pagina-web"
                                                                                onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => sendEmail(lead)) }}>
                                                                                <span className="navi-icon">
                                                                                    <i className="fas fa-envelope-open pr-3 text"></i>
                                                                                </span>
                                                                                <span className="navi-text align-self-center">ENVIAR CORREO</span>
                                                                            </Dropdown.Item>
                                                                            : ''
                                                                    }
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { openModal(lead) }} >
                                                                        <span className="navi-icon">
                                                                            <i className="fas fa-phone pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">AGENDAR LLAMADA</span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { changePageLlamadaSalida(lead) }} >
                                                                        <span className="navi-icon">
                                                                            <i className="far fa-file-alt pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">SEGUIMIENTO</span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { openModalHistorial(lead) }} >
                                                                        <span className="navi-icon">
                                                                            <i className="far fa-list-alt pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">HISTORIAL DE CONTACTO</span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'ESTE LEAD SERÁ MARCADO COMO DUPLICADO', () => deleteDuplicado(lead)) }}>
                                                                        <span className="navi-icon">
                                                                            <i className="fas fa-minus-circle pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">ELIMINAR LEAD DUPLICADO</span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="text-hover-info dropdown-pagina-web" onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', 'MOVERÁS ESTE LEAD A RELACIONES PÚBLICAS', () => moveToRelacionesPublicas(lead)) }}>
                                                                        <span className="navi-icon">
                                                                            <i className="far fa-handshake pr-3 text"></i>
                                                                        </span>
                                                                        <span className="navi-text align-self-center">Relaciones públicas</span>
                                                                    </Dropdown.Item>
                                                                </DropdownButton>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        :
                                        <tr>
                                            <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className={leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between"} >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm">
                                    Página {parseInt(leads.numPage) + 1} de {leads.total_paginas}
                                </div>
                                : ''
                        }
                        <div>
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
                    </div>
                </div >
            </>
        )
    }
}

export default LeadNuevo