import React, { Component } from 'react'
import { RadioGroup, Calendar, SelectSearch, Input } from '../form-components'

class ContactoLeadForm extends Component{

    state = {
        newTipoContacto: false
    }

    updateTipoContacto = value => {
        const { onChangeContacto } = this.props
        onChangeContacto( { target: { name: 'tipoContacto', value: value.value } } )
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
        const { onChangeContacto }  = this.props
        onChangeContacto( { target: { name: 'fechaContacto', value: date } } )
    }

    render(){
        const { tiposContactos, formContacto, onChangeContacto } = this.props
        const { newTipoContacto } = this.state
        return(
            <div className="row mx-0">
                <div className="col-md-6 px-2">
                    
                        <SelectSearch 
                            options={tiposContactos} 
                            placeholder = "Selecciona el medio de contacto" 
                            name = "tipoContacto" 
                            value = { formContacto.tipoContacto } 
                            /* defaultValue = { formContacto.tipoContacto }  */
                            onChange = { this.updateTipoContacto }
                            />
                        
                    
                </div>
                <div className="col-md-6 px-2">
                    <Calendar 
                        onChangeCalendar = { this.handleChangeDate }
                        placeholder = "Fecha de contacto"
                        name = "fechaContacto"
                        value = { formContacto.fechaContacto }
                        />
                </div>
                <div className="col-md-6 px-2">
                    <RadioGroup
                        name = { 'success' }
                        onChange = { onChangeContacto }
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
                        value = { formContacto.success }
                        />
                </div>
                {
                    newTipoContacto &&
                        <div className="col-md-6 px-2">
                            <Input 
                                onChange={ onChangeContacto } 
                                name="newTipoContacto" 
                                type="text" 
                                value={ formContacto.newTipoContacto } 
                                placeholder="Nuevo tipo de contacto"/>
                        </div>
                }
                <div className="col-md-12 px-2">
                    <Input
                        as = 'textarea'
                        name = 'descripcion'
                        placeholder = 'Descripción del contacto'
                        onChange = { onChangeContacto }
                        value = { formContacto.descripcion }
                        rows = '3'
                        />
                </div>
            </div>
        )
    }
}

export default ContactoLeadForm