import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch, Button, RadioGroup, Input, Calendar, InputNumber,InputPhone, FileInput} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { RFC, DATE, NSS, CURP, TEL } from '../../../constants'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard' 

class EmpleadosForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange} = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }


    render() {
        const { options, onChange, form, onSubmit, formeditado, onChangeAdjunto, clearFiles, title} = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> INFORMACIÓN GENERAL DEL EMPLEADO</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> INFORMACIÓN GENERAL DEL PUESTO</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> INFORMACIÓN GENERAL DE IMSS</h3>
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
                        >
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos generales e información bancaria</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
                                            onChange={onChange}
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="nombre"
                                            type="text"
                                            value={form.nombre}
                                            placeholder="NOMBRE DEL EMPLEADO"
                                            iconclass={"fas fa-user"}
                                            messageinc="Incorrecto. Ingresa el nombre."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="curp"
                                            type="text"
                                            value={form.curp}
                                            placeholder="CURP"
                                            iconclass={"far fa-address-card"}
                                            patterns={CURP}
                                            messageinc="Incorrecto. Ej. SIHC400128HDFLLR01"
                                            maxLength="18"
                                        />
                                        <pre id="resultado"></pre>
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="rfc"
                                            type="text"
                                            value={form.rfc}
                                            placeholder="RFC"
                                            iconclass={"far fa-file-alt"}
                                            patterns={RFC}
                                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                                            maxLength="13"
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumber
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="nss"
                                            type="text"
                                            value={form.nss}
                                            placeholder="NSS"
                                            iconclass={"fas fa-hospital-user"}
                                            patterns={NSS}
                                            messageinc="Incorrecto. Ej. 01234567891"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="nombre_emergencia"
                                            type="text"
                                            value={form.nombre_emergencia}
                                            placeholder="NOMBRE DEL CONTACTO DE EMERGENCIA"
                                            iconclass={"fas fa-user-circle"}
                                            messageinc="Incorrecto. Ingresa el nombre del contacto de emergencia."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputPhone
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            placeholder="TELÉFONO DE EMERGENCIA"
                                            name="telefono_emergencia"
                                            value={form.telefono_emergencia}
                                            onChange={onChange}
                                            iconclass={"fas fa-mobile-alt"}
                                            patterns={TEL}
                                            messageinc="Incorrecto. Ingresa el número de teléfono."
                                            thousandSeparator={false}
                                            prefix={''}
                                        />
                                    </div>
                                    
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="banco"
                                            type="text"
                                            value={form.banco}
                                            placeholder="BANCO"
                                            iconclass={" fab fa-cc-discover "}
                                            messageinc="Incorrecto. Ingresa el banco."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumber
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="cuenta"
                                            type="text"
                                            value={form.cuenta}
                                            placeholder="CUENTA"
                                            iconclass={" fas fa-id-card "}
                                            messageinc="Incorrecto. Ingresa el número de cuenta."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputNumber
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="clabe"
                                            type="text"
                                            value={form.clabe}
                                            placeholder="CLABE"
                                            iconclass={"fas fa-money-check-alt"}
                                            messageinc="Incorrecto. Ingresa la clabe."
                                            maxLength="18"
                                        />
                                    </div>
                                </div>
                                {
                                    title === 'Editar empleado'
                                        ? ''
                                        : <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-12">
                                                    <FileInput
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChangeAdjunto={onChangeAdjunto}
                                                        placeholder={form.adjuntos.datosGenerales.placeholder}
                                                        value={form.adjuntos.datosGenerales.value}
                                                        name='datosGenerales'
                                                        id='datosGenerales'
                                                        accept="image/*, application/pdf"
                                                        files={form.adjuntos.datosGenerales.files}
                                                        deleteAdjunto={clearFiles}
                                                        multiple
                                                    />
                                                </div>
                                            </div>
                                        </>
                                }
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa la información bancaria</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name={'tipo_empleado'}
                                            onChange={onChange}
                                            options={
                                                [
                                                    {
                                                        label: 'Administrativo',
                                                        value: 'Administrativo'
                                                    },
                                                    {
                                                        label: 'Obra',
                                                        value: 'Obra'
                                                    }
                                                ]
                                            }
                                            placeholder={'SELECCIONA EL TIPO DE EMPLEADO'}
                                            value={form.tipo_empleado}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name={'estatus_empleado'}
                                            onChange={onChange}
                                            options={
                                                [
                                                    {
                                                        label: 'Activo',
                                                        value: 'Activo'
                                                    },
                                                    {
                                                        label: 'Inactivo',
                                                        value: 'Inactivo'
                                                    }
                                                ]
                                            }
                                            value={form.estatus_empleado}
                                            placeholder={'SELECCIONA EL ESTATUS DE EMPLEADO'}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.empresas}
                                            placeholder="Selecciona la empresa"
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={this.updateEmpresa}
                                            iconclass={"far fa-building"}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDateInicio}
                                            placeholder="Fecha de inicio"
                                            name="fechaInicio"
                                            value={form.fechaInicio}
                                            selectsStart
                                            startDate={form.fechaInicio}
                                            endDate={form.fechaFin}
                                            iconclass={"far fa-calendar-alt"}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Calendar
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDateFin}
                                            placeholder="Fecha final"
                                            name="fechaFin"
                                            value={form.fechaFin}
                                            selectsEnd
                                            startDate={form.fechaInicio}
                                            endDate={form.fechaFin}
                                            minDate={form.fechaInicio}
                                            iconclass={"far fa-calendar-alt"}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="puesto"
                                            type="text"
                                            value={form.puesto}
                                            placeholder="PUESTO"
                                            iconclass={"fas fa-user-tie"}
                                            messageinc="Incorrecto. Ingresa el puesto."
                                        />
                                    </div>
                                </div>
                                {
                                    title === 'Editar empleado'
                                        ? ''
                                        :
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-12">
                                                    <FileInput
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChangeAdjunto={onChangeAdjunto}
                                                        placeholder={form.adjuntos.recibosNomina.placeholder}
                                                        value={form.adjuntos.recibosNomina.value}
                                                        name='recibosNomina'
                                                        id='recibosNomina'
                                                        accept="image/*, application/pdf"
                                                        files={form.adjuntos.recibosNomina.files}
                                                        deleteAdjunto={clearFiles}
                                                        multiple
                                                    />
                                                </div>
                                            </div>
                                        </>
                                }
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
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos del IMSS</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name={'estatus_imss'}
                                            onChange={onChange}
                                            options={
                                                [
                                                    {
                                                        label: 'Activo',
                                                        value: 'Activo'
                                                    },
                                                    {
                                                        label: 'Inactivo',
                                                        value: 'Inactivo'
                                                    }
                                                ]
                                            }
                                            value={form.estatus_imss}
                                            placeholder={'IMSS ESTATUS'}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="vacaciones_tomadas"
                                            type="text"
                                            value={form.vacaciones_tomadas}
                                            placeholder="DÍAS DE VACACIONES TOMADAS"
                                            iconclass={"far fa-calendar-alt"}
                                            messageinc="Incorrecto. Ingresa lod días de vacaciones tomadas."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Calendar
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA DE ALTA AL IMSS"
                                            name="fecha_alta_imss"
                                            value={form.fecha_alta_imss}
                                            patterns={DATE}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless"> 
                                    <div className="col-md-4">
                                        <InputNumber
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="numero_alta_imss"
                                            type="text"
                                            value={form.numero_alta_imss}
                                            placeholder="NÚMERO DE ALTA IMSS"
                                            iconclass={"fas fa-hospital-user"}
                                            patterns={NSS}
                                            messageinc="Incorrecto. Ej. 01234567891"
                                            //maxLength="11"
                                        />
                                    </div>
                                    {
                                        title === 'Editar empleado'
                                            ? ''
                                            :
                                            <div className="col-md-8">
                                                <FileInput
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChangeAdjunto={onChangeAdjunto}
                                                    placeholder={form.adjuntos.altasBajas.placeholder}
                                                    value={form.adjuntos.altasBajas.value}
                                                    name='altasBajas'
                                                    id='altasBajas'
                                                    accept="image/*, application/pdf"
                                                    files={form.adjuntos.altasBajas.files}
                                                    deleteAdjunto={clearFiles}
                                                    multiple
                                                />
                                            </div>
                                    }
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

export default EmpleadosForm