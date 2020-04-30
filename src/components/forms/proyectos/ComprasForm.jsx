import React, { Component } from 'react'
import {Subtitle} from '../../texts'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form } from 'react-bootstrap'

class ComprasForm extends Component{

    updateCliente = value => {
        const { onChange, setOptions } = this.props
        onChange({target:{value: value.value, name:'cliente'}})
        onChange({target:{value: '', name:'proyecto'}})
        setOptions('proyectos',value.proyectos)
    }

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'proyecto'}})
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({target:{value: value.value, name:'empresa'}})
        onChange({target:{value: '', name:'cuenta'}})
        setOptions('cuentas',value.cuentas)
    }

    updateCuenta = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'cuenta'}})
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({target:{value: value.value, name:'area'}})
        onChange({target:{value: '', name:'subarea'}})
        setOptions('subareas',value.subareas)
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'proveedor'}})
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'subarea'}})
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({target:{value: date, name:'fecha'}})
    }

    updateFactura = e => {
        const { value, name } = e.target
        const { onChange, options } = this.props
        onChange({target:{value: value, name: name}})
        let aux = ''
        options.tiposImpuestos.find(function(element, index) {        
            if(element.text === 'IVA')
                aux = element.value
        });
        onChange({target:{value: aux, name: 'tipoImpuesto'}})
    }

    render(){
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, sendFactura, ...props } = this.props
        return(
            <Form { ... props }>
                <Subtitle className="text-center" color = "gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-6 px-2">
                        <RadioGroup
                            name = 'factura'
                            onChange = { this.updateFactura }
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
                        form.factura === 'Con factura' ?        
                            <div className="col-md-6 px-2">
                                <FileInput 
                                    onChangeAdjunto = { onChangeAdjunto } 
                                    placeholder = { form['adjuntos']['factura']['placeholder'] }
                                    value = { form['adjuntos']['factura']['value'] }
                                    name = { 'factura' } id = { 'factura' }
                                    accept = "text/xml, application/pdf" 
                                    files = { form['adjuntos']['factura']['files'] }
                                    deleteAdjunto = { clearFiles } multiple/>
                            </div>
                        : ''
                    }

                    {
                        form.factura === 'Con factura' && form.adjuntos.factura.value ?
                            <div className="col-md-6 d-flex align-items-center justify-content-md-end justify-content-center">
                                <Button icon='' className="mx-auto" onClick={sendFactura} text="Enviar Factura" />
                            </div>
                        : ''
                    }

                    {
                        form.factura === 'Con factura' && form.facturaObject ?
                            <div className="col-md-6 px-2">
                                <Input placeholder="RFC" name="rfc" value={form.rfc} onChange={onChange}/>
                            </div>
                        : ''
                    }

                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proveedores} placeholder = "Selecciona el proveedor" 
                            name = "proveedores" value = { form.proveedor } onChange = { this.updateProveedor }/>    
                        
                    </div>

                    <div className="col-md-6 px-2">
                        {
                            form.facturaObject ? 
                                <Input placeholder="Cliente" readOnly name="cliente" value={form.cliente} onChange={onChange}/>
                            :
                                <SelectSearch options={options.clientes} placeholder = "Selecciona el cliente" 
                                    name = "clientes" value = { form.cliente } onChange = { this.updateCliente }/>    
                        }
                        
                    </div>
                    {
                        form.cliente ? 
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.proyectos} placeholder = "Selecciona el proyecto" 
                                    name = "proyecto" value = { form.proyecto } onChange = { this.updateProyecto }/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        {
                            form.facturaObject ?
                                <Input placeholder="Empresa" name="empresa" readOnly value={form.empresa} onChange={onChange}/>
                            :
                                <SelectSearch options={options.empresas} placeholder = "Selecciona la empresa" 
                                    name = "empresas" value = { form.empresa } onChange = { this.updateEmpresa }/>
                        }
                    </div>
                    {
                        form.empresa ? 
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.cuentas} placeholder = "Selecciona la cuenta" 
                                    name = "cuenta" value = { form.cuenta } onChange = { this.updateCuenta }/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.areas} placeholder = "Selecciona el área" 
                            name = "areas" value = { form.area } onChange = { this.updateArea }/>
                    </div>
                    {
                        form.area ? 
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.subareas} placeholder = "Selecciona el subárea" 
                                    name = "subarea" value = { form.subarea } onChange = { this.updateSubarea }/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        <Select placeholder="Selecciona el tipo de pago" options = { options.tiposPagos } 
                            name="tipoPago" value = { form.tipoPago } onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Select placeholder="Selecciona el impuesto" options = { options.tiposImpuestos } 
                            name="tipoImpuesto" value = { form.tipoImpuesto } onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Select placeholder="Selecciona el estatus de compra" options = { options.estatusCompras } 
                            name="estatusCompra" value = { form.estatusCompra } onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Monto" value = { form.total } name = "total" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Comisión" value = { form.comision } name = "comision" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Calendar onChangeCalendar = { this.handleChangeDate } 
                            placeholder = "Fecha" name = "fecha" value = { form.fecha }/>
                    </div>
                    <div className = "col-md-6 px-2 ">
                        <FileInput
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = { form['adjuntos']['presupuesto']['placeholder'] }
                            value = { form['adjuntos']['presupuesto']['value'] }
                            name = { 'presupuesto' } id = { 'presupuesto' }
                            accept = "text/xml, application/pdf" 
                            files = { form['adjuntos']['presupuesto']['files'] }
                            deleteAdjunto = { clearFiles } />
                    </div>
                    <div className = "col-md-6 px-2 ">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = { form['adjuntos']['pago']['placeholder'] }
                            value = { form['adjuntos']['pago']['value'] }
                            name = { 'pago' } id = { 'pago' }
                            accept = "text/xml, application/pdf" 
                            files = { form['adjuntos']['pago']['files'] }
                            deleteAdjunto = { clearFiles } />
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

export default ComprasForm