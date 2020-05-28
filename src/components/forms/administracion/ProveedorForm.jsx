import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'

class ProveedorForm extends Component{

    updateArea = value => {
        const { onChange, setOptions } = this.props
        onChange({target:{value: value.value, name:'area'}})
        onChange({target:{value: '', name:'subarea'}})
        setOptions('subareas',value.subareas)
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange( { target: { name: 'subarea', value: value.value.toString() } } )
    }

    render(){
        const { title, options, form, onChange, setOptions, ...props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0 mt-3">
                    <div className="col-md-6 px-2">
                        <Input name="nombre" value={form.nombre} placeholder="Nombre" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="razonSocial" value={form.razonSocial} placeholder="Razón Social" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="rfc" value={form.rfc} placeholder="RFC" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="correo" value={form.correo} placeholder="Correo" type="email" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input name="numCuenta" value={form.numCuenta} placeholder="No. de cuenta" onChange={onChange} />
                    </div>
                    <div className="col-md-6 px-2">
                        <Select required name = 'tipo' options = { options.tipos } placeholder = 'Selecciona el tipo de cuenta' value = { form.tipo }
                            onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Select required name = 'banco' options = { options.bancos } placeholder = 'Selecciona el banco' value = { form.banco }
                            onChange = { onChange } />
                    </div>
                    {
                        form.leadId ? 
                            <Input name="leadId" value={form.leadIn} readOnly hidden />
                        : ''
                    }
                    <div className="col-md-6 px-2">
                        <SelectSearch options = { options.areas } placeholder = "Selecciona el área"
                            name="area" value={form.area} onChange={this.updateArea}/> 
                    </div>
                    {
                        form.area ?
                            <div className="col-md-6 px-2">
                                <SelectSearch options = { options.subareas } placeholder = "Selecciona el subárea"
                                    name="subarea" value={form.subarea} onChange={this.updateSubarea}/> 
                            </div>
                        : ''
                    }
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                </div>
            </Form>
        )
    }
}

export default ProveedorForm