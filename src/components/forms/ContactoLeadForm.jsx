import React, { Component } from 'react'
import { RadioGroup, Calendar, SelectSearch, Input } from '../form-components'

class ContactoLeadForm extends Component{

    state = {
        newTipoContacto: false
    }
    updateTipoContacto = value => {
        const { onChange } = this.props
        onChange({target:{name:'tipoContacto', value: value.value}})
        if( value.value === 'New' ){
            this.setState({
                newTipoContacto: true
            })
        }else{
            this.setState({
                newTipoContacto: false
            })
        }
    }

    handleChangeDate = (date) =>{
        const { onChange }  = this.props
        onChange( { target: { name: 'fechaContacto', value: date } } )
    }

    render(){
        const { tiposContactos, form, onChange } = this.props
        const { newTipoContacto } = this.state
        return(
            <div className="row mx-0">
                <div className="col-md-4 px-2">
                    { tiposContactos && 
                        <SelectSearch options={tiposContactos} 
                            placeholder = "Selecciona el medio de contacto" 
                            name = "tipoContacto" 
                            value = { form.tipoContacto } 
                            onChange = { this.updateTipoContacto }
                            />
                    } 
                </div>
                <div className="col-md-4 px-2">
                    <Calendar 
                        onChangeCalendar = { this.handleChangeDate }
                        placeholder = "Fecha de contacto"
                        name = "fechaContacto"
                        value = { form.fechaContacto }
                        />
                </div>
                <div className="col-md-4 px-2">
                    <RadioGroup
                        name = { 'success' }
                        onChange = { onChange }
                        options = {
                            [
                                {
                                    label: 'Contactado',
                                    value: 'Contactado'
                                },
                                {
                                    label: 'Sin respuesta',
                                    value: 'Sin respuesta'
                                }
                            ]
                        }
                        placeholder = { ' Selecciona el estatus del intento de contacto ' }
                        value = { form.success }
                        />
                </div>
                {
                    newTipoContacto &&
                        <div className="col-md-4 px-2">
                            <Input 
                                onChange={ onChange } 
                                name="newTipoContacto" 
                                type="text" 
                                value={ form.newTipoContacto } 
                                placeholder="Nuevo tipo de contacto"/>
                        </div>
                }
                <div className="col-md-12 px-2">
                    <Input
                        as = 'textarea'
                        name = 'descripcion'
                        placeholder = 'Descripción del contacto'
                        onChange = { onChange }
                        value = { form.descripcion }
                        rows = '3'
                        />
                </div>
            </div>
        )
    }
}

export default ContactoLeadForm