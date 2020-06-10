import React, { Component } from 'react'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form } from 'react-bootstrap'

class ComprasForm extends Component {

    /* Código Omar
     updateCliente = value => {
     const { onChange, setOptions } = this.props
     onChange({ target: { value: value.value, name: 'cliente' } })
     onChange({ target: { value: '', name: 'proyecto' } })
     setOptions('proyectos', value.proyectos)
 }

 updateProyecto = value => {
     const { onChange } = this.props
     onChange({ target: { value: value.value, name: 'proyecto' } })
 }

 updateEmpresa = value => {
     const { onChange, setOptions } = this.props
     onChange({ target: { value: value.value, name: 'empresa' } })
     onChange({ target: { value: '', name: 'cuenta' } })
     setOptions('cuentas', value.cuentas)
 }

 updateCuenta = value => {
     const { onChange } = this.props
     onChange({ target: { value: value.value, name: 'cuenta' } })
 }

 
 updateArea = value => {
     const { onChange, setOptions } = this.props
     onChange({target:{value: value.value, name:'area'}})
     onChange({target:{value: '', name:'subarea'}})
     setOptions('subareas',value.subareas)
 }*/

    updateCliente = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'cliente' } })
        onChange({ target: { value: '', name: 'proyecto' } })
        const { options: { proyectos: proyectos } } = this.props

        const aux = proyectos.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('proyectos', element.proyectos)
            }
        })
    }
    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
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

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }
    /*Código Omar
    updateSubarea = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'subarea'}})
    }*/

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
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

    updateTipoPago = e => {
        const { options, form, onChange } = this.props
        const { value } = e.target
        if (form.facturaObject) {
            options.tiposPagos.map((option) => {
                if (option.value.toString() === value.toString() && option.text.toString() === 'TOTAL')
                    onChange({ target: { value: form.facturaObject.subtotal, name: 'total' } })
            })
        }
        onChange(e)
    }

    render() {
        const { title, options, form, onChange, setOptions, onChangeAdjunto, clearFiles, ...props } = this.props
        return (
            <Form {...props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0">
                    <div className="col-md-6 px-2">
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
                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                            <div className="col-md-6 px-2">
                                <FileInput
                                    onChangeAdjunto={onChangeAdjunto}
                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                    value={form['adjuntos']['factura']['value']}
                                    name={'factura'} id={'factura'}
                                    accept="text/xml, application/pdf"
                                    files={form['adjuntos']['factura']['files']}
                                    deleteAdjunto={clearFiles} multiple />
                            </div>
                            : ''
                    }

                    {
                        form.factura === 'Con factura' && title !== 'Editar compra' ?
                            <div className="col-md-6 px-2">
                                <Input placeholder="RFC" name="rfc" value={form.rfc} onChange={onChange} />
                            </div>
                            : ''
                    }

                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proveedores} placeholder="Selecciona el proveedor"
                            name="proveedores" value={form.proveedor} onChange={this.updateProveedor} />
                    </div>

                    {/* <div className="col-md-6 px-2">
                        <SelectSearch options={options.clientes} placeholder = "Selecciona el cliente" 
                            name = "cliente" value = { form.cliente } onChange = { this.updateCliente }/>    
                    </div>
                    {
                        form.cliente ? 
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.proyectos} placeholder = "Selecciona el proyecto" 
                                    name = "proyecto" value = { form.proyecto } onChange = { this.updateProyecto }/>
                            </div>
                        : ''
                    } */}
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proyectos} placeholder="Selecciona el proyecto"
                            name="proyecto" value={form.proyecto} onChange={this.updateProyecto} />
                    </div>
                    <div className="col-md-6 px-2">
                        {
                            form.facturaObject ?
                                <Input placeholder="Empresa" name="empresa" readOnly value={form.empresa} onChange={onChange} />
                                :
                                <SelectSearch options={options.empresas} placeholder="Selecciona la empresa"
                                    name="empresas" value={form.empresa} onChange={this.updateEmpresa} />
                        }
                    </div>
                    {
                        form.empresa ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.cuentas} placeholder="Selecciona la cuenta"
                                    name="cuenta" value={form.cuenta} onChange={this.updateCuenta} />
                            </div>
                            : ''
                    }
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.areas} placeholder="Selecciona el área"
                            name="areas" value={form.area} onChange={this.updateArea} />
                    </div>
                    {
                        form.area ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options={options.subareas} placeholder="Selecciona el subárea"
                                    name="subarea" value={form.subarea} onChange={this.updateSubarea} />
                            </div>
                            : ''
                    }
                    {
                        options.tiposPagos.length > 0 ?
                            <div className="col-md-6 px-2">
                                <Select placeholder="Selecciona el tipo de pago" options={options.tiposPagos}
                                    name="tipoPago" value={form.tipoPago} onChange={this.updateTipoPago} />
                            </div>
                            : ''
                    }
                    <div className="col-md-6 px-2">
                        <Select placeholder="Selecciona el impuesto" options={options.tiposImpuestos}
                            name="tipoImpuesto" value={form.tipoImpuesto} onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Select placeholder="Selecciona el estatus de compra" options={options.estatusCompras}
                            name="estatusCompra" value={form.estatusCompra} onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true} placeholder="Monto" value={form.total} name="total" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true} placeholder="Comisión" value={form.comision} name="comision" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Calendar onChangeCalendar={this.handleChangeDate}
                            placeholder="Fecha" name="fecha" value={form.fecha} />
                    </div>
                    <div className="col-md-6 px-2 ">
                        <FileInput
                            onChangeAdjunto={onChangeAdjunto}
                            placeholder={form['adjuntos']['presupuesto']['placeholder']}
                            value={form['adjuntos']['presupuesto']['value']}
                            name={'presupuesto'} id={'presupuesto'}
                            accept="text/xml, application/pdf"
                            files={form['adjuntos']['presupuesto']['files']}
                            deleteAdjunto={clearFiles} />
                    </div>
                    <div className="col-md-6 px-2 ">
                        <FileInput
                            onChangeAdjunto={onChangeAdjunto}
                            placeholder={form['adjuntos']['pago']['placeholder']}
                            value={form['adjuntos']['pago']['value']}
                            name={'pago'} id={'pago'}
                            accept="text/xml, application/pdf"
                            files={form['adjuntos']['pago']['files']}
                            deleteAdjunto={clearFiles} />
                    </div>
                    <div className=" col-md-12 px-2">
                        <Input as="textarea" placeholder="Descripción" rows="3" value={form.descripcion}
                            name="descripcion" onChange={onChange} />
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