import React, { Component } from 'react'
import { printDate } from '../../../../functions/printers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
class ItemTaskList extends Component {

    isImportant = (tarea) => {
        if(tarea.prioritario)
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

    responsablesSymbol = (responsables) => {
        if(responsables.length > 3){
            let obtenerTresR = responsables.slice(0, 3);
            let obtenerRestantes = responsables.slice(3, responsables.length);
            return(
                <div className="symbol-group symbol-hover justify-content-center">
                    {
                        obtenerTresR.map((responsable, key) => {
                            return (
                                <OverlayTrigger key={key} overlay={<Tooltip>{responsable.name}</Tooltip>}>
                                    <div className="symbol symbol-25 symbol-circle border-1">
                                        <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                    </div>
                                </OverlayTrigger>
                            )
                        })
                    }
                    <OverlayTrigger overlay={
                        <Tooltip>
                            {
                                obtenerRestantes.map((responsable, key) => {
                                    return (
                                        <div className="d-flex align-items-center mb-1" key={key}>
                                            <div className="symbol-list d-flex flex-wrap">
                                                <div className="symbol symbol-20 symbol-circle mr-3" style={{ width: '' }}>
                                                    <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column flex-grow-1">
                                                <div className="text-dark-75 mb-1 font-size-sm font-weight-bold text-left">{responsable.name.split(" ", 1)}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Tooltip>
                    }>
                        <div className="symbol symbol-25 symbol-circle border-1 symbol-light-primary">
                            <span className="symbol-label font-weight-bolder">{obtenerRestantes.length}+</span>
                        </div>
                    </OverlayTrigger>
                </div>
            )
        }else{
            return(
                <div className="symbol-group symbol-hover justify-content-center">
                    {
                        responsables.map((responsable, key) => {
                            return (
                                <OverlayTrigger key={key} overlay={<Tooltip>{responsable.name}</Tooltip>}>
                                    <div className="symbol symbol-25 symbol-circle border-1">
                                        <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                    </div>
                                </OverlayTrigger>
                            )
                        }) 
                    }
                </div>
            )
        }
    }
    
    render() {
        const { mostrarTarea, tareas, updateFav } = this.props
        return (
            <>
                {
                    tareas.map((tarea, key) => {
                        return (
                            <tr key={key}>
                                <td id="responsables" >
                                    {this.responsablesSymbol(tarea.responsables)}
                                </td>
                                <td id="descripcion" className="text-hover" onClick={() => { mostrarTarea(tarea) }}>
                                    <div>
                                        <div className="text-dark-75 font-weight-bolder mb-2 font-size-lg cursor-pointer">
                                            {tarea.titulo}
                                        </div>
                                        <div className="text-justify font-weight-light">
                                            {tarea.descripcion}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-right white-space-nowrap">
                                        <span className="label label-light-danger font-weight-bold label-inline">URGENTE</span>
                                        <span className="mx-3">
                                            <div className="btn btn-icon btn-xs btn-hover-text-warning active">
                                                <i className="flaticon-add-label-button text-muted"></i>
                                            </div>
                                            <div onClick={(e) => { e.preventDefault(); updateFav(tarea) }} className={`btn btn-icon btn-xs text-hover-warning`}>
                                                <i className={`flaticon-star ${this.isImportant(tarea)}`}></i>
                                            </div>
                                        </span>
                                        <span className="font-weight-bold text-muted">
                                            {printDate(tarea.fecha_limite)}
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