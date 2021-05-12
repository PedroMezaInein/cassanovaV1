import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch, Button, RadioGroup, Input, InputNumber,InputPhone, FileInput, RangeCalendar, TagSelectSearch, CalendarDay} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { RFC, NSS, CURP, TEL } from '../../../constants'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import $ from "jquery";

class EmpleadosForm extends Component {

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha_alta_imss' } })
    }

    updateEmpresa = value => {
        const { onChange} = this.props
        onChange({ target: { value: value, name: 'empresa' } })
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
        const { options, onChange, form, onSubmit, formeditado, onChangeAdjunto, clearFiles, title, onChangeRange} = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
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
                                    <span>3.</span> INFORMACIÓN GENERAL DE LAS PRESTACIONES</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos generales e información bancaria</h5> */}
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
                                            typeformat ="###########"
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
                                            thousandseparator={false}
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
                                            typeformat ="##################"
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
                                            typeformat ="##################"
                                        />
                                    </div>
                                </div>
                                {
                                    title === 'Editar empleado'
                                        ? ''
                                        : <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-12 mt-5 text-center">
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
                                                        classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50'
                                                        iconclass='flaticon2-clip-symbol text-primary'
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa la información bancaria</h5> */}
                                <div className="mx-0 row">
                                    <div className="align-self-center col-md-4">
                                        <div className="col text-center">
                                            <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                                            <RangeCalendar
                                                onChange={onChangeRange}
                                                start={form.fechaInicio}
                                                end={form.fechaFin}
                                            />
                                        </div>
                                    </div>
                                    <div className="align-self-center col-md-8">
                                        <div className="form-group row form-group-marginless mb-0">
                                            <div className="col-md-6">
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
                                            <div className="col-md-6">
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
                                                    placeholder={'SELECCIONA EL ESTATUS DEL EMPLEADO'}
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <SelectSearch
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
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <TagSelectSearch
                                                    placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                                                    options={this.transformarOptions(options.departamentos)}
                                                    defaultvalue={this.transformarOptions(form.departamentos)}
                                                    onChange={this.nuevoUpdateDepartamento}
                                                    iconclass={"fas fa-layer-group"}
                                                    requirevalidation={0}
                                                    messageinc="Incorrecto. Selecciona el(los) departamento(s)"
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
                                                        <div className="col-md-12 mt-5 text-center">
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
                                                                classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50'
                                                                iconclass='flaticon2-clip-symbol text-primary'
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                        }
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de las prestaciones</h5> */}
                                <div className="mx-0 row">
                                    <div className="align-self-center col-md-4">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">FECHA DE ALTA AL IMSS</label>
                                        </div>
                                            <CalendarDay
                                                date={form.fecha_alta_imss}
                                                value={form.fecha_alta_imss}
                                                onChange={onChange}
                                                name='fecha_alta_imss'
                                                withformgroup={0}
                                                requirevalidation={0}
                                            />
                                        </div>
                                    <div className="align-self-center col-md-8">
                                        <div className="form-group row form-group-marginless mb-0">
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
                                                    typeformat="###########"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Input
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChange={onChange}
                                                    name="vacaciones_disponibles"
                                                    type="text"
                                                    value={form.vacaciones_disponibles}
                                                    placeholder="VACACIONES DISPONIBLES AL AÑO"
                                                    iconclass={"far fa-calendar-alt"}
                                                    messageinc="Incorrecto. Ingresa loS días de vacaciones disponibles al año."
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
                                                    name="nomina_imss"
                                                    type="text"
                                                    value={form.nomina_imss}
                                                    placeholder="Nomina IMSS"
                                                    iconclass={"fas fa-money-check-alt"}
                                                    messageinc="Incorrecto. Ingresa la nomina imss."
                                                    thousandseparator={true}
                                                    prefix={'$'}
                                                />
                                            </div>
                                            {
                                                form.tipo_empleado === 'Obra' ?
                                                    <>
                                                        <div className="col-md-4">
                                                            <InputNumber
                                                                requirevalidation={0}
                                                                formeditado={formeditado}
                                                                onChange={onChange}
                                                                name="salario_hr"
                                                                type="text"
                                                                value={form.salario_hr}
                                                                placeholder="Salario por hora"
                                                                iconclass={"fas fa-money-check-alt"}
                                                                messageinc="Incorrecto. Ingresa el salario por hora."
                                                                thousandseparator={true}
                                                                prefix={'$'}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <InputNumber
                                                                requirevalidation={0}
                                                                formeditado={formeditado}
                                                                onChange={onChange}
                                                                name="salario_hr_extra"
                                                                type="text"
                                                                value={form.salario_hr_extra}
                                                                placeholder="Salario por hora extra"
                                                                iconclass={"fas fa-money-check-alt"}
                                                                messageinc="Incorrecto. Ingresa el salario por hora extra."
                                                                thousandseparator={true}
                                                                prefix={'$'}
                                                            />
                                                        </div>
                                                    </>
                                                    :
                                                    <div className="col-md-4">
                                                        <InputNumber
                                                            requirevalidation={0}
                                                            formeditado={formeditado}
                                                            onChange={onChange}
                                                            name="nomina_extras"
                                                            type="text"
                                                            value={form.nomina_extras}
                                                            placeholder="Restante de nómina"
                                                            iconclass={"fas fa-money-check-alt"}
                                                            messageinc="Incorrecto. Ingresa el restante de nómina."
                                                            thousandseparator={true}
                                                            prefix={'$'}
                                                        />
                                                    </div>
                                            }
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            {
                                                title === 'Editar empleado'
                                                    ? ''
                                                    :
                                                    <div className="col-md-12 mt-5 text-center">
                                                        <FileInput
                                                            requirevalidation={1}
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
                                                            classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50'
                                                            iconclass='flaticon2-clip-symbol text-primary'
                                                        />
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
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