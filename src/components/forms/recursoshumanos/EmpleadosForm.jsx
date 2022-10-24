import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { RadioGroupGray, Button, TagSelectSearchGray,  InputGray, InputPhoneGray, SelectSearchGray, InputNumberGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { RFC, NSS, CURP, TEL } from '../../../constants'
import { openWizard1_4TABS, openWizard2_4TABS } from '../../../functions/wizard'
// import { openWizard1_4TABS, openWizard2_4TABS, openWizard3_4TABS, openWizard4_4TABS } from '../../../functions/wizard'

import $ from "jquery";

class EmpleadosForm extends Component {

    state = {
        form: {

            fecha: new Date(),
        }
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha_alta_imss' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateBanco = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'banco' } })
    }

    updateRepse = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'id_patronal' } })
    }

    updateEstadoCivil = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'estado_civil' } })
    }

    updateOrganigrama = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'organigrama' } })
    }

    updatePuesto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'puesto' } })
    }

    updateResponsable = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'responsable' } })
    }

    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empleado' } })
    }

    updateCivil = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    nuevoUpdateDepartamento = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.departamentos.length) {
            let diferencia = $(seleccionados).not(form.departamentos).get();
            let val_diferencia = diferencia[0].value
            this.updateDepartamento(val_diferencia)
        }
        else {
            let diferencia = $(form.departamentos).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "departamentos")
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
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }

    onChange = fecha => {
        const { form } = this.props
        form.fecha = fecha
        this.setState({ form })
    }

    render() {

        const { options, onChange, form, onSubmit, formeditado  } = this.props

        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> COLABORADOR</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> CONTRATACION</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        {/* <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3_4TABS() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> PRESTACIONES</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div> */}
                        {/* {
                            title !== 'Editar colaborador' &&
                            <div id="wizard-4" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard4_4TABS() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>4.</span> ENTREGABLES Y ADJUNTOS</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                        } */}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form className="px-3"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'wizard-2-content')
                                }
                            }
                        >
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <div className="mx-0 row border-rh-info ribbon ribbon-top">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        DATOS GENERALES
                                    </div>
                                    <div className="mx-0 row">
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={onChange} formeditado={formeditado} name="nombre"
                                                type="text" value={form.nombre} placeholder="NOMBRE DEL COLABORADOR" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa el nombre." />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={onChange} formeditado={formeditado} name="ap_materno"
                                                type="text" value={form.ap_materno} placeholder="APELLIDO MATERNO" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa el nombre." />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={onChange} formeditado={formeditado} name="ap_paterno"
                                                type="text" value={form.ap_paterno} placeholder="APELLIDO PATERNO" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa el nombre." />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange} name="curp"
                                                type="text" value={form.curp} placeholder="CURP" iconclass="far fa-address-card" patterns={CURP} messageinc="Incorrecto. Ej. SIHC400128HDFLLR01" maxLength="18" />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange} name="rfc"
                                                type="text" value={form.rfc} placeholder="RFC" iconclass="far fa-file-alt" patterns={RFC} messageinc="Incorrecto. Ej. ABCD001122ABC" maxLength="13" />
                                        </div>
                                        <div className="col-md-2">
                                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                name="nss" type="text" value={form.nss} placeholder="NSS" iconclass="fas fa-hospital-user" patterns={NSS} messageinc="Incorrecto. Ej. 01234567891" typeformat="###########"
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={onChange} formeditado={formeditado} name="fecha_nacimiento"
                                                type="date" value={form.fecha_nacimiento} data-date-format="DD/MMMM/YYYY" placeholder="Fecha de nacimiento" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha." />
                                        </div>

                                        <div className="separator separator-dashed mt-1 mb-2"></div>

                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1}
                                                withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange} name="nacionalidad" type="text"
                                                value={form.nacionalidad} placeholder="NACIONALIDAD" iconclass="far fa-flag" messageinc="Incorrecto. Ingresa la nacionalidad." />
                                        </div>
                                        <div className="col-md-2">
                                            <InputPhoneGray withformgroup={0} requirevalidation={0} formeditado={formeditado} placeholder="TELÉFONO MÓVIL" name="telefono_movil" value={form.telefono_movil} onChange={onChange}
                                                iconclass="fas fa-mobile-alt" patterns={TEL} messageinc="Incorrecto. Ingresa el número de teléfono móvil." thousandseparator={false} prefix={''} />
                                        </div>
                                        <div className="col-md-2">
                                            <InputPhoneGray withformgroup={0} requirevalidation={0} formeditado={formeditado} placeholder="TELÉFONO PARTICULAR" name="telefono_particular" value={form.telefono_particular}
                                                onChange={onChange} iconclass="fas fa-mobile-alt" patterns={TEL} messageinc="Incorrecto. Ingresa el número de teléfono particular." thousandseparator={false} prefix={''} />
                                        </div>

                                        <div className="col-md-2">
                                            <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.estado_civil} placeholder="Selecciona el estado civil"
                                                name="estado_civil" value={form.estado_civil} onChange={this.updateEstadoCivil} iconclass={"far fa-heart"} messageinc="Incorrecto. Selecciona el estado civil"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.empresas} placeholder="Selecciona la empresa"
                                                name="empresa" value={form.empresa} onChange={this.updateEmpresa} iconclass={"far fa-building"} messageinc="Incorrecto. Selecciona la empresa"
                                            />
                                        </div>
                                        
                                        <div className="col-md-3">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                name="nombre_emergencia" value={form.nombre_emergencia} placeholder="CONTACTO DE EMERGENCIA" iconclass={"fas fa-user-circle"}
                                                messageinc="Incorrecto. Ingresa el nombre del contacto de emergencia."
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <InputPhoneGray withformgroup={0} requirevalidation={0} formeditado={formeditado} placeholder="TELÉFONO DE EMERGENCIA" name="telefono_emergencia" value={form.telefono_emergencia}
                                                onChange={onChange} iconclass={"fas fa-mobile-alt"} patterns={TEL} messageinc="Incorrecto. Ingresa el número de teléfono." thousandseparator={false} prefix={''}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                name="email_personal" type="email" value={form.email_personal} placeholder="CORREO PERSONAL" iconclass={"far fa-envelope"} messageinc="Incorrecto.Ej. usuario@dominio.com" />
                                        </div>
                                        <div className="col-md-2">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} formeditado={formeditado} onChange={onChange}
                                                name="email_empresarial" type="email" value={form.email_empresarial} placeholder="CORREO EMPRESARIAL" iconclass={"far fa-envelope"} messageinc="Incorrecto.Ej. usuario@dominio.com" />
                                        </div>
                                        <div className="col-md-3">
                                            <TagSelectSearchGray placeholder="SELECCIONA EL(LOS) DEPARTAMENTO(S)" options={this.transformarOptions(options.departamentos)} defaultvalue={this.transformarOptions(form.departamentos)}
                                                onChange={this.nuevoUpdateDepartamento} iconclass="fas fa-layer-group" requirevalidation={0} messageinc="Incorrecto. Selecciona el(los) departamento(s)"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                name="domicilio" type="text" value={form.domicilio} placeholder="DOMICILIO" iconclass="fas fa-map-marker-alt" messageinc="Incorrecto. Ingresa el domicilio."
                                            />
                                        </div>
                                        <div className="col-md-3">
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
                                        <div className="col-md-3">
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
                                        <div className="col-md-2">
                                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                name="checador" type="text" value={form.checador} placeholder="Numero asignado checador" iconclass="fas fa-hospital-user" patterns={NSS} messageinc="Incorrecto. Ej. 01234567891" typeformat="###########"
                                            />
                                        </div>
                                    </div>
                                    <div className="mx-0 row border-rh-info ribbon ribbon-top" style={{ width: "100%" }}>
                                        <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                            DATOS DE JERARQUIA
                                        </div>
                                        <div className="form-group row form-group-marginless" style={{ width: "100%" }}>

                                            <div className="col-md-3">
                                                <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.organigrama} placeholder="Selecciona el organigrama"
                                                    name="organigrama" value={form.organigrama} onChange={this.updateOrganigrama} iconclass={"far fa-heart"} messageinc="Incorrecto. Selecciona el organigrama"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.puestos} placeholder="Selecciona el puesto"
                                                    name="puesto" value={form.puesto} onChange={this.updatePuesto} iconclass={"far fa-heart"} messageinc="Incorrecto. Selecciona el puesto"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.responsable} placeholder="Selecciona el responsable"
                                                    name="responsable" value={form.responsable} onChange={this.updateResponsable} iconclass={"far fa-heart"} messageinc="Incorrecto. Selecciona el responsable"
                                                />
                                            </div>

                                        </div>
                                    </div><br />
                                </div>

                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_4TABS() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <div className="mx-0 row border-rh-info ribbon ribbon-top form-group-marginless">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        DATOS BANCARIOS
                                    </div>
                                    <div className="col-md-2">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.bancos} placeholder="Selecciona el banco"
                                            name="banco" value={form.banco} onChange={this.updateBanco} iconclass={"far fa-building"} messageinc="Incorrecto. Selecciona el banco"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                            name="cuenta" type="text" value={form.cuenta} placeholder="CUENTA" iconclass={" fas fa-id-card "} messageinc="Incorrecto. Ingresa el número de cuenta." typeformat="##################"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                            name="clabe" type="text" value={form.clabe} placeholder="CLABE" iconclass={"fas fa-money-check-alt"} messageinc="Incorrecto. Ingresa la clabe." typeformat="##################"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={onChange} formeditado={formeditado} name="fechaInicio"
                                            type="date" value={form.fechaInicio} placeholder="Fecha de Ingreso" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha." />
                                    </div>
                                    <div className="col-md-2">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} onChange={onChange} formeditado={formeditado} name="fechaFin"
                                            type="date" value={form.fechaFin} placeholder="Fecha de baja" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha baja." />
                                    </div>

                                    <div className="col-md-2">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} onChange={onChange} formeditado={formeditado} name="fecha_alta_imss"
                                            type="date" value={form.fecha_alta_imss} placeholder="Fecha alta imss" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha de alta imss." />
                                    </div>
                                    <div className="col-md-2">
                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                            name="numero_alta_imss" type="text" value={form.numero_alta_imss} placeholder="FOLIO DE ALTA IMSS" iconclass={"fas fa-hospital-user"} patterns={NSS} messageinc="Incorrecto. Ej. 01234567891" typeformat="###########"
                                        />
                                    </div>











                                    {/* <div className="col-md-2">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} customdiv="mb-0" formeditado={formeditado} options={options.bancos} placeholder="Selecciona el banco"
                                            name="banco" value={form.banco} onChange={this.updateBanco} iconclass={"far fa-building"} messageinc="Incorrecto. Selecciona el banco"
                                        />
                                    </div> */}

                                    <div className="col-md-2">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1}  formeditado={formeditado} options={options.registro_patronal} onChange={this.updateRepse}
                                            name="id_patronal" value={form.id_patronal} placeholder="Registro Patronal" iconclass={"fas fa-hospital-user"} 
                                        />
                                    </div>












                                    <div className="col-md-2">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={0} onChange={onChange} formeditado={formeditado} name="fecha_baja_imss"
                                            type="date" value={form.fecha_baja_imss} placeholder="Fecha baja imss" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha de baja imss." />
                                    </div>
                                    <div className="col-md-2">
                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                            name="numero_baja_imss" type="text" value={form.numero_baja_imss} placeholder="NÚMERO DE BAJA IMSS" iconclass={"fas fa-hospital-user"} patterns={NSS} messageinc="Incorrecto. Ej. 01234567891" typeformat="###########"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange} disabled
                                            name="vacaciones_disponibles" type="text" value={form.vacaciones_disponibles} placeholder="Vacaciones disponibles" iconclass="fas fa-calendar-alt" patterns={NSS} messageinc="Incorrecto. Ej. 01234567891" typeformat="###########"
                                        />
                                    </div>                                    

                                    <div className="align-self-center col-md-8">

                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">

                                        </div>
                                    </div>
                                    <div className="mx-0 row border-rh-info ribbon ribbon-top form-group-marginless" style={{ width: "100%" }}>
                                        <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                            Nomina
                                        </div>
                                        <div className="form-group row form-group-marginless" style={{ width: "100%" }}>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="salario_bruto" type="text" value={form.salario_bruto} placeholder="SALARIO BRUTO MENSUAL" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el salario bruto." thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="salario_neto_mensal" type="text" value={form.salario_neto_mensal} placeholder="SALARIO NETO MENSUAL" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa salario neto mensual." thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="salario_neto_quincenal" type="text" value={form.salario_neto_quincenal} placeholder="SALARIO NETO QUINCENAL" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa salario neto quincenal." thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            
                                            <div className={form.tipo_empleado === 'Obra' ? "col-md-2" : "col-md-2"}>
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="nomina_imss" type="text" value={form.nomina_imss} placeholder="Nomina IMSS" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa la nomina imss." thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            {
                                                form.tipo_empleado === 'Obra' ?
                                                    <>
                                                        <div className="col-md-2">
                                                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                                name="salario_hr" type="text" value={form.salario_hr} placeholder="SALARIO POR HORA" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el salario por hora."
                                                                thousandseparator={true} prefix={'$'}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                                name="salario_hr_extra" type="text" value={form.salario_hr_extra} placeholder="SALARIO POR HORA EXTRA" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el salario por hora extra." thousandseparator={true} prefix={'$'}
                                                            />
                                                        </div>
                                                    </>
                                                    :
                                                    <div className="col-md-2">
                                                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                            name="nomina_extras" type="text" value={form.nomina_extras} placeholder="EFECTIVO QUINCENAL" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el efectivo quincenal."
                                                            thousandseparator={true} prefix={'$'}
                                                        />
                                                    </div>
                                            }

                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="adicionales_imss" type="text" value={form.adicionales_imss} placeholder="ADICIONALES IMSS" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa adicionales imss." thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            
                                        </div>

                                        <div className="form-group row form-group-marginless" style={{ width: "100%" }}>
                                            {/* <div className="col-md-2">
                                                <InputNumberGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange} 
                                                name="total_transferencia" type="text" value={form.total_transferencia} placeholder="TOTAL TRANSFERENCIA" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa total de transferencia." thousandseparator={true} prefix={'$'}
                                                />
                                            </div> */}
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="isn" type="text" value={form.isn} placeholder="ISN" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el isn ."
                                                    thousandseparator={true} prefix={'$'}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="adicionales_efectivo" type="text" value={form.adicionales_efectivo} placeholder="ADICIONALES EFECTIVO" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa adicionales efectivo."
                                                    thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="total_efectivo" type="text" value={form.total_efectivo} placeholder="TOTAL EFECTIVO" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el total efectivo."
                                                    thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="total" type="text" value={form.total} placeholder="TOTAL" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el total ."
                                                    thousandseparator={true} prefix={'$'}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0} formeditado={formeditado} onChange={onChange}
                                                    name="ispt" type="text" value={form.ispt} placeholder="ISPT" iconclass="fas fa-money-check-alt" messageinc="Incorrecto. Ingresa el ispt ."
                                                    thousandseparator={true} prefix={'$'}
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
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase"
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-2-content')
                                                }
                                            }
                                            text="ENVIAR" />                                    </div>
                                </div>
                            </div>
                            {/* 
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <div className="mx-0 row border-rh-info ribbon ribbon-top">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        PRESTACIONES
                                    </div>
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
                                    
                                </div>
                                <div className="form-group row mx-0 form-group-marginless border-rh-info ribbon ribbon-top mt-10">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        NÓMINA
                                    </div>
                                   
                                </div> 
                                <div className="form-group row mx-0 form-group-marginless border-rh-info ribbon ribbon-top mt-10">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        PRESTACIONES DE LEY
                                    </div>
                                    
                                </div>    
                                <div className="form-group row mx-0 form-group-marginless border-rh-info ribbon ribbon-top mt-10">
                                    <div className="ribbon-target bg-light-primary text-primary font-weight-bolder ribbon-rh shadow-none">
                                        Otras PRESTACIONES
                                    </div>
                                    
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
                                            <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                                onClick = {
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(onSubmit, e, 'wizard-3-content')
                                                    }
                                                } 
                                                text="ENVIAR" />
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
                            */}
                        </Form>
                    </div>
                </div>
            </div>

        )
    }
}

export default EmpleadosForm