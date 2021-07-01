import React, { Component } from 'react';
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert';
import { Button, CalendarDay, InputNumberGray, InputMoneyGray, FileInput } from '../../form-components';
import SelectSearchGray from '../../form-components/Gray/SelectSearchGray';

class FormCalendarioIEquipos extends Component {

    updateSelect = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    handleChangeAdjunto = (e, index) => {
        const { onChange } = this.props
        const { value, files } = e.target
        let auxFiles = []
        files.forEach((file) =>{ auxFiles.push({file:file, name: file.name, url: URL.createObjectURL(file),}) })
        onChange({ target: { value: { value: value, files: auxFiles}, name: 'cotizacion' } })
    }

    deleteAdjunto = ( ) => {
        const { onChange } = this.props
        onChange({ target: { value: { value: '', files: []}, name: 'cotizacion' } })
    }

    render() {
        const { form, onChange, options, onSubmit } = this.props
        return (
            <Form id='form-equipo'>
                <div className="row justify-content-center mx-0">
                    <div className="col-md-6">
                        <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } options = { options.proyectos } placeholder = "SELECCIONA EL PROYECTO" 
                            name = "proyecto" value = { form.proyecto } onChange = { (value) => this.updateSelect(value, 'proyecto') } iconclass = "far fa-folder-open" 
                            messageinc = "Incorrecto. Selecciona el proyecto" customdiv = 'mb-0' withicon = { true }/>
                    </div>
                    <div className="col-md-6">
                        <SelectSearchGray withtaglabel = { 1 } withtextlabel = { 1 } options = { options.equipos } placeholder = "SELECCIONA EL EQUIPO" 
                            name = "equipo" value = { form.equipo } onChange = { (value) => this.updateSelect(value, 'equipo') } iconclass = "far fa-folder-open" 
                            messageinc = "Incorrecto. Selecciona el equipo" customdiv = 'mb-0' withicon = { true }/>
                    </div>
                    <div className="col-md-6">
                        <InputNumberGray requirevalidation = { 1 } placeholder = "INGRESA LA CANTIDAD DE EQUIPOS" type = "text" name = "cantidad"
                            value = { form.cantidad } onChange = { onChange } iconclass = "fas fa-tablet-alt" patterns = "[0-9]{1,2}" maxLength = "2"
                            messageinc = "Incorrecto. Ingresa la cantidad."  formgroup = 'mb-0' withicon = { true } />
                    </div>
                    <div className="col-md-6">
                        <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 1 } 
                            requirevalidation = { 1 } type = "text" placeholder = "INGRESA EL COSTO DE MANTENIMIENTO" value = { form.costo } 
                            iconclass = "fas fa-dollar-sign" thousandseparator = { true } onChange = { onChange } prefix = '$' formeditado = { 0 } 
                            name = "costo" customdiv = 'mb-0' messageinc = "Incorrecto. Ingresa el costo." />
                    </div>
                    <div className="col-md-6">
                        <InputNumberGray requirevalidation = { 1 } placeholder = "INGRESA EL TIEMPO DE VIDA (AÑOS)" type = "text" name = "duracion"
                            value = { form.duracion } onChange = { onChange } iconclass = "fas fa-id-card" patterns = "[0-9]{1,2}" maxLength = "2" 
                            messageinc = "Incorrecto. Ingresa el tiempo de vida." formgroup = 'mb-0' withicon = { true } />
                    </div>
                    <div className="col-md-6">
                        <InputNumberGray requirevalidation = { 1 } placeholder = "INGRESA LA PERIODICIDAD (MESES)" type = "text" name = "periodo"
                            value = { form.periodo } onChange = { onChange } iconclass = "fas fa-id-card" patterns = "[0-9]{1,2}" maxLength = "2"
                            messageinc = "Incorrecto. Ingresa la periodicidad."  formgroup = 'mb-0' withicon = { true } />
                    </div>
                    <div className="col-md-7 text-center pt-5">
                        <div className="d-flex justify-content-center pt-5" style={{ height: '1px' }}>
                            <label className="text-center font-weight-bolder">Fecha de instalación</label>
                        </div>
                        <CalendarDay value = { form.fecha } name = 'fecha' onChange = { onChange } date = { form.fecha } withformgroup = { 1 } 
                            requirevalidation = { 1 } />
                    </div>
                    <div className="col-md-12 mb-3 mt-4">
                        <div>
                            <FileInput requirevalidation = { 0 } formeditado = { 0 } placeholder = 'Cotización' name = 'cotizacion' 
                                onChangeAdjunto = { (e) => { this.handleChangeAdjunto(e) } } multiple = { false } id = 'cotizacion'
                                value = { form.cotizacion.value }  files = { form.cotizacion.files } classinput = 'file-input'
                                deleteAdjunto = { this.deleteAdjunto } iconclass = 'flaticon2-clip-symbol text-primary'
                                accept = 'application/pdf'
                                classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0' />
                        </div>                                
                    </div>
                </div>
                <div className="card-footer py-3 pr-1 text-right">
                    <Button icon = '' className = "btn btn-primary mr-2" text = "ENVIAR"
                        onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-equipo') }} />
                </div>
            </Form>
        );
    }
}

export default FormCalendarioIEquipos;