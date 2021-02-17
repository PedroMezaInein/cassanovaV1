import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from '../../form-components'

class Esquema extends Component{

    /* state = {
        planos: [],
        tipos: []
    }

    componentDidMount(){
        const { planos } = this.props
        this.setState({...this.state, planos: planos })    
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidUpdate(newProps){
        const { planos } = this.props
        const { planos: planosNew } = newProps
        let bandera = false
        if(planos.length !== planosNew.length)
            this.setState({...this.state, planos: planosNew})
        else{
            for(let i = 0; i < planos.length; i++){
                if(planos[i] !== planosNew[i]){
                    bandera = true
                    i = planos.length
                }
            }
        }
        if(bandera){ this.setState({...this.state, planos: planosNew}) }
    } */

    onDragEnd = result => {
        const { reorderPlanos } = this.props
        if(!result.destination)
            return;
        reorderPlanos(result)
    }

    render(){
        const { deletePlano, planos } = this.props
        /* const { planos } = this.state */
        console.log('PLANOS', planos)
        return(
            <div>
                {
                    planos.map((item, index)=>{
                        if(item.id)
                            return(
                                <div className = 'row borderBottom mx-0 py-2 my-3' key = { index } >
                                    <div className = 'col-1 px-1 align-self-center text-justify'>
                                        <Button icon = '' onClick = { () => { deletePlano(item.id) } } className = "btn btn-icon btn-light-danger btn-xs mr-2" 
                                            only_icon = "flaticon2-delete icon-xs" tooltip={{text:'Eliminar'}} />
                                    </div>
                                    <div className = 'col-9 w-100 px-2 align-self-center text-justify'>
                                        { item.nombre }
                                    </div>
                                    <div className = 'col-2 w-100 px-2 align-self-center'>
                                        <div className = 'row mx-0'>
                                            <div className = 'col-6 px-1 align-self-center'>
                                                <Button icon = '' onClick = { () => { deletePlano(item.id) } } className = "btn btn-icon btn-light-primary btn-xs mr-2" 
                                                    only_icon = "flaticon2-up icon-xs" tooltip={{text:'Subir'}} />
                                            </div>
                                            <div className = 'col-6 px-1 align-self-center'>
                                                <Button icon = '' onClick = { () => { deletePlano(item.id) } } className = "btn btn-icon btn-light-info btn-xs mr-2" 
                                                    only_icon = "flaticon2-down icon-xs" tooltip={{text:'Bajar'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                    })
                }
            </div>
        )
        return(
            <DragDropContext onDragEnd = { this.onDragEnd }>
                <Droppable droppableId = 'esquema_2'>
                    { (provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                planos.map((item,index)=>{
                                    if(item.id){
                                        console.log('INDEX', index)
                                        console.log('ITEM ', item)
                                        return(
                                            <Draggable draggableId = { item.id.toString() } index = { index } >
                                                { (provided, snapshot) => (
                                                    <div ref = { provided.innerRef } {...provided.draggableProps} {...provided.dragHandleProps} >
                                                        <div className = 'row borderBottom mx-0 py-2 my-3' >
                                                            <div className = 'col-1 px-1 '>
                                                                <Button icon = '' onClick = { () => { deletePlano(item.id) } }
                                                                    className = "btn btn-icon btn-light-danger btn-xs mr-2" 
                                                                    only_icon = "flaticon2-delete icon-xs" tooltip={{text:'Eliminar'}} />
                                                            </div>
                                                            <div className = 'col-9 w-100 px-2 align-self-center text-justify'>
                                                                {item.nombre}
                                                            </div>
                                                            <div className = 'col-2 w-100 px-2 align-self-center text-justify'>
                                                                <div className = 'row justify-content-center'>
                                                                    {item.nombre}
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    }
                                })
                            }
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}
export default Esquema