import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'

class RegisterUserForm extends Component{

    constructor(props){
        super(props)
    }

    render(){
        const { children, options, form, onChange, title } = this.props
        return(
            <Form { ... this.props}>
                <Subtitle className="text-center" color="gold">
                    {title}
                </Subtitle>
                <div className="row mx-0 mt-3 ,b-2">
                    <div className="col-md-6 px-2">
                        <Input onChange={ onChange } required name="name" type="text" value={ form.name } placeholder="Nombre"/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Input onChange={ onChange } required name="email" type="email" value={ form.email } placeholder="Email"/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Select onChange={ onChange } name="tipo" value={ form.tipo } placeholder="Selecciona el tipo de usuario" options={options} />
                    </div>
                </div>
                { children }
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default RegisterUserForm