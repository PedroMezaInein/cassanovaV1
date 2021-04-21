import React, { Component } from 'react'
import { WriteComment, CommentsPanel } from '../../../../components/forms'
import { printDate } from '../../../../functions/printers'

class Task extends Component {

    render() {
        const {showTask, mostrarListPanel, tarea, completarTarea, updateFav, form, onChange } = this.props
        if(tarea)
            return (
                <div className={showTask ? 'col-xl-12 gutter-b' : 'd-none'}>
                    <div className="card card-custom card-stretch">
                        <div className="card-header align-items-center flex-wrap justify-content-between border-0 py-6 h-auto">
                            <div className="d-flex flex-column mr-2 py-2">
                                <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mr-3">
                                    {tarea.titulo}
                                </span>
                                <div className="d-flex align-items-center py-1">
                                    <span className="d-flex align-items-center text-muted text-hover-info mr-2 font-weight-bold">
                                        <span className="fa fa-genderless text-info icon-md mr-2"></span>EN PROCESO</span>
                                    <span className="d-flex align-items-center text-muted text-hover-danger font-weight-bold">
                                        <span className="fa fa-genderless text-danger icon-md mr-2"></span>URGENTE</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end text-right my-2">
                                <span className="btn btn-default btn-icon btn-sm mr-2">
                                        <i className="las la-edit icon-xl"></i>
                                </span>
                                <span className="btn btn-light-danger btn-sm text-uppercase font-weight-bolder mr-2" onClick={() => { mostrarListPanel() }}>
                                    { printDate(tarea.fecha_limite) }
                                </span>
                                <span className="btn btn-light-success btn-sm text-uppercase font-weight-bolder text-hover" onClick={() => { completarTarea(tarea) }}>
                                    COMPLETAR
                                </span>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="mb-3">
                                <div className="cursor-pointer">
                                    <div className="d-flex align-items-start card-spacer-x py-4">
                                        <div className="d-flex flex-column flex-grow-1 flex-wrap">
                                            <div className="d-flex">
                                                <span className="font-size-lg font-weight-bold text-dark-75 mr-2">Responsable: </span>
                                                <div className="font-size-lg font-weight-bold text-dark-50 mr-2">
                                                    {
                                                        tarea.responsables.map((responsable, index) => {
                                                            return(
                                                                <span className ='mr-2'>
                                                                    { responsable.name }
                                                                    { index + 1 < tarea.responsables.length && ','}
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                <span className={`btn btn-icon btn-xs text-hover-warning`}
                                                    onClick = { (e) => {e.preventDefault(); updateFav(tarea)} }>
                                                    <i className={`flaticon-star ${tarea.prioritario ? 'text-warning' : 'text-muted'}`}></i>
                                                </span>
                                                <span className="btn btn-icon btn-xs btn-hover-text-warning">
                                                    <i className="flaticon-add-label-button text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-spacer-x pt-2 pb-5 toggle-off-item">
                                        <div className="mb-1 text-justify font-weight-light mb-5">
                                            {tarea.descripcion}
                                        </div>
                                    </div>
                                </div>
                                <div className="separator separator-dashed separator-border-3"></div>
                                <CommentsPanel/>
                            </div>
                        </div>
                        <WriteComment form={form} onChange={onChange}/>
                    </div>
                </div>
            )
        return (<></>)
    }
}

export default Task