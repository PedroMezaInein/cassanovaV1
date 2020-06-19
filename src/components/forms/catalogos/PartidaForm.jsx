import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'
import { faAngleRight, faTimes, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge } from 'react-bootstrap'

class PartidaForm extends Component{

    render(){
        const { title, form, onChange, addSubpartida, deleteSubpartida, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-6 mx-center px-2">
                        <Input required name="partida" value={form.partida} placeholder="Nombre de la partida" onChange={onChange} iconclass={"far fa-window-maximize"}/>
                        <span className="form-text text-muted">Por favor, ingresa el nombre de la partida </span>
                    </div>
                    <div className="col-md-6 mx-center d-flex px-2 align-items-end">
                        <div className="w-100">
                            <Input name="subpartida" value={form.subpartida} placeholder="Subpartida " onChange={onChange} iconclass={"far fa-window-restore"}/>
                            <span className="form-text text-muted">Por favor, ingresa la subpartida </span>
                        </div>
                        <Button icon = {faCaretRight} text ="" color="transparent" className="pb-3 ml-2" onClick = { addSubpartida } />
                    </div>
                    {
                        form.subpartidas.map((element, key) => {
                            return(
                                <div className="col-md-3 px-2" key = { key } >
                                    <Badge variant = "light" className="image-upload d-flex px-3 align-items-center" pill>
                                        <FontAwesomeIcon
                                            icon = { faTimes }
                                            onClick = { (e) => { e.preventDefault(); deleteSubpartida(element) }}
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
                    form.partida !== '' && form.subpartidas.length > 0 ? 
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    : ''
                }
                
            </Form>
        )
    }
}

export default PartidaForm