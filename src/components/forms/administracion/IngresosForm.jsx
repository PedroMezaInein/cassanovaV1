import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Button, RadioGroup, Input, Calendar, InputMoney } from '../../form-components'

class IngresosForm extends Component{

    updateEmpresa = value => {
        const { onChange, setCuentas } = this.props
        onChange( { target: { name: 'empresa', value: value.value } } )
        setCuentas( value.cuentas )
    }

    updateCuenta = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'cuenta', value: value.value } } )
    }

    updateAreas = value => {
        const { onChange, setSubareas } = this.props
        onChange( { target: { name: 'area', value: value.value } } )
        setSubareas(value.subareas)
    }

    updateSubareas = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'subarea', value: value.value } } )
    }

    updateClientes = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'cliente', value: value.value } } )
    }
    
    updateCalendar = date => {
        const { onChange } = this.props
        onChange( { target: { name: 'fecha', value:  date } } )
    }

    render(){
        const { title, empresas, cuentas, areas, subareas, clientes, tiposImpuestos, tiposPagos, estatusCompras, form, onChange, ... props} = this.props
        console.log(empresas, 'empresas')
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    { title }
                </Subtitle>
                <div className = "row mx-0">
                    <div className = "col-md-6 col-lg-4 px-2">
                        <SelectSearch options = { empresas } value = { form.empresa } 
                            onChange = { this.updateEmpresa } placeholder="Selecciona la empresa"/>
                    </div>
                    {
                        form.empresa && 
                            <div className = 'col-md-6 col-lg-4 px-2'>
                                <SelectSearch options = { cuentas } value = { form.cuenta }
                                    onChange = { this.updateCuenta } placeholder = "Selecciona la cuenta" />
                            </div>
                    }
                    <div className = "col-md-6 col-lg-4 px-2">
                        <SelectSearch options = { clientes } value = { form.cliente } 
                            onChange = { this.updateClientes } placeholder="Selecciona el cliente"/>
                    </div>
                    <div className = "col-md-6 col-lg-4 px-2">
                        <RadioGroup
                            name = 'factura'
                            onChange = { onChange }
                            options = {
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
                            placeholder = { ' Lleva factura ' }
                            value = { form.factura }
                            />
                    </div>
                    {
                        form.factura === 'Con factura' &&
                            <>
                                {/* <div className = "col-md-6 col-lg-4 px-2">
                                    <Input value = { form.rfc } name = "rfc" placeholder = "RFC" onChange = { onChange } />
                                </div>
                                <div className = "col-md-6 col-lg-4 px-2">
                                    <Input value = { form.numeroFactura } name = "numeroFactura" placeholder = "Número de factura" onChange = { onChange } />
                                </div> */}
                                <div className = "col-md-6 col-lg-4 px-2">
                                    <Select required name = 'tipoImpuesto' options = { tiposImpuestos } 
                                        placeholder = 'Selecciona la tasa de impuestos' value = { form.tipoImpuesto }
                                        onChange = { onChange } />
                                </div>
                            </>
                    }
                    
                    <div className = "col-md-6 col-lg-4 px-2">
                        <Select required name = 'tipoPago' options = { tiposPagos } 
                            placeholder = 'Selecciona el tipo de pago' value = { form.tipoPago }
                            onChange = { onChange } />
                    </div>
                    <div className = "col-md-6 col-lg-4 px-2">
                        <SelectSearch options = { areas } value = { form.area } 
                            onChange = { this.updateAreas } placeholder="Selecciona el area"/>
                    </div>
                    {
                        form.area && 
                            <div className = 'col-md-6 col-lg-4 px-2'>
                                <SelectSearch options = { subareas } value = { form.subarea }
                                    onChange = { this.updateSubareas } placeholder = "Selecciona el sub-área" />
                            </div>
                    }
                    <div className = "col-md-6 col-lg-4 px-2">
                        <Calendar name = "fecha" placeholder = "Fecha" value = { form.fecha }
                            onChangeCalendar = { this.updateCalendar } />
                    </div>
                    <div className = "col-md-6 col-lg-4 px-2">
                        <InputMoney prefix = { '$' } name = "monto" value = { form.monto } onChange = { onChange } placeholder="Ingrese el monto" />
                    </div>
                    {/* <div className = "col-md-6 col-lg-4 px-2">
                        <InputMoney prefix = { '%' } name = "comision" value = { form.comision } onChange = { onChange } placeholder="Ingrese el porcentaje de comisión" />
                    </div> */}
                    <div className = "col-md-6 col-lg-4 px-2">
                        <Select required name = 'estatusCompra' options = { estatusCompras } 
                            placeholder = 'Selecciona el estatus de la compra' value = { form.estatusCompra }
                            onChange = { onChange } />
                    </div>
                    <div className = " col-md-12 px-2">
                        <Input as = "textarea" placeholder = "Descripción" rows = "3" value = { form.descripcion }
                            name = "descripcion" onChange = { onChange } />
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default IngresosForm