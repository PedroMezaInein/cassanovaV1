import React, { Component } from 'react'
import { P, Subtitle } from '../texts'
import { Draggable } from 'react-beautiful-dnd'
import { Button } from '../form-components'
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'

class Task extends Component{

    handleClick = () => {
        alert('pushado')
    }
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
                        className="border p-2 my-3 mx-1"
                        >
                        <P className="mb-0 mt-2 text-center w-100">
                            {tarea.titulo}
                        </P>
                        <div className=" d-flex justify-content-around mt-2 align-items-center">
                            <Button text='' icon={faTrash} color="red" onClick={this.handleClick}/>
                            <Button text='' icon={faEye} color="transparent" onClick={this.handleClick}/>
                        </div>
                    </div>
                )}
                
            </Draggable>
             :
            null
        )
    }
}

export default Task