import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'
import {Input, Calendar, SelectSearch, Button } from '../../form-components'
import { DATE } from '../../../constants'
import ItemSlider from '../../singles/ItemSlider'

class ProcesoTicketForm extends Component {

    handleChangeDate = ( date ) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fechaProgramada', value: date } })
    }

    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'empleado', value: value } })
    }

    render() {
        const { form, onSubmit, formeditado, onChange, options, handleChange, deleteFile, generateEmail, estatus, ...props } = this.props
        return (
            <Form 
                id = "form-proceso"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-proceso')
                    }
                }
                {...props}>
                <div className="text-center text-dark font-size-h5 font-weight-bold">
                    TICKET EN PROCESO
                </div>
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-4">
                        <Calendar
                            onChangeCalendar = { this.handleChangeDate }
                            placeholder = "FECHA PROGRAMADA"
                            name = "fechaProgramada"
                            value = { form.fechaProgramada }
                            iconclass = "far fa-calendar-alt"
                            requirevalidation = { 0 }
                            patterns = { DATE }
                            disabled = { estatus === 'Terminado' ? true : false }
                            />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            options = { options.empleados }
                            placeholder = "TÉCNICO QUE ASISTE"
                            name = "empleado"
                            value = { form.empleado }
                            onChange = { this.updateEmpleado }
                            iconclass = "fas fa-layer-group"
                            formeditado = { formeditado }
                            disabled = { estatus === 'Terminado' ? true : false }
                            />
                    </div>
                    <div className="col-md-4">
                        <Input
                            placeholder = "¿QUIÉN RECIBE?"
                            name = "recibe"
                            value = { form.recibe }
                            onChange = { onChange }
                            iconclass = "fas fa-layer-group"
                            requirevalidation = { 0 }
                            formeditado = { formeditado }
                            disabled = { estatus === 'Terminado' ? true : false }
                            />
                    </div>
                    <div className="col-md-12">
                        <Input
                            formeditado = {formeditado}
                            requirevalidation = { 0 }
                            as = 'textarea'
                            name = 'descripcion'
                            placeholder = 'DESCRIPCIÓN SOLUCIÓN DEL PROBLEMA'
                            onChange = { onChange }
                            value = { form.descripcion }
                            rows = '3'
                            disabled = { estatus === 'Terminado' ? true : false }
                            messageinc = "Incorrecto. Ingresa una descripción."
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="text-center mt-4">
                            { form.adjuntos.reporte_problema_reportado.placeholder }
                        </div>
                        {
                            estatus === 'Terminado' ? 
                                <ItemSlider items = { form.adjuntos.reporte_problema_reportado.files } 
                                item = 'reporte_problema_reportado' /> 
                            :
                                <ItemSlider items = { form.adjuntos.reporte_problema_reportado.files } 
                                item = 'reporte_problema_reportado' handleChange = { handleChange } deleteFile = { deleteFile } /> 
                        }
                    </div>
                    <div className="col-md-6">
                        <div className="text-center mt-4">
                            { form.adjuntos.reporte_problema_solucionado.placeholder }
                        </div>
                        {
                            estatus === 'Terminado' ? 
                                <ItemSlider items = { form.adjuntos.reporte_problema_solucionado.files } 
                                    item = 'reporte_problema_solucionado' /> 
                            :
                                <ItemSlider items = { form.adjuntos.reporte_problema_solucionado.files } 
                                    item = 'reporte_problema_solucionado' handleChange = { handleChange } deleteFile = { deleteFile } /> 
                        }
                    </div>
                </div>

                {
                    estatus !== 'Terminado' ? 
                        <div className="d-flex justify-content-center mt-3 pt-3">
                            <div className="mr-5">
                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type="submit" text="GUARDAR" />
                            </div>
                            <div>
                                <Button icon='' className="btn btn-success font-weight-bold text-uppercase" onClick = { (e) => { e.preventDefault(); generateEmail(true)} }  text="TERMINAR" />
                            </div>
                        </div>
                    : ''
                }
                
            </Form>
        );
    }
}

export default ProcesoTicketForm
