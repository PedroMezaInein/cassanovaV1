import React, { Component } from 'react'
import { Form, Col, Row  } from 'react-bootstrap' 
import { Input, Select, SelectSearch, Button, InputMoney, RadioGroup, CalendarDay } from '../../form-components'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles';

class SolicitudEgresosForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    // updateEmpresa = value => {
    //     const { onChange, setOptions } = this.props
    //     onChange({ target: { value: value, name: 'empresa' } })
    //     onChange({ target: { value: '', name: 'cuenta' } })

    //     const { options: { empresas } } = this.props

    //     empresas.find(function (element, index) {
    //         if (value.toString() === element.value.toString()) {
    //             setOptions('cuentas', element.cuentas)
    //         }
    //         return false
    //     })
    // }
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    render() {
        const { title, options, form, onChange, clearFiles, onSubmit, formeditado, handleChange, deleteFile,  ...props } = this.props
        return (
            <div className="wizard wizard-3" id="for2-wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="for2-wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de solicitud</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="for2-wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Presupuesto</h3>
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
                                    validateAlert(onSubmit, e, 'for2-wizard-2-content')
                                }
                            }
                            {...props}
                        >
                            <div id="for2-wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la solicitud</h5>
                                <Row>
                                    <Col md={4} className="px-0">
                                        <div className="col-md-12 text-center px-0 mt-4" style={{ height: '0px' }}>
                                            <label className="text-center font-weight-bolder">Fecha</label>
                                        </div>
                                        <div className="col-md-12 text-center px-0">
                                            <CalendarDay
                                                value = { form.fecha }
                                                date = { form.fecha }
                                                onChange = { onChange }
                                                name = 'fecha'
                                                withformgroup={1}
                                                requirevalidation={1}
                                            />
                                        </div>
                                    </Col>
                                    <Col  md={8} className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <SelectSearch
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    options={options.proveedores}
                                                    placeholder="SELECCIONA EL PROVEEDOR"
                                                    name="proveedor"
                                                    value={form.proveedor}
                                                    onChange={this.updateProveedor}
                                                    messageinc="Incorrecto. Selecciona el proveedor"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <SelectSearch
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    options={options.empresas}
                                                    placeholder="SELECCIONA LA EMPRESA"
                                                    name="empresa"
                                                    value={form.empresa}
                                                    onChange={this.updateEmpresa}
                                                    messageinc="Incorrecto. Selecciona la empresa"
                                                />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                        <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <Select
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        placeholder="SELECCIONA EL TIPO DE PAGO"
                                                        options={options.tiposPagos}
                                                        name="tipoPago"
                                                        value={form.tipoPago}
                                                        onChange={onChange}
                                                        messageinc="Incorrecto. Selecciona el tipo de pago."
                                                        iconclass={"fas fa-coins"}
                                                        required
                                                    />
                                            </div>
                                            <div className="col-md-4">
                                                <InputMoney
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    thousandseparator={true}
                                                    placeholder="MONTO"
                                                    value={form.total}
                                                    name="total" onChange={onChange}
                                                    iconclass={" fas fa-money-check-alt"}
                                                />
                                            </div>
                                            <div className='col-md-4'>
                                                <SelectSearch
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    options={options.subareas}
                                                    placeholder="SELECCIONA EL SUBÁREA"
                                                    name="subarea"
                                                    value={form.subarea}
                                                    onChange={this.updateSubarea}
                                                    messageinc="Incorrecto. Selecciona el subárea"
                                                    />
                                            </div>
                                        </div>
                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-12">
                                                    <Input
                                                        requirevalidation={0}
                                                        formeditado={formeditado}
                                                        as="textarea"
                                                        placeholder="DESCRIPCIÓN"
                                                        rows="3"
                                                        value={form.descripcion}
                                                        name="descripcion"
                                                        onChange={onChange}
                                                        customclass="px-2"
                                                        messageinc="Incorrecto. Ingresa la descripción."
                                                    />
                                                </div>
                                            </div>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="for2-wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el presupuesto</h5>
                                <div className="form-group row form-group-marginless mb-0">
                                    <div className="col-md-6 d-flex align-items-center d-flex justify-content-center">
                                        <RadioGroup
                                            name='factura'
                                            onChange={onChange}
                                            options={
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'Con factura'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'Sin factura'
                                                    }
                                                ]
                                            }
                                            placeholder={' Lleva factura '}
                                            value={form.factura}
                                        />
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.adjunto.files } item = 'adjunto' deleteFile = { deleteFile } 
                                            handleChange = { form.adjuntos.adjunto.files.length ? null : handleChange } multiple = { false } />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                    <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'for2-wizard-2-content')
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

export default SolicitudEgresosForm