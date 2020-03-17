import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Subtitle } from '../texts'
import { Input, InputMoney, Select, Button } from '../form-components'

class LeadForm extends Component{

    constructor(props){
        super(props)   
    }
    
    render(){
        const { bancos, estatus, tipos, title, form, onChange, empresas, ...props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className = "text-center" color = "gold">
                    {title}
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-4">
                        <Input required placeholder = "Ingresa el nombre de la cuenta" type = "text" name = "nombre" value = { form.nombre } 
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-4">
                        <Select required name = 'empresa' options = { empresas } placeholder = 'Selecciona la empresa' value = { form.empresa }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-4">
                        <Select required name = 'banco' options = { bancos } placeholder = 'Selecciona el banco' value = { form.banco }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-4">
                        <Input required placeholder = "Ingresa el número de cuenta" type = "text" name = "numero" value = { form.numero }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-4">
                        {/* <Input required placeholder = "Ingresa el balance" type = "text" name = "balance" value = { form.balance }
                            onChange = { onChange } /> */}
                        <InputMoney placeholder = "Ingresa el balance" value = { form.balance } name = "balance" onChange = { onChange }/>
                    </div>
                    <div className="col-md-4">
                        <Select required name = 'tipo' options = { tipos } placeholder = 'Selecciona el tipo' value = { form.tipo }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-4">
                        <Select required name = 'estatus' options = { estatus } placeholder = 'Selecciona el estatus' value = { form.estatus }
                            onChange = { onChange } />
                    </div>
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