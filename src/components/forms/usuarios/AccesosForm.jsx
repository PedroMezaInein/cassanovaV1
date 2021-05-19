import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, Button, TagSelectSearch, InputPhone } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { EMAIL, TEL } from '../../../constants'
import InputPassword from '../../form-components/InputPassword'
import $ from "jquery";

class AccesosForm extends Component {

    nuevoUpdateUsuarios = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.usuarios.length) {
            let diferencia = $(seleccionados).not(form.usuarios).get();
            let val_diferencia = diferencia[0].value
            this.updateUsuarios(val_diferencia)
        }
        else {
            let diferencia = $(form.usuarios).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "usuarios")
            })
        }
    }
    updateUsuarios = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.usuarios.map((user) => {
            if (user.value === value)
                onChangeAndAdd({ target: { value: user.value, name: 'responsable' } }, 'usuarios')
            return false
        })
        onChange({ target: { value: value, name: 'responsable' } })
    }

    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.text
            return ''
        });
        return options
    }

    nuevoUpdateEmpresa = seleccionados => {
        const { form, updateEmpresa, onChangeEmpresa } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.empresas.length) {
            let diferencia = $(seleccionados).not(form.empresas).get();
            let val_diferencia = diferencia[0].value
            onChangeEmpresa(val_diferencia)
        }
        else {
            let diferencia = $(form.empresas).not(seleccionados).get();
            diferencia.forEach(borrar => {
                updateEmpresa(borrar, "empresas")
            })
        }
    }
    updateDepartamentos = value => {
        const { onChange } = this.props
        onChange({target: { value: value, name: 'departamentos'}}, true)
    }
    render() {
        const { form, onChange, onSubmit, formeditado, options } = this.props
        return (
            <Form id="form-accesos"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-accesos')
                    }
                }
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <TagSelectSearch placeholder = "SELECCIONA LA EMPRESA"
                            options = { this.transformarOptions(options.empresas) }
                            defaultvalue = { this.transformarOptions(form.empresas) }
                            onChange = { this.nuevoUpdateEmpresa } iconclass = "far fa-building"
                            messageinc = "Incorrecto. Selecciona la(s) empresas." />
                    </div>
                    <div className="col-md-4">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "plataforma"
                            value = { form.plataforma } placeholder = "NOMBRE DE LA PLATAFORMA"
                            onChange = { onChange } iconclass = "flaticon2-website"
                            messageinc="Incorrecto. Ingresa el nombre de la plataforma."
                            /* letterCase = { false } */ />
                    </div>
                    <div className="col-md-4">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "url"
                            value = { form.url } placeholder = "LINK DE LA PLATAFORMA" onChange = { onChange }
                            iconclass = "fas fa-share-square" messageinc="Incorrecto. Ingresa el nombre del banco."
                            letterCase = { false }/>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } name = "usuario"
                            value = { form.usuario } placeholder = "USUARIO" onChange = { onChange } iconclass = "far fa-user"
                            messageinc = "Incorrecto. Ingresa el usuario." letterCase = { false }
                        />
                    </div>
                    <div className="col-md-4">
                        {/* Contraseña */}
                        {/* <Input  */}
                        <InputPassword formeditado = { formeditado } name = "contraseña" value = { form.contraseña }
                        placeholder = "CONTRASEÑA" onChange = { onChange } iconclass = "fab fa-diaspora"
                        messageinc = "Incorrecto. Ingresa la contraseña." letterCase = { false } 
                        requirevalidation = { 0 } />
                    </div>
                    <div className="col-md-4">
                        <TagSelectSearch placeholder = "SELECCIONA LO(S) RESPONSABLE(S)"
                            options = { this.transformarOptions(options.usuarios) }
                            defaultvalue = { this.transformarOptions(form.usuarios) }
                            onChange = { this.nuevoUpdateUsuarios }
                            requirevalidation = { 0 } iconclass = "far fa-user"
                            messageinc = "Incorrecto. Selecciona lo(s) responsable(s)" />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input formeditado = { formeditado } placeholder = "CORREO ELECTRÓNICO" value = { form.correo }
                            name = "correo" onChange = { onChange } iconclass = "far fa-envelope"
                            messageinc="Incorrecto. Ej. usuario@dominio.com" patterns = { EMAIL }
                            letterCase = { false }
                        />
                    </div>
                    <div className="col-md-4">
                        <InputPhone thousandseparator = { false } prefix = '' name = "numero" value = { form.numero }
                            placeholder = "TELÉFONO" onChange = { onChange } iconclass = "fas fa-mobile-alt"
                            messageinc="Incorrecto. Ingresa el número de teléfono." patterns = { TEL } 
                            formeditado = { formeditado } />
                    </div>
                    <div className="col-md-4">
                        <TagSelectSearch
                            placeholder='Selecciona el departamento '
                            options={options.departamentos}
                            iconclass='far fa-building'
                            defaultvalue={form.departamentos}
                            onChange={this.updateDepartamentos}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } rows = "3"
                            as = "textarea" placeholder = "DESCRIPCIÓN" name = "descripcion"
                            value = { form.descripcion } onChange = { onChange } style = { { paddingLeft: "10px" } }
                            messageinc = "Incorrecto. Ingresa la descripción." />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-accesos')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AccesosForm