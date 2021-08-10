import React, { Component } from 'react';
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, Input, SelectSearch } from '../../form-components';
import { ItemSlider } from '../../singles';

class EquipoForm extends Component {

    updateSelect = ( value, name ) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }
    
    render() {
        const { form, formeditado, onChange, options, handleChange, onSubmit } = this.props
        return (
            <Form id = 'form-equipo'>
                <div className="row form-group-marginless mx-0 my-6">
                    <div className="col-md-4">
                        <Input requirevalidation = { 1 } formeditado = { formeditado } name = "equipo" value = { form.equipo }
                            onChange = { onChange } type = "text" placeholder="NOMBRE DEL EQUIPO" iconclass = "fas fa-desktop"
                            messageinc="Incorrecto. Ingresa el nombre del equipo." />
                    </div>
                    <div className="col-md-4">
                        <Input requirevalidation = { 1 } formeditado = { formeditado } name = "marca" value = { form.marca }
                            onChange = { onChange } type = "text" placeholder="MARCA DEL EQUIPO" iconclass = "fab fa-apple"
                            messageinc="Incorrecto. Ingresa la marca del equipo." />
                    </div>
                    <div className="col-md-4">
                        <Input requirevalidation = { 1 } formeditado = { formeditado } name = "modelo" value = { form.modelo }
                            onChange = { onChange } type = "text" placeholder="MODELO DEL EQUIPO" iconclass = "fas fa-desktop"
                            messageinc="Incorrecto. Ingresa el model del equipo." />
                    </div>
                    <div className="col-md-12 separator separator-dashed mb-5 mt-8" />
                    <div className="col-md-6">
                        <SelectSearch options = { options.proveedores } placeholder = "SELECCIONA EL PROVEEDOR" name = "proveedor" 
                            value = { form.proveedor } onChange = { (value) => this.updateSelect(value, 'proveedor') } 
                            iconclass = 'far fa-user' messageinc="Incorrecto. Selecciona el proveedor" />
                    </div>
                    <div className="col-md-6">
                        <SelectSearch options = { options.partidas } placeholder = "SELECCIONA LA PARTIDA" name = "partida" 
                            value = { form.partida } onChange = { (value) => this.updateSelect(value, 'partida') } 
                            iconclass = 'fas fa-book' messageinc="Incorrecto. Selecciona la partida" />
                    </div>
                    <div className="col-md-12 separator separator-dashed mb-4 mt-8" />
                    <div className="col-md-12 mb-3">
                        <Input requirevalidation = { 0 } formeditado = { formeditado } placeholder = "OBSERVACIONES" as = "textarea"
                            name = "observaciones" value = { form.observaciones } onChange = { onChange } messageinc = "Incorrecto. Ingresa las observaciones."
                            customclass="px-2 textarea-input text-justify" />
                    </div>
                    <div className="col-md-6 mx-auto pt-3">
                        <div className="mt-5">
                            <ItemSlider items = { form.adjuntos.adjunto.files } item = 'adjunto' multiple = { false }
                                handleChange = { handleChange } deleteFile = { this.deleteFile }  />
                        </div>
                    </div>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon = '' className = "btn btn-primary mr-2" text = "ENVIAR"
                        onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-equipo') } } />
                </div>
            </Form>            
        );
    }
}

export default EquipoForm;