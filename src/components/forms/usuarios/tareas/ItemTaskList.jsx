import React, { Component } from 'react'

class ItemTaskList extends Component {

    render() {
        const { mostrarTarea, tareas } = this.props
        return (
            <div>
                <div className="row mx-0 col-md-12 px-0">
                    <div className="col align-self-center px-1">
                        <div className="d-flex align-items-center">
                            <div className="symbol symbol-30 mr-3 symbol-light">
                                <span className="symbol-label font-size-lg">CJ</span>
                            </div>
                            <div>
                                <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer" onClick={() => { mostrarTarea() }} >
                                    PROPUESTA DE DISEÑO MÓDULO DE MERCADOTECNIA
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-auto px-1 align-self-center">
                        <div className="d-flex align-items-center justify-content-end flex-wrap">
                            <span className="label label-light-danger font-weight-bold label-inline">URGENTE</span>
                            <span className="mx-3">
                                <div className="btn btn-icon btn-xs text-hover-warning">
                                    <i className="flaticon-star text-muted"></i>
                                </div>
                                <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                    <i className="flaticon-add-label-button text-muted"></i>
                                </div>
                            </span>
                            <div className="font-weight-bold text-muted">15 ABRIL</div>
                        </div>
                    </div>
                </div>
                <div className="separator separator-solid my-4"></div>
            </div>
        )
    }
}

export default ItemTaskList