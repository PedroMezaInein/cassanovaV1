import React, { Component } from 'react'
import { Subtitle } from '../texts'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'

class Column extends Component{

    render(){
        const { column, id } = this.props
        return(
            <div className="border my-3 p-2">
                <Subtitle className="mb-0 text-center">
                    {column.titulo}
                </Subtitle>
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