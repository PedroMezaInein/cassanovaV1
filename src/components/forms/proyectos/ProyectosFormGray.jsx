import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Form, Row } from 'react-bootstrap'
import { RangeCalendar, TagInputGray, TagSelectSearchGray, InputPhoneGray, InputGray, InputNumberGray, CalendarDay, ReactSelectSearchGray } from '../../form-components'
import { TEL } from '../../../constants'
import { openWizard1_4TABS, openWizard2_4TABS, openWizard3_4TABS, openWizard4_4TABS } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import $ from "jquery";
import { optionsFases } from "../../../functions/options"
class ProyectosForm extends Component {
    state = {
        cliente_seleccionado:[],
        clientes_add:[],
    }
    // addCorreo = () => {
    //     const { onChange, form } = this.props
    //     let aux = false
    //     let array = []
    //     if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i.test(form.correo)) {
    //         // if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(form.correo)) {
    //         if (form.correo) {
    //             form.correos.map((correo) => {
    //                 if (correo === form.correo) {
    //                     aux = true
    //                 }
    //                 return false
    //             })
    //             if (!aux) {
    //                 array = form.correos
    //                 array.push(form.correo)
    //                 onChange({ target: { name: 'correos', value: array } })
    //                 onChange({ target: { name: 'correo', value: '' } })
    //             }
    //         }
    //     } else {
    //         alert("La dirección de email es incorrecta.");
    //     }
    // }
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

    // updateEmpresa = value => {
    //     const { onChange } = this.props
    //     onChange({ target: { name: 'empresa', value: value } })
    // }

    // updateColonia = value => {
    //     const { onChange } = this.props
    //     onChange({ target: { name: 'colonia', value: value } })
    // }

    // updateEstatus = value => {
    //     const { onChange } = this.props
    //     onChange({ target: { name: 'estatus', value: value } })
    // }

