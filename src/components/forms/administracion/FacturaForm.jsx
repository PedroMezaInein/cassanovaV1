import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'

export default class FacturaForm extends Component{

    changeDate = date => {
        const { onChange } = this.props
        onChange( { target: { value: date, name:'fecha' } } )
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange( { target: { value: value.value, name:'empresa' } } )
    }

    updateCliente = value => {
        const { onChange } = this.props
        onChange( { target: { value: value.value, name:'cliente' } } )
    }

    updateMetodoPago = value => {
        const { onChange } = this.props
        onChange( { target: { value: value.value, name:'metodoPago' } } )
    }

    updateFormaPago = value => {
        const { onChange } = this.props
        onChange( { target: { value: value.value, name:'formaPago' } } )
    }

    updateEstatusFactura = value => {
        const { onChange } = this.props
        onChange( { target: { value: value.value, name:'estatusFactura' } } )
    }

    render(){
        const { options, form, onChange, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    Solicitar factura
                </Subtitle>
                <div className="row mx-0 my-3">
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.empresas} placeholder = "Empresa de emisión" 
                            name = "empresa" value = { form.empresa } onChange = { this.updateEmpresa }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Calendar onChangeCalendar = { this.changeDate } name = "fecha" 
                            value = { form.fecha } placeholder="Fecha de emisión"/>
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.clientes} placeholder = "Nombre del cliente" 
                            name = "cliente" value = { form.cliente } onChange = { this.updateCliente }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "RFC del cliente" value = { form.rfc } name = "rfc" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Concepto" value = { form.concepto } name = "concepto" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Monto con IVA" value = { form.total } name = "total" onChange = { onChange }/>
                    </div>

                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.formasPago} placeholder = "Forma de pago" 
                            name = "formaPago" value = { form.formaPago } onChange = { this.updateFormaPago }/>
                    </div>

                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.metodosPago} placeholder = "Método de pago" 
                            name = "metodoPago" value = { form.metodoPago } onChange = { this.updateMetodoPago }/>
                    </div>

                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.estatusFacturas} placeholder = "Estatus" 
                            name = "estatusFactura" value = { form.estatusFactura } onChange = { this.updateEstatusFactura }/>
                    </div>

                    <div className="col-md-6 px-2">
                        <Input placeholder = "Correo" value = { form.email } name = "email" onChange = { onChange } />
                    </div>

                </div>
                
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}