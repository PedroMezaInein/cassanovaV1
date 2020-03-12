import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, SelectSearch } from '../form-components'
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class TareaForm extends Component{


    state = {
        part: []
    }

    updateParticipantes = value => {
        const { update } = this.props
        update(value);
    }

    render(){
        const { form, participantes, participantesTask, deleteParticipante} = this.props
        const { part } = this.state
        console.log( 'FORM', form.participantes)
        console.log( 'PARTICIPANTES', participantes)
        console.log( 'PART', part)
        return(
            <Form { ... this.props}>
                <div className="row mx-0">
                    <div className="col-md-4 mx-auto no-label">
                        <Input className=" no-label " placeholder = 'Título' value = { form.titulo } name = 'titulo' />
                    </div>
                    
                    

                    <div className="col-md-12">
                        <Input placeholder = 'Descripción' value = { form.descripcion } name = 'descripcion' as="textarea" rows="3" 
                            onBlur = { (e) => { e.preventDefault(); console.log('onBlur')} } onChange = { (e) => { e.preventDefault(); console.log('onChange')} }/>
                    </div>

                    <div className={participantes.length > 0 ? "col-md-8 px-2" : "col-md-12 px-2"}>
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
                    
                </div>
                
            </Form>
        )
    }
}

export default TareaForm