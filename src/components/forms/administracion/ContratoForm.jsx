import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Button, RadioGroup, Input, Calendar, InputMoney, FileInput } from '../../form-components'

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

    updateProveedor = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    render() {
        const { title, options, form, onChange, tipo, ...props } = this.props
        return (
            <Form {...props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        {
                            tipo === 'Cliente' ?
                                <SelectSearch 
                                    options={options.clientes} 
                                    placeholder = "Selecciona la el cliente" 
                                    name = "cliente" 
                                    value = { form.cliente } 
                                    onChange = { this.updateCliente }
                                    iconclass={"far fa-user"}
                                    />
                            : 
                                <SelectSearch 
                                    options={options.proveedores} 
                                    placeholder = "Selecciona el proveedor" 
                                    name = "proveedor" 
                                    value = { form.proveedor } 
                                    onChange = { this.updateProveedor }
                                    iconclass={"far fa-user"}
                                    />
                        }
                        <span className="form-text text-muted">Por favor, selecciona el 
                            {
                                tipo === 'Cliente'?
                                    'cliente'
                                :
                                    'proveedor'
                            }
                        </span>
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateInicio }
                            placeholder = "Fecha de inicio"
                            name = "fechaInicio"
                            value = { form.fechaInicio }
                            selectsStart
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            iconclass={"far fa-calendar-alt"}                            
                        />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span>
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateFin }
                            placeholder = "Fecha final"
                            name = "fechaFin"
                            value = { form.fechaFin }
                            selectsEnd
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            minDate={ form.fechaInicio }
                            iconclass={"far fa-calendar-alt"}                          
                        />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de fin. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch 
                            options={options.empresas} 
                            placeholder = "Selecciona la empresa" 
                            name = "empresa" 
                            value = { form.empresa } 
                            onChange = { this.updateEmpresa }
                            iconclass={"far fa-building"}
                            />
                        <span className="form-text text-muted">Por favor, selecciona la empresa.</span>
                    </div>
                    <div className="col-md-4">
                        <InputMoney thousandSeparator={true}  prefix = { '$' } name = "monto" value = { form.monto } onChange = { onChange } placeholder="Monto con IVA" iconclass={"fas fa-money-bill-wave-alt"}/>
                        <span className="form-text text-muted">Por favor, ingrese el monto con IVA. </span>
                    </div>
                    <div className="col-md-4">
                        <RadioGroup
                            name = 'tipoContrato'
                            onChange = { onChange }
                            options={
                                [
                                    {
                                        label: 'Obra',
                                        value: 'Obra'
                                    },
                                    {
                                        label: 'Diseño',
                                        value: 'Diseño'
                                    }
                                ]
                            }
                            placeholder={' Tipo de contrato '}
                            value={form.tipoContrato}
                        />
                        <span className="form-text text-muted">Por favor, seleccione el tipo de contrato. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input rows="3" as="textarea" placeholder="Descripción" name="descripcion" onChange={onChange} value={form.descripcion} iconclass={"fas fa-terminal"}/>
                        <span className="form-text text-muted">Por favor, ingrese su descripción. </span>
                    </div>
                </div>
                <div class="separator separator-dashed mt-1 mb-2"></div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default ContratoForm