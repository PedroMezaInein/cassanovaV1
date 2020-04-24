import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Button, RadioGroup, Input, Calendar, InputMoney, FileInput } from '../../form-components'

class EgresosForm extends Component{

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({target:{value: date, name:'fecha'}})
    }

    updateEmpresa = value => {
        const { onChange, setCuentas } = this.props
        onChange({target:{value: value.value, name:'empresa'}})
        setCuentas(value.cuentas)
    }

    updateCuenta = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'cuenta'}})
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'proveedor'}})
    }

    updateArea = value => {
        const { onChange, setSubareas } = this.props
        onChange({target:{value: value.value, name:'area'}})
        setSubareas(value.subareas)
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'subarea'}})
    }

    render(){
        const { onChange, onChangeFile, onChangeAdjunto, sendFactura, clearAdjunto, clearFile, form, title, options, setSubareas, setCuentas, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    { title }
                </Subtitle>
                
                <div className="row mx-0">
                    <div className="col-md-6 px-2">
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
                        form.factura === 'Con factura' ?        
                            <div className="col-md-6 px-2">
                                <FileInput 
                                    onChangeAdjunto = { onChangeFile } 
                                    placeholder = "Factura"
                                    value = {form.fileFactura.value}
                                    name = "fileFactura"
                                    id = "fileFactura"
                                    accept = "application/pdf, text/xml"
                                    files = { form.fileFactura.adjuntos }
                                    deleteAdjunto = { clearFile }
                                    multiple
                                    />
                            </div>
                        : ''
                    }
                    {
                        form.factura === 'Con factura' && form.fileFactura.value ?
                            <div className="col-md-6 d-flex align-items-center justify-content-md-end justify-content-center">
                                <Button icon='' className="mx-auto" onClick={sendFactura} text="Enviar Factura" />
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        {
                            form.facturaObject ?
                                <Input placeholder="Proveedor" readOnly name="proveedor" value={form.proveedor} onChange={onChange}/>
                            :
                                <SelectSearch options={options.proveedores} placeholder = "Selecciona el proveedor" 
                                    name = "proveedor" value = { form.proveedor } onChange = { this.updateProveedor }/>
                        }
                    </div>
                    {
                        form.factura === 'Con factura' && form.facturaObject ?
                            <div className="col-md-6 px-2">
                                <Input placeholder="RFC" name="rfc" value={form.rfc} onChange={onChange}/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        {
                            form.facturaObject ?
                                <Input placeholder="Empresa" name="empresa" readOnly value={form.empresa} onChange={onChange}/>
                            :
                                <SelectSearch options={options.empresas} placeholder = "Selecciona la empresa" 
                                    name = "empresa" value = { form.empresa } onChange = { this.updateEmpresa }/>
                        }
                    </div>
                    {
                        options.cuentas.length > 0 ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.cuentas} placeholder = "Selecciona la cuenta" 
                                    name = "cuenta" value = { form.cuenta } onChange = { this.updateCuenta }/>
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
                        <SelectSearch options={options.areas} placeholder = "Selecciona el área" 
                            name = "area" value = { form.area } onChange = { this.updateArea }/>
                    </div>
                    {
                        options.subareas.length > 0 ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.subareas} placeholder = "Selecciona el subárea" 
                                    name = "subarea" value = { form.subarea } onChange = { this.updateSubarea }/>
                            </div>
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Monto" value = { form.total } name = "total" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Comisión" value = { form.comision } name = "comision" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDate } placeholder = "Fecha"
                            name = "fecha" value = { form.fecha }/>
                    </div>
                    <div className = "col-md-6 px-2 ">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = "Presupuesto"
                            value = {form.presupuesto.value}
                            name = "presupuesto"
                            id = "presupuesto"
                            accept = "application/pdf, image/*" 
                            files = { form.presupuesto.name === '' ? [] : [ {name: form.presupuesto.name, key: 1}] }
                            deleteAdjunto = { (e) => { clearAdjunto('presupuesto') }}
                            />
                    </div>
                    <div className = "col-md-6 px-2 ">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = "Pago"
                            value = {form.pago.value}
                            name = "pago"
                            id = "pago"
                            accept = "application/pdf, image/*" 
                            files = { form.pago.name === '' ? [] : [ {name: form.pago.name, key: 1}] }
                            deleteAdjunto = { (e) => { clearAdjunto('pago') }}
                            />
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

export default EgresosForm