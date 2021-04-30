import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Button, Select, SelectSearchTrue, RadioGroup, TagSelectSearch } from '../form-components'
import { EMAIL } from '../../constants'
import $ from "jquery";
class RegisterUserForm extends Component {
    nuevoUpdateDepartamento = seleccionados =>{
        const { form,deleteOption } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.departamentos.length){
            let diferencia = $(seleccionados).not(form.departamentos).get();
            let val_diferencia = diferencia[0].value
            this.updateDepartamento(val_diferencia)
        }
        else {
            let diferencia = $(form.departamentos ).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                deleteOption(borrar,"departamentos")
            })
        }
    }
    updateDepartamento = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.departamentos.map((departamento) => {
            if (departamento.value === value)
                onChangeAndAdd({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            return false
        })
        onChange({ target: { value: value, name: 'departamento' } })
    }
    nuevoUpdateProyecto= seleccionados =>{
        const { form,deleteOption } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.proyectos.length){
            let diferencia = $(seleccionados).not(form.proyectos).get();
            let val_diferencia = diferencia[0].value
            this.updateProyecto(val_diferencia)
        }
        else {
            let diferencia = $(form.proyectos ).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                deleteOption(borrar,"proyectos")
            })
        }
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
    transformarOptions = options => {  
        options = options?options:[]
        options.map((value)=>{
            value.label = value.name 
            return ''
        } );
        return options
    }
    render() {
        const { options, form, onChange, deleteOption, onChangeOptions, formeditado, departamentos_disponibles, proyectos_disponibles, onChangeAndAdd, ...props } = this.props
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
                    <div className="col-md-3">
                        <Input
                            onChange={onChange}
                            formeditado={formeditado}
                            requirevalidation={1}
                            name="name"
                            type="text"
                            value={form.name}
                            placeholder="NOMBRE DE USUARIO"
                            iconclass={"fas fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre de usuario."
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
                                        messageinc="Incorrecto. Selecciona el empleado"
                                    />
                                </div>
                                <div className="col-md-9">
                                    <TagSelectSearch
                                        placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                        options={this.transformarOptions(options.departamentos)}
                                        defaultvalue={this.transformarOptions(form.departamentos)}
                                        onChange={this.nuevoUpdateDepartamento}
                                        iconclass={"fas fa-layer-group"}
                                        requirevalidation={1}
                                        messageinc="Incorrecto. Selecciona el(los) departamento(s)"
                                    />
                                </div>
                            </div>
                        </> : ''
                }
                {
                    form.tipo === '3' ?
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12">
                                    <TagSelectSearch
                                        placeholder="SELECCIONA EL(LOS) PROYECTO(S)"
                                        options={this.transformarOptions(options.proyectos)}
                                        defaultvalue={this.transformarOptions(form.proyectos)}
                                        onChange={this.nuevoUpdateProyecto}
                                        iconclass={"fas fa-layer-group"}
                                        requirevalidation={1}
                                        messageinc="Incorrecto. Selecciona el(los) proyecto(s)"
                                    />
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