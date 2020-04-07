import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import {Subtitle} from '../../texts'
import {Input, Select, SelectSearch, Button} from '../../form-components'

class ProveedorForm extends Component{

    updateArea = value => {
        const { onChangeForm, setSubareas } = this.props
        onChangeForm( { target: { name: 'area', value: value.value.toString() } } )
        setSubareas(value.subareas)
    }

    updateSubarea = value => {
        const { onChangeForm } = this.props
        onChangeForm( { target: { name: 'subarea', value: value.value.toString() } } )
    }

    render(){
        const { title, form, onChangeForm, tipos, bancos, areas, subareas, setSubareas, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center">
                    {
                        title
                    }
                </Subtitle>
                <div className="row mx-0 mt-3">
                    <div className="col-md-4 px-2">
                        <Input name="nombre" value={form.nombre} placeholder="Nombre" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input name="razonSocial" value={form.razonSocial} placeholder="Razón Social" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input name="correo" value={form.correo} placeholder="Correo" type="email" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input name="cuenta" value={form.cuenta} placeholder="Cuenta" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Input name="numCuenta" value={form.numCuenta} placeholder="No. de cuenta" onChange={onChangeForm} />
                    </div>
                    <div className="col-md-4 px-2">
                        <Select required name = 'tipo' options = { tipos } placeholder = 'Selecciona el tipo de cuenta' value = { form.tipo }
                            onChange = { onChangeForm } />
                    </div>
                    <div className="col-md-4 px-2">
                        <Select required name = 'banco' options = { bancos } placeholder = 'Selecciona el banco' value = { form.banco }
                            onChange = { onChangeForm } />
                    </div>
                    {
                        form.leadId ? 
                            <Input name="leadId" value={form.leadIn} readOnly hidden />
                        : ''
                    }
                    <div className="col-md-4 px-2">
                        <SelectSearch options = { areas } placeholder = "Selecciona el área"
                            name="area" value={form.area} onChange={this.updateArea}/> 
                    </div>
                    {
                        form.area ?
                            <div className="col-md-4 px-2">
                                <SelectSearch options = { subareas } placeholder = "Selecciona el subárea"
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