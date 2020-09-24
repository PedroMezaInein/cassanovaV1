import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearch, Input } from '../form-components'
import axios from 'axios'
import { CP_URL } from '../../constants'
import { ContactoLeadForm, ClienteForm } from '../forms'
import { openWizard1, openWizard2, openWizard3 } from '../../functions/wizard'
import { validateAlert } from '../../functions/alert'

class ProspectoForm extends Component {

    state = {
        newClient: false,
        newEstatusProspectos: false,
        newTipoProyecto: false,
        newEstatusContratacion: false,
        municipio: '',
        estado: '',
        colonias: []
    }

    updateEstatusContratacion = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'estatusContratacion', value: value } })
        if (value === 'New') {
            this.setState({
                newEstatusContratacion: true
            })
        } else {
            this.setState({
                newEstatusContratacion: false
            })
        }
    }

    updateEstatusProspectos = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'estatusProspecto', value: value } })
        if (value === 'New') {
            this.setState({
                newEstatusProspectos: true
            })

        } else {
            this.setState({
                newEstatusProspectos: false
            })
        }
    }

    updateTipoProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'tipoProyecto', value: value } })
        if (value === 'New') {
            this.setState({
                newTipoProyecto: true
            })
        } else {
            this.setState({
                newTipoProyecto: false
            })
        }
    }

    updateCliente = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'cliente', value: value } })
        if (value === 'New') {
            this.setState({
                newClient: true
            })
        } else {
            this.setState({
                newClient: false
            })
        }
    }

    updateVendedor = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'vendedor', value: value } })
    }

    updateColonia = value => {
        const { onChangeCliente } = this.props
        onChangeCliente({ target: { name: 'colonia', value: value } })
    }

    changeCP = event => {
        const { value, name } = event.target
        const { onChangeCliente } = this.props
        onChangeCliente({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
    }

    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { onChangeCliente } = this.props
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia })
                })
                this.setState({
                    ... this.state,
                    municipio,
                    estado,
                    colonias: aux
                })
                onChangeCliente({ target: { name: 'cp', value: value } })
                onChangeCliente({ target: { name: 'municipio', value: municipio } })
                onChangeCliente({ target: { name: 'estado', value: estado } })
            },
            (error) => {

            }
        ).catch((error) => {

        })
    }

    render() {
        const { title, form, formCliente, children, vendedores, estatusProspectos, clientes, tipoProyecto, estatusContratacion, tiposContactos, onChange, onChangeCliente, onChangeContacto, formContacto, onSubmit, formeditado, options,  ...props } = this.props
        const { newClient, newEstatusProspectos, newTipoProyecto, newEstatusContratacion, municipio, estado, colonias } = this.state
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
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Descripción y motivo</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" style={{ paddingTop: "0px" }} onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span>Información del contacto</h3>
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
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de generales</h5>
                                <div className="form-group row form-group-marginless">
                                    {/* <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.clientes}
                                            placeholder="SELECCIONA EL CLIENTE"
                                            onChange={this.updateCliente}
                                            name="cliente"
                                            value={form.cliente}
                                            />
                                    </div> */}
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado = { formeditado }
                                            options = { options.vendedores }
                                            placeholder="SELECCIONA AL VENDEDOR"
                                            name = "vendedor"
                                            value = { form.vendedor }
                                            onChange = { this.updateVendedor }
                                            />
                                    </div>

                                    <div className="col-md-4">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={1}
                                            name="preferencia"
                                            type="text"
                                            placeholder="PEREFENCIA DE CONTACTO"
                                            onChange={onChange}
                                            value={form.preferencia}
                                            iconclass={"fas fa-mail-bulk"}
                                            messageinc="Incorrecto. Ingresa la preferencia de contacto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado = { formeditado }
                                            options = { options.estatusProspectos }
                                            placeholder = "SELECCIONA EL ESTATUS DEL PROSPECTO"
                                            onChange = { this.updateEstatusProspectos }
                                            name = "estatusProspecto"
                                            value = { form.estatusProspecto }
                                            />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    
                                    {
                                        newEstatusProspectos &&
                                            <div className="col-md-4">
                                                <Input
                                                    formeditado={formeditado}
                                                    requirevalidation={1}
                                                    name="newEstatusProspecto"
                                                    type="text"
                                                    placeholder="NUEVO ESTATUS PROSPECTO"
                                                    onChange={onChange}
                                                    value={form.newEstatusProspectos}
                                                />
                                            </div>
                                    }
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado = { formeditado }
                                            options = { options.tipoProyectos }
                                            placeholder = "SELECCIONA EL TIPO DE PROYECTO"
                                            onChange = { this.updateTipoProyecto }
                                            name = "tipoProyecto"
                                            value = { form.tipoProyecto }
                                            />
                                    </div>
                                    {
                                        newTipoProyecto &&
                                            <div className="col-md-4">
                                                <Input
                                                    formeditado={formeditado}
                                                    requirevalidation={1}
                                                    name="newTipoProyecto"
                                                    onChange={onChange}
                                                    value={form.newTipoProyecto}
                                                    type="text"
                                                    placeholder="NUEVO TIPO DE PROYECTO"
                                                />
                                            </div>
                                    }
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa la descripción y motivo</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            rows="3"
                                            as="textarea"
                                            placeholder="DESCRIPCIÓN DEL PROSPECTO"
                                            name="descripcion"
                                            onChange={onChange}
                                            value={form.descripcion}
                                            style={{ paddingLeft: "10px" }}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            rows="3"
                                            as="textarea"
                                            placeholder="MOTIVO DE CONTRATACIÓN O RECHAZO"
                                            name="motivo"
                                            onChange={onChange}
                                            value={form.motivo}
                                            style={{ paddingLeft: "10px" }}
                                            messageinc="Incorrecto. Ingresa el motivo."
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
                                <h5 className="mb-4 font-weight-bold text-dark">Información del contacto</h5>

                                {
                                    title !== 'Editar prospecto' &&
                                    <>
                                        <div className="">
                                            <ContactoLeadForm
                                                options = { options }
                                                formContacto={formContacto}
                                                onChangeContacto={onChangeContacto}
                                            />
                                        </div>
                                    </>
                                }
                                <div className="col-md-4">
                                </div>
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

export default ProspectoForm