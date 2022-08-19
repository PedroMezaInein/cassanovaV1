import React, { Component } from 'react'
import { Form, Col, Row, Nav, Tab } from 'react-bootstrap'
import { SelectSearch, Button, Input, InputSinText, InputNumber, InputMoney, CalendarDay, OptionsCheckboxHeaders,OptionsCheckbox} from '../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import es from "date-fns/locale/es";
class PresupuestoDiseñoForm extends Component {

    state = {
        date: new Date()
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateEsquema = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'esquema' } })
    }
    
    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'tipoProyecto' } })
    }

    handleChangeCheckboxPlanos = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form.planos
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'planos')
    }

    handleChangeCheckboxPartidasAcabados = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form.partidasAcabados
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'partidasAcabados')
    }

    handleChangeCheckboxPartidasMobiliario = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form.partidasMobiliario
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'partidasMobiliario')
    }
    handleChangeCheckboxPartidasObra = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form.partidasObra
        aux.find(function (_aux, index) {
            if (_aux.id.toString() === name.toString()) {
                _aux.checked = checked
            }
            return false
        });
        onChangeCheckboxes(aux, 'partidasObra')
    }
    handleChangeCheckboxDesglose = e => {
        const { name, checked } = e.target
        const { form, onChangeCheckboxes } = this.props
        let aux = form.desglose
        aux.find(function (_aux, index) {
            if (_aux[0].id.toString() === name.toString()) {
                _aux[0].checked = checked
                if(checked == true){
                    form.total = form.total + _aux[0].monto
                    form.MontoIngenerias[0][0].monto = form.MontoIngenerias[0][0].monto + _aux[0].monto
                }else{
                    form.total = form.total - _aux[0].monto
                    form.MontoIngenerias[0][0].monto = form.MontoIngenerias[0][0].monto - _aux[0].monto
                }                

            }
            return false

        });
        onChangeCheckboxes(aux, 'desglose')
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, onSubmit, submitPDF, onChangeCheckboxes, checkButtonSemanas, formeditado, onChangeConceptos,onClickTab, activeKey, defaultKey, onChangePartidas, ...props } = this.props
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
                        {
                            form.fase2 ?
                                <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3() }}>
                                    <div className="wizard-label pt-0">
                                        <h3 className="wizard-title">
                                            <span>3.</span> Fase 2: Construcción</h3>
                                        <div className="wizard-bar"></div>
                                    </div>
                                </div>
                            : ''
                        }
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12 mx-0 px-0">
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
                                <Row>
                                    <Col md={4} className="px-0">
                                        <div className="col-md-12 text-center px-0" style={{ height: '14px' }}>
                                            <label className="text-center font-weight-bolder text-dark-60">Fecha</label>
                                        </div>
                                        <div className="col-md-12 text-center px-0">
                                            <CalendarDay value = { form.fecha } date = { form.fecha } onChange = { onChange }
                                                name = 'fecha' withformgroup={1} requirevalidation={1}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={8} className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <SelectSearch formeditado = { formeditado } options = { options.empresas } placeholder = "SELECCIONA LA EMPRESA"
                                                    name = "empresa" value = { form.empresa } onChange = { this.updateEmpresa }
                                                    iconclass = "far fa-building" messageinc = "Selecciona la empresa" />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectSearch formeditado = { formeditado } options = { options.tipos } placeholder = "SELECCIONA EL TIPO DE PROYECTO"
                                                    name = "tipoProyecto" value = { form.tipoProyecto } onChange = { this.updateTipoProyecto } 
                                                    iconclass = "far fa-building" messageinc = "Selecciona el tipo de proyecto" />
                                            </div>
                                            {/* <div className="col-md-4">
                                                <Input requirevalidation = { 1 } formeditado = { formeditado } placeholder = "NOMBRE DEL PROYECTO"
                                                    value = { form.proyecto } name = "proyecto" onChange = { onChange } iconclass = "far fa-folder-open"/>
                                            </div> */}
                                        {/* </div> */}
                                        
                                        {/* <div className="form-group row form-group-marginless"> */}
                                            <div className="col-md-4">
                                                <SelectSearch formeditado = { formeditado } options = { options.esquemas } placeholder = "ESQUEMA"
                                                    name = "esquema" value = { form.esquema } onChange = { this.updateEsquema } iconclass = "flaticon2-sheet"
                                                    messageinc = "Selecciona el esquema" />
                                            </div>
                                            <div className="col-md-12 px-09">
                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "m²"
                                                    value = { form.m2 } name = "m2" onChange = { onChange } iconclass = "fas fa-ruler-combined"
                                                    messageinc = "Ingresa los m²."/>
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumber formeditado = { formeditado } requirevalidation = { 0 } placeholder = "TOTAL"
                                                    value = { form.total } iconclass = "fas fa-dollar-sign" thousandseparator = { true }
                                                    disabled = { true } name = "total" />
                                            </div>
                                        {/* </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless"> */}
                                            <div className="col-md-4">
                                                <InputMoney requirevalidation = { 0 } type = "text" placeholder = "DESCUENTO" value = { form.descuento }
                                                    iconclass = "fas fa-percentage" thousandseparator = { true } onChange = { onChange } prefix = '%'
                                                    messageinc = "Ingresa el porcentaje." formeditado = { formeditado }  name = "descuento"/>
                                            </div>
                                            <div className="col-md-12 px-09">
                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "DÍAS DE EJECUCIÓN"
                                                    value = { form.tiempo_ejecucion_diseno } name = "tiempo_ejecucion_diseno" onChange = { onChange }
                                                    iconclass = "flaticon-calendar-with-a-clock-time-tools" messageinc = "Ingresa los días de ejecución." />
                                            </div>
                                            <div className='col-md-4 d-flex justify-content-start'>
                                                <div className="form-group">
                                                    <label className="col-form-label font-size-lg">¿Se incluyen renders?</label>
                                                    <div className="radio-inline">
                                                        <label className="radio">
                                                            <input type = "radio" name = 'si_renders' value = { true } onChange = { onChange }
                                                                checked = { form.si_renders } />Si
															<span></span>
                                                        </label>
                                                        <label className="radio">
                                                            <input type = "radio" name = 'si_renders' value = { false } onChange = { onChange }
                                                                checked = { !form.si_renders } />No
															<span></span>
                                                        </label>
													</div>
												</div>
                                            </div>
                                            {
                                                form.si_renders?
                                                    <div className="col-md-4">
                                                        <InputNumber formeditado = { formeditado } requirevalidation = { 1 } placeholder = "NÚMERO DE RENDERS"
                                                            value = { form.renders } iconclass = "fas fa-photo-video" thousandseparator = { true }
                                                            onChange = { onChange } name = "renders" messageinc = "Ingresa los números de renders."/>
                                                    </div>
                                                :''
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-9 mb-2">
                                        <OptionsCheckboxHeaders requirevalidation = { 0 } formeditado = { formeditado } placeholder = "SELECCIONA LOS PLANOS"
                                            options = { form.planos } name = 'planos'  value = { form.planos } onChange = { this.handleChangeCheckboxPlanos } />
                                    </div>
                                    <div className="col-md-1">
                                        <div className="form-group">
                                            <label className="font-weight-bolder m-0">Fases</label>
                                            <div className="checkbox-list pt-2">
                                                <label className="checkbox font-weight-light">
                                                    <input name = 'fase1' type = "checkbox" checked = { form.fase1 } onChange = { onChange } /> 
                                                    Fase 1
                                                    <span></span>
                                                </label>
                                                <label className="checkbox font-weight-light">
                                                    <input  name = 'fase2' type = "checkbox" checked = { form.fase2 } onChange = { onChange } /> 
                                                    Fase 2
                                                    <span></span>
                                                </label>  
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="font-weight-bolder ">desglose de montos</label>
                                                        <div className="checkbox-list pt-3">                                                        
                                                            {
                                                            form.desglose.map((desglo,index) => {
                                                                    return (
                                                                    <label className=" ">
                                                                          <Form.Check                                                                                 
                                                                                type="checkbox"
                                                                                label={  desglo[0].nombre + " -$" +desglo[0].monto.toFixed(2)}
                                                                                name={ desglo[0].id }
                                                                                checked= { desglo[0].checked }
                                                                                onChange = { this.handleChangeCheckboxDesglose }

                                                                            />
                                                                        <span></span>
                                                                    </label> 
                                                                    )
                                                                })
                                                            // :''
                                                            }
                                                        
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="font-weight-bolder m-0">desglose de Precios ingenerias</label>
                                                        <div className="checkbox-list pt-3">
                                                        
                                                            {
                                                            form.MontoIngenerias.map((desglo,index) => {
                                                                    return (
                                                                    <label className=" font-weight-light">
                                                                          { desglo[0].nombre } <strong>- ${desglo[0].monto.toFixed(2) }</strong><br  ></br>
                                                                        <span></span>
                                                                    </label> 
                                                                    )
                                                                })
                                                            }
                                                        
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="font-weight-bolder m-0">desglose de Precios esquemas</label>
                                                        <div className="checkbox-list pt-3">
                                                        
                                                            {
                                                            form.MontoEsquemas.map((desglo,index) => {
                                                                    return (
                                                                    <label className=" font-weight-light">
                                                                          { desglo[0].nombre } <strong>- ${desglo[0].monto.toFixed(2) }</strong><br  ></br>
                                                                        <span></span>
                                                                    </label> 
                                                                    )
                                                                })
                                                            }
                                                        
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
                                                    form.conceptos.map((concepto, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="dia">
                                                                    <InputSinText placeholder = 'DÍA' requirevalidation = { 0 }
                                                                        formeditado = { formeditado } name = 'concepto1' value = { concepto.value }
                                                                        onChange = { (e) => { onChangeConceptos(e, key) } } />
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
                                                        form.semanas.map((semana, key) => {
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
                                            <Calendar locale={es} date={date} color = {"#2171c1"}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="table-responsive-lg col-md-8">
                                            <table className="table table-vertical-center">
                                                <thead >
                                                    <tr>
                                                        <th className="dia">Anticipo porcentaje %</th>
                                                        <th>Nombre</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-justify">
                                                  <tr>
                                                    <td className="">
                                                        <InputMoney requirevalidation = { 0 } type = "text" placeholder = "ANTICIPO" value = { form.concepto1 }
                                                            iconclass = "fas fa-percentage" thousandseparator = { true } onChange = { onChange } prefix = '%'
                                                            messageinc = "Ingresa el porcentaje." formeditado = { formeditado }  name = "concepto1"/>
                                                     </td>
                                                     <td className="justify-content-center">
                                                         <div className="font-weight-bold text-dark-75 justify-content-center">
                                                            ANTICIPO
                                                         </div>
                                                     </td>
                                                  </tr>         
                                                  <tr>
                                                    <td className="">
                                                      <InputMoney requirevalidation = { 0 } type = "text" placeholder = "AVANCE DE OBRA" value = { form.concepto2 }
                                                            iconclass = "fas fa-percentage" thousandseparator = { true } onChange = { onChange } prefix = '%'
                                                            messageinc = "Ingresa el porcentaje." formeditado = { formeditado }  name = "concepto2"/>                                                        
                                                     </td>
                                                     <td className="justify-content-center">
                                                         <div className="font-weight-bold text-dark-75 justify-content-center">
                                                             AVANCE DE OBRA
                                                         </div>
                                                     </td>
                                                  </tr>         
                                                  <tr>
                                                    <td className="">
                                                        <InputMoney requirevalidation = { 0 } type = "text" placeholder = "FINIQUITO" value = { form.concepto3 }
                                                            iconclass = "fas fa-percentage" thousandseparator = { true } onChange = { onChange } prefix = '%'
                                                            messageinc = "Ingresa el porcentaje." formeditado = { formeditado }  name = "concepto3"/>
                                                     </td>
                                                     <td className="justify-content-center">
                                                         <div className="font-weight-bold text-dark-75 justify-content-center">
                                                            FINIQUITO
                                                         </div>
                                                     </td>
                                                  </tr>                                                  
                                                    
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    {
                                        form.fase2 ?
                                            <div>
                                                <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                            </div>
                                        :
                                        <div>
                                            <Button icon = '' className = "btn btn-light-primary btn-sm mr-2" only_icon = "far fa-save pr-0"
                                                tooltip = { { text: 'GUARDAR' } }
                                                onClick = {
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'wizard-2-content')
                                                    }
                                                } />
                                            <Button icon ='' className = "btn btn-light-success btn-sm mr-2" only_icon = "far fa-file-pdf pr-0"
                                                tooltip = { { text: 'GENERAR COTIZACIÓN' } }
                                                onClick = {
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(submitPDF, e, 'wizard-2-content')
                                                    }
                                                } />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <Tab.Container 
                                    defaultActiveKey={defaultKey?defaultKey:form.acabados?"acabados":form.mobiliario?"mobiliario": form.obra?"obra":"vacio"}
                                    activeKey={ activeKey?activeKey:form.acabados?"acabados":form.mobiliario?"mobiliario": form.obra?"obra":"vacio" }
                                    >
                                    <div className="form-group row form-group-marginless d-flex justify-content-between">
                                        <div className="col-md-7">
                                            <h5 className="mb-0 font-weight-bold text-dark">INGRESA LOS PRECIOS PARAMÉTRICOS Y EL TIEMPO DE EJECUCIÓN</h5>
                                        </div>
                                        <div className="col-md-5 d-flex justify-content-end">
                                            <div className="row py-0 mx-0">
                                                <label className="w-auto mr-4 py-0 col-form-label text-dark-75 font-weight-bold font-size-lg">¿Llevará desglose de información?</label>
                                                <div className="w-auto px-3">
                                                    <div className="radio-inline mt-0 ">
                                                        <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                                            <input type = "radio" name = 'si_desglose' value = { true } onChange = { onChange }
                                                                checked = { form.si_desglose } />Si
															<span></span>
                                                        </label>
                                                        <label className="radio radio-outline radio-brand text-dark-75 font-weight-bold">
                                                            <input type = "radio" name = 'si_desglose' value = { false } onChange = { onChange }
                                                                checked = { !form.si_desglose } />No
															<span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={form.acabados || form.mobiliario || form.obra ?"form-group row form-group-marginless":"row form-group-marginless"}>
                                        <div className="col-md-3">
                                            <Input requirevalidation = { 1 } formeditado = { formeditado } placeholder = "TIEMPO DE EJECUCIÓN (SEMANAS)"
                                                value = { form.tiempo_ejecucion_construccion } name = "tiempo_ejecucion_construccion" onChange = { onChange }
                                                iconclass = "flaticon-calendar-with-a-clock-time-tools" messageinc = "Ingresa el tiempo de ejecución."
                                                formgroup = "mb-1" />
                                        </div>
                                        <div className="col-md-3 align-self-center my-3">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="bullet bullet-bar bg-primary align-self-stretch"></span>
                                                <label className="checkbox checkbox-lg checkbox-light-primary checkbox-single flex-shrink-0 m-0 mx-2">
                                                    <input
                                                        type="checkbox"
                                                        name='acabados'
                                                        checked={form.acabados}
                                                        onChange={onChangePartidas}
                                                    />
                                                    <span></span>
                                                </label>
                                                <div>
                                                    <span className="text-dark-75 font-weight-bold font-size-lg">Acabados e instalaciones</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 align-self-center my-3">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="bullet bullet-bar bg-primary align-self-stretch"></span>
                                                <label className="checkbox checkbox-lg checkbox-light-primary checkbox-single flex-shrink-0 m-0 mx-2">
                                                    <input
                                                        type="checkbox"
                                                        name="mobiliario"
                                                        checked={form.mobiliario}
                                                        onChange={onChangePartidas}
                                                    />
                                                    <span></span>
                                                </label>
                                                <div>
                                                    <span className="text-dark-75 font-weight-bold font-size-lg">Mobiliario</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 align-self-center my-3">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="bullet bullet-bar bg-primary align-self-stretch"></span>
                                                <label className="checkbox checkbox-lg checkbox-light-primary checkbox-single flex-shrink-0 m-0 mx-2">
                                                    <input
                                                        type="checkbox"
                                                        name="obra"
                                                        checked={form.obra}
                                                        onChange={onChangePartidas}
                                                    />
                                                    <span></span>
                                                </label>
                                                <div>
                                                    <span className="text-dark-75 font-size-sm font-weight-bold font-size-lg mb-1">Obra civil</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        form.acabados || form.mobiliario || form.obra ?
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                        :""
                                    }
                                    <div className="form-group row form-group-marginless">
                                        <div className="col-md-2 align-self-center">
                                            <Nav className="navi navi-active">
                                                {
                                                    form.acabados ?
                                                        <Nav.Item className="navi-item">
                                                            <Nav.Link className="navi-link pl-0 bg-navi-light-primary" eventKey="acabados" onClick={() => { onClickTab("acabados") }}>
                                                                <span className="navi-text font-weight-bolder text-hover-primary"> Acabados e instalaciones</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        : ""
                                                }
                                                {
                                                    form.mobiliario ?
                                                        <Nav.Item className="navi-item">
                                                            <Nav.Link className="navi-link pl-0 bg-navi-light-primary" eventKey="mobiliario" onClick={() => { onClickTab("mobiliario") }}>
                                                                <span className="navi-text font-weight-bolder text-hover-primary">Mobiliario</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        : ""
                                                }
                                                {
                                                    form.obra ?
                                                        <Nav.Item className="navi-item">
                                                            <Nav.Link className="navi-link pl-0 bg-navi-light-primary" eventKey="obra" onClick={() => { onClickTab("obra") }}>
                                                                <span className="navi-text font-weight-bolder text-hover-primary">Obra civil</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        : ""
                                                }
                                            </Nav>
                                        </div>
                                    <div className="col-md-10">
                                        <Tab.Content>
                                                <Tab.Pane eventKey="vacio">
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="acabados">
                                                    <div className="col-md-12">
                                                        <div className='row mx-0 d-flex justify-content-center'>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "CONSTR. INTERIOR INF."
                                                                    value = { form.construccion_interiores_inf } name = "construccion_interiores_inf" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de constr. interior inf." iconclass = "fas fa-dollar-sign"
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "CONSTR. INTERIOR SUP."
                                                                    value = { form.construccion_interiores_sup } name = "construccion_interiores_sup" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de constr. de interiores sup." iconclass = "fas fa-dollar-sign"
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <OptionsCheckbox requirevalidation = { 0 } formeditado = { formeditado }
                                                        options = { form.partidasAcabados } name = 'partidasAcabados'  value = { form.partidasAcabados }
                                                        onChange = { this.handleChangeCheckboxPartidasAcabados } customgroup="columns-2"
                                                        customlist="px-3" customcolor="primary" />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="mobiliario">
                                                    <div className="col-md-12">
                                                        <div className='row mx-0 d-flex justify-content-center'>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "MOBILIARIO INF."
                                                                    value = { form.mobiliario_inf } name = "mobiliario_inf" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de mobiliario inf." iconclass = "fas fa-dollar-sign"
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "MOBILIARIO SUP."
                                                                    value = { form.mobiliario_sup } name = "mobiliario_sup" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de mobiliario sup." iconclass = "fas fa-dollar-sign"
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <OptionsCheckbox requirevalidation = { 0 } formeditado = { formeditado } options = { form.partidasMobiliario }
                                                        name = 'partidasMobiliario' value = { form.partidasMobiliario } customgroup = "columns-2"
                                                        onChange = { this.handleChangeCheckboxPartidasMobiliario } customlist="px-3" customcolor="primary"/>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="obra">
                                                    <div className="col-md-12">
                                                        <div className='row mx-0 d-flex justify-content-center'>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "CONST. CIVIL INF."
                                                                    value = { form.construccion_civil_inf } name = "construccion_civil_inf" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de const. civil inf." iconclass = "fas fa-dollar-sign" 
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <InputNumber requirevalidation = { 1 } formeditado = { formeditado } placeholder = "CONST. CIVIL SUP."
                                                                    value = { form.construccion_civil_sup } name = "construccion_civil_sup" onChange = { onChange }
                                                                    messageinc = "Ingresa el precio de const. civil sup." iconclass = "fas fa-dollar-sign"
                                                                    thousandseparator = { true } formgroup = "mb-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <OptionsCheckbox requirevalidation = { 0 } formeditado = { formeditado } name = 'partidasObra' 
                                                        options = { form.partidasObra } value = { form.partidasObra } customlist = "px-3"
                                                        onChange = { this.handleChangeCheckboxPartidasObra } customgroup = "columns-2" customcolor="primary"/>
                                                </Tab.Pane>
                                            </Tab.Content>
                                    </div>
                                    </div>
                                </Tab.Container>
                                    <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-light-primary btn-sm mr-2" only_icon="far fa-save pr-0" 
                                            tooltip = { { text: 'GUARDAR' } }
                                            onClick = {
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            }/>
                                        <Button icon = '' className = "btn btn-light-success btn-sm mr-2" only_icon = "far fa-file-pdf pr-0"
                                            tooltip = { { text: 'GENERAR COTIZACIÓN' } }
                                            onClick = {
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(submitPDF, e, 'wizard-3-content')
                                                }
                                            } />
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

export default PresupuestoDiseñoForm