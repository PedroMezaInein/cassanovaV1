import React, { useState, useEffect } from 'react';

import { TagSelectSearchGray, InputGray, InputMoneyGray, TagInputGray, InputPhoneGray, InputNumberGray, ReactSelectSearchGray, RangeCalendar, Button, FixedMultiOptionsGray } from '../../../components/form-components'

import Swal from 'sweetalert2'
import moment from 'moment'

export default function EditProyect() { 
    const [state, setState] = useState({
        cliente_seleccionado: [],
        clientes_add: [],
        navInfo: 'info',
        showModal: false,
        modal: {
            cp: false
        },
        form: {
            nombre: '',
            empresa: '',
            tipoProyecto: '',
            fases: [],
            m2: '',
            costo: '',
            descripcion: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            contacto: '',
            numeroContacto: '',
            cliente_principal: '',
            clientes: [],
            correos: [],
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            ubicacion_cliente: '',
            ciudad: '',
            sucursal: '',
            cp_ubicacion: []
        },
        formContratar: {
            nombre: '',
            fases: [],
            costo: '',
            fechaInicio: new Date(),
            fechaFin: new Date()
        },
        formeditado: 1,
        stateOptions: {
            fases: []
        }
    })

    useEffect(() => { 
        
    }, [])

    return (
        <>
            { tipo === 'edit' ?
                <div className="wizard wizard-6" id="wizardP" data-wizard-state="first">
                    <div className="wizard-content d-flex flex-column mx-auto">
                        <div className="d-flex flex-column-auto flex-column px-0">
                            <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                <div className="wizard-steps d-flex flex-column flex-md-row">
                                    <div id="wizard-1" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
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
                                    <div id="wizard-2" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={() => { openWizard2() }}>
                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                            <div className="wizard-icon">
                                                <i className="wizard-check fas fa-check"></i>
                                                <span className="wizard-number">2</span>
                                            </div>
                                            <div className="wizard-label mr-3">
                                                <h3 className="wizard-title mb-0">Información</h3>
                                                <div className="wizard-desc">Datos de contacto</div>
                                            </div>
                                            <span className="svg-icon">
                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Form
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(this.onSubmit, e, 'wizard-3-content')
                                }
                            }
                        >
                            <div id="wizard-1-content" data-wizard-type="step-content" data-wizard-state="current">
                                <Row className="mx-0 mt-10">
                                    <div className="text-center col-sm-12 col-lg-12 col-xxl-4 order-2 order-xxl-1 mt-5 mt-xxl-0">
                                        <div className="col-form-label mb-3 p-0 font-weight-bolder text-dark-60">Periodo inicio - final</div>
                                        <RangeCalendar
                                            onChange={this.onChangeRange}
                                            start={form.fechaInicio}
                                            end={form.fechaFin}
                                        />
                                    </div>
                                    <div className="align-self-center col-sm-12 col-lg-12 col-xxl-8 order-1 order-xxl-2">
                                        <div className="form-group row form-group-marginless">

                                            <div className="col-md-4">
                                                <ReactSelectSearchGray
                                                    placeholder='Selecciona la empresa'
                                                    defaultvalue={form.empresa}
                                                    iconclass='las la-building icon-xl'
                                                    options={this.transformarOptions(options.empresas)}
                                                    onChange={this.updateEmpresa}
                                                    requirevalidation={1}
                                                    messageinc="Selecciona la empresa."
                                                />
                                            </div>
                                            <div className="col-md-4">
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
                                                    name="nombre"
                                                    value={form.nombre}
                                                    onChange={this.onChange}
                                                    type="text"
                                                    placeholder="SUCURSAL"
                                                    iconclass="far fa-folder-open"
                                                    messageinc="Ingresa la sucursal del proyecto."
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
                                                    withformgroup={0}
                                                    formeditado={formeditado}
                                                    name="ciudad"
                                                    value={form.ciudad}
                                                    onChange={this.onChange}
                                                    type="text"
                                                    placeholder="CIUDAD"
                                                    iconclass="far fa-folder-open"
                                                    messageinc="Ingresa la ciudad del proyecto."
                                                />
                                            </div>

                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-8">
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
                                                    placeholder="UBICACIÓN"
                                                    name="sucursal"
                                                    onChange={this.onChange}
                                                    value={form.sucursal}
                                                    customclass="px-2"
                                                    messageinc="Ingresa la dirección completa."
                                                />
                                            </div>

                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-4">
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
                                            <div className="col-md-4">
                                                <InputNumberGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="M²"
                                                    value={form.m2}
                                                    name="m2"
                                                    onChange={this.onChange}
                                                    iconclass="las la-ruler-combined icon-xl"
                                                    messageinc="Ingresa los m²."
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputMoneyGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    thousandseparator={true}
                                                    placeholder="Costo con IVA"
                                                    value={form.costo}
                                                    name="costo"
                                                    onChange={this.onChange}
                                                    iconclass="las la-coins"
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
                                                    onChange={this.onChange}
                                                    value={form.descripcion}
                                                    customclass="px-2"
                                                    messageinc="Ingresa una descripción."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="d-flex justify-content-end pt-3 border-top mt-10">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard2() }}>Siguiente
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div id="wizard-2-content" data-wizard-type="step-content">
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
                                            onChange={this.onChange}
                                            type="text"
                                            placeholder="NOMBRE DEL CONTACTO"
                                            iconclass="far fa-user-circle"
                                            messageinc="Ingresa el nombre de contacto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputPhoneGray
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            prefix={''}
                                            name="numeroContacto"
                                            value={form.numeroContacto}
                                            onChange={this.onChange}
                                            placeholder="NÚMERO DE CONTACTO"
                                            iconclass="fas fa-mobile-alt"
                                            messageinc="Ingresa el número de contacto."
                                            patterns={TEL}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <ReactSelectSearchGray
                                            placeholder='Selecciona el cliente principal'
                                            defaultvalue={form.cliente_principal}
                                            iconclass='las la-user icon-xl'
                                            options={options.clientes}
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
                                            placeholder="SELECCIONA EL(LOS) CLIENTE(S)"
                                            options={options.clientes}
                                            defaultvalue={form.clientes}
                                            onChange={(value) => { this.updateSelect(value, 'clientes') }}
                                            iconclass="las la-user-friends icon-xl"
                                            messageinc="Selecciona el cliente."
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <TagInputGray
                                            tags={form.correos}
                                            onChange={this.tagInputChange}
                                            placeholder="CORREO DE CONTACTO"
                                            iconclass="far fa-folder-open"
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-3">
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard1() }}>
                                        <span className="svg-icon svg-icon-md mr-2">
                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                        </span>Anterior
                                    </button>
                                    {/* <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard3(); if (showModal) { this.openModalCP(); } }}>Siguiente
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                </span>
                                                            </button> */}
                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'wizard-2-content') }} >Editar
                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                            <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                        </span>
                                    </button>
                                </div>
                            </div>

                        </Form>
                    </div>
                </div>
                :
                tipo === 'hire' ?
                    <Form id="form-contratar" onSubmit={(e) => { e.preventDefault(); validateAlert(this.sendFormContratar, e, 'form-contratar') }} >
                        <Row className="mx-auto justify-content-center">
                            <Col md="6" className="text-center">
                                <div className="col-form-label mb-3 p-0 font-weight-bolder text-dark-60">Periodo inicio - final</div>
                                <RangeCalendar
                                    onChange={this.onChangeRangeContratar}
                                    start={formContratar.fechaInicio}
                                    end={formContratar.fechaFin}
                                />
                            </Col>
                            <Col md="5" className="align-self-center">
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                            withformgroup={1} requirevalidation={1} formeditado={formeditado}
                                            thousandseparator={true} placeholder="Costo con IVA" value={formContratar.costo}
                                            name="costo" onChange={this.onChangeContratar} iconclass="las la-coins" />
                                    </div>
                                    <div className="col-md-12">
                                        <FixedMultiOptionsGray requirevalidation={1} placeholder="SELECCIONA LA FASE"
                                            options={stateOptions.fases} defaultvalue={formContratar.fases}
                                            onChange={this.updateSelectContratar} iconclass="las la-pencil-ruler icon-xl"
                                            messageinc="Selecciona la fase." name="fases" />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1}
                                            withformgroup={1} requirevalidation={1} formeditado={formeditado}
                                            placeholder='NOMBRE' value={formContratar.nombre} name='nombre'
                                            onChange={this.onChangeContratar} iconclass="far fa-folder-open"
                                            messageinc="Ingresa el nombre del proyecto." />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="card-footer p-0 mt-8 pt-3">
                            <div className="row mx-0">
                                <div className="col-md-12 text-right p-0">
                                    <Button icon='' className="btn btn-light-primary2" text="CONTRATAR" onClick={(e) => { e.preventDefault(); validateAlert(this.sendFormContratar, e, 'form-contratar') }} />
                                </div>
                            </div>
                        </div>
                    </Form>
                :<></>   
            }
        </>
    )
}