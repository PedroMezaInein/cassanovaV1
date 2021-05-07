import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import moment from 'moment'

class Task extends Component{

    diffDate = date => {

        if(date === null){
            return null
        }
        var now  = new Date();
        var then = new Date(date);

        var diff = moment.duration(moment(then).diff(moment(now)));
        
        var days = parseInt(diff.asDays());

        return days

    }

    render(){
        const { tarea, index, clickTask } = this.props
        let new_index = index
        let _fecha_limite = null
        if( tarea ){
            _fecha_limite = this.diffDate(tarea.fecha_limite)
        }
        if(tarea){
            new_index = tarea.posicion
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
                        className="px-3 py-2 my-3"
                        >
                            <div> 
                            </div>
                            
                            <div className="py-2 px-3 d-flex align-items-left kanban-item" onClick = { (e) => { e.preventDefault(); clickTask(tarea)} }>
                                <div className="d-flex flex-column align-items-start">
                                    <span className="text-dark-50 font-weight-bold mb-1">{tarea.titulo}</span>
                                    {
                                        _fecha_limite && _fecha_limite < 1 ?
                                            <div className="text-right"> 
                                                <span className="label label-inline label-light-danger font-weight-bold">Tarea caducada</span> 
                                            </div>
                                        : ''
                                    }
                                    {
                                        (_fecha_limite && _fecha_limite >= 0 && _fecha_limite < 7) ?
                                            <div className="text-right">
                                                <span className="label label-inline label-light-danger font-weight-bold">{ _fecha_limite }</span>
                                            </div>
                                        : ''
                                    }
                                    
                                </div> 
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