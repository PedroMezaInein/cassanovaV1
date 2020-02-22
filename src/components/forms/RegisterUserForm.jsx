import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'

class RegisterUserForm extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { children, options, form, onChange } = this.props
        return(
            <Form { ... this.props}>
                <Subtitle color="gold">
                    Llena los campos para registrar un nuevo campo.
                </Subtitle>
                <Input onChange={ onChange } required name="name" type="text" value={ form.name } placeholder="Nombre"/>
                <Input onChange={ onChange } required name="email" type="email" value={ form.email } placeholder="Email"/>
                <Select onChange={ onChange } name="tipo" value={ form.tipo } placeholder="Selecciona el tipo de usuario" options={options} />
                { children }
                <div className="mt-3 text-center">
                    <Button className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default RegisterUserForm