import React, { Component } from 'react'
import { Button } from '../../form-components'

class Esquema3 extends Component{

    state = {
        planos: [],
        tipos: []
    }

    componentDidMount(){
        const { planos } = this.props
        this.setState({...this.state, planos: planos, tipos: this.updatePlanos(planos)})
    }

    componentDidUpdate(newProps){
        const { planos } = this.props
        const { planos: planosNew } = newProps
        let bandera = false
        if(planos.length !== planosNew.length)
            this.setState({...this.state, planos: planos, tipos: this.updatePlanos(planos)})
        else{
            for(let i = 0; i < planos.length; i++){
                if(planos[i] !== planosNew[i]){
                    bandera = true
                    i = planos.length
                }
            }
        }
        if(bandera){
            this.setState({...this.state, planos: planos, tipos: this.updatePlanos(planos)})
        }
            
    }

    updatePlanos = planos => {
        let auxTipos = []
        planos.map((plano) => {
            let value = ''
            for(let contador = 0; contador < auxTipos.length; contador++){
                if(plano.tipo === auxTipos[contador].tipo){
                    value = contador;
                    contador = auxTipos.length
                }
            }
            if(value === ''){
                if(plano.tipo !== '' && plano.nombre !== '')
                    auxTipos.push({
                        tipo: plano.tipo,
                        planos: [plano],
                        posicion: plano.posicion
                    })
            }else{ auxTipos[value].planos.push(plano) }
            return ''
        })
        return auxTipos
    }

    isUpActiveButton = (item, index, planos) => {
        if(index > 0)
            return true
        return false
    }

    isDownActiveButton = (item, index, planos) => {
        if(index < planos.length - 1)
            return true
        return false
    }

    isUpActiveButtonTipo = (index) => {
        if(index > 0)
            return true
        return false
    }

    isDownActiveButtonTipo = (index) => {
        const { tipos } = this.state
        if(index < tipos.length - 1)
            return true
        return false
    }

    render(){
        const { tipos } = this.state
        const { deletePlano, changePosicionPlano, changePosicionTipo  } = this.props
        return(
            <div>
                {
                    tipos.map((item, key)=>{
                        return(
                            <div>
                                <div className="text-muted font-weight-bolder py-3 row mx-0 bg-light">
                                    <div className = 'col-10'>
                                        {item.tipo}
                                    </div>
                                    <div className = 'col-1 px-1 align-self-center'>
                                        {
                                            this.isUpActiveButtonTipo(key) ?
                                                <Button icon = '' onClick = { () => { changePosicionTipo(item, 'up') } } 
                                                    className = "btn btn-icon btn-light-pink btn-xs mr-2" 
                                                    only_icon = "flaticon2-up icon-xs" tooltip={{text:'Subir'}} />
                                            : ''
                                        }
                                    </div>
                                    <div className = 'col-1 px-1 align-self-center'>
                                        {
                                            this.isDownActiveButtonTipo(key) ?
                                                <Button icon = '' onClick = { () => { changePosicionTipo(item, 'down') } } 
                                                    className = "btn btn-icon btn-light-warning btn-xs mr-2" 
                                                    only_icon = "flaticon2-down icon-xs" tooltip={{text:'Bajar'}} />
                                            : ''
                                        }
                                    </div>
                                </div>
                                {
                                    item.planos.map((plano, index) => {
                                        return(
                                            <div className = 'row borderBottom mx-0 py-2' key = { index } >
                                                <div className='col-1 px-1 align-self-center text-justify'>
                                                    <Button icon = '' onClick = { () => { deletePlano(plano.id) } } 
                                                        className = "btn btn-icon btn-light-danger btn-xs mr-2" 
                                                        only_icon = "flaticon2-delete icon-xs" tooltip={{text:'Eliminar'}} />
                                                </div>
                                                <div className = 'col-9 w-100 px-2 align-self-center text-justify'>
                                                    {plano.nombre}
                                                </div>
                                                <div className = 'col-2 w-100 px-2 align-self-center'>
                                                    <div className = 'row mx-0'>
                                                        <div className = 'col-6 px-1 align-self-center'>
                                                            {
                                                                this.isUpActiveButton(item, index, item.planos) ?
                                                                    <Button icon = '' onClick = { () => { changePosicionPlano(plano, 'up') } } className = "btn btn-icon btn-light-primary btn-xs mr-2" 
                                                                        only_icon = "flaticon2-up icon-xs" tooltip={{text:'Subir'}} />
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className = 'col-6 px-1 align-self-center'>
                                                            {
                                                                this.isDownActiveButton(item, index, item.planos) ?
                                                                    <Button icon = '' onClick = { () => { changePosicionPlano(plano, 'down') } } className = "btn btn-icon btn-light-info btn-xs mr-2" 
                                                                        only_icon = "flaticon2-down icon-xs" tooltip={{text:'Bajar'}} />
                                                                : ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
        /* return(
            <DragDropContext onDragEnd = { this.onDragEnd }>
                <Droppable droppableId = 'esquema_3'>
                    { (provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                tipos.map((item) => (
                                    <Draggable key = { item.tipo } draggableId = { item.tipo } index = { item.posicion } >
                                        { (provided, snapshot) => (
                                            <div ref = { provided.innerRef } {...provided.draggableProps} {...provided.dragHandleProps} >
                                                <div className="text-muted font-weight-bolder my-3">
                                                    {item.tipo}
                                                </div>
                                                {
                                                    item.planos.map((plano, key) => (
                                                        <div className = 'row borderBottom mx-0 py-2' key = { key } >
                                                            <div className='col-1 px-1 change-col-2 '>
                                                                <Button icon = '' onClick = { () => { deletePlano(plano.id) } } 
                                                                    className = "btn btn-icon btn-light-danger btn-xs mr-2" 
                                                                    only_icon = "flaticon2-delete icon-xs" tooltip={{text:'Eliminar'}} />
                                                            </div>
                                                            <div className = 'col-10 w-100 px-2 align-self-center text-justify change-col-10'>
                                                                {plano.nombre}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        ) */
    }
}

export default Esquema3