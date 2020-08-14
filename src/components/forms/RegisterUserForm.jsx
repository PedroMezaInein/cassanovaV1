import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select, SelectSearchTrue } from '../form-components'
import { EMAIL } from '../../constants'

class RegisterUserForm extends Component {

    constructor(props) {
        super(props)
    }

    updateDepartamento = value => {
        const { onChange, onChangeOptions, options, form } = this.props
        options.departamentos.map((departamento) => {

            console.log(departamento.value, " vs ", value)
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

    updateProyecto = value => {
        const { onChange, onChangeOptions, options, form } = this.props
        options.proyectos.map((proyecto) => {
            if (proyecto.value === value) {
                let aux = false;
                form.proyectos.map((proyecto) => {
                    if (proyecto.value === value)
                        aux = true
                })
                if (!aux)
                    onChangeOptions({ target: { value: proyecto.value, name: 'proyecto' } }, 'proyectos')
            }

        })
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    render() {
        const { options, form, onChange, deleteOption, onChangeOptions, formeditado, ...props } = this.props
        console.log(form)
        return (
            <Form {...props} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            onChange={onChange}
                            formeditado={formeditado}
                            requirevalidation={1}
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
                            requirevalidation={1}
                            formeditado={formeditado}
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
                            requirevalidation={1}
                            formeditado={formeditado}
                            onChange={onChange}
                            name="tipo"
                            value={form.tipo}
                            placeholder="SELECCIONA EL TIPO DE USUARIO"
                            options={options.tipos}
                            iconclass={"fas fa-user-cog"}
                            messageinc="Incorrecto. Selecciona el tipo de usuario."
                        />
                    </div>
                </div>
                {
                    form.tipo > 0 && form.tipo < 3 ?
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchTrue
                                    options={options.departamentos}
                                    placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                    name="departamento"
                                    value={form.departamento}
                                    onChange={this.updateDepartamento}
                                    iconclass={"fas fa-layer-group"}
                                    formeditado={formeditado}

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
                                                                    onClick={(e) => { e.preventDefault(); deleteOption(departamento, 'departamentos') }}
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
                {
                    form.tipo == 3 ?
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <SelectSearchTrue
                                    options={options.proyectos}
                                    placeholder="SELECCIONA EL(LOS) PROYECTO(S)"
                                    name="proyecto"
                                    value={form.proyecto}
                                    onChange={this.updateProyecto}
                                    iconclass={"fas fa-layer-group"}

                                />
                            </div>
                            <div className="col-md-8">
                                {
                                    form.proyectos.length > 0 ?
                                        <div className="col-md-12 row mx-0 align-items-center image-upload">
                                            {
                                                form.proyectos.map((proyecto, key) => {
                                                    console.log(proyecto)
                                                    return (
                                                        <div key={key} className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                            <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                                <div
                                                                    title="Borrar archivo"
                                                                    className="tagify__tag__removeBtn"
                                                                    role="button"
                                                                    aria-label="remove tag"
                                                                    onClick={(e) => { e.preventDefault(); deleteOption(proyecto, 'proyectos') }}
                                                                >
                                                                </div>
                                                                <div><span className="tagify__tag-text p-1 white-space">{proyecto.name}</span></div>
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