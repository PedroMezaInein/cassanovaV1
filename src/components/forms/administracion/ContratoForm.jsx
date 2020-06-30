import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Button, RadioGroup, Input, Calendar, InputMoney, FileInput } from '../../form-components'
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
        const { title, options, form, onChange, tipo, onSubmit, formeditado, ...props } = this.props
        return (
            <Form id="form-contrato"
                onSubmit = { 
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
                            placeholder="Nombre" 
                            name="nombre" 
                            onChange={onChange} 
                            value={form.nombre} 
                            iconclass={"far fa-user"}
                            messageinc="Incorrecto. Ingresa el nombre."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese un nombre. </span>*/}
                    </div>

                    <div className="col-md-4">
                        {
                            tipo === 'Cliente' ?
                                <SelectSearch 
                                    formeditado={formeditado}
                                    options={options.clientes} 
                                    placeholder = "Selecciona la el cliente" 
                                    name = "cliente" 
                                    value = { form.cliente } 
                                    onChange = { this.updateCliente }
                                    iconclass={"far fa-user"}
                                    />
                            : 
                                <SelectSearch 
                                    formeditado={formeditado}
                                    options={options.proveedores} 
                                    placeholder = "Selecciona el proveedor" 
                                    name = "proveedor" 
                                    value = { form.proveedor } 
                                    onChange = { this.updateProveedor }
                                    iconclass={"far fa-user"}
                                    />
                        }
                        {/*<span className="form-text text-muted">Por favor, selecciona el 
                            {
                                tipo === 'Cliente'?
                                    'cliente'
                                :
                                    'proveedor'
                            }
                        </span>*/}
                    </div>
                    <div className="col-md-4">
                        <SelectSearch 
                            formeditado={formeditado}
                            options={options.empresas} 
                            placeholder = "Selecciona la empresa" 
                            name = "empresa" 
                            value = { form.empresa } 
                            onChange = { this.updateEmpresa }
                            iconclass={"far fa-building"}
                            />
                        {/*<span className="form-text text-muted">Por favor, selecciona la empresa.</span>*/}
                    </div>
                    
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <InputMoney 
                                requirevalidation={1}
                                formeditado={formeditado}
                                thousandSeparator={true}  
                                prefix = { '$' } 
                                name = "monto" 
                                value = { form.monto } 
                                onChange = { onChange } 
                                placeholder="Monto con IVA" 
                                iconclass={"fas fa-money-bill-wave-alt"}
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese el monto con IVA. </span>*/}
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            formeditado={formeditado}
                            onChangeCalendar = { this.handleChangeDateInicio }
                            placeholder = "Fecha de inicio"
                            name = "fechaInicio"
                            value = { form.fechaInicio }
                            selectsStart
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            iconclass={"far fa-calendar-alt"}      
                            patterns={DATE}                      
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span>*/}
                    </div>
                    <div className="col-md-4">
                        <Calendar 
                            formeditado={formeditado}
                            onChangeCalendar = { this.handleChangeDateFin }
                            placeholder = "Fecha final"
                            name = "fechaFin"
                            value = { form.fechaFin }
                            selectsEnd
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            minDate={ form.fechaInicio }
                            iconclass={"far fa-calendar-alt"} 
                            patterns={DATE}                        
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su fecha de fin. </span>*/}
                    </div>
                    
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch 
                            formeditado={formeditado}
                            options={options.tiposContratos} 
                            placeholder = "Selecciona el tipo de contrato" 
                            name = "tipoContrato" 
                            value = { form.tipoContrato } 
                            onChange = { this.updateTipoContrato }
                            iconclass={"fas fa-pen-fancy"}
                            />
                        {/*<span className="form-text text-muted">Por favor, seleccione el tipo de contrato. </span>*/}
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            requirevalidation={1}
                            formeditado={formeditado}
                            rows="3" 
                            as="textarea" 
                            placeholder="Descripción" 
                            name="descripcion" 
                            onChange={onChange} 
                            value={form.descripcion} 
                            messageinc="Incorrecto. Ingresa la descripción."
                            style={{paddingLeft: "10px"}}   
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su descripción. </span>*/}
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default ContratoForm