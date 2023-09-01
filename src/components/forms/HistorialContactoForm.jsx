import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../functions/wizard'
import { Button, CalendarDay, InputGray, RadioGroupGray, SelectHorario, SelectSearchGray } from '../form-components'
import { ItemSlider } from '../singles'
import { doneAlert, printResponseErrorAlert, validateAlert, waitAlert } from '../../functions/alert'
import { apiPostFormData, catchErrors } from '../../functions/api'
class HistorialContactoForm extends Component{

    state = {
        form: {
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: false,
            descripcion: '',
            adjuntos: {
                adjuntos: {
                    files: []
                }
            },
            fechaContacto: new Date(),
            hora: '08',
            minuto: '00'
        },
        newTipoContacto: false
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        files.forEach((file, key) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: key } ) })
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({ ...this.state, form })
    }

    updateSelect = (value, name) => {
        const { form } = this.state
        let { newTipoContacto } = this.state
        if(name === 'tipoContacto'){
            if(value === 'New'){
                newTipoContacto = true
            }else{
                newTipoContacto = false
            }
        }
        form[name] = value
        this.setState({...this.state, form, newTipoContacto})
    }

    onSubmit = () => {
        waitAlert()
        const { at, refresh, lead } = this.props
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaContacto':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        apiPostFormData(`crm/contacto/lead/${lead.id}`, data, at).then((response) => {
            doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.', () => {refresh()} )
        }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    render(){
        const { form, newTipoContacto } = this.state
        const { options, classcalendar, classhora } = this.props
        return(
            <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" 
                            onClick = { openWizard1_for2_wizard } >
                            <div className="wizard-label pt-1">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" 
                            onClick = { openWizard2_for2_wizard } >
                            <div className="wizard-label pt-1">
                                <h3 className="wizard-title">
                                    <span>2.</span> Adjunto y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'for2-wizardP') } } >
                            <div id="for2-wizard-1-content" className="px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className = {`col-md-${newTipoContacto ? '4' : '6'}`}>
                                        <RadioGroupGray placeholder = "Selecciona el estatus del intento de contacto" formeditado = { 0 }
                                            name = 'success' onChange = { this.onChange } value = { form.success}
                                            options = { [
                                                { label: 'Contactado', value: 'Contactado' },
                                                { label: 'Sin respuesta', value: 'Sin respuesta' }
                                            ] }  />
                                    </div>
                                    <div className = {`col-md-${newTipoContacto ? '4' : '6'}`}>
                                        <SelectSearchGray formeditado = { 0 } requirevalidation = { 1 } options = { options.tiposContactos }
                                            placeholder = "SELECCIONA EL MEDIO DE CONTACTO" name = "tipoContacto" value = { form.tipoContacto }
                                            onChange = { (value) => { this.updateSelect(value, 'tipoContacto') } } withtaglabel = { 1 } 
                                            messageinc = "Incorrecto. Selecciona el medio de contacto." withicon = { 1 } withtextlabel = { 1 } />
                                    </div>
                                    {
                                        newTipoContacto ? 
                                            <div className="col-md-4">
                                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                                    withformgroup = { 1 } formeditado = { 0 } requirevalidation = { 1 }
                                                    onChange = { this.onChange } name = "newTipoContacto" type = "text"
                                                    value = { form.newTipoContacto } placeholder = "NUEVO TIPO DE CONTACTO"
                                                    iconclass = "fas fa-mail-bulk" messageinc = "Incorrecto. Ingresa el nuevo tipo de contacto." />
                                            </div>
                                        : <></>
                                    }
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 }
                                            withformgroup = { 1 } formeditado = { 0 } requirevalidation = { 1 } as='textarea'
                                            name = 'descripcion' placeholder = 'DESCRIPCIÓN DEL CONTACTO' onChange = { this.onChange } 
                                            value = { form.descripcion } rows='3' messageinc="Incorrecto. Ingresa una descripción." />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2" />
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" 
                                            onClick = { openWizard2_for2_wizard } data-wizard-type="action-next">
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="for2-wizard-2-content" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Adjunto y fecha de contacto</h5>
                                <div className="form-group row form-group-marginless d-flex justify-content-center">
                                    <div className="col-md-6 text-center align-self-center">
                                        <label className="col-4 font-weight-bolder align-self-center">Adjunto</label>
                                        <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos'
                                            handleChange = { this.handleChange } multiple = { false } />
                                    </div>
                                    <div className="col-md-6 text-center align-self-center">
                                        <div className={classcalendar}>
                                            <CalendarDay date = { form.fechaContacto } value = { form.fechaContacto } onChange = { this.onChange }
                                            name = 'fechaContacto' withformgroup = { 1 } requireValidation = { 1 } title="Fecha de contacto"/>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <div className={classhora}>
                                                <label className="col-form-label text-center font-weight-bolder">Hora de contacto</label>
                                                <div className="form-group row d-flex justify-content-center">
                                                    <SelectHorario onChange = { this.onChange } minuto = { { value: form.minuto, name: 'minuto' } }
                                                        hora = { { value: form.hora, name: 'hora' } } allhours = { 1 } />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top mt-3 pt-3">
                                    <div className="row">
                                        <div className="col-lg-6 text-left">
                                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" 
                                                onClick = { openWizard1_for2_wizard } data-wizard-type="action-prev">
                                                Anterior
                                            </button>
                                        </div>
                                        <div className="col-lg-6 text-right">
                                            <div className="">
                                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase"
                                                    onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'for2-wizardP') } }
                                                    text="Enviar" />
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default HistorialContactoForm