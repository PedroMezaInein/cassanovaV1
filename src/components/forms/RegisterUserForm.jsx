import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select, SelectSearchTrue } from '../form-components'
import { EMAIL } from '../../constants'

class RegisterUserForm extends Component {

    constructor(props) {
        super(props)
    }

    updateDepartamento = value => {
        const { onChange, onChangeOptions, options2, form } = this.props
        options2.departamentos.map((departamento) => {
            if (departamento.value === value) {
                let aux = false;
                form.departamentos.map((departamento) => {
                    if (departamento.value === value)
                        aux = true
                })
                if (!aux)
                    onChangeOptions({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            }

        })
        onChange({ target: { value: value, name: 'departamento' } })
    }

    render() {
        const { children, options, options2, form, onChange, title, deleteOption, tipo} = this.props
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
                {
                    tipo > 0 && tipo < 3 ?
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchTrue
                                    options={options2.departamentos}
                                    placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                    name="departamento"
                                    value={form.departamento}
                                    onChange={this.updateDepartamento}
                                    iconclass={"fas fa-layer-group"}

                                />
                            </div>
                            <div className="col-md-8">
                                {
                                    form.departamentos.length > 0 ?
                                        <div className="col-md-12 row mx-0 align-items-center image-upload">
                                            {
                                                form.departamentos.map((departamento, key) => {
                                                    return (
                                                        <div key={key} className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                            <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                                <div
                                                                    title="Borrar archivo"
                                                                    className="tagify__tag__removeBtn"
                                                                    role="button"
                                                                    aria-label="remove tag"
                                                                    onClick={(e) => { e.preventDefault(); deleteOption(departamento, 'departamentos', 'empleado') }}
                                                                >
                                                                </div>
                                                                <div><span className="tagify__tag-text p-1 white-space">{departamento.name}</span></div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                        : ''
                }
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default RegisterUserForm