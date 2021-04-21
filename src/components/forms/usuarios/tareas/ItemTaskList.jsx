import React, { Component } from 'react'

class ItemTaskList extends Component {

    render() {
        const { mostrarTarea } = this.props
        return (
            <tr onClick={() => { mostrarTarea() }}>
                <td>
                    <div className="symbol symbol-30 mr-3 symbol-light">
                        <span className="symbol-label font-size-lg">CJ</span>
                    </div>
                </td>
                <td className="white-space-nowrap">
                    <div>
                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                            PROPUESTA DE DISEÑO MÓDULO DE MERCADOTECNIA
                                </span>
                    </div>
                </td>
                <td className="white-space-nowrap">
                    <div className="text-right">
                        <span className="label label-light-danger font-weight-bold label-inline">URGENTE</span>
                        <span className="mx-3">
                            <div className="btn btn-icon btn-xs text-hover-warning">
                                <i className="flaticon-star text-muted"></i>
                            </div>
                            <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                <i className="flaticon-add-label-button text-muted"></i>
                            </div>
                        </span>
                        <span className="font-weight-bold text-muted">15 ABRIL</span>
                    </div>
                </td>
            </tr>
        )
    }
}

export default ItemTaskList