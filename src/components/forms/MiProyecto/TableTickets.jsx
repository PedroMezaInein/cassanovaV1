import React, { Component } from 'react'
import { setLabelTable } from '../../../functions/setters'
import { showFilesAlert } from '../../../functions/alert'
import moment from 'moment';
import 'moment/locale/es';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class TableTickets extends Component {
    formatDay(fecha) {
        let fecha_ticket = moment(fecha);
        let formatDate = fecha_ticket.locale('es').format("DD MMM YYYY");
        return formatDate.replace('.', '');
    }
    isActiveButton(direction) {
        const { tickets_info } = this.props
        if (tickets_info.total_paginas > 1) {
            if (direction === 'prev') {
                if (tickets_info.numPage > 0) {
                    return true;
                }
            } else {
                if (tickets_info.numPage < 10) {
                    if (tickets_info.numPage < tickets_info.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { tickets, openModalSee, openModalDetalles, onClickPrev, onClickNext, tickets_info, tipoTickets, openModalLevantamiento, openFilterTickets, changeTicketTab } = this.props
        return (
            <div className="container">
                <div className="text-center">
                    <div className="btn-group btn-group-sm">
                        <button type="button" className={`btn btn-fill-vert btn-group-tickets ${tipoTickets === 'proyecto' ? 'active' : ''}`} onClick={ () => { changeTicketTab('proyecto')}}>Tickets del proyecto</button>
                        <button type="button" className={`btn btn-fill-vert btn-group-tickets ${tipoTickets === 'all' ? 'active' : ''}`} onClick={ () => {changeTicketTab('all')}}>Todos los tickets</button>
                    </div>
                </div>
                <div className="d-flex justify-content-end mb-10">
                    {
                        tipoTickets === 'proyecto'?
                            <span className='btn btn-sm btn-transparent btn-hover-light-success text-success font-weight-bolder font-size-13px box-shadow-button' onClick={openModalLevantamiento}>
                                <i className="la la-file-archive icon-xl text-success"></i> NUEVO TICKET
                            </span>
                        :<></>
                    }
                    <span className='btn btn-sm btn-transparent btn-hover-light-primary text-primary font-weight-bolder font-size-13px box-shadow-button'onClick={() => { openFilterTickets('ticket')}}>
                        <i className="la la-filter icon-xl text-primary"></i> Filtrar
                    </span>
                </div>
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center table-hover  rounded bg-white" id="table-tickets">
                            <thead>
                                <tr className="text-center text-proyecto">
                                    <th>Estatus</th>
                                    <th>ID</th>
                                    <th style={{ minWidth: '100px' }}>Fecha</th>
                                    {
                                        tipoTickets === 'all'?
                                            <th style={{ minWidth: '100px' }}>Proyecto</th>
                                        :<></>
                                    }
                                    <th style={{ minWidth: '125px' }}>Tipo de trabajo</th>
                                    <th style={{ minWidth: '209px' }}>Descripción</th>
                                    <th style={{ minWidth: '90px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tickets.length === 0 ?
                                        <tr className="text-dark-75 font-weight-light text-center" >
                                            <td colSpan={tipoTickets === 'all'?'8':'7'}>
                                                Aún no hay tickets levantados
                                            </td>
                                        </tr>
                                        : <></>
                                }
                                {
                                    tickets.map((ticket, key) => {
                                        return (
                                            <tr className="text-dark-75 font-weight-light text-center" key={key}>
                                                <td> {setLabelTable(ticket.estatus_ticket)} </td>
                                                <td> {ticket.identificador} </td>
                                                <td> {this.formatDay(ticket.created_at)} </td>
                                                {
                                                    tipoTickets === 'all'?
                                                        <td><div className="text-center">{ticket.proyecto.nombre}</div></td>
                                                    :<></>
                                                }
                                                <td> {ticket.subarea ? ticket.subarea.nombre : '-'} </td>
                                                <td className="text-justify"> {ticket.descripcion} </td>
                                                <td className="white-space-nowrap">
                                                    <div className="d-flex justify-content-evenly">
                                                        {
                                                            ticket.fotos ? ticket.fotos.length ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>FOTOS</span></Tooltip>}>
                                                                    <span className="btn btn-icon btn-bg-light btn-text-info btn-hover-info btn-sm"
                                                                        onClick={(e) => { showFilesAlert(ticket.fotos, '') }}>
                                                                        <i className="las la-photo-video text-info icon-lg"></i>
                                                                    </span>
                                                                </OverlayTrigger>
                                                                : <></> : <></>
                                                        }
                                                        {
                                                            ticket.presupuesto.length ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>PRESUPUESTO</span></Tooltip>}>
                                                                    <span className={`btn btn-icon btn-sm ${ticket.estatus_ticket.estatus === "Aprobación pendiente" ? 'btn-light-warning pulse pulse-warning' : 'btn-light  btn-hover-success'}`} onClick={(e) => { openModalSee(ticket) }}>
                                                                        <i className={`las la-file-invoice-dollar icon-xl text-${ticket.estatus_ticket.estatus === "Aprobación pendiente" ? '' : 'success'} `}></i>
                                                                        {
                                                                            ticket.estatus_ticket.estatus === "Aprobación pendiente" ?
                                                                                <span className="pulse-ring"></span>
                                                                                : ''
                                                                        }
                                                                    </span>
                                                                </OverlayTrigger>
                                                                : <></>
                                                        }
                                                        {
                                                            ticket.estatus_ticket.estatus === "Terminado" ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>DETALLES DEL LEVANTAMIENTO</span></Tooltip>}>
                                                                    <span className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={(e) => { openModalDetalles(ticket) }}>
                                                                        <i className="la la-list-alt text-primary icon-xl"></i>
                                                                    </span>
                                                                </OverlayTrigger>
                                                                : <></>
                                                        }
                                                        {
                                                            ticket.motivo_cancelacion !== null ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip className="tool-card-motivo">
                                                                    <div className="tool-titulo text-warning font-weight-bolder letter-spacing-0-4 bg-light-warning">
                                                                        MOTIVO DE CANCELACIÓN
                                                                    </div>
                                                                    <div className="p-2">
                                                                        <div className="tool-contenido">
                                                                            <div className="p-3 text-justify text-uppercase">
                                                                                {ticket.motivo_cancelacion}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Tooltip>}>
                                                                    <span className="btn btn-icon btn-bg-light btn-text-warning btn-hover-warning btn-sm">
                                                                        <i className="las la-exclamation-triangle text-warning icon-lg"></i>
                                                                    </span>
                                                                </OverlayTrigger>
                                                                : <></>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={tickets_info.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between"} >
                    {
                        tickets_info.total > 0 ?
                            <div className="text-body font-weight-bolder font-size-md">
                                Página {parseInt(tickets_info.numPage) + 1} de {tickets_info.total_paginas}
                            </div>
                            : ''
                    }
                    <div>
                        {
                            this.isActiveButton('prev') ?
                                <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default TableTickets