    // handleToggler = e => {
    //     const { name, checked } = e.target
    //     const { onChange } = this.props
    //     onChange({ target: { name: name, value: checked } })
    // }

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
    getNameWithoutFases = cadena => {
        let auxiliar = cadena.split(' - FASE 1')[0]
        auxiliar = auxiliar.split(' - FASE 2')[0]
        return auxiliar.split(' - FASE 3')[0]
    }
    updateSelect = (value, name) => {
        const { form, onChange } = this.props
        let { cliente_seleccionado, clientes_add } = this.state
        if (value === null) {
            value = []
        }
        onChange({ target: { value: value, name: name } }, true)
        switch (name) {
            case 'fases':
                let nombre = this.getNameWithoutFases(form.nombre)
                let ordenValue = value
                ordenValue.sort((a, b) => (a.value > b.value) ? 1 : -1)
                if (value.length) {
                    value.forEach((element) => {
                        nombre += ` - ${element.label.toUpperCase()}`
                    })
                }
                form.nombre = nombre
                break;
            case 'cliente_principal':
                let arr3 = []
                if (value.length === 0) {
                    if (cliente_seleccionado.length > 0) {
                        clientes_add.forEach((clientes, index1) => {
                            if (clientes.value === cliente_seleccionado[0].value) {
                                clientes_add.splice(index1, 1);
                            }
                        })
                        cliente_seleccionado.splice(0, 1);
                    }
                    form.clientes = clientes_add
                } else {
                    clientes_add.forEach((clientes, index1) => {
                        if (clientes.value === value.value) {
                            clientes_add.splice(index1, 1);
                        }
                    })
                    if (cliente_seleccionado.length > 0) {
                        clientes_add.forEach((clientes, index1) => {
                            if (clientes.value === cliente_seleccionado[0].value) {
                                clientes_add.splice(index1, 1);
                            }
                        })
                        cliente_seleccionado.splice(0, 1);
                    }
                    cliente_seleccionado.push(value)
                    arr3 = [...clientes_add, ...cliente_seleccionado]
                    form.clientes = arr3
                }
                break;
            case 'clientes':
                clientes_add = value
                this.setState({ ...this.state, clientes_add })
                break;
            default:
                break;
        }
    }
    render() {
        const { title, children, form, onChange, onChangeAdjunto, /* onChangeAdjuntoGrupo, */ clearFiles, /*clearFilesGrupo,*/ options, onSubmit, /*removeCorreo,*/ formeditado, deleteOption, onChangeOptions, action, handleChange, onChangeRange, tagInputChange,
            openModalCP, showModal, changeNameFile, onChangeFile, ...props } = this.props
        return (
            <>
                <div className="wizard wizard-6" id="wizardP" data-wizard-state="first">
                    <div className="wizard-content d-flex flex-column mx-auto">
                        <div className="d-flex flex-column-auto flex-column px-0">
                            <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                <div className="wizard-steps d-flex flex-column flex-md-row">
                                    <div id="wizard-1" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_4TABS() }}>
                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                            <div className="wizard-icon">
                                                <i className="wizard-check fas fa-check"></i>
                                                <span className="wizard-number">1</span>
                                            </div>
                                            <div className="wizard-label mr-3">
                                                <h3 className="wizard-title">Detalles</h3>
                                                <div className="wizard-desc">Datos del proyecto</div>
                                            </div>
                                            <span className="svg-icon">
                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div id="wizard-2" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={() => { openWizard2_4TABS() }}>
                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                            <div className="wizard-icon">
                                                <i className="wizard-check fas fa-check"></i>
                                                <span className="wizard-number">2</span>
                                            </div>
                                            <div className="wizard-label mr-3">
                                                <h3 className="wizard-title">Información</h3>
                                                <div className="wizard-desc">Datos de contacto</div>
                                            </div>
                                            <span className="svg-icon">
                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div id="wizard-3" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={(e) => { e.preventDefault(e); openWizard3_4TABS(); if (showModal) { openModalCP(); } }}>
                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                            <div className="wizard-icon">
                                                <i className="wizard-check fas fa-check"></i>
                                                <span className="wizard-number">3</span>
                                            </div>
                                            <div className="wizard-label mr-3">
                                                <h3 className="wizard-title">Ubicación</h3>
                                                <div className="wizard-desc">Ubicación del proyecto</div>
                                            </div>
                                            <span className="svg-icon">
                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div id="wizard-4" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={() => { openWizard4_4TABS() }}>
                                        <div className="wizard-wrapper">
                                            <div className="wizard-icon">
                                                <i className="wizard-check fas fa-check"></i>
                                                <span className="wizard-number">4</span>
                                            </div>
                                            <div className="wizard-label mr-3">
                                                <h3 className="wizard-title">Orden de compra</h3>
                                                <div className="wizard-desc">Evidencia de orden</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Form
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'wizard-4-content')
                                }
                            }
                            {...props}
                        >
                            {children}
                            <div id="wizard-1-content" class="px-8" data-wizard-type="step-content" data-wizard-state="current">
                                <Row className="mx-0 mt-10">
                                    <div className="text-center col-md-4">
                                        <div className="col-form-label mb-3 p-0 font-weight-bolder text-dark-60">Periodo del proyecto</div>
                                        <RangeCalendar
                                            onChange={onChangeRange}
                                            start={form.fechaInicio}
                                            end={form.fechaFin}
                                        />
                                    </div>
                                    <div className="align-self-center col-md-8">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <InputGray
                                                    letterCase={true}
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    requirevalidation={1}
                                                    withformgroup={0}
                                                    formeditado={formeditado}
                                                    name="nombre"
                                                    value={form.nombre}
                                                    onChange={onChange}
                                                    type="text"
                                                    placeholder="NOMBRE DEL PROYECTO"
                                                    iconclass="far fa-folder-open"
                                                    messageinc="Incorrecto. Ingresa el nombre del proyecto."
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <ReactSelectSearchGray
                                                    placeholder='Tipo de proyecto'
                                                    defaultvalue={form.tipoProyecto}
                                                    iconclass='las la-swatchbook icon-xl'
                                                    options={this.transformarOptions(options.tipos)}
                                                    onChange={(value) => { this.updateSelect(value, 'tipoProyecto') }}
                                                    requirevalidation={1}
                                                    messageinc="Selecciona el tipo de proyecto."
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <TagSelectSearchGray
                                                    requirevalidation={1}
                                                    placeholder="SELECCIONA LA FASE"
                                                    options={optionsFases()}
                                                    defaultvalue={form.fases}
                                                    onChange={(value) => { this.updateSelect(value, 'fases') }}
                                                    iconclass="las la-pencil-ruler icon-xl"
                                                    messageinc="Selecciona la fase."
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <InputNumberGray
                                                    withtaglabel = { 1 }
                                                    withtextlabel = { 1 }
                                                    withplaceholder = { 1 }
                                                    withicon={1}
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="M²"
                                                    value={form.m2}
                                                    name="m2"
                                                    onChange={onChange}
                                                    iconclass="fas fa-ruler-combined"
                                                    messageinc="Ingresa los m²."
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="row form-group-marginless">
                                            <div className="col-md-12">
                                                <InputGray
                                                    letterCase={false}
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={0}
                                                    requirevalidation={0}
                                                    withformgroup={0}
                                                    formeditado={formeditado}
                                                    rows="3"
                                                    as="textarea"
                                                    placeholder="DESCRIPCIÓN"
                                                    name="descripcion"
                                                    onChange={onChange}
                                                    value={form.descripcion}
                                                    customclass="px-2"
                                                    messageinc="Incorrecto. Ingresa una descripción."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="d-flex justify-content-end pt-3 border-top mt-10">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard2_4TABS() }}>Siguiente
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div id="wizard-2-content" class="px-8" data-wizard-type="step-content">
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={1}
                                            withformgroup={0}
                                            formeditado={formeditado}
                                            name="contacto"
                                            value={form.contacto}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL CONTACTO"
                                            iconclass="far fa-user-circle"
                                            messageinc="Incorrecto. Ingresa el nombre de contacto."
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
                                            iconclass="fas fa-mobile-alt"
                                            messageinc="Incorrecto. Ingresa el número de contacto."
                                            patterns={TEL}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <ReactSelectSearchGray
                                            placeholder='Selecciona el cliente principal'
                                            defaultvalue={form.cliente_principal}
                                            iconclass='las la-user icon-xl'
                                            options={this.transformarOptions(options.clientes)}
                                            onChange={(value) => { this.updateSelect(value, 'cliente_principal') }}
                                            requirevalidation={1}
                                            messageinc="Selecciona el cliente principal."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <TagSelectSearchGray
                                            requirevalidation={1}
                                            placeholder="SELECCIONA EL CLIENTE"
                                            options={this.transformarOptions(options.clientes)}
                                            defaultvalue={this.transformarOptions(form.clientes)}
                                            onChange={this.nuevoUpdateCliente}
                                            iconclass="far fa-folder-open"
                                            messageinc="Incorrecto. Selecciona el cliente."
                                            />
                                    </div>
                                    <div className="col-md-6">
                                        <TagInputGray
                                            tags={form.correos}
                                            onChange={tagInputChange}
                                            placeholder="CORREO DE CONTACTO"
                                            iconclass="far fa-folder-open"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-3">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard1_4TABS() }}>
                                        <span className="svg-icon svg-icon-md mr-2">
                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                        </span>Anterior
                                    </button>
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard3_4TABS(); if (showModal) { this.openModalCP(); } }}>Siguiente
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div id="wizard-3-content" class="px-8" data-wizard-type="step-content">
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <InputNumberGray
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon={1}
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            name="cp"
                                            onChange={onChange}
                                            value={form.cp}
                                            type="text"
                                            placeholder="CÓDIGO POSTAL"
                                            iconclass="far fa-envelope"
                                            maxLength="5"
                                            messageinc="Incorrecto. Ingresa el código postal."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={0}
                                            withformgroup={0}
                                            formeditado={formeditado}
                                            value={form.estado}
                                            onChange={onChange}
                                            name="estado"
                                            type="text"
                                            placeholder="ESTADO"
                                            iconclass="fas fa-map-marked-alt"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputGray
                                            letterCase={false}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={0}
                                            requirevalidation={0}
                                            withformgroup={0}
                                            formeditado={formeditado}
                                            value={form.municipio}
                                            onChange={onChange}
                                            name="municipio"
                                            type="text"
                                            placeholder="MUNICIPIO/DELEGACIÓN"
                                            iconclass="fas fa-map-marker-alt"
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
                                            requirevalidation={0}
                                            withformgroup={0}
                                            formeditado={formeditado}
                                            value={form.colonia}
                                            onChange={onChange}
                                            name="colonia"
                                            type="text"
                                            placeholder="COLONIA"
                                            iconclass="fas fa-map-pin"
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <InputGray
                                            letterCase={true}
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            requirevalidation={0}
                                            withformgroup={0}
                                            formeditado={formeditado}
                                            name="calle"
                                            value={form.calle}
                                            onChange={onChange}
                                            type="text"
                                            placeholder="CALLE Y NÚMERO"
                                            iconclass="fas fa-map-signs"
                                            messageinc="Incorrecto. Ingresa la calle y número."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-3">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard2_4TABS() }}>
                                        <span className="svg-icon svg-icon-md mr-2">
                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                        </span>Anterior
                                    </button>
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard4_4TABS() }}>Siguiente
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div id="wizard-4-content" class="px-8" data-wizard-type="step-content">
                                <Row className="mx-auto mt-5 mb-8 col-md-9 col-xxl-7">
                                    <div className="text-center col-md-6">
                                        <div>
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bolder">Fecha de orden de compra</label>
                                            </div>
                                            <CalendarDay value = { form.fechaEvidencia } date = { form.fechaEvidencia } onChange = { onChange } name = 'fechaEvidencia' withformgroup={0} requirevalidation={1}/>
                                        </div>
                                    </div>
                                    <div className="align-self-center col-md-6">
                                        <div className="col-md-12 mb-9">
                                            <InputGray
                                                letterCase={true}
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                requirevalidation={0}
                                                withformgroup={0}
                                                formeditado={formeditado}
                                                name="numero_orden"
                                                value={form.numero_orden}
                                                onChange={onChange}
                                                type="text"
                                                placeholder="NÚMERO DE ORDEN DE COMPRA"
                                                iconclass="las la-hashtag"
                                                messageinc="Incorrecto. Ingresa el número de orden."
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="adjunto" className="drop-files">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { onChangeFile(e.target.files[0], 'adjunto'); changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2" id="info">Subir orden de compra (PDF)</div>
                                            </label>
                                            {
                                                form.adjunto === '' ?
                                                    <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                    : <></>
                                            }
                                        </div>
                                    </div>
                                </Row>
                                <div className="d-flex justify-content-between border-top pt-3">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard3_4TABS() }}>
                                        <span className="svg-icon svg-icon-md mr-2">
                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                        </span>Anterior
                                    </button>
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(onSubmit, e, 'wizard-4-content') }} >
                                        Convertir
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
}

export default ProyectosForm