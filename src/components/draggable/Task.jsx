import React, { Component } from 'react'
import { P, Subtitle } from '../texts'
import { Draggable } from 'react-beautiful-dnd'
import { Button } from '../form-components'
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GOLD } from '../../constants'

class Task extends Component{

    handleClick = () => {
        alert('pushado')
    }
    render(){
        const { tarea, index, id, clickTask } = this.props
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
                        className="background__white-bone tarea px-3 py-2 my-3 d-flex justify-content-around align-items-center"
                        
                        >
                        <P className="my-1 text-left w-100">
                            {tarea.titulo}
                        </P>
                        <FontAwesomeIcon icon={faEye} color={GOLD} onClick = { (e) => { e.preventDefault(); clickTask(tarea)} }/>
                    </div>
                )}
                
            </Draggable>
             :
            null
        )
    }
}

export default Task