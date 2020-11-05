import React, { Component } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import { InputGray, SelectSearchGray, Button, InputNumberGray, OptionsCheckbox,OptionsCheckboxHeaders, InputMoneyGray, CalendarDay } from '../../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../../functions/wizard'
import { validateAlert } from '../../../../functions/alert'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import es from "date-fns/locale/es";
class PresupuestoDiseñoCRMForm extends Component {
    
    state = {
        date: new Date()
    }
    
    updateEsquema = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'esquema' } })
    }

    handleChangeCheckboxPartidas = e => {
        const { name, checked } = e.target
        const { formDiseño, onChangeCheckboxes } = this.props
        let aux = formDiseño.partidas
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'partidas')
    }
    
    handleChangeCheckboxPlanos = e => {
        const { name, checked } = e.target
        const { formDiseño, onChangeCheckboxes } = this.props
        let aux = formDiseño.planos
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'planos')
    }
    
    render() {
        const { options, formDiseño, onChange, onSubmit, submitPDF, onChangeCheckboxes, checkButtonSemanas, formeditado, onChangeConceptos, ...props } = this.props
        const { date } = this.state
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos del presupuesto de diseño</h5> */}
                                <Row>
                                    <Col md={4} className="px-0">
                                        <div className="col-md-12 text-center px-0" style={{ height: '14px' }}>
                                            <label className="text-center font-weight-bolder text-dark-60">Fecha</label>
                                        </div>
                                        <div className="col-md-12 text-center px-0">
                                            <CalendarDay
                                                value={formDiseño.fecha}
                                                onChange={onChange}
                                                name='fecha'
                                            />
                                        </div>
                                    </Col>
                                    <Col md={8} className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="M2"
                                                    value={formDiseño.m2}
                                                    name="m2"
                                                    onChange={onChange}
                                                    iconclass={"fas fa-ruler-combined"}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectSearchGray
                                                    formeditado = { formeditado }
                                                    options = { options.esquemas }
                                                    placeholder = "ESQUEMA"
                                                    name = "esquema"
                                                    value = { formDiseño.esquema }
                                                    onChange = { this.updateEsquema }
                                                    iconclass = "flaticon2-sheet"
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
                                        </div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="DÍAS DE EJECUCIÓN"
                                                    value={formDiseño.tiempo_ejecucion_diseno}
                                                    name="tiempo_ejecucion_diseno"
                                                    onChange={onChange}
                                                    iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    requirevalidation={0}
                                                    placeholder="TOTAL"
                                                    value={formDiseño.total}
                                                    iconclass={"fas fa-dollar-sign"}
                                                    thousandseparator={true}
                                                    disabled={true}
                                                    name="total"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    requirevalidation={0}
                                                    placeholder="NÚMERO DE RENDERS"
                                                    value={formDiseño.renders}
                                                    iconclass={"fas fa-photo-video"}
                                                    thousandseparator={true}
                                                    onChange={onChange}
                                                    name="renders"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6 mb-2">
                                        <OptionsCheckboxHeaders
                                            requirevalidation = { 0 }
                                            formeditado = { formeditado }
                                            placeholder = "SELECCIONA LAS PLANOS"
                                            options = { formDiseño.planos }
                                            name = 'planos' 
                                            value = { formDiseño.planos }
                                            onChange = { this.handleChangeCheckboxPlanos }
                                            />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="font-weight-bolder m-0">Fases</label>
                                            <div className="checkbox-list pt-2">
                                                <label className="checkbox font-weight-light">
                                                    <input
                                                        name = 'fase1'
                                                        type="checkbox"
                                                        checked = { formDiseño.fase1 }
                                                        onChange={onChange} 
                                                    /> Fase 1
                                                    <span></span>
                                                </label>
                                                <label className="checkbox font-weight-light">
                                                    <input 
                                                        name = 'fase2'
                                                        type="checkbox"
                                                        checked = { formDiseño.fase2 }
                                                        onChange={onChange}
                                                    /> 
                                                    Fase 2
                                                    <span></span>
                                                </label>  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                {/* <h5 className="mb-4 font-weight-bold text-dark">INGRESA LOS TIEMPOS</h5> */}
                                <div className="form-group row form-group-marginless">
                                    <div className="table-responsive-lg col-md-6">
                                        <table className="table table-vertical-center">
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
                                                                <td className="dia">
                                                                    <InputGray
                                                                        customdiv={"mb-0"}
                                                                        withtaglabel={0}
                                                                        withtextlabel={0}
                                                                        withplaceholder={0}
                                                                        withicon={0}
                                                                        placeholder='DÍA'
                                                                        requirevalidation={0}
                                                                        formeditado={formeditado}
                                                                        name='concepto1'
                                                                        value={concepto.value}
                                                                        onChange={(e) => { onChangeConceptos(e, key) }}
                                                                    />
                                                                </td>
                                                                <td className="">
                                                                    <div className="font-weight-bold text-dark-75">
                                                                        {concepto.text}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="table-responsive-lg">
                                            <table className="table table-vertical-center">
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
                                                                    <th scope="row" className="px-0">
                                                                        <div className="font-size-sm">SEMANA {key + 1}</div>
                                                                    </th>
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
                                        <div className="d-flex justify-content-center">
                                            <Calendar
                                                locale={es}
                                                date={date}
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                <h5 className="mb-4 font-weight-bold text-dark">INGRESA LOS PRECIOS PARAMÉTRICOS Y EL TIEMPO DE EJECUCIÓN</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="CONSTR. INTERIOR INF."
                                            value={formDiseño.construccion_interiores_inf}
                                            name="construccion_interiores_inf"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de constr. interior inf."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="CONSTR. INTERIOR SUP."
                                            value={formDiseño.construccion_interiores_sup}
                                            name="construccion_interiores_sup"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de constr. de interiores sup."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="MOBILIARIO INF."
                                            value={formDiseño.mobiliario_inf}
                                            name="mobiliario_inf"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de mobiliario inf."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="MOBILIARIO SUP."
                                            value={formDiseño.mobiliario_sup}
                                            name="mobiliario_sup"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de mobiliario sup."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="CONST. CIVIL INF."
                                            value={formDiseño.construccion_civil_inf}
                                            name="construccion_civil_inf"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de const. civil inf."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="CONST. CIVIL SUP."
                                            value={formDiseño.construccion_civil_sup}
                                            name="construccion_civil_sup"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el precio de const. civil sup."
                                            iconclass={"fas fa-dollar-sign"}
                                            thousandseparator={true}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
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
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <OptionsCheckbox
                                            requirevalidation = { 0 }
                                            formeditado = { formeditado }
                                            placeholder = "SELECCIONA LAS PARTIDAS"
                                            options = { formDiseño.partidas }
                                            name = 'partidas' 
                                            value = { formDiseño.partidas }
                                            onChange = { this.handleChangeCheckboxPartidas }
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button 
                                            icon=''
                                            className="btn btn-light-primary btn-sm mr-2"
                                            only_icon="far fa-save pr-0"
                                            tooltip={{ text: 'GUARDAR' }}
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            }
                                        />
                                        <Button 
                                            icon=''
                                            className="btn btn-light-success btn-sm mr-2"
                                            only_icon="far fa-file-pdf pr-0"
                                            tooltip={{ text: 'GENERAR PDF' }}
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(submitPDF, e, 'wizard-3-content')
                                                }
                                            }                                            
                                        />
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