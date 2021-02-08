import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
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
        })
        return auxTipos
    }

    onDragEnd = result => {
        const { reorderPlanos } = this.props
        if(!result.destination)
            return;
        reorderPlanos(result)
    }

    render(){
        const { tipos } = this.state
        const { deletePlano } = this.props
        return(
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
        )
    }
}

export default Esquema3