import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'
import { faAngleRight, faTimes, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge } from 'react-bootstrap'

class UnidadForm extends Component{

    render(){
        const { title, form, onChange, ... props } = this.props
        return(
            <Form { ... props}>
                <div className="row mx-0">
                    <div className="col-md-12 mx-center px-2">
                        <Input required name="tipo" value={form.tipo} placeholder="Tipo" onChange={onChange} 
                            iconclass={"far fa-window-maximize"}/>
                        <span className="form-text text-muted">Por favor, ingresa el tipo </span>
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default UnidadForm