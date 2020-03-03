import React, { Component } from 'react'
import { Subtitle } from '../texts'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'
import { Button } from '../form-components'
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
class Column extends Component{

    render(){
        const { column, id, handleAddButton } = this.props
        return(
            <div className="border my-3 p-2">
                
                <div className="position-relative">
                    <Subtitle className="mb-0 text-center">
                        {column.titulo}
                    </Subtitle>
                </div>
                <div className="text-right">
                    <Button text='' color='transparent' icon={faPlus} className="p-0 mx-2" onClick={() => {handleAddButton(column.id)}}/>
                </div>
                <Droppable droppableId={column.id.toString()}>
                    {
                        provided => (
                            <div 
                                className="border border-white border-left-0 border-right-0"
                                ref={provided.innerRef}
                                { ...provided.droppableProps}>
                                {
                                    column.tareas.map((tarea, index) => 
                                        /* console.log('tarea', tarea)
                                        return( */
                                            <Task id={id} key={tarea.id} tarea={tarea} index={index} />
                                        /* ) */
                                    )
                                }
                                {provided.placeholder}
                            </div>
                            
                        )
                        
                    }
                    
                </Droppable>
                
                <Task>

                </Task>
            </div>
        )
    }

}

export default Column