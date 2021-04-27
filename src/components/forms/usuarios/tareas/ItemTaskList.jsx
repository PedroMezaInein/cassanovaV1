import React, { Component } from 'react'
import { printDateMes } from '../../../../functions/printers'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton } from 'react-bootstrap'
import moment from 'moment'
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
                                    <div className="symbol symbol-25 symbol-circle border-0">
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
                        <div className="symbol symbol-25 symbol-circle border-0 symbol-light-primary">
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
                                    <div className="symbol symbol-25 symbol-circle border-0">
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

    isActiveTag = (tag, tarea) => {
        if(tag.value ==='nueva_etiqueta')
            return false
        let flag = tarea.etiquetas.find((etiqueta) => {
            return etiqueta.id.toString() === tag.value
        })
        if(flag)
            return false
        return true
    }
    tareaCaducada(fechaLiminte){
        let textColor=''
        var date = moment(fechaLiminte)
        var now = moment();
        if (now > date) {
            textColor= 'text-danger'
        }else{
            textColor = 'text-muted'
        }
        return textColor
    }
    render() {
        const { mostrarTarea, tareas, updateFav, addLabel, options, updateTagInTask } = this.props
        return (
            <>
                {
                    tareas.map((tarea, key) => {
                        return (
                            <div className="row mx-0 border-botton-2px py-3 table-hover" key={key} id="table-tareas" >
                                <div className="col-md-1 align-self-center">
                                    <div className="py-3">
                                        {this.responsablesSymbol(tarea.responsables)}
                                    </div>
                                </div>
                                <div className="col-md-9 align-self-center">
                                    <div className="py-3">
                                        <div id="titulo" className="text-dark-75 font-weight-bolder font-size-lg cursor-pointer text-hover-dark" onClick={() => { mostrarTarea(tarea) }}>
                                            {tarea.titulo}
                                        </div>
                                        {
                                            tarea.etiquetas &&
                                            <div className="my-4" id="tags">
                                                { 
                                                    tarea.etiquetas.map((etiqueta) => {
                                                        return (
                                                            <span key={etiqueta.id} style={{ backgroundColor: etiqueta.color, color: 'white', borderRadius:"0.3rem", padding:'5px' }}
                                                                className="label font-weight-bold label-inline text-hover mr-1 mb-1"
                                                                onClick={(e) => { addLabel(etiqueta) }} >
                                                                {etiqueta.titulo}
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }
                                        <div className="text-justify font-weight-light">
                                            {tarea.descripcion}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2 align-self-center">
                                    <div className="py-3" id="tags-date">
                                        <span id="down-tag">
                                            <DropdownButton
                                                title={
                                                    <i className="flaticon-add-label-button text-muted p-0 font-size-14px"></i>
                                                }
                                                id={`dropdown-button-tag`}
                                                className="d-inline-block"
                                                drop={'left'}>
                                                {
                                                    options.tags.map((tag, key) => {
                                                        if (this.isActiveTag(tag, tarea))
                                                            return (
                                                                <div key={key}>
                                                                    <Dropdown.Item className="p-0" key={key} onClick={() => { updateTagInTask(tag, tarea, 'add') }}>
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline rounded-0 w-100 font-weight-bold"
                                                                                    style={{
                                                                                        color: `${tag.name === 'Nueva etiqueta' ? '#80808f' : 'white'}`,
                                                                                        backgroundColor: tag.color,
                                                                                    }}>
                                                                                    {tag.name}
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                </div>
                                                            )
                                                        return ''
                                                    })
                                                }
                                            </DropdownButton>
                                        </span>
                                        <div onClick={(e) => { e.preventDefault(); updateFav(tarea) }} className={`btn btn-icon btn-xs text-hover-warning`}>
                                            <i className={`flaticon-star ${this.isImportant(tarea)}`}></i>
                                        </div>
                                        <span className={`font-weight-bolder ml-2 ${this.tareaCaducada(tarea.fecha_limite)}`}>
                                            {printDateMes(tarea.fecha_limite)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }
}

export default ItemTaskList