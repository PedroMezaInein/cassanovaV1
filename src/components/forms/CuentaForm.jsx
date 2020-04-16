import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Subtitle } from '../texts'
import { Input, InputMoney, Select, Button } from '../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class LeadForm extends Component{

    constructor(props){
        super(props)   
    }
    
    render(){
        const { bancos, estatus, tipos, title, form, onChange, onChangeEmpresa, updateEmpresa, empresas, ...props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className = "text-center" color = "gold">
                    {title}
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-6">
                        <Input required placeholder = "Ingresa el nombre de la cuenta" type = "text" name = "nombre" value = { form.nombre } 
                            onChange = { onChange } />
                    </div>
                    
                    <div className="col-md-6">
                        <Select required name = 'banco' options = { bancos } placeholder = 'Selecciona el banco' value = { form.banco }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-6">
                        <Input required placeholder = "Ingresa el número de cuenta" type = "text" name = "numero" value = { form.numero }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-6">
                        <Select required name = 'tipo' options = { tipos } placeholder = 'Selecciona el tipo' value = { form.tipo }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-6">
                        <Select required name = 'estatus' options = { estatus } placeholder = 'Selecciona el estatus' value = { form.estatus }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-6">
                        <Select required name = 'empresa' options = { empresas } placeholder = 'Selecciona la(s) empresa(s)' value = { form.empresa }
                            onChange = { onChangeEmpresa } />
                    </div>
                    {
                        form.empresas.length > 0 ?
                            <div className="col-md-12 d-flex align-items-center image-upload">
                                {
                                    form.empresas.map((empresa, key)=>{
                                        return(
                                            <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                                <FontAwesomeIcon
                                                    icon = { faTimes }
                                                    onClick = { (e) => { e.preventDefault(); updateEmpresa(empresa) }}
                                                    className = "small-button mr-2" />
                                                    {
                                                        empresa.text
                                                    }
                                            </Badge>
                                        )
                                    })
                                }
                            </div>
                        : ''
                    }
                    

                    <div className="col-md-12">
                        <Input rows = "3" as = "textarea" placeholder = "Descripción" name = "descripcion" value = { form.descripcion }
                            onChange = { onChange } />
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default LeadForm