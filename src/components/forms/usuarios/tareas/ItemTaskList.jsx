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
                                        <div className="text-left" key={key}>
                                            • {responsable.name}
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
        const { mostrarTarea, tareas, updateFav, addLabel } = this.props
        return (
            <>
                {
                    tareas.map((tarea, key) => {
                        return(
                            <tr key = { key } style={{borderBottom:'1px solid #ebedf3'}}>
                                <td>
                                    {this.responsablesSymbol(tarea.responsables)}
                                </td>
                                <td className="white-space-nowrap text-hover" onClick={() => { mostrarTarea(tarea) }}>
                                    <div>
                                        <span className="text-dark-75 font-weight-bolder mb-1 font-size-lg cursor-pointer">
                                            {tarea.titulo}
                                        </span>
                                    </div>
                                </td>
                                <td className="white-space-nowrap">
                                    <div className="text-right">
                                        {
                                            tarea.etiquetas.map((etiqueta) => {
                                                return(
                                                    <span key = { etiqueta.id} style = { { backgroundColor: etiqueta.color, color: 'white'}}
                                                        className="label font-weight-bold label-inline ml-2 text-hover"
                                                        onClick = { (e) => { addLabel(etiqueta) } } >
                                                        {etiqueta.titulo}
                                                    </span>
                                                )
                                            })
                                        }
                                        
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