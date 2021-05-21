import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar, InputMoney } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { RFC, EMAIL } from '../../../constants'

export default class FacturaForm extends Component {

    changeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateCliente = value => {
        const { onChange, data } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
        data.clientes.map((cliente) => {
            if (cliente.id.toString() === value)
                onChange({ target: { value: cliente.rfc, name: 'rfc' } })
            return false
        })
    }

    updateMetodoPago = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'metodoPago' } })
    }

    updateFormaPago = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'formaPago' } })
    }

    updateEstatusFactura = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'estatusFactura' } })
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-solicitar-factura"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-solicitar-factura')
                    }
                }
                {...props}>

                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="EMPRESA DE EMISIÓN"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            messageinc="Incorrecto. Selecciona la empresa de emisión"
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.clientes}
                            placeholder="NOMBRE DEL CLIENTE"
                            name="cliente"
                            value={form.cliente}
                            onChange={this.updateCliente}
                            messageinc="Incorrecto. Selecciona el nombre del ciente"
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="RFC DEL CLIENTE"
                            value={form.rfc}
                            name="rfc"
                            onChange={onChange}
                            iconclass={"far fa-file-alt"}
                            patterns={RFC}
                            messageinc="Incorrecto. Ej. ABCD001122ABC"
                            maxLength="13"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="CONCEPTO"
                            value={form.concepto}
                            name="concepto"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el concepto."
                        />
                    </div>
                    <div className="col-md-4">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            thousandseparator={true}
                            placeholder="MONTO CON IVA"
                            value={form.total}
                            name="total"
                            onChange={onChange}
                            iconclass={" fas fa-money-check-alt"}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.formasPago}
                            placeholder="FORMA DE PAGO"
                            name="formaPago"
                            value={form.formaPago}
                            onChange={this.updateFormaPago}
                            messageinc="Incorrecto. Selecciona la forma de pago"
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Input
                            formeditado={formeditado}
                            requirevalidation={1}
                            placeholder="CORREO ELECTRÓNICO"
                            value={form.email}
                            name="email"
                            onChange={onChange}
                            iconclass={"far fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                        />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.metodosPago}
                            placeholder="MÉTODO DE PAGO"
                            name="metodoPago"
                            value={form.metodoPago}
                            onChange={this.updateMetodoPago}
                            messageinc="Incorrecto. Selecciona el método de pago"
                        />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.estatusFacturas}
                            placeholder="ESTATUS"
                            name="estatusFactura"
                            value={form.estatusFactura}
                            onChange={this.updateEstatusFactura}
                            messageinc="Incorrecto. Selecciona el estatus"
                        />
                    </div>
                    <div className="col-md-3">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.changeDate}
                            name="fecha"
                            value={form.fecha}
                            placeholder="FECHA DE EMISIÓN"
                        />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon=''
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-solicitar-factura')
                                    }
                                }
                                className="btn btn-primary mr-2" text='ENVIAR' />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}