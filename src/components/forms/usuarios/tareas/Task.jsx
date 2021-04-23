import React, { Component } from 'react'
import { WriteComment, CommentsPanel } from '../../../../components/forms'
import { printDate } from '../../../../functions/printers'

class Task extends Component {

    render() {
        const {showTask, mostrarListPanel, tarea, completarTarea, updateFav, form, onChange, clearFiles, openModalEdit, user, mentions, onSubmit } = this.props
        if(tarea)
            return (
                <div className={showTask ? 'col-xl-12 gutter-b' : 'd-none'}>
                    <div className="card card-custom card-stretch">
                        <div className="card-header align-items-center flex-wrap justify-content-between border-0 py-6 h-auto">
                            <div className="mr-2 py-2 row">
                                <div className="col-md-auto align-self-center pr-0">
                                    <span className="btn btn-light btn-hover-secondary font-weight-bold h-100 p-3" onClick={() => { mostrarListPanel() }}>
                                        <i className="fas fa-arrow-left icon-md p-0"></i>
                                    </span>
                                </div>
                                <div className="col">
                                    <div className="d-flex flex-column mr-2 py-2">
                                        <span className="text-dark font-weight-bold font-size-h4 mr-3">
                                            {tarea.titulo}
                                        </span>
                                        <div className="d-flex align-items-center py-1">
                                            {
                                                tarea.etiquetas.map((etiqueta) => {
                                                    return(
                                                        <span key = { etiqueta.id } className="d-flex align-items-center mr-2 font-weight-bold cursor-pointer">
                                                            <span className="fas fa-times text-hover icon-md mr-2" style={{ color: etiqueta.color }} onClick = { (e) => { console.log('ETIQUETA', etiqueta) } } />
                                                            {/* <span className="fa fa-genderless icon-md mr-2" style={{ color: etiqueta.color }}/> */}
                                                            <span onMouseLeave={e => (e.target.style.color = "#B5B5C3")} onMouseOver={e => (e.target.style.color = etiqueta.color)} style={{ color: "#B5B5C3" }}>{etiqueta.titulo}</span>
                                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end text-right my-2">
                                {
                                    tarea.responsables.map((responsable, index) => {
                                        if(responsable.name === user.name){
                                            return (
                                                <span key = {user.id} className="btn btn-default btn-icon btn-sm mr-2" onClick={(e) => { openModalEdit(tarea) }}>
                                                        <i className="las la-edit icon-xl"></i>
                                                </span>
                                            )
                                        }
                                        return <></>
                                    })
                                }
                                <span className="btn btn-light-danger btn-sm text-uppercase font-weight-bolder mr-2">
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
                                                <span className="font-size-lg font-weight-bold text-dark-75 mr-3 align-self-center">
                                                    {tarea.responsables.length > 1 ? 'Responsables:':'Responsable:'}
                                                </span>
                                                <div className="font-size-lg font-weight-bold text-dark-50 mr-3 text-justify">
                                                    {
                                                        tarea.responsables.map((responsable, index) => {
                                                            return(
                                                                <span key = { index } className ='mr-2'>
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
                                <CommentsPanel tarea = { tarea }  proyectos = { mentions.proyectos } />
                            </div>
                        </div>
                        <WriteComment form={form} onChange={onChange} clearFiles={clearFiles} mentions = { mentions } onSubmit = { onSubmit } />
                    </div>
                </div>
            )
        return (<></>)
    }
}

export default Task