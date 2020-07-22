import React, { Component } from 'react'
import { Form } from 'react-bootstrap' 
import { Input, SelectSearch, Button, Calendar, InputMoney} from '../../form-components'
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
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
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
                            thousandSeparator={true}
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
                        />
                    </div>
                </div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input
                            formeditado={formeditado}
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="CORREO ELECTRÓNICO"
                            value={form.email}
                            name="email"
                            onChange={onChange}
                            iconclass={"far fa-envelope"}
                            messageinc="Incorrecto. Ej. usuario@dominio.com"
                            patterns={EMAIL}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.metodosPago}
                            placeholder="MÉTODO DE PAGO"
                            name="metodoPago"
                            value={form.metodoPago}
                            onChange={this.updateMetodoPago}
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.estatusFacturas}
                            placeholder="ESTATUS"
                            name="estatusFactura"
                            value={form.estatusFactura}
                            onChange={this.updateEstatusFactura}
                        />
                    </div>
                </div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.changeDate}
                            name="fecha"
                            value={form.fecha}
                            placeholder="FECHA DE EMISIÓN"
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>

            </Form>
        )
    }
}