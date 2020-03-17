import React, { Component } from 'react'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'
import { CustomToggle } from '../singles'
import { Small, Subtitle, P } from '../texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Input, Button } from '../form-components'
import { GOLD } from '../../constants'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle'
import { isMobile } from "react-device-detect"
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
            <div className="column background__d-white-bone  my-3 px-4 py-3">
                
                <div className="position-relative">
                    <Subtitle color="dark-blue" className="mb-0 text-center">
                        {column.titulo}
                    </Subtitle>
                </div>
                <Droppable droppableId={column.id.toString()}>
                    {
                        provided => (
                            <div 
                                className={ column.tareas.length > 0 ? 'py-1' : 'py-2'}
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
                                                            index < 3 && <Task id={id} key={tarea.id} tarea={tarea} index={index} clickTask = {clickTask} />
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
                    column.tareas.length > 3 && isMobile && mobileState &&
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
                    column.tareas.length > 3 && isMobile && !mobileState &&
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
                    <div onClick = {(e) => {e.preventDefault(); handleAccordion(column.id)}} >
                        <Small className="px-3" color="gold">
                            <FontAwesomeIcon className="mr-1" icon={faPlus} />
                            Añadir otra tarea
                        </Small>
                    </div>
                    <Accordion.Collapse eventKey={column.id}>
                        <div className="background__white-bone tarea px-1 py-2 my-3 column__task d-flex justify-content-around align-items-center">
                            <Input className="border-0 mb-0" placeholder="Tarea nueva" value = { form.titulo } name = 'titulo' onChange = { onChange } />
                            <Button icon = { faCheck } text = '' onClick = { this.submit } color = "transparent" />
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div>
        )
    }

}

export default Column