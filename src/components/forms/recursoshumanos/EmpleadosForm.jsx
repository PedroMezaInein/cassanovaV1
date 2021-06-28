import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { RadioGroupGray, Button, RangeCalendar, TagSelectSearchGray, CalendarDay, InputGray, InputPhoneGray, SelectSearchGray, InputNumberGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { RFC, NSS, CURP, TEL } from '../../../constants'
import { openWizard1_4TABS, openWizard2_4TABS, openWizard3_4TABS, openWizard4_4TABS } from '../../../functions/wizard'
import $ from "jquery";
import { ItemSlider } from '../../../components/singles';

class EmpleadosForm extends Component {

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha_alta_imss' } })
    }

    updateEmpresa = value => {
        const { onChange} = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateEstadoCivil = value => {
        const { onChange} = this.props
        onChange({ target: { value: value, name: 'estado_civil' } })
    }

    nuevoUpdateDepartamento = seleccionados =>{
        const { form,deleteOption } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.departamentos.length){
            let diferencia = $(seleccionados).not(form.departamentos).get();
            let val_diferencia = diferencia[0].value
            this.updateDepartamento(val_diferencia)
        }
        else {
            let diferencia = $(form.departamentos ).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                deleteOption(borrar,"departamentos")
            })
        }
    }

    updateDepartamento = value => { 
        const { onChange, options, onChangeOptions, form } = this.props
        options.departamentos.map((departamento) => {
            if (departamento.value === value) {
                let aux = false;
                form.departamentos.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            }
            return false
        })
        onChange({ target: { value: value, name: 'departamento' } })
    }
    transformarOptions = options => {  
        options = options ? options : []
        options.map( (value) => {
            value.label = value.name 
            return ''
        });
        return options
    }
    render() {
        const { options, onChange, form, onSubmit, formeditado, onChangeRange, handleChange, title} = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> INFORMACIÓN DEL COLABORADOR</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> INFORMACIÓN DEL PUESTO</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> INFORMACIÓN DE LAS PRESTACIONES</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        {
                            title !== 'Editar colaborador' &&
                            <div id="wizard-4" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard4_4TABS() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>4.</span> ADJUNTOS</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form className="px-3"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                }
                            } 
                        >
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <div className="row mx-0">
                                    <div className="col-md-4 text-center align-self-center">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bold text-dark-60">Fecha de nacimiento</label>
                                            </div>
                                            <CalendarDay value={form.fecha_nacimiento} name='fecha_nacimiento' date={form.fecha_nacimiento}  onChange={onChange} withformgroup={0} requirevalidation={0}/>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-8">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={1}
                                                    onChange={onChange}
                                                    formeditado={formeditado}
                                                    name="nombre"
                                                    type="text"
                                                    value={form.nombre}
                                                    placeholder="NOMBRE DEL COLABORADOR"
                                                    iconclass="fas fa-user"
                                                    messageinc="Incorrecto. Ingresa el nombre."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="curp"
                                                    type="text"
                                                    value={form.curp}
                                                    placeholder="CURP"
                                                    iconclass="far fa-address-card"
                                                    patterns={CURP}
                                                    messageinc="Incorrecto. Ej. SIHC400128HDFLLR01"
                                                    maxLength="18"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="rfc"
                                                    type="text"
                                                    value={form.rfc}
                                                    placeholder="RFC"
                                                    iconclass="far fa-file-alt"
                                                    patterns={RFC}
                                                    messageinc="Incorrecto. Ej. ABCD001122ABC"
                                                    maxLength="13"
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="nacionalidad"
                                                    type="text"
                                                    value={form.nacionalidad}
                                                    placeholder="NACIONALIDAD"
                                                    iconclass="far fa-flag"
                                                    messageinc="Incorrecto. Ingresa la nacionalidad."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputPhoneGray
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    placeholder="TELÉFONO MÓVIL"
                                                    name="telefono_movil"
                                                    value={form.telefono_movil}
                                                    onChange={onChange}
                                                    iconclass="fas fa-mobile-alt"
                                                    patterns={TEL}
                                                    messageinc="Incorrecto. Ingresa el número de teléfono móvil."
                                                    thousandseparator={false}
                                                    prefix={''}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputPhoneGray
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    placeholder="TELÉFONO PARTICULAR"
                                                    name="telefono_particular"
                                                    value={form.telefono_particular}
                                                    onChange={onChange}
                                                    iconclass="fas fa-mobile-alt"
                                                    patterns={TEL}
                                                    messageinc="Incorrecto. Ingresa el número de teléfono particular."
                                                    thousandseparator={false}
                                                    prefix={''}
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="estado_civil"
                                                    type="text"
                                                    value={form.estado_civil}
                                                    placeholder="ESTADO CIVIL"
                                                    iconclass={"far fa-heart"}
                                                    messageinc="Incorrecto. Ingresa el estado civil"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="nombre_emergencia"
                                                    value={form.nombre_emergencia}
                                                    placeholder="CONTACTO DE EMERGENCIA"
                                                    iconclass={"fas fa-user-circle"}
                                                    messageinc="Incorrecto. Ingresa el nombre del contacto de emergencia."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputPhoneGray
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    placeholder="TELÉFONO DE EMERGENCIA"
                                                    name="telefono_emergencia"
                                                    value={form.telefono_emergencia}
                                                    onChange={onChange}
                                                    iconclass={"fas fa-mobile-alt"}
                                                    patterns={TEL}
                                                    messageinc="Incorrecto. Ingresa el número de teléfono."
                                                    thousandseparator={false}
                                                    prefix={''}
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
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
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="cuenta"
                                                    type="text"
                                                    value={form.cuenta}
                                                    placeholder="CUENTA"
                                                    iconclass={" fas fa-id-card "}
                                                    messageinc="Incorrecto. Ingresa el número de cuenta."
                                                    typeformat ="##################"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="clabe"
                                                    type="text"
                                                    value={form.clabe}
                                                    placeholder="CLABE"
                                                    iconclass={"fas fa-money-check-alt"}
                                                    messageinc="Incorrecto. Ingresa la clabe."
                                                    typeformat ="##################"
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="domicilio"
                                                    type="text"
                                                    value={form.domicilio}
                                                    placeholder="DOMICILIO"
                                                    iconclass="fas fa-map-marker-alt"
                                                    messageinc="Incorrecto. Ingresa el domicilio."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_4TABS() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <div className="mx-0 row">
                                    <div className="align-self-center col-md-4">
                                        <div className="col text-center">
                                            {
                                                form.estatus_empleado === 'Activo'?
                                                <>
                                                    <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                        <label className="text-center font-weight-bold text-dark-60">Fecha de inicio</label>
                                                    </div>
                                                    <CalendarDay value={form.fechaInicio} name='fechaInicio' onChange={onChange} date={form.fechaInicio} withformgroup={0} requirevalidation={1}/>
                                                </>
                                                :
                                                <>
                                                    <label className="ctext-center font-weight-bold text-dark-60 mb-2">Fecha de inicio - Fecha final</label><br/>
                                                    <RangeCalendar
                                                        onChange={onChangeRange}
                                                        start={form.fechaInicio}
                                                        end={form.fechaFin}
                                                    />
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div className="align-self-center col-md-8">
                                        <div className="form-group row form-group-marginless mb-0">
                                            <div className="col-md-6">
                                                <RadioGroupGray
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
                                            <div className="col-md-6">
                                                <RadioGroupGray
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
                                                    placeholder={'SELECCIONA EL ESTATUS DEL EMPLEADO'}
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <SelectSearchGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    customdiv="mb-0"
                                                    formeditado={formeditado}
                                                    options={options.empresas}
                                                    placeholder="Selecciona la empresa"
                                                    name="empresa"
                                                    value={form.empresa}
                                                    onChange={this.updateEmpresa}
                                                    iconclass={"far fa-building"}
                                                    messageinc="Incorrecto. Selecciona la empresa"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
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
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="row form-group-marginless">
                                            <div className="col-md-12">
                                                <TagSelectSearchGray
                                                    placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                                    options={this.transformarOptions(options.departamentos)}
                                                    defaultvalue={this.transformarOptions(form.departamentos)}
                                                    onChange={this.nuevoUpdateDepartamento}
                                                    iconclass="fas fa-layer-group"
                                                    requirevalidation={0}
                                                    messageinc="Incorrecto. Selecciona el(los) departamento(s)"
                                                />
                                            </div>
                                        </div>
                                        
                                    </div>                            
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_4TABS() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3_4TABS() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <div className="mx-0 row border-rh-info ribbon ribbon-top">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        PRESTACIONES
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bold text-dark-60">FECHA DE ALTA AL IMSS</label>
                                            </div>
                                            <CalendarDay date = { form.fecha_alta_imss } value = { form.fecha_alta_imss } onChange = { onChange } 
                                                name = 'fecha_alta_imss' withformgroup = { 0 } requirevalidation = { 0 } />
                                        </div>
                                    </div>
                                    <div className="align-self-center col-md-8">
                                        <div className="form-group row form-group-marginless mb-0">
                                            <div className="col-md-4">
                                                <RadioGroupGray
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
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="nss"
                                                    type="text"
                                                    value={form.nss}
                                                    placeholder="NSS"
                                                    iconclass="fas fa-hospital-user"
                                                    patterns={NSS}
                                                    messageinc="Incorrecto. Ej. 01234567891"
                                                    typeformat ="###########"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
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
                                                    typeformat="###########"
                                                />
                                            </div>
                                            
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="vacaciones_disponibles"
                                                    type="text"
                                                    value={form.vacaciones_disponibles}
                                                    placeholder="VACACIONES DISPONIBLES"
                                                    iconclass="far fa-calendar-alt"
                                                    messageinc="Incorrecto. Ingresa loS días de vacaciones disponibles al año."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="salario_imss"
                                                    type="text"
                                                    value={form.salario_imss}
                                                    placeholder="SALARIO IMSS"
                                                    iconclass="fas fa-money-check-alt"
                                                    messageinc="Incorrecto. Ingresa el salario de imss."
                                                    thousandseparator={true}
                                                    prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="salario_bruto"
                                                    type="text"
                                                    value={form.salario_bruto}
                                                    placeholder="SALARIO BRUTO"
                                                    iconclass="fas fa-money-check-alt"
                                                    messageinc="Incorrecto. Ingresa el salario bruto."
                                                    thousandseparator={true}
                                                    prefix={'$'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row mx-0 form-group-marginless border-rh-info ribbon ribbon-top mt-10">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        NÓMINA
                                    </div>
                                    <div className={form.tipo_empleado === 'Obra' ? "col-md-4" : "col-md-6"}>
                                        <InputNumberGray
                                            withicon={1}
                                            formgroup="mb-0"
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChange={onChange}
                                            name="nomina_imss"
                                            type="text"
                                            value={form.nomina_imss}
                                            placeholder="Nomina IMSS"
                                            iconclass="fas fa-money-check-alt"
                                            messageinc="Incorrecto. Ingresa la nomina imss."
                                            thousandseparator={true}
                                            prefix={'$'}
                                        />
                                    </div>
                                    {
                                        form.tipo_empleado === 'Obra' ?
                                            <>
                                                <div className="col-md-4">
                                                    <InputNumberGray
                                                        withicon={1}
                                                        formgroup="mb-0"
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChange={onChange}
                                                        name="salario_hr"
                                                        type="text"
                                                        value={form.salario_hr}
                                                        placeholder="SALARIO POR HORA"
                                                        iconclass="fas fa-money-check-alt"
                                                        messageinc="Incorrecto. Ingresa el salario por hora."
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputNumberGray
                                                        withicon={1}
                                                        formgroup="mb-0"
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        onChange={onChange}
                                                        name="salario_hr_extra"
                                                        type="text"
                                                        value={form.salario_hr_extra}
                                                        placeholder="SALARIO POR HORA EXTRA"
                                                        iconclass="fas fa-money-check-alt"
                                                        messageinc="Incorrecto. Ingresa el salario por hora extra."
                                                        thousandseparator={true}
                                                        prefix={'$'}
                                                    />
                                                </div>
                                            </>
                                            :
                                            <div className="col-md-6">
                                                <InputNumberGray
                                                    withicon={1}
                                                    formgroup="mb-0"
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="nomina_extras"
                                                    type="text"
                                                    value={form.nomina_extras}
                                                    placeholder="RESTANTE DE NOMINA"
                                                    iconclass="fas fa-money-check-alt"
                                                    messageinc="Incorrecto. Ingresa el restante de nómina."
                                                    thousandseparator={true}
                                                    prefix={'$'}
                                                />
                                            </div>
                                    }
                                </div>           
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_4TABS() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    {
                                        title === 'Editar colaborador' ?
                                        <div>
                                            <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                                onClick = {
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'wizard-3-content')
                                                    }
                                                } 
                                                text="ENVIAR" />
                                        </div>
                                        :
                                        <div>
                                            <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard4_4TABS() }} data-wizard-type="action-next">Siguiente</button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div id="wizard-4-content" className="pb-3" data-wizard-type="step-content">   
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.datosGenerales.placeholder}</label>
                                        <ItemSlider
                                            items={form.adjuntos.datosGenerales.files}
                                            item='datosGenerales'
                                            handleChange={handleChange}
                                            multiple={true}
                                        />
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.recibosNomina.placeholder}</label>
                                        <ItemSlider
                                            items={form.adjuntos.recibosNomina.files}
                                            item='recibosNomina'
                                            handleChange={handleChange}
                                            multiple={true}
                                        />
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.altasBajas.placeholder}</label>
                                        <ItemSlider
                                            items={form.adjuntos.altasBajas.files}
                                            item='altasBajas'
                                            handleChange={handleChange}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard3_4TABS() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                            onClick = {
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            } 
                                            text="ENVIAR" />
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