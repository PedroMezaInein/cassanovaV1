import React, { Component } from 'react'
import { WriteComment, CommentsPanel } from '../../../../components/forms'

class Task extends Component {

    render() {
        const {showTask, mostrarListPanel, form, onChange} = this.props
        return (
            <div className={showTask ? 'col-xl-12 gutter-b' : 'd-none'}>
                <div className="card card-custom card-stretch">
                    <div className="card-header align-items-center flex-wrap justify-content-between border-0 py-6 h-auto">
                        <div className="mr-2 py-2 row">
                            <div className="col-md-auto align-self-center pr-0">
                                <a className="btn btn-light btn-hover-secondary font-weight-bold h-100 p-3" onClick={() => { mostrarListPanel() }}>
                                    <i className="fas fa-arrow-left icon-md p-0"></i>
                                </a>
                            </div>
                            <div className="col">
                                <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mr-3">PROPUESTA DE DISEÑO MÓDULO DE MERCADOTECNIA</span>
                                <div className="d-flex align-items-center py-1">
                                    <span className="d-flex align-items-center text-muted text-hover-info mr-2 font-weight-bold">
                                        <span className="fa fa-genderless text-info icon-md mr-2"></span>EN PROCESO</span>
                                    <span className="d-flex align-items-center text-muted text-hover-danger font-weight-bold">
                                        <span className="fa fa-genderless text-danger icon-md mr-2"></span>URGENTE</span>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end text-right my-2">
                            <span className="btn btn-default btn-icon btn-sm mr-2">
                                    <i className="las la-edit icon-xl"></i>
                            </span>
                            <span className="btn btn-light-danger btn-sm text-uppercase font-weight-bolder mr-2">20 ABRIL</span>
                            <span className="btn btn-light-success btn-sm text-uppercase font-weight-bolder">COMPLETAR</span>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="mb-3">
                            <div className="cursor-pointer">
                                <div className="d-flex align-items-start card-spacer-x py-4">
                                    <div className="d-flex flex-column flex-grow-1 flex-wrap">
                                        <div className="d-flex">
                                            <span className="font-size-lg font-weight-bold text-dark-75 mr-2">Responsable: </span>
                                            <div className="font-size-lg font-weight-bold text-dark-50 text-hover-primary mr-2">CARINA JIMÉNEZ</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="btn btn-icon btn-xs text-hover-warning">
                                                <i className="flaticon-star text-muted"></i>
                                            </span>
                                            <span className="btn btn-icon btn-xs btn-hover-text-warning">
                                                <i className="flaticon-add-label-button text-muted"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-spacer-x pt-2 pb-5 toggle-off-item">
                                    <div className="mb-1 text-justify font-weight-light mb-5">
                                        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                                    </div>
                                </div>
                            </div>
                            <div className="separator separator-dashed separator-border-3"></div>
                            <CommentsPanel/>
                        </div>
                        <WriteComment form={form} onChange={onChange}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Task