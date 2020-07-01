import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox, SelectSearch } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class ClienteUserForm extends Component{

    updateProyectos = value => {
        const { onChange, onChangeOptions, options } = this.props
        options.proyectos.map((proyecto)=> {
            if(proyecto.value === value)
                onChangeOptions({ target: { value: proyecto.value, name: 'proyecto' } }, 'proyectos')
        })
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    

    render(){
        const { form, onChange, options, deleteOption, onChangeOption, clear, ...props } = this.props
        return(
            <div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            options = { options.proyectos } 
                            placeholder = "Selecciona el proyecto" 
                            name="proyecto"  
                            value = { form.proyecto } 
                            onChange = { this.updateProyectos } 
                            iconclass={"far fa-folder-open"} 
                            />
                        <span className="form-text text-muted">Por favor, seleccione el/los proyectos(s)</span>
                    </div>
                    <div className="col-md-8">
                        {
                            form.proyectos.length > 0 ?
                                <div className="col-md-12 d-flex align-items-center image-upload">
                                    {
                                        form.proyectos.map((proyecto, key)=>{
                                            return(
                                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                                    <FontAwesomeIcon
                                                        icon = { faTimes }
                                                        onClick = { (e) => { e.preventDefault(); deleteOption(proyecto, 'proyectos')  }}
                                                        className = "small-button mr-2" />
                                                        {
                                                            proyecto.name
                                                        }
                                                </Badge>
                                            )
                                        })
                                    }
                                </div>
                            : ''
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default ClienteUserForm