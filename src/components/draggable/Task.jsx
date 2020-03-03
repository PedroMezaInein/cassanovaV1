import React, { Component } from 'react'
import { P, Subtitle } from '../texts'
import { Draggable } from 'react-beautiful-dnd'

class Task extends Component{

    render(){
        const { tarea, index, id } = this.props
        let new_index = index
        if(tarea){
            new_index = tarea.index
        }
        
        return(
            tarea ?
            <Draggable 
                draggableId={tarea.id.toString()}
                index={new_index}
                >
                { (provided) => (
                    <div
                        { ...provided.draggableProps} 
                        { ...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="border p-1 my-3 mx-1"
                        >
                        <P className="mb-0">
                            {tarea.titulo}
                        </P>
                    </div>
                )}
                
            </Draggable>
             :
            null
        )
    }
}

export default Task