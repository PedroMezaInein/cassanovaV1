import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { SelectSearch, Button, Input, InputMoney,RangeCalendar } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles';
class ContratoForm extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    updateCliente = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
    }
    updateTipoContrato = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'tipoContrato' } })
    }
    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }
    render() {
        const { title, options, form, onChange, tipo, onSubmit, formeditado, clearFiles, onChangeAdjunto,handleChange,onChangeRange, ...props } = this.props
        return (
            <Form id="form-contrato"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-contrato')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="NOMBRE"
                            name="nombre"
                            onChange={onChange}
                            value={form.nombre}
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre."
                        />
                    </div>
                    <div className="col-md-3">
                        {
                            tipo === 'Cliente' ?
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.clientes}
                                    placeholder="SELECCIONA EL CLIENTE"
                                    name="cliente"
                                    value={form.cliente}
                                    onChange={this.updateCliente}
                                    iconclass={"far fa-user"}
                                    messageinc="Incorrecto. Selecciona el cliente"
                                />
                                :
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.proveedores}
                                    placeholder="SELECCIONA EL PROVEEDOR"
                                    name="proveedor"
                                    value={form.proveedor}
                                    onChange={this.updateProveedor}
                                    iconclass={"far fa-user"}
                                    messageinc="Incorrecto. Selecciona el proveedor"
                                />
                        }
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="SELECCIONA LA EMPRESA"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la empresa"
                        />
                    </div>
                    <div className="col-md-3">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            thousandseparator={true}
                            prefix={'$'}
                            name="monto"
                            value={form.monto}
                            onChange={onChange}
                            placeholder="MONTO CON IVA"
                            iconclass={"fas fa-money-bill-wave-alt"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.tiposContratos}
                            placeholder="SELECCIONA EL TIPO DE CONTRATO"
                            name="tipoContrato"
                            value={form.tipoContrato}
                            onChange={this.updateTipoContrato}
                            iconclass={"fas fa-pen-fancy"}
                            messageinc="Incorrecto. Selecciona el tipo de contrato"
                        />
                    </div>
                    <div className="col-md-9">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="1"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            onChange={onChange}
                            value={form.descripcion}
                            messageinc="Incorrecto. Ingresa la descripción."
                            customclass="px-2"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-4"></div>
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    <div className="col text-center">
                        <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                    {
                        title === 'Editar contrato de Cliente' || title === 'Editar contrato de Proveedor'
                            ? ''
                            :
                            <div className="col text-center">
                                <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                <ItemSlider
                                    items={form.adjuntos.adjunto.files}
                                    item='adjunto'
                                    handleChange={handleChange}
                                    multiple={true}
                                />
                            </div>
                    }
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-contrato')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default ContratoForm