import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'
import { faAngleRight, faTimes, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge } from 'react-bootstrap'

class AreaForm extends Component{

    render(){
        const { title, form, onChange, addSubarea, deleteSubarea, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-6 mx-center px-2">
                        <Input required name="nombre" value={form.nombre} placeholder="Nombre del área" onChange={onChange} iconclass={"far fa-window-maximize"}/>
                        <span className="form-text text-muted">Por favor, ingresa el nombre del área </span>
                    </div>
                    <div className="col-md-6 mx-center d-flex px-2 align-items-end">
                        <div className="w-100">
                            <Input name="subarea" value={form.subarea} placeholder="Subárea " onChange={onChange} iconclass={"far fa-window-restore"}/>
                            <span className="form-text text-muted">Por favor, ingresa la subárea </span>
                        </div>
                        <Button icon = {faCaretRight} text ="" color="transparent" className="pb-3 ml-2" onClick = { addSubarea } />
                    </div>
                    {
                        form.subareas.map((element, key) => {
                            return(
                                <div className="col-md-3 px-2" key = { key } >
                                    <Badge variant = "light" className="image-upload d-flex px-3 align-items-center" pill>
                                        <FontAwesomeIcon
                                            icon = { faTimes }
                                            onClick = { (e) => { e.preventDefault(); deleteSubarea(element) }}
                                            className = "small-button mr-2" />
                                            {
                                                element
                                            }
                                    </Badge>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    form.nombre !== '' && form.subareas.length > 0 ? 
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    : ''
                }
                
            </Form>
        )
    }
}

export default AreaForm