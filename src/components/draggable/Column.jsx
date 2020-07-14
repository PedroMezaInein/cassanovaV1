import React, { Component } from 'react'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'
import Accordion from 'react-bootstrap/Accordion'
import { Small, Subtitle, P } from '../texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Input, Button } from '../form-components'
import { isMobile } from "react-device-detect"

function closeAcordion(){  
    if(document.getElementsByClassName('collapse')[0].classList.contains("show") )
    {      
        document.getElementsByClassName("collapse")[0].classList.remove("show");
    }
    else
    {         
        document.getElementsByClassName("collapse")[0].classList.add("show");
    } 
}

class Column extends Component{

    state = {
        mobileState: false,
    }

    submit = () => {
        const { submit, onChange, column, form } = this.props
        onChange( { target:{ name: 'grupo', value: column.id } } )
        if( form.titulo.length )
            submit()
    }

    render(){
        const { column, id, form, onChange, activeKey, handleAccordion, clickTask } = this.props
        const { mobileState } = this.state
        return(
            <div className="kanban-container">
                <div className="kanban-board" data-id="_inprocess" style={{width: "250px", marginLeft: "0px", marginRight: "0px"}}>
                
                <div className="position-relative">
                <header className="kanban-board-header light-primary">
                    <div className="kanban-title-board p-3">
                        {column.titulo}
                    </div>
                </header>
                </div>
                <Droppable droppableId={column.id.toString()}>
                    {
                        provided => (
                            <div 
                                className={ column.tareas.length > 0 ? 'py-1 kanban-drag ' : 'py-2 kanban-drag'}
                                ref={provided.innerRef}
                                { ...provided.droppableProps}>
                                {
                                    (!isMobile || mobileState)  ? 
                                        column.tareas.map((tarea, index) => 
                                            <Task id={id} key={tarea.id} tarea={tarea} index={index} clickTask = {clickTask} />
                                        )
                                    :
                                        column.tareas.map((tarea, index) => {
                                                return(
                                                    <>
                                                        {
                                                            index < 5 && <Task id={id} key={tarea.id} tarea={tarea} index={index} clickTask = {clickTask} />
                                                        }
                                                    </>         
                                                )
                                            }
                                        )
                                }
                                {provided.placeholder}
                            </div>
                            
                        )
                    }
                </Droppable>
                {
                    column.tareas.length > 5 && isMobile && mobileState &&
                        <div onClick = {(e) => {e.preventDefault(); this.setState({
                                mobileState: false
                            })}} 
                            className="text-right mb-2"
                            >
                            <Small className="px-3" color="dark-blue">
                                Mostrar menos
                            </Small>
                        </div>
                }
                {
                    column.tareas.length > 5 && isMobile && !mobileState &&
                        <div onClick = {(e) => {e.preventDefault(); this.setState({
                                mobileState: true
                            })}} 
                            className="text-right mb-2"
                            >
                            <Small className="px-3" color="dark-blue">
                                Mostrar más
                            </Small>
                        </div>
                }
                <Accordion activeKey = {activeKey} >
                    <div onClick = {(e) => {e.preventDefault(); handleAccordion(column.id);}} id="acordion">
                        <span className="btn btn-light btn-text-primary btn-hover-text-primary font-weight-bold btn-lg btn-block py-1" >
                            <FontAwesomeIcon className="mr-1" icon={faPlus} />
                            Añadir otra tarea
                        </span>
                    </div>
                    <Accordion.Collapse eventKey={column.id} >
                        <div className="background__white-bone tarea px-1 py-2 my-3 column__task d-flex justify-content-around align-items-center">
                            <Input 
                                className="border-0 mb-0 ml-1" 
                                placeholder="Título de la tarea" 
                                value = { form.titulo } 
                                name = 'titulo' 
                                onChange = { onChange } 
                                style={{paddingLeft:"10px"}}
                            />
                            <Button icon = { faCheck } text = '' onClick = { this.submit } color = "transparent" />
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div>
            </div>
        )
    }

}

export default Column