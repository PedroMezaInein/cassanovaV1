import React, { Component } from 'react'
import { setLabelTable } from '../../../functions/setters'
import moment from 'moment';
import 'moment/locale/es';
class TableTickets extends Component {
    formatDay (fecha){
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
        const { tickets, openModalSee, openModalDetalles, onClickPrev, onClickNext, tickets_info } = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive" id='table-proyecto'>
                    <table className="table table-borderless table-vertical-center table-hover">
                        <thead>
                            <tr className="text-center bg-blue-proyecto text-proyecto">
                                <th>Estatus</th>
                                <th style={{ minWidth: '100px' }}>Fecha</th>
                                <th>Partida</th>
                                <th style={{ minWidth: '125px' }}>Tipo de trabajo</th>
                                <th style={{ minWidth: '176px' }}>Motivo de cancelación</th>
                                <th style={{ minWidth: '209px' }}>Descripción</th>
                                <th style={{ minWidth: '90px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tickets.map((ticket, key) => {
                                    return (
                                        <tr className="text-dark-75 font-weight-normal text-center" key={key}>
                                            <td>
                                                {setLabelTable(ticket.estatus_ticket)}
                                            </td>
                                            <td>
                                                {this.formatDay(ticket.created_at)}
                                            </td>
                                            <td>
                                                {ticket.partida.nombre}
                                            </td>
                                            <td>
                                                {ticket.tipo_trabajo.tipo}
                                            </td>
                                            <td>
                                                {ticket.motivo_cancelacion}
                                            </td>
                                            <td className="text-justify">
                                                {ticket.descripcion}
                                            </td>
                                            <td>
                                                {
                                                    ticket.presupuesto.length ?
                                                        <a className="btn btn-icon btn-light btn-hover-primary btn-sm" onClick={(e) => { openModalSee(ticket) }}>
                                                            <i className="la la-file-invoice-dollar text-primary icon-xl"></i>
                                                        </a>
                                                        : ''
                                                }
                                                {
                                                    ticket.estatus_ticket.estatus === "Terminado" ?
                                                        <a className="btn btn-icon btn-light btn-hover-primary btn-sm ml-3" onClick={(e) => { openModalDetalles(ticket) }}>
                                                            <i className="la la-list-alt text-primary icon-xl"></i>
                                                        </a>
                                                        : ''
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
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