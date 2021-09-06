import React, { Component } from 'react'
import { setLabelTable } from '../../../functions/setters'
import moment from 'moment';
import 'moment/locale/es';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class TablePresupuestos extends Component {
    formatDay(fecha) {
        let fecha_presupuesto = moment(fecha);
        let formatDate = fecha_presupuesto.locale('es').format("DD MMM YYYY");
        return formatDate.replace('.', '');
    }
    isActiveButton(direction) {
        const { presupuestos_info } = this.props
        if (presupuestos_info.total_paginas > 1) {
            if (direction === 'prev') {
                if (presupuestos_info.numPage > 0) {
                    return true;
                }
            } else {
                if (presupuestos_info.numPage < 10) {
                    if (presupuestos_info.numPage < presupuestos_info.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { presupuestos, openModalSee, onClickPrev, onClickNext, presupuestos_info, typePresupuesto, openFilter, changeTicketTab } = this.props
        return (
            <div className="container">
                <div className="text-center">
                    <div className="btn-group btn-group-sm">
                        <button type="button" className={`btn btn-fill-vert btn-group-presupuestos ${typePresupuesto === 'proyecto' ? 'active' : ''}`} onClick={ () => { changeTicketTab('proyecto')}}>Presupuestos del proyecto</button>
                        <button type="button" className={`btn btn-fill-vert btn-group-presupuestos ${typePresupuesto === 'all' ? 'active' : ''}`} onClick={ () => {changeTicketTab('all')}}>Todos los presupuestos</button>
                    </div>
                </div>
                <div className="d-flex justify-content-end mb-10">
                    <span className='btn btn-sm btn-transparent btn-hover-light-primary text-primary font-weight-bolder font-size-13px box-shadow-button' onClick={() => { openFilter('presupuesto')}}>
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
                                        typePresupuesto === 'all'?
                                            <th style={{ minWidth: '100px' }}>Proyecto</th>
                                        :<></>
                                    }
                                    <th style={{ minWidth: '125px' }}>Fase</th>
                                    <th>Tiempo de ejecución</th>
                                    <th style={{ minWidth: '90px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    presupuestos.length === 0 ?
                                        <tr className="text-dark-75 font-weight-light text-center" >
                                            <td colSpan={typePresupuesto === 'all'?'8':'7'}>
                                                Aún no hay presupuestos
                                            </td>
                                        </tr>
                                        : <></>
                                }
                                {
                                    presupuestos.map((presupuesto, key) => {
                                        return (
                                            <tr className="text-dark-75 font-weight-light text-center" key={key}>
                                                <td> {setLabelTable(presupuesto.estatus_ticket)} </td>
                                                <td> {presupuesto.identificador} </td>
                                                <td> {this.formatDay(presupuesto.created_at)} </td>
                                                {
                                                    typePresupuesto === 'all'?
                                                        <td><div className="text-center">{presupuesto.proyecto.nombre}</div></td>
                                                    :<></>
                                                }
                                                <td><div>{presupuesto.subarea ? presupuesto.subarea.nombre : '-'}</div></td>
                                                <td> X DÍAS </td>
                                                <td className="white-space-nowrap">
                                                    <div className="d-flex justify-content-evenly">
                                                        {
                                                            presupuesto.presupuesto.length ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>PRESUPUESTO</span></Tooltip>}>
                                                                    <span className='btn btn-icon btn-sm btn-light  btn-hover-success' onClick={(e) => { openModalSee(presupuesto) }}>
                                                                        <i className='las la-file-invoice-dollar icon-xl text-success'></i>
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
                <div className={presupuestos_info.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between"} >
                    {
                        presupuestos_info.total > 0 ?
                            <div className="text-body font-weight-bolder font-size-md">
                                Página {parseInt(presupuestos_info.numPage) + 1} de {presupuestos_info.total_paginas}
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

export default TablePresupuestos