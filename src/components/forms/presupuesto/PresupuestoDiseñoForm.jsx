import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { RFC, DATE } from '../../../constants'
import { SelectSearch, Button, Input, Calendar, InputSinText, FileInput } from '../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'

class PresupuestoDiseñoForm extends Component {

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateM2 = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'm2' } })
    }

    updateEsquema = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'esquema' } })
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, onSubmit, formeditado, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps px-8 pb-8 px-lg-15 pb-lg-3">
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
                <div className="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
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
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos del presupuesto de diseño</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.empresas}
                                            placeholder="SELECCIONA LA EMPRESA"
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={this.updateEmpresa}
                                            iconclass={"far fa-building"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        {/* <SelectSearch
                                            formeditado={formeditado}
                                            options={options.m2}
                                            placeholder="SELECCIONA LOS M2"
                                            name="m2"
                                            value={form.m2}
                                            onChange={this.updateM2}
                                            iconclass={"fas fa-ruler-combined"}
                                        /> */}
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={""}
                                            placeholder="SELECCIONA LOS M2"
                                            name=""
                                            value={""}
                                            onChange={""}
                                            iconclass={"fas fa-ruler-combined"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        {/* <SelectSearch
                                            formeditado={formeditado}
                                            options={options.esquema}
                                            placeholder="ESQUEMA"
                                            name="esquema"
                                            value={form.esquema}
                                            onChange={this.updateEsquema}
                                            iconclass={"flaticon2-sheet"}
                                        /> */}
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={""}
                                            placeholder="ESQUEMA"
                                            name=""
                                            value={""}
                                            onChange={""}
                                            iconclass={"flaticon2-sheet"}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA"
                                            name="fecha"
                                            value={form.fecha}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="TIEMPO DE EJECUCIÓN"
                                            value={form.tiempo_ejecucion_diseno}
                                            name="tiempo_ejecucion_diseno"
                                            onChange={onChange}
                                            iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                                        />
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
                                <h5 className="mb-4 font-weight-bold text-dark">INGRESA LOS DATOS DEL </h5>
                                <div className="form-group row form-group-marginless">
                                    <div class="table-responsive-lg col-md-6">
                                        <table class="table">
                                            <thead >
                                                <tr>
                                                    <th className="dia">DÍA</th>
                                                    <th>ACTIVIDAD</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-justify">
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Reunión de ambos equipos</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Desarrollo del material para la primera revisión presencial</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Junta presencial para primera revisión de la propuesta de diseño y modelo 3D</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Desarrollo del proyecto</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Junta presencial para segunda revisión de la propuesta de diseño y modelo 3D</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Desarrollo del proyecto ejecutivo</td>
                                                </tr>
                                                <tr>
                                                    <td className="dia" >
                                                        <InputSinText
                                                            placeholder='DÍA'
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            name=''
                                                            value={''}
                                                            onChange={''}
                                                        />
                                                    </td>
                                                    <td>Entrega final del proyecto en digital</td>
                                                </tr>
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
                                                <tr className="text-center">
                                                    <th scope="row">SEMANA 1</th>
                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>

                                                    <td>
                                                        <label class="checkbox checkbox-single">
                                                            <input type="checkbox" value="" class="checkable" />
                                                            <span></span>
                                                        </label>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el tipo de pago, impuesto y estatus</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        {/* <SelectSearch
                                            formeditado={formeditado}
                                            options={options.partida}
                                            placeholder="Partida"
                                            name="partida"
                                            value={form.partida}
                                            onChange={this.updatePartida}
                                            iconclass={"flaticon2-sheet"}
                                        /> */}
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={""}
                                            placeholder="Partida"
                                            name=""
                                            value={""}
                                            onChange={""}
                                            iconclass={"flaticon2-sheet"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="COSTO INFERIOR"
                                            value={form.costo_inferior}
                                            name="costo_inferior"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el costo inferior."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="COSTO SUPERIOR"
                                            value={form.costo_superior}
                                            name="costo_superior"
                                            onChange={onChange}
                                            messageinc="Incorrecto. Ingresa el costo superior."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    
                                </div>
                                
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type="submit" text="Enviar" />
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