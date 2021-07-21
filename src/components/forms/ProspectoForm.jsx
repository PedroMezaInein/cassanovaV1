import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, SelectSearch, Input } from '../form-components'
import { ContactoLeadForm } from '../forms'
import { validateAlert } from '../../functions/alert'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../functions/wizard'
class ProspectoForm extends Component {

    state = {
        newTipoProyecto: false,
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

    updateVendedor = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'vendedor', value: value } })
    }

    render() {
        const { title, form, formCliente, children, vendedores, estatusProspectos, clientes, tipoProyecto, estatusContratacion, tiposContactos, onChange, onChangeCliente, onChangeContacto, formContacto, onSubmit, formeditado, options, handleChange, ...props } = this.props
        const { newTipoProyecto, } = this.state
        return (
            <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        {
                            title === 'Editar prospecto' ? '' :
                                <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                                    <div className="wizard-label">
                                        <h3 className="wizard-title">
                                            <span>1.</span> Datos de generales</h3>
                                        <div className="wizard-bar"></div>
                                    </div>
                                </div>

                        }
                        {
                            title !== 'Editar prospecto' &&
                            <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                                <div className="wizard-label">
                                    <h3 className="wizard-title">
                                        <span>2.</span> Información de contacto</h3>
                                    <div className="wizard-bar"></div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form
                            id = 'prospecto-form-id'
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'for2-wizard-1-content')
                                }
                            }
                            {...props}
                        >
                            <div id="for2-wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                            {
                                title === 'Editar prospecto' ? '' :
                                <h5 className="mb-4 font-weight-bold text-dark">INGRESA LOS DATOS DE GENERALES</h5>
                            }
                                <div className="form-group row form-group-marginless pt-4">
                                    <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
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
                                    <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.vendedores}
                                            placeholder="SELECCIONA AL VENDEDOR"
                                            name="vendedor"
                                            value={form.vendedor}
                                            onChange={this.updateVendedor}
                                            messageinc="Incorrecto. Selecciona al vendedor"
                                        />
                                    </div>
                                    <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.tipoProyectos}
                                            placeholder="SELECCIONA EL TIPO DE PROYECTO"
                                            onChange={this.updateTipoProyecto}
                                            name="tipoProyecto"
                                            value={form.tipoProyecto}
                                            messageinc="Incorrecto. Selecciona el tipo de proyecto"
                                        />
                                    </div>
                                    {
                                        newTipoProyecto &&
                                        <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                            <Input
                                                formeditado={formeditado}
                                                requirevalidation={1}
                                                name="newTipoProyecto"
                                                onChange={onChange}
                                                value={form.newTipoProyecto}
                                                type="text"
                                                placeholder="NUEVO TIPO DE PROYECTO"
                                                iconclass={"far fa-folder-open"}
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            rows="3"
                                            as="textarea"
                                            placeholder="DESCRIPCIÓN DEL PROSPECTO"
                                            name="descripcion"
                                            onChange={onChange}
                                            value={form.descripcion}
                                            customclass="px-2"
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            rows="3"
                                            as="textarea"
                                            placeholder="MOTIVO DE CONTRATACIÓN O RECHAZO"
                                            name="motivo"
                                            onChange={onChange}
                                            value={form.motivo}
                                            customclass="px-2"
                                            messageinc="Incorrecto. Ingresa el motivo."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        {
                                            title === 'Editar prospecto' ?
                                                <div className="col-lg-6 text-right">
                                                    <div className="">
                                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-2"
                                                            onClick={
                                                                (e) => {
                                                                    e.preventDefault();
                                                                    validateAlert(onSubmit, e, 'for2-wizard-1-content')
                                                                }
                                                            }
                                                            text="Enviar" />
                                                    </div>
                                                </div>
                                                :
                                                <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div id="for2-wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">INFORMACIÓN DEL CONTACTO</h5>
                                {
                                    title !== 'Editar prospecto' &&
                                    <ContactoLeadForm
                                        options={options}
                                        formContacto={formContacto}
                                        onChangeContacto={onChangeContacto}
                                        handleChange={handleChange}
                                    />
                                }
                                <div className="border-top mt-3 pt-3">
                                    <div className="row">
                                        <div className="col-lg-6 text-left">
                                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                        </div>
                                        <div className="col-lg-6 text-right">
                                            <div className="">
                                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-2"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'for2-wizard-1-content')
                                                        }
                                                    }
                                                    text="Enviar" />
                                            </div>
                                        </div>
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