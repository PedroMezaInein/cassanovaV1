import React, { Component } from 'react'
import { Form } from 'react-bootstrap';
import { validateAlert } from '../../../../functions/alert';
import { SelectSearchGray, InputGray, Button } from '../../../form-components';
import { ItemSlider } from '../../../singles';
export default class FormNuevoTicket extends Component {

    updateSelect = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    render() {
        const { form, options, onSubmit, handleChange, onChange } = this.props
        return (
            <>
                <Form id="form-nuevo-ticket"
                    onSubmit={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-nuevo-ticket') } } >
                    <div className="form-group row form-group-marginless pt-4 justify-content-md-center">
                        <div className="col-md-4">
                            <SelectSearchGray requirevalidation = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 }
                                options = { options.proyectos } placeholder = 'SELECCIONA EL PROYECTO' name = 'proyecto'
                                value = { form.proyecto } onChange = { (value) =>  { this.updateSelect(value, 'proyecto') } } 
                                iconclass = 'las la-swatchbook icon-2x' messageinc = "Incorrecto. Selecciona el proyecto" />
                        </div>
                        <div className="col-md-4">
                            <SelectSearchGray requirevalidation = { 1 } withtaglabel = { 1 } withtextlabel = { 1 } withicon = { 1 }
                                options = { options.tiposTrabajo } placeholder = "SELECCIONA EL TIPO DE TRABAJO" name = "tipo_trabajo"
                                value = { form.tipo_trabajo } onChange = { (value) =>  { this.updateSelect(value, 'tipo_trabajo') } }  
                                iconclass = "las la-tools icon-xl" messageinc = "Incorrecto. Selecciona el tipo de trabajo" />
                        </div>
                        <div className="col-md-4">
                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                                requirevalidation = { 1 } placeholder = "NOMBRE DEL SOLICITANTE" value = { form.solicito } name = "solicito" 
                                onChange = { onChange } messageinc="Incorrecto. Ingresa el nombre del solicitante." />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-12">
                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } withformgroup = { 0 }
                                requirevalidation = { 1 } as = "textarea" placeholder = "DESCRIPCIÓN DEL PROBLEMA" rows = "2" 
                                value = { form.descripcion } name = "descripcion" onChange = { onChange } 
                                messageinc="Incorrecto. Ingresa una descripción." />
                        </div>
                    </div>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <div className="form-group row form-group-marginless justify-content-center">
                        <div className="col-md-6 text-center">
                            <label className="col-form-label mt-2 font-weight-bolder">{form.adjuntos.fotos.placeholder}</label>
                            <ItemSlider items={form.adjuntos.fotos.files} handleChange={handleChange} item="fotos" />
                        </div>
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon = '' text = 'ENVIAR'
                                    onClick={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-nuevo-ticket') } } />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        );
    }
}