import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap' 
import { InputGray, Select, SelectSearchGray, Button, InputMoneyGray, RadioGroup, CalendarDay } from '../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles';

class SolicitudCompraForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas } } = this.props

        empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
            }
            return false
        })
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas } } = this.props
        areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
            return false
        })

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
        const { title, options, form, onChange, children, clearFiles, onSubmit, formeditado, handleChange,  ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span>Soliciar compra</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Área y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> Presupuesto</h3>
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
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            withformgroup={0}
                                            customdiv="mb-0"
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.proyectos}
                                            placeholder="SELECCIONA EL PROYECTO"
                                            name="proyecto"
                                            value={form.proyecto}
                                            onChange={this.updateProyecto}
                                            messageinc="Incorrecto. Selecciona el proyecto"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            withformgroup={0}
                                            customdiv="mb-0"
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
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearchGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            withformgroup={0}
                                            customdiv="mb-0"
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.empresas}
                                            placeholder="SELECCIONA LA EMPRESA"
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={this.updateEmpresa}
                                            messageinc="Incorrecto. Selecciona la empresa"
                                            iconclass='far fa-building'
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
                                            placeholder="MONTO"
                                            value={form.total}
                                            name="total" onChange={onChange}
                                            iconclass={"fas fa-money-check-alt"}
                                        />
                                    </div>
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
                                            iconclass="fas fa-coins text-dark-50"
                                            required
                                            customclass="bg-light border-0 text-dark-50 font-weight-bold"
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
                                <Row className="mx-0">
                                    <Col md="4" className="text-center">
                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                            <label className="text-center font-weight-bolder">Fecha</label>
                                        </div>
                                        <CalendarDay value={form.fecha} name='fecha' onChange={onChange} date={form.fecha} withformgroup={0} requirevalidation={0}/>
                                    </Col>
                                    <Col md="8" className="align-self-center">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                <SelectSearchGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={1}
                                                    customdiv="mb-0"
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    options={options.areas}
                                                    placeholder="SELECCIONA EL ÁREA"
                                                    name="areas"
                                                    value={form.area}
                                                    onChange={this.updateArea}
                                                    messageinc="Incorrecto. Selecciona el área"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <SelectSearchGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={1}
                                                    customdiv="mb-0"
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
                                        <div className="row form-group-marginless">
                                            <div className="col-md-12">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={0}
                                                    withformgroup={0}
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
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
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
                                    <div className="col-md-6 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                        <ItemSlider
                                            items={form.adjuntos.adjunto.files}
                                            item='adjunto'
                                            handleChange={handleChange}
                                            multiple={true}
                                        />
                                    </div>
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

export default SolicitudCompraForm