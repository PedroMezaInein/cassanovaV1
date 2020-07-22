import React, { Component } from 'react'
import { Input, Button, RadioGroup, Select, Calendar, InputNumber, InputPhone, SelectSearchTrue } from '../form-components' 
import { faPlus } from '@fortawesome/free-solid-svg-icons' 
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { RFC, DATE, NSS, CURP, TEL } from '../../constants' 
import { openWizard1, openWizard2, openWizard3 } from '../../functions/wizard' 

function CustomToggle({ children, eventKey }) {

    let variable = false

    const handleClick = useAccordionToggle(eventKey, (e) => {
        if (variable) {
            variable = false
        } else {
            variable = true
        }
    });


    return (
        <div className="d-flex justify-content-between">
            <div>
                {children}
            </div>
            <Button name={eventKey} className="small-button " color="transparent" icon={faPlus} text='' onClick={handleClick} />
        </div>
    );
}
class EmpleadoForm extends Component {

    constructor(props) {
        super(props)
    }

    updateDepartamento = value => {
        const { onChange, onChangeOptions, options, form } = this.props
        options.departamentos.map((departamento) => {
            if (departamento.value === value) {
                let aux = false;
                form.departamentos.map((departamento) => {
                    if (departamento.value === value)
                        aux = true
                })
                if (!aux)
                    onChangeOptions({ target: { value: departamento.value, name: 'departamento' } }, 'departamentos')
            }

        })
        onChange({ target: { value: value, name: 'departamento' } })
    }

    render() {
        const { children, options, form, onChange, title, onChangeCalendar, deleteOption, formEditado } = this.props

        return (
            <>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearchTrue
                            options={options.departamentos}
                            placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)"
                            name="departamento"
                            value={form.departamento}
                            onChange={this.updateDepartamento}
                            iconclass={"fas fa-layer-group"}

                        />
                    </div>
                    <div className="col-md-8">
                        {
                            form.departamentos.length > 0 ?
                                <div className="col-md-12 row mx-0 align-items-center image-upload">
                                    {
                                        form.departamentos.map((departamento, key) => {
                                            return (
                                                <div key={key} className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                    <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                        <div
                                                            title="Borrar archivo"
                                                            className="tagify__tag__removeBtn"
                                                            role="button"
                                                            aria-label="remove tag"
                                                            onClick={(e) => { e.preventDefault(); deleteOption(departamento, 'departamentos', 'empleado') }}
                                                        >
                                                        </div>
                                                        <div><span className="tagify__tag-text p-1 white-space">{departamento.name}</span></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : ''
                        }
                    </div>
                </div>

                <div className="separator separator-solid mt-5 mb-2"></div>
                <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                    <div className="wizard-nav">
                        <div className="wizard-steps px-8 py-0 px-lg-15 py-lg-0">
                            <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard1() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>1.</span> INFORMACIÓN GENERAL DEL EMPLEADO</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                            <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard2() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>2.</span> INFORMACIÓN BANCARIA</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                            <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard3() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>3.</span>CONTACTO DE EMERGENCIA</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
                        <div className="col-md-12">
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5>  */}
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
                                            name={'estatus'}
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
                                            value={form.estatus}
                                            placeholder={'SELECCIONA EL ESTATUS DE EMPLEADO'}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Select
                                            name={'empresa'}
                                            options={options.empresas}
                                            onChange={onChange}
                                            placeholder={'SELECCIONA LA EMPRESA'}
                                            value={form.empresa}
                                            iconclass={"far fa-building"}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
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
                                    <div className="col-md-4">
                                        <InputNumber
                                            onChange={onChange}
                                            name="nss"
                                            type="text"
                                            value={form.nss}
                                            placeholder="NSS"
                                            iconclass={"fas fa-hospital-user"}
                                            patterns={NSS}
                                            messageinc="Incorrecto. Ej. 01234567891"
                                        //maxLength="11"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Input
                                            onChange={onChange}
                                            name="curp"
                                            type="text"
                                            value={form.curp}
                                            placeholder="CURP"
                                            iconclass={"far fa-address-card"}
                                            patterns={CURP}
                                            messageinc="Incorrecto. Ej. ABCD123456EFGHIJ78"
                                            maxLength="18"
                                        />
                                        <pre id="resultado"></pre>
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
                                            onChange={onChange}
                                            name="puesto"
                                            type="text"
                                            value={form.puesto}
                                            placeholder="PUESTO"
                                            iconclass={"fas fa-user-tie"}
                                            messageinc="Incorrecto. Ingresa el puesto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Calendar
                                            onChangeCalendar={onChangeCalendar}
                                            placeholder="FECHA DE INICIO"
                                            name="fecha_inicio"
                                            value={form.fecha_inicio}
                                            patterns={DATE}
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos bancarios</h5> */}
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Información del contacto</h5> */}
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Input
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
                                            requirevalidation={1}
                                            /* formeditado={formeditado} */
                                            placeholder="TELÉFONO"
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
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type="submit" text="Enviar" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default EmpleadoForm