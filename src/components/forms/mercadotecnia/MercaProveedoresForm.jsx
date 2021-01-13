import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { EMAIL, RFC, TEL } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { Button, Input, Select, SelectSearch } from '../../form-components';
import InputNumber from '../../form-components/InputNumber';
import InputPhone from '../../form-components/InputPhone';

class MercaProveedoresFrom extends Component{

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }
    
    render(){
        const { title, options, form, onChange, setOptions, onSubmit, formeditado, ...props } = this.props
        return(
            <Form id = "form-proveedor" { ...props }
                onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-proveedor') } }>
                <div className="form-group row form-group-marginless mt-4">
                    <div className="col-md-4">
                        <Input requirevalidation = { 1 } name = "razonSocial" value = { form.razonSocial } onChange = { onChange }
                            placeholder = "RAZÓN SOCIAL / NOMBRE DE LA EMPRESA" formeditado = { formeditado }
                            iconclass = "far fa-building" messageinc = "Incorrecto. Ingresa la razón social."/>
                    </div>
                    <div className="col-md-4">
                        <Input name = "rfc" value = { form.rfc } placeholder = "RFC" onChange = { onChange }
                            iconclass = "far fa-file-alt" patterns = { RFC } formeditado = { formeditado }
                            messageinc = "Incorrecto. Ej. ABCD001122ABC" maxLength = "13"/>
                    </div>
                    <div className="col-md-4">
                        <SelectSearch required options = { options.subareas } placeholder = "SELECCIONA EL SUBÁREA"
                            name = "subarea" value = { form.subarea } onChange = { this.updateSubarea }
                            formeditado = { formeditado } iconclass = "far fa-window-restore"
                            messageinc = "Incorrecto. Selecciona el subárea" />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className = 'col-md-4'>
                        <Input name = 'nombre' value = { form.nombre } requirevalidation = { 0 }
                            placeholder = 'NOMBRE DE CONTACTO' onChange = { onChange } iconclass = 'far fa-user'
                            formeditado = { formeditado } messageinc = 'Incorrecto. Ingresa el nombre.' />
                    </div>
                    <div className="col-md-4">
                        <Input requirevalidation = { 0 } name = "correo" value = { form.correo }
                            placeholder = "CORREO ELECTRÓNICO" type = "email" onChange = { onChange }
                            iconclass = "fas fa-envelope" messageinc = "Incorrecto. Ej. usuario@dominio.com"
                            patterns = { EMAIL } formeditado = { formeditado }
                        />
                    </div>
                    <div className="col-md-4">
                        <InputPhone requirevalidation = { 0 } thousandseparator = { false } prefix = ''
                            name = "telefono" value = { form.telefono } placeholder = "TELÉFONO"
                            onChange = { onChange } iconclass = "fas fa-mobile-alt" patterns = { TEL }
                            messageinc = "Incorrecto. Ingresa el número de teléfono." formeditado = { formeditado } />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputNumber requirevalidation = { 0 } name = "numCuenta" value = { form.numCuenta }
                            placeholder = "NÚMERO DE CUENTA" onChange = { onChange } iconclass = " fas fa-id-card "
                            formeditado = { formeditado } messageinc = "Incorrecto. Ingresa el número de cuenta." />
                    </div>
                    <div className="col-md-4">
                        <Select requirevalidation = { 0 } name = 'tipo' options = { options.tipos }
                            placeholder = 'SELECCIONA EL TIPO DE CUENTA' value = { form.tipo }
                            onChange = { onChange } formeditado = { formeditado }
                            iconclass = " far fa-address-card"/>
                    </div>
                    <div className="col-md-4">
                        <Select requirevalidation = { 0 } name = 'banco' options = { options.bancos } value = { form.banco }
                            placeholder = 'SELECCIONA EL BANCO' onChange = { onChange } formeditado = { formeditado }
                            iconclass = " fab fa-cc-discover " />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon = '' className = "btn btn-primary" text = "ENVIAR"
                        onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-proveedor') } } />
                </div>
            </Form>
        )
    }
}

export default MercaProveedoresFrom