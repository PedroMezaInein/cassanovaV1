import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle, Small} from '../../texts'
import {Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'


class SolicitudCompraForm extends Component{

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

    render(){
        const { title, options, form, onChange, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>

                <div className="row mx-0 my-3">
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proyectos} placeholder = "Selecciona el proyecto" 
                            name = "proyecto" value = { form.proyecto } onChange = { this.updateProyecto }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proveedores} placeholder = "Selecciona el proveedor" 
                            name = "proveedor" value = { form.proveedor } onChange = { this.updateProveedor }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.empresas} placeholder = "Selecciona la empresa" 
                            name = "empresa" value = { form.empresa } onChange = { this.updateEmpresa }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Monto" value = { form.total } name = "total" onChange = { onChange }/>
                    </div>
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
                        <Calendar onChangeCalendar = { this.handleChangeDate } 
                            placeholder = "Fecha" name = "fecha" value = { form.fecha }/>
                    </div>
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
                    <div className = " col-md-12 px-2">
                        <Input as = "textarea" placeholder = "Descripción" rows = "3" value = { form.descripcion }
                            name = "descripcion" onChange = { onChange } />
                    </div>
                </div>
                
                <div className="d-flex justify-content-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}

export default SolicitudCompraForm