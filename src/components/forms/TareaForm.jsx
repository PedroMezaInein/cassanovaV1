import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, SelectSearch, Button } from '../form-components'
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrashAlt, faCheck, faTrash, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import Calendar from '../form-components/Calendar'
import { Small } from '../texts'
import { GOLD, DARK_BLUE } from '../../constants'
import ReactTooltip from "react-tooltip";

class TareaForm extends Component{


    state = {
        activeEnd: '',
        activeDelete: ''
    }

    updateParticipantes = value => {
        const { update } = this.props
        update(value);
    }

    onChangeCalendar = date =>{
        const { changeValueSend, changeValue } = this.props
        changeValue( { target: { name: 'fecha_limite', value: date } } )
        changeValueSend( { target: { name: 'fecha_limite', value: date } } )
    }

    onClickEnd = () => {
        const { activeEnd } = this.state
        if(activeEnd === ''){
            this.setState({
                activeEnd: 'active',
                activeDelete: ''
            })
        }else{
            this.setState({
                activeEnd: '',
                activeDelete: ''
            })
        }
    }

    onClickDelete = () => {
        const { activeDelete } = this.state
        if(activeDelete === ''){
            this.setState({
                activeDelete: 'active',
                activeEnd: ''
            })
        }else{
            this.setState({
                activeDelete: '',
                activeEnd: ''
            })
        }
    }

    onClickClose = () => {
        this.setState({
            activeDelete: '',
            activeEnd: ''
        })
    }

    render(){
        const { form, participantes, participantesTask, deleteParticipante, changeValue, changeValueSend, deleteTarea, endTarea} = this.props
        const { activeEnd, activeDelete } = this.state
        return(
            <Form { ... this.props}>
                <div className="row mx-0">
                    <div className="col-md-6 mx-auto no-label">
                        <Input className=" no-label " placeholder = 'Título' value = { form.titulo } name = 'titulo' 
                            onBlur = { (e) => { e.preventDefault(); changeValueSend(e) } } onChange = { (e) => { e.preventDefault(); changeValue(e)} }/>
                    </div>

                    <div className="col-md-12 d-flex justify-content-end">
                        <div className="d-flex align-items-center px-2">
                            <FontAwesomeIcon data-tip data-for="end" icon = { faCalendarCheck } color = { DARK_BLUE } className = "mr-2 button-hover" onClick = { () => this.onClickEnd() } />
                            <ReactTooltip id='end' place="top" type='success' effect="solid">
                                Terminar
                            </ReactTooltip>
                            <div className = { `${activeEnd} transition-all hidden` }>
                                <Small className="d-flex align-items-center">
                                    ¿Das por terminada la tarea?
                                    <Button icon = { faTimes } color = "transparent"  text = "" className = "small-button mx-1" onClick = { () => this.onClickClose() } />
                                    <Button color = "transparent" className = "small-button" onClick={() => endTarea(form.id)}>
                                        <FontAwesomeIcon color = { GOLD } icon = { faCheck } />
                                    </Button>
                                </Small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center px-2">
                            <FontAwesomeIcon data-tip data-for="delete" icon={faTrashAlt} color="red" className="mr-2 button-hover" onClick = { () => this.onClickDelete() }/>
                            <ReactTooltip id='delete' place="top" type='error' effect="solid">
                                Eliminar
                            </ReactTooltip>
                            <div className = { `${activeDelete} transition-all hidden` }>
                                <Small className="d-flex align-items-center">
                                    ¿Estás seguro? 
                                    <Button color="transparent" className="small-button mx-1"  onClick = { () => this.onClickClose() }>
                                        <FontAwesomeIcon color={GOLD} icon={faTimes} />
                                    </Button>
                                    <Button icon={faCheck} color="transparent"  text="" className="small-button"  onClick={() => deleteTarea(form.id)}/>
                                </Small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <Input placeholder = 'Descripción' value = { form.descripcion } name = 'descripcion' as="textarea" rows="3" 
                            onBlur = { (e) => { e.preventDefault(); changeValueSend(e) } } onChange = { (e) => { e.preventDefault(); changeValue(e)} }/>
                    </div>

                    <div className={participantes.length > 0 ? "col-md-6 px-2" : "col-md-8 px-2"}>
                        {
                            participantesTask.map( ( participante, key ) => {
                                return(
                                    <Badge key = { key } pill variant = "success" className="mr-2">
                                        <div className="d-flex align-items-center px-2 py-1">
                                            <FontAwesomeIcon icon={faTimes} className="mr-1 button-hover" onClick = { (e) => { e.preventDefault(); deleteParticipante(participante.identificador)} } />
                                            {
                                                participante.name
                                            }
                                        </div>
                                    </Badge>
                                )
                            })
                        }
                    </div>

                    {
                        participantes.length > 0 &&
                            <div className="col-md-6 px-2">
                                <SelectSearch 
                                    search
                                    options = { participantes }
                                    placeholder = "Selecciona los participantes" 
                                    name = "participantes"
                                    onChange={this.updateParticipantes}
                                    />
                            </div>
                    }

                    <div className="col-md-6">
                        <Calendar 
                            onChangeCalendar={ this.onChangeCalendar }
                            placeholder="Fecha límite"
                            name="fecha_limite"
                            value = { (form.fecha_limite === null || form.fecha_limite === undefined) ? '' : new Date(form.fecha_limite) }
                            />
                    </div>
                    
                </div>
                
            </Form>
        )
    }
}

export default TareaForm