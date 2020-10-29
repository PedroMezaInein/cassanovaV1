import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, Select, SelectSearch, Button, Calendar, InputNumberGray, RadioGroup } from '../../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../../functions/wizard'
import { validateAlert } from '../../../../functions/alert'

class PresupuestoDiseñoCRMForm extends Component {

    render() {
        const { title, options, formDiseño, onChange, setOptions, onChangeAdjunto, clearFiles, onSubmit, submitPDF, onChangeCheckboxes, checkButtonSemanas, formeditado, onChangeConceptos, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                            <div className="wizard-label pt-0">
                                <h3 className="wizard-title">
                                    <span>1.</span> Fase 1: Diseño</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2() }}>
                            <div className="wizard-label pt-0">
                                <h3 className="wizard-title">
                                    <span>2.</span> Fase 1: Diseño</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3() }}>
                            <div className="wizard-label pt-0">
                                <h3 className="wizard-title">
                                    <span>3.</span> Fase 2: Construcción</h3>
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
                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                }
                            }
                            {...props}
                        >
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos del presupuesto de diseño</h5>
                                {/* <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.precios}
                                            placeholder="SELECCIONA LOS M2"
                                            name="m2"
                                            value={formDiseño.m2}
                                            onChange={this.updateM2}
                                            iconclass={"fas fa-ruler-combined"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.esquemas}
                                            placeholder="ESQUEMA"
                                            name="esquema"
                                            value={formDiseño.esquema}
                                            onChange={this.updateEsquema}
                                            iconclass={"flaticon2-sheet"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            placeholder="Total"
                                            value={formDiseño.total}
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA"
                                            name="fecha"
                                            value={formDiseño.fecha}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="TIEMPO DE EJECUCIÓN (DÍAS)"
                                            value={formDiseño.tiempo_ejecucion_diseno}
                                            name="tiempo_ejecucion_diseno"
                                            onChange={onChange}
                                            iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoneyGray
                                            requirevalidation={0}
                                            type="text"
                                            placeholder="DESCUENTO"
                                            value={formDiseño.descuento}
                                            iconclass={"fas fa-percentage"}
                                            thousandseparator={true}
                                            onChange={onChange}
                                            prefix={'%'}
                                            messageinc="Incorrecto. Ingresa el porcentaje."
                                            formeditado={formeditado}                                            
                                            name="descuento"
                                        />
                                    </div>
                                </div> */}
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">INGRESA LOS TIEMPOS</h5>
                                {/* <div className="form-group row form-group-marginless">
                                    <div className="table-responsive-lg col-md-6">
                                        <table className="table">
                                            <thead >
                                                <tr>
                                                    <th className="dia">DÍA</th>
                                                    <th>ACTIVIDAD</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-justify">
                                                {
                                                    formDiseño.conceptos.map((concepto, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="dia" >
                                                                    <InputSinText
                                                                        placeholder='DÍA'
                                                                        requirevalidation={0}
                                                                        formeditado={formeditado}
                                                                        name='concepto1'
                                                                        value={concepto.value}
                                                                        onChange={(e) => { onChangeConceptos(e, key) }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {
                                                                        concepto.text
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive-lg col-md-6">
                                        <table className="table">
                                            <thead>
                                                <tr className="text-center">
                                                    <th scope="col"></th>
                                                    <th scope="col">LUN</th>
                                                    <th scope="col">MAR</th>
                                                    <th scope="col">MIE</th>
                                                    <th scope="col">JUE</th>
                                                    <th scope="col">VIE</th>
                                                    <th scope="col">SAB</th>
                                                    <th scope="col">DOM</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    formDiseño.semanas.map((semana, key) => {
                                                        return (
                                                            <tr className="text-center" key={key}>
                                                                <th scope="row">SEMANA {key + 1}</th>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'lunes') }} type="checkbox" value={semana.lunes} checked={semana.lunes} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'martes') }} type="checkbox" value={semana.martes} checked={semana.martes} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'miercoles') }} type="checkbox" value={semana.miercoles} checked={semana.miercoles} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'jueves') }} type="checkbox" value={semana.jueves} checked={semana.jueves} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'viernes') }} type="checkbox" value={semana.viernes} checked={semana.viernes} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'sabado') }} type="checkbox" value={semana.sabado} checked={semana.sabado} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <label className="checkbox checkbox-single">
                                                                        <input onChange={(e) => { checkButtonSemanas(e, key, 'domingo') }} type="checkbox" value={semana.domingo} checked={semana.domingo} className="checkable" />
                                                                        <span></span>
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div> */}
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los precios, las partidas y el tiempo de ejecución</h5>
                                {/* <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="PRECIO PARAMÉTRICO DE CONSTRUCCIÓN INFERIOR"
                                            value={formDiseño.precio_inferior_construccion}
                                            name="precio_inferior_construccion"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio paramétrico de construcción inferior."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="PRECIO PARAMÉTRICO DE CONSTRUCCIÓN SUPERIOR"
                                            value={formDiseño.precio_superior_construccion}
                                            name="precio_superior_construccion"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio paramétrico de construcción superior."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="TIEMPO DE EJECUCIÓN"
                                            value={formDiseño.tiempo_ejecucion_construccion}
                                            name="tiempo_ejecucion_construccion"
                                            onChange={onChange}
                                            iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="PRECIO PARAMÉTRICO DE MOBILIARIO INFERIOR"
                                            value={formDiseño.precio_inferior_mobiliario}
                                            name="precio_inferior_mobiliario"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio paramétrico de mobiliario inferior."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="PRECIO PARAMÉTRICO DE MOBILIARIO SUPERIOR"
                                            value={formDiseño.precio_superior_mobiliario}
                                            name="precio_superior_mobiliario"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio paramétrico de mobiliario superior."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <OptionsCheckbox
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA LAS PARTIDAS"
                                            options={formDiseño.tipo_partida === "partidasInein" ? formDiseño.partidasInein : formDiseño.partidasIm}
                                            name={formDiseño.tipo_partida}
                                            value={formDiseño.tipo_partida === "partidasInein" ? formDiseño.partidasInein : formDiseño.partidasIm}
                                            onChange={this.handleChangeCheckbox}
                                        />
                                    </div>
                                </div> */}
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-4" 
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            }
                                            text="ENVIAR" />
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" onClick = { submitPDF } text="ENVIAR Y GENERAR PDF" />
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

export default PresupuestoDiseñoCRMForm