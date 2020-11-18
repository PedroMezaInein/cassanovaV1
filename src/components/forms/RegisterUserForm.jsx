import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select, SelectSearchTrue, RadioGroup } from '../form-components'
import { EMAIL } from '../../constants'
class RegisterUserForm extends Component {
    updateDepartamento = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.departamentos.map((departamento) => {
            if (departamento.value === value)
                onChangeAndAdd({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            return false
        })
        onChange({ target: { value: value, name: 'departamento' } })
    }
    updateProyecto = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.proyectos.map((proyecto) => {
            if (proyecto.value === value)
                onChangeAndAdd({ target: { value: proyecto.value, name: 'proyecto' } }, 'proyectos')
            return false
        })
        onChange({ target: { value: value, name: 'proyecto' } })
    }
    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empleado' } })
    }
    render() {
        const { options, form, onChange, deleteOption, onChangeOptions, formeditado, departamentos_disponibles, proyectos_disponibles, ...props } = this.props
        return (
            <Form {...props} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3 d-flex align-items-center">
                        <RadioGroup
                            placeholder = 'SELECCIONA EL GÉNERO'
                            formeditado = { formeditado }
                            name = 'sexo'
                            onChange = { onChange }
                            options = {
                                [
                                    {
                                        label: 'Femenino',
                                        value: 'femenino'
                                    },
                                    {
                                        label: 'Masculino',
                                        value: 'masculino'
                                    }/* ,
                                    {
                                        label: 'No binario',
                                        value: 'no binario'
                                    } */
                                ]
                            }
                            value = { form.sexo }
                        />
                    </div>
                    {/* <div className="col-md-3">
                        <Form.Label className="col-form-label">Selecciona el tipo de sexo</Form.Label>
                        <div className="input-icon">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className="fas fa-venus-mars kt-font-boldest text-primary"></i>
                                </span>
                            </span>
                            <Form.Control className="form-control is-valid text-uppercase" value = {form.sexo} onChange={onChange} name='sexo' formeditado={formeditado} as="select">
                                <option disabled selected value = {0}> Selecciona el sexo</option>
                                <option value={"femenino"}>Femenino</option>
                                <option value={"masculino"}>Masculino</option>
                            </Form.Control>
                        </div>
                    </div> */}
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-3">
                                    <SelectSearchTrue
                                        options={options.empleados}
                                        placeholder="SELECCIONA EL EMPLEADO"
                                        name="empleado"
                                        value={form.empleado}
                                        onChange={this.updateEmpleado}
                                        iconclass={"fas fa-layer-group"}
                                        formeditado={formeditado}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchTrue
                                        options={departamentos_disponibles}
                                        placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                        name="departamento"
                                        value={"No hay más departamentos"}
                                        onChange={this.updateDepartamento}
                                        iconclass={"fas fa-layer-group"}
                                        formeditado={formeditado}
                                    />
                                </div>
                                <div className="col-md-6">
                                    {
                                        form.departamentos.length > 0 ?
                                            <div className="col-md-12 row mx-0 align-items-center image-upload">
                                                {
                                                    form.departamentos.map((departamento, key) => {
                                                        return (
                                                            <div key={key} className="tagify form-control p-1 col-md-4 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
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
                        </> : ''
                }
                {
                    form.tipo === '3' ?
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-3">
                                    <SelectSearchTrue
                                        options={proyectos_disponibles}
                                        placeholder="SELECCIONA EL(LOS) PROYECTO(S)"
                                        name="proyecto"
                                        value={form.proyecto}
                                        onChange={this.updateProyecto}
                                        iconclass={"fas fa-layer-group"}
                                    />
                                </div>
                                <div className="col-md-9">
                                    {
                                        form.proyectos.length > 0 ?
                                            <div className="col-md-12 row mx-0 align-items-center image-upload">
                                                {
                                                    form.proyectos.map((proyecto, key) => {
                                                        return (
                                                            <div key={key} className="tagify form-control p-1 col-md-4 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
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
                        </>
                        : ''
                }
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon='' />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default RegisterUserForm