import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, SelectSearch } from '../form-components'
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Calendar from '../form-components/Calendar'

class TareaForm extends Component{


    state = {
        part: []
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

    render(){
        const { form, participantes, participantesTask, deleteParticipante, changeValue, changeValueSend} = this.props
        const { part } = this.state
        console.log( 'FORM', form)
        return(
            <Form { ... this.props}>
                <div className="row mx-0">
                    <div className="col-md-4 mx-auto no-label">
                        <Input className=" no-label " placeholder = 'Título' value = { form.titulo } name = 'titulo' 
                            onBlur = { (e) => { e.preventDefault(); changeValueSend(e) } } onChange = { (e) => { e.preventDefault(); changeValue(e)} }/>
                    </div>

                    <div className="col-md-12">
                        <Input placeholder = 'Descripción' value = { form.descripcion } name = 'descripcion' as="textarea" rows="3" 
                            onBlur = { (e) => { e.preventDefault(); changeValueSend(e) } } onChange = { (e) => { e.preventDefault(); changeValue(e)} }/>
                    </div>

                    <div className={participantes.length > 0 ? "col-md-4 px-2" : "col-md-8 px-2"}>
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
                            <div className="col-md-4 px-2">
                                <SelectSearch 
                                    search
                                    options = { participantes }
                                    placeholder = "Selecciona los participantes" 
                                    name = "participantes"
                                    onChange={this.updateParticipantes}
                                    />
                            </div>
                    }

                    <div className="col-md-4">
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