import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select } from '../form-components'
import { Subtitle, P } from '../texts'
import { EMAIL } from '../../constants'

class RegisterUserForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { children, options, form, onChange, title } = this.props
        return (
            <Form
                {... this.props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-4">
                        <Input
                            onChange={onChange}
                            required
                            name="name"
                            type="text"
                            value={form.name}
                            placeholder="NOMBRE"
                            iconclass={"fas fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre."
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            onChange={onChange}
                            required
                            name="email"
                            type="email"
                            value={form.email}
                            placeholder="CORREO ELECTRÓNICO"
                            iconclass={"fas fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                        />
                    </div>
                    <div className="col-md-4">
                        <Select
                            onChange={onChange}
                            name="tipo"
                            value={form.tipo}
                            placeholder="SELECCIONA EL TIPO DE USUARIO"
                            options={options}
                            iconclass={"fas fa-user-cog"}
                            messageinc="Incorrecto. Selecciona el tipo de usuario."
                        />
                    </div>
                </div>
                {children}
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default RegisterUserForm