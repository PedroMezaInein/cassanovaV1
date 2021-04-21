import React, { Component } from 'react'
import { printDate } from '../../../../functions/printers'

class ItemTaskList extends Component {

    isImportant = (tarea) => {
        const { user } = this.props
        let flag = ''
        if(tarea)
            if(tarea.responsables)
                flag = tarea.responsables.find( (elemento) => {
                    return elemento.id === user.id
                })
        if(flag)
            if(flag.pivot)
                if(flag.pivot.prioritario)
                    return 'text-warning'
        return 'text-muted'    
    }

    isOwner = (tarea) => {
        const { user } = this.props
        let flag = ''
        if(tarea)
            if(tarea.responsables)
                flag = tarea.responsables.find( (elemento) => {
                    return elemento.id === user.id
                })
        if(flag)
            return true
        return false
    }

    render() {
        const { mostrarTarea, tareas, updateFav } = this.props
        return (
            <>
                {
                    tareas.map((tarea, key) => {
                        return(
                            <tr key = { key } >
                                <td onClick={() => { mostrarTarea() }}>
                                    <div className="symbol symbol-30 mr-3 symbol-light">
                                    <span className="symbol-label font-size-lg">CJ</span>
                                    </div>
                                </td>
                                <td className="white-space-nowrap" onClick={() => { mostrarTarea() }}>
                                    <div>
                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg cursor-pointer">
                                            {tarea.titulo}
                                        </span>
                                    </div>
                                </td>
                                <td className="white-space-nowrap">
                                    <div className="text-right">
                                        <span className="label label-light-danger font-weight-bold label-inline">URGENTE</span>
                                        <span className="mx-3">
                                            <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                <i className="flaticon-add-label-button text-muted"></i>
                                            </div>
                                            <div onClick = { (e) => {e.preventDefault(); updateFav(tarea)} } className={`btn btn-icon btn-xs text-hover-warning`}>
                                                <i className={`flaticon-star ${this.isImportant(tarea)}`}></i>
                                            </div>
                                        </span>
                                        <span className="font-weight-bold text-muted">
                                            { printDate(tarea.fecha_limite) }
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </>
        )
    }
}

export default ItemTaskList