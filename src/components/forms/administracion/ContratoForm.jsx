import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { SelectSearch, Button, Input, Calendar, InputMoney, FileInput } from '../../form-components'
import { DATE } from '../../../constants'
import { validateAlert } from '../../../functions/alert'

class ContratoForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateCliente = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
    }

    updateTipoContrato = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'tipoContrato' } })
    }

    updateProveedor = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    render() {
        const { title, options, form, onChange, tipo, onSubmit, formeditado, clearFiles, onChangeAdjunto, ...props } = this.props
        return (
            <Form id="form-contrato"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-contrato')
                    }
                }
                {...props}>
                <div className="form-group row form-group-marginless pt-4">

                    <div className="col-md-4">
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

                    <div className="col-md-4">
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
                                />
                        }
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="SELECCIONA LA EMPRESA"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                        />
                    </div>

                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            thousandSeparator={true}
                            prefix={'$'}
                            name="monto"
                            value={form.monto}
                            onChange={onChange}
                            placeholder="MONTO CON IVA"
                            iconclass={"fas fa-money-bill-wave-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="FECHA DE INICIO"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="FECHA FINAL"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>

                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.tiposContratos}
                            placeholder="SELECCIONA EL TIPO DE CONTRATO"
                            name="tipoContrato"
                            value={form.tipoContrato}
                            onChange={this.updateTipoContrato}
                            iconclass={"fas fa-pen-fancy"}
                        />
                    </div>
                    {
                        title === 'Editar contrato de cliente' || title === 'Editar contrato de proveedor'
                            ? ''
                            :
                            <div className="col-md-8">
                                <FileInput
                                    requirevalidation={0}
                                    formeditado={formeditado}
                                    onChangeAdjunto={onChangeAdjunto}
                                    placeholder={form.adjuntos.adjunto.placeholder}
                                    value={form.adjuntos.adjunto.value}
                                    name='adjunto'
                                    id='adjunto'
                                    accept="image/*, application/pdf"
                                    files={form.adjuntos.adjunto.files}
                                    deleteAdjunto={clearFiles}
                                    multiple
                                />
                            </div>
                    }

                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={formeditado}
                            rows="3"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            onChange={onChange}
                            value={form.descripcion}
                            messageinc="Incorrecto. Ingresa la descripción."
                            style={{ paddingLeft: "10px" }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" 
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-contrato')
                            }
                        }
                        text="ENVIAR" />
                </div>
            </Form>
        )
    }
}

export default ContratoForm