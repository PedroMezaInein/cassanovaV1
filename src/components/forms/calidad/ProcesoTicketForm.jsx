import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'
import { Input, Calendar, SelectSearch, Button } from '../../form-components'
import { DATE } from '../../../constants'
import ItemSlider from '../../singles/ItemSlider'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../functions/wizard'

class ProcesoTicketForm extends Component {

    handleChangeDate = (date) => {
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
            <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de solicitud</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Reporte de archivos</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'for2-wizard-2-content')
                                }
                            }
                            {...props}
                        >
                            <div id="for2-wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA PROGRAMADA"
                                            name="fechaProgramada"
                                            value={form.fechaProgramada}
                                            iconclass="far fa-calendar-alt"
                                            requirevalidation={0}
                                            patterns={DATE}
                                            disabled={estatus === 'Terminado' ? true : false}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        {/* <SelectSearch
                                            options={options.empleados}
                                            placeholder="TÉCNICO QUE ASISTE"
                                            name="empleado"
                                            value={form.empleado}
                                            onChange={this.updateEmpleado}
                                            iconclass="fas fa-layer-group"
                                            formeditado={formeditado}
                                            disabled={estatus === 'Terminado' ? true : false}
                                            messageinc="Incorrecto. Selecciona el técnico que asiste"
                                        /> */}
                                        <Input placeholder = "TÉCNICO QUE ASISTE" name = "empleado" value = { form.empleado }
                                            onChange = { onChange } iconclass = "fas fa-layer-group" requirevalidation = { 0 }
                                            formeditado = { formeditado } disabled = { estatus === 'Terminado' ? true : false } />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            placeholder="¿QUIÉN RECIBE?"
                                            name="recibe"
                                            value={form.recibe}
                                            onChange={onChange}
                                            iconclass="fas fa-layer-group"
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            disabled={estatus === 'Terminado' ? true : false}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            as='textarea'
                                            name='descripcion'
                                            placeholder='DESCRIPCIÓN SOLUCIÓN DEL PROBLEMA'
                                            onChange={onChange}
                                            value={form.descripcion}
                                            rows='3'
                                            disabled={estatus === 'Terminado' ? true : false}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                            style={{ paddingLeft: "10px" }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="for2-wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Adjunta los reportes</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <div className="text-center mt-4">
                                            {form.adjuntos.reporte_problema_reportado.placeholder}
                                        </div>
                                        {
                                            estatus === 'Terminado' ?
                                                <ItemSlider items={form.adjuntos.reporte_problema_reportado.files}
                                                    item='reporte_problema_reportado' />
                                                :
                                                <ItemSlider items={form.adjuntos.reporte_problema_reportado.files}
                                                    item='reporte_problema_reportado' handleChange={handleChange} deleteFile={deleteFile} />
                                        }
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center mt-4">
                                            {form.adjuntos.reporte_problema_solucionado.placeholder}
                                        </div>
                                        {
                                            estatus === 'Terminado' ?
                                                <ItemSlider items={form.adjuntos.reporte_problema_solucionado.files}
                                                    item='reporte_problema_solucionado' />
                                                :
                                                <ItemSlider items={form.adjuntos.reporte_problema_solucionado.files}
                                                    item='reporte_problema_solucionado' handleChange={handleChange} deleteFile={deleteFile} />
                                        }
                                    </div>
                                </div>
                                <div className="border-top mt-3 pt-3">
                                    <div className="row">
                                        <div className="col-lg-6 text-left">
                                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                        </div>
                                        <div className="col-lg-6 text-right">
                                            {
                                                estatus !== 'Terminado' ?
                                                    <div className="">
                                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-2" text="GUARDAR" 
                                                            onClick={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'for2-wizard-2-content') } }/>
                                                        <Button icon='' className="btn btn-success font-weight-bold text-uppercase" text="TERMINAR" 
                                                            onClick={(e) => { e.preventDefault(); generateEmail(true) }} />
                                                    </div>
                                                : ''
                                            }
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProcesoTicketForm
