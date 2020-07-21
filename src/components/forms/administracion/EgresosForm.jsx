import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { RFC, DATE } from '../../../constants'
import { SelectSearch, Select, Button, RadioGroup, Input, Calendar, InputMoney, FileInput } from '../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'

class EgresosForm extends Component {

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas: empresas } } = this.props

        const aux = empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
            }
        })
    }
    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }

    updateCuenta = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cuenta' } })
    }

    updateProveedor = value => {
        const { onChange, data, form } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
        data.proveedores.find(function (element, index) {
            if (value.toString() === element.id.toString()) {
                if (element.rfc !== '') {
                    onChange({ target: { value: element.rfc, name: 'rfc' } })
                }
            }
        })
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
        })

    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    updateTipoPago = e => {
        const { options, form, onChange } = this.props
        const { value } = e.target
        if (form.facturaObject) {
            options.tiposPagos.map((option) => {
                if (option.value.toString() === value.toString() && option.text.toString() === 'TOTAL')
                    onChange({ target: { value: form.facturaObject.total, name: 'total' } })
            })
        }
        onChange(e)
    }

    updateFactura = e => {
        const { value, name } = e.target
        const { onChange, options } = this.props
        onChange({ target: { value: value, name: name } })
        let aux = ''
        options.tiposImpuestos.find(function (element, index) {
            if (element.text === 'IVA')
                aux = element.value
        });
        onChange({ target: { value: aux, name: 'tipoImpuesto' } })
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, onSubmit, formeditado, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de la factura</h3>
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
                                    <span>3.</span> Pago</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center py-10 px-8 py-lg-12 px-lg-10">
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
                            <div id="wizard-1-content" className="pb-3" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos de la factura</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name='factura'
                                            onChange={this.updateFactura}
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
                                    {
                                        form.factura === 'Con factura' && title !== 'Editar egreso' ?
                                            <div className="col-md-4">
                                                <FileInput
                                                    requirevalidation={0}
                                                    formeditado={formeditado}
                                                    onChangeAdjunto={onChangeAdjunto}
                                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                                    value={form['adjuntos']['factura']['value']}
                                                    name={'factura'} id={'factura'}
                                                    accept="text/xml, application/pdf"
                                                    files={form['adjuntos']['factura']['files']}
                                                    deleteAdjunto={clearFiles} multiple
                                                    messageinc="Incorrecto. Adjunta el documento."
                                                />
                                            </div>
                                            : ''
                                    }
                                    {
                                        form.factura === 'Con factura' ?
                                            <div className="col-md-4">
                                                <Input
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    placeholder="RFC"
                                                    name="rfc"
                                                    value={form.rfc}
                                                    onChange={onChange}
                                                    iconclass={"far fa-file-alt"}
                                                    patterns={RFC}
                                                    messageinc="Incorrecto. Ej. ABCD001122ABC"
                                                    maxLength="13"
                                                />
                                            </div>
                                            : ''
                                    }
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.proveedores}
                                            placeholder="SELECCIONA EL PROVEEDOR"
                                            name="proveedores"
                                            value={form.proveedor}
                                            onChange={this.updateProveedor}
                                            iconclass={"far fa-user"}
                                            messageinc="Incorrecto. Selecciona el proveedor."

                                        />
                                    </div>
                                    <div className="col-md-6">
                                        {
                                            form.facturaObject ?
                                                <Input
                                                    placeholder="EMPRESA"
                                                    name="empresa"
                                                    readOnly
                                                    value={form.empresa}
                                                    onChange={onChange}
                                                    iconclass={"far fa-building"}
                                                />
                                                :
                                                <SelectSearch
                                                    formeditado={formeditado}
                                                    options={options.empresas}
                                                    placeholder="SELECCIONA LA EMPRESA"
                                                    name="empresa"
                                                    value={form.empresa}
                                                    onChange={this.updateEmpresa}
                                                    iconclass={"far fa-building"}
                                                    messageinc="Incorrecto. Selecciona la empresa."
                                                />
                                        }
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
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el área y fecha</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Calendar
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA"
                                            name="fecha"
                                            value={form.fecha}
                                            patterns={DATE}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearch
                                            formeditado={formeditado}
                                            options={options.areas}
                                            placeholder="SELECCIONA EL ÁREA"
                                            name="area"
                                            value={form.area}
                                            onChange={this.updateArea}
                                            iconclass={"far fa-window-maximize"}
                                            messageinc="Incorrecto. Selecciona el área."
                                        />
                                    </div>
                                    {
                                        form.area ?
                                            <div className="col-md-4">
                                                <SelectSearch
                                                    formeditado={formeditado}
                                                    options={options.subareas}
                                                    placeholder="SELECCIONA EL SUBÁREA"
                                                    name="subarea"
                                                    value={form.subarea}
                                                    onChange={this.updateSubarea}
                                                    iconclass={"far fa-window-restore"}
                                                    messageinc="Incorrecto. Selecciona el subárea."
                                                />
                                            </div>
                                            : ''
                                    }
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
                                            messageinc="Incorrecto. Ingresa la descripción."
                                            style={{ paddingLeft: "10px" }}
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
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el tipo de pago, impuesto y estatus</h5>
                                <div className="form-group row form-group-marginless">
                                    {
                                        form.empresa ?
                                            <div className="col-md-4">
                                                <SelectSearch
                                                    formeditado={formeditado}
                                                    options={options.cuentas}
                                                    placeholder="SELECCIONA LA CUENTA"
                                                    name="cuenta"
                                                    value={form.cuenta}
                                                    onChange={this.updateCuenta}
                                                    iconclass={"far fa-credit-card"}
                                                    messageinc="Incorrecto. Selecciona la cuenta."
                                                />
                                            </div>
                                            : ''
                                    }
                                    <div className="col-md-4">
                                        <Select
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL TIPO DE PAGO"
                                            options={options.tiposPagos}
                                            name="tipoPago"
                                            value={form.tipoPago}
                                            onChange={this.updateTipoPago}
                                            iconclass={"fas fa-coins"}
                                            messageinc="Incorrecto. Selecciona el tipo de pago."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Select
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL IMPUESTO"
                                            options={options.tiposImpuestos}
                                            name="tipoImpuesto"
                                            value={form.tipoImpuesto}
                                            onChange={onChange}
                                            iconclass={"fas fa-file-invoice-dollar"}
                                            messageinc="Incorrecto. Selecciona el impuesto."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <Select
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL ESTATUS DE COMPRA"
                                            options={options.estatusCompras}
                                            name="estatusCompra"
                                            value={form.estatusCompra}
                                            onChange={onChange}
                                            iconclass={"flaticon2-time"}
                                            messageinc="Incorrecto. Selecciona el estatus de compra."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            thousandSeparator={true}
                                            placeholder="MONTO"
                                            value={form.total}
                                            name="total"
                                            onChange={onChange}
                                            iconclass={" fas fa-money-check-alt"}
                                            messageinc="Incorrecto. Ingresa el monto."
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            thousandSeparator={true}
                                            placeholder="COMISIÓN"
                                            value={form.comision}
                                            name="comision"
                                            onChange={onChange}
                                            iconclass={"flaticon-coins"}
                                            messageinc="Incorrecto. Ingresa la comisión."
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <FileInput
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChangeAdjunto={onChangeAdjunto}
                                            placeholder={form['adjuntos']['presupuesto']['placeholder']}
                                            value={form['adjuntos']['presupuesto']['value']}
                                            name={'presupuesto'} id={'presupuesto'}
                                            accept="text/xml, application/pdf"
                                            files={form['adjuntos']['presupuesto']['files']}
                                            deleteAdjunto={clearFiles}
                                            messageinc="Incorrecto. Adjunta el documento."
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <FileInput
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChangeAdjunto={onChangeAdjunto}
                                            placeholder={form['adjuntos']['pago']['placeholder']}
                                            value={form['adjuntos']['pago']['value']}
                                            name={'pago'} id={'pago'}
                                            accept="text/xml, application/pdf"
                                            files={form['adjuntos']['pago']['files']}
                                            deleteAdjunto={clearFiles}
                                            messageinc="Incorrecto. Adjunta el documento."
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
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EgresosForm