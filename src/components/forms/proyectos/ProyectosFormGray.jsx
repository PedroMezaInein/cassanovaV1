import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Button, RangeCalendar, TagInputGray, TagSelectSearchGray, InputPhoneGray, InputGray, InputNumberGray, SelectSearchGray } from '../../form-components'
import { TEL } from '../../../constants'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import $ from "jquery";
class ProyectosForm extends Component {
    addCorreo = () => {
        const { onChange, form } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i.test(form.correo)) {
            // if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(form.correo)) {
            if (form.correo) {
                form.correos.map((correo) => {
                    if (correo === form.correo) {
                        aux = true
                    }
                    return false
                })
                if (!aux) {
                    array = form.correos
                    array.push(form.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else {
            alert("La dirección de email es incorrecta.");
        }
    }
    nuevoUpdateCliente = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.clientes.length) {
            let diferencia = $(seleccionados).not(form.clientes).get();
            let val_diferencia = diferencia[0].value
            this.updateCliente(val_diferencia)
        }
        else {
            let diferencia = $(form.clientes).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "clientes")
            })
        }
    }
    updateCliente = value => {
        const { onChange, options, onChangeOptions, form } = this.props
        options.clientes.map((cliente) => {
            if (cliente.value === value) {
                let aux = false;
                form.clientes.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: cliente.value, name: 'cliente' } }, 'clientes')
            }
            return false
        })
        onChange({ target: { value: value, name: 'cliente' } })
    }

    nuevoUpdateFase = seleccionados => {
        const { form, deleteOption } = this.props
        seleccionados = seleccionados ? seleccionados : [];
        if (seleccionados.length > form.fases.length) {
            let diferencia = $(seleccionados).not(form.fases).get();
            let val_diferencia = diferencia[0].value
            this.updateFase(val_diferencia)
        }
        else {
            let diferencia = $(form.fases).not(seleccionados).get();
            diferencia.forEach(borrar => {
                deleteOption(borrar, "fases")
            })
        }
    }

    updateFase = value => {
        const { onChange, options, onChangeOptions, form } = this.props
        options.fases.map((fase) => {
            if (fase.value === value) {
                let aux = false;
                form.fases.map((element) => {
                    if (element.value === value)
                        aux = true
                    return false
                })
                if (!aux)
                    onChangeOptions({ target: { value: fase.value, name: 'fase' } }, 'fases')
            }
            return false
        })
        onChange({ target: { value: value, name: 'fase' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'empresa', value: value } })
    }

    updateColonia = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'colonia', value: value } })
    }

    updateEstatus = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'estatus', value: value } })
    }

    handleToggler = e => {
        const { name, checked } = e.target
        const { onChange } = this.props
        onChange({ target: { name: name, value: checked } })
    }

    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'tipoProyecto', value: value } })
    }
    render() {
        const { title, children, form, onChange, onChangeCP, onChangeAdjunto, onChangeAdjuntoGrupo, clearFiles, clearFilesGrupo, options, onSubmit, removeCorreo, formeditado, deleteOption, onChangeOptions, action, handleChange, onChangeRange, tagInputChange,
            openModalCP, showModal,  ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={(e) => { e.preventDefault(e); openWizard2(); if(showModal){ openModalCP(); } }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Ubicación</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> Tipo de proyecto y periodo</h3>
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
                            {children}
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5> */}
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <TagSelectSearchGray
                                            placeholder="SELECCIONA LA FASE"
                                            options={this.transformarOptions(options.fases)}
                                            defaultvalue={this.transformarOptions(form.fases)}
                                            onChange={this.nuevoUpdateFase}
                                            iconclass={"far fa-folder-open"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={1}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            name="nombre"
                                            value={form.nombre}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL PROYECTO"
                                            iconclass={"far fa-folder-open"}
                                            messageinc="Incorrecto. Ingresa el nombre del proyecto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputPhoneGray
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            //thousandseparator={false}
                                            prefix={''}
                                            name="numeroContacto"
                                            value={form.numeroContacto}
                                            onChange={onChange}
                                            placeholder="NÚMERO DE CONTACTO"
                                            iconclass={"fas fa-mobile-alt"}
                                            messageinc="Incorrecto. Ingresa el número de contacto."
                                            patterns={TEL}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={1}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            name="contacto"
                                            value={form.contacto}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL CONTACTO"
                                            iconclass={"far fa-user-circle"}
                                            messageinc="Incorrecto. Ingresa el nombre de contacto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <TagSelectSearchGray
                                            requirevalidation={1}
                                            placeholder="SELECCIONA EL CLIENTE"
                                            options={this.transformarOptions(options.clientes)}
                                            defaultvalue={this.transformarOptions(form.clientes)}
                                            onChange={this.nuevoUpdateCliente}
                                            iconclass={"far fa-folder-open"}
                                            messageinc="Incorrecto. Selecciona el cliente."
                                            />
                                    </div>
                                    <div className="col-md-4">
                                        <TagInputGray
                                            tags={form.correos}
                                            onChange={tagInputChange}
                                            placeholder={"CORREO DE CONTACTO"}
                                            iconclass={"far fa-folder-open"}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={(e) => { 
                                                e.preventDefault(e); 
                                                openWizard2();
                                                if(showModal){
                                                    openModalCP();
                                                }
                                            }}
                                            data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Escribe la ubicación</h5> */}
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            name="cp"
                                            onChange={onChangeCP}
                                            value={form.cp}
                                            type="text"
                                            placeholder="CÓDIGO POSTAL"
                                            iconclass={"far fa-envelope"}
                                            maxLength="5"
                                            messageinc="Incorrecto. Ingresa el código postal."
                                        />
                                    </div>
                                    <div className="col-md-4" hidden={form.cp === '' ? true : false}>
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={0}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            readOnly={form.cp === '' ? true : false}
                                            value={form.estado}
                                            name="estado"
                                            type="text"
                                            placeholder="ESTADO"
                                            iconclass={"fas fa-map-marked-alt"}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-4" hidden={form.cp === '' ? true : false}>
                                        <InputGray
                                            letterCase={false}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={0}
                                            requirevalidation={0}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            readOnly={form.cp === '' ? true : false}
                                            value={form.municipio}
                                            name="municipio"
                                            type="text"
                                            placeholder="MUNICIPIO/DELEGACIÓN"
                                            iconclass={"fas fa-map-marker-alt"}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2" hidden={form.cp === '' ? true : false}></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-5" hidden={form.cp === '' ? true : false}>
                                        {
                                            options.colonias.length > 0 &&
                                            <SelectSearchGray
                                                formeditado={formeditado}
                                                options={options.colonias}
                                                placeholder="SELECCIONA LA COLONIA"
                                                name="colonia"
                                                iconclass={"fas fa-map-pin"}
                                                value={form.colonia}
                                                defaultValue={form.colonia}
                                                onChange={this.updateColonia}
                                                messageinc="Incorrecto. Selecciona la colonia"
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withicon={1}
                                            />
                                        }
                                        {
                                            form.cp === '' &&
                                            <InputGray
                                                letterCase={true}
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                requirevalidation={1}
                                                withformgroup={1}
                                                formeditado={formeditado}
                                                readOnly
                                                value={form.colonia}
                                                name="colonia" type="text"
                                                placeholder="SELECCIONA LA COLONIA"
                                                iconclass={"fas fa-map-pin"}
                                            />
                                        }
                                    </div>
                                    <div className="col-md-7" hidden={form.cp === '' ? true : false}>
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={1}
                                            withformgroup={1}
                                            formeditado={formeditado}
                                            name="calle"
                                            value={form.calle}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="CALLE Y NÚMERO"
                                            iconclass={"fas fa-map-signs"}
                                            messageinc="Incorrecto. Ingresa la calle y número."
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
                                {/* <h5 className="mb-4 font-weight-bold text-dark">Tipo de proyecto y periodo</h5> */}
                                <Row>
                                    <Col md="4">
                                        <div className="form-group row form-group-marginless justify-content-center mt-3">
                                            <div className="col-md-12 text-center">
                                                <div className="col-form-label m-0 p-0 font-weight-bolder">Fecha de inicio - Fecha final</div>
                                                    <RangeCalendar
                                                        onChange = { onChangeRange }
                                                        start = { form.fechaInicio }
                                                        end = { form.fechaFin }
                                                    />
                                            </div>
                                            {/* <div className="col-md-12 text-center">
                                                <label className="col-form-label my-2 font-weight-bolder">Fecha de Reunión</label><br />
                                                <CalendarDay value = { form.fechaReunion } name = 'fechaReunion' onChange = { onChange } date = { form.fechaReunion } withformgroup={1} requirevalidation={1}/>
                                            </div> */}
                                        </div>
                                    </Col>
                                    <Col md="8" className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <SelectSearchGray 
                                                    options = { options.tipos } 
                                                    placeholder="SELECCIONE UN TIPO DE PROYECTO"
                                                    name="tipoProyecto" 
                                                    value = { form.tipoProyecto } 
                                                    onChange = { this.updateTipoProyecto }
                                                    requirevalidation = { 1 } 
                                                    messageinc = "Incorrecto. Seleccione el proyecto."
                                                    customdiv = "mb-0" 
                                                    withtaglabel = { 1 } 
                                                    withtextlabel = { 1 }
                                                    withicon={1}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputNumberGray
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="M²"
                                                    value={form.m2}
                                                    name="m2"
                                                    onChange={onChange}
                                                    iconclass={"fas fa-ruler-combined"}
                                                    messageinc="Ingresa los m²."
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-12">
                                                <InputGray
                                                    letterCase={false}
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={0}
                                                    requirevalidation={0}
                                                    withformgroup={1}
                                                    formeditado={formeditado}
                                                    rows="3"
                                                    as="textarea"
                                                    placeholder="DESCRIPCIÓN"
                                                    name="descripcion"
                                                    onChange={onChange}
                                                    value={form.descripcion}
                                                    style={{ paddingLeft: "10px" }}
                                                    messageinc="Incorrecto. Ingresa una descripción."
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase"
                                            onClick={
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

export default ProyectosForm