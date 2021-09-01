import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../../functions/alert'
import { Input, Button, SelectSearchTrue } from '../../form-components'

class ServicioForm extends Component{

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    
    render(){
        const { form, title, options, onChange, onSubmit, formeditado, ...props } = this.props
        return(
            <Form id = 'form-servicio' onSubmit = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-servicio') } } { ...props}>
                <div className = 'form-group row form-group-marginless pt-4 justify-content-around'>
                    <div className = 'col-md-5'>
                        <Input requirevalidation = { 1 } formeditado = { formeditado } name = 'servicio' value = { form.servicio }
                            placeholder = 'SERVICIO DE INTERÉS' onChange = { onChange } iconclass = 'fab fa-wordpress-simple'
                            messageinc = 'Incorrecto. Ingresa el servicio de interés' />
                    </div>
                    <div className = 'col-md-5'>
                        <SelectSearchTrue formeditado = { formeditado } options = { options.empresas } placeholder = 'Selecciona la empresa'
                            name = 'empresa' value = { form.empresa } onChange = { this.updateEmpresa } iconclass = 'flaticon2-search-1 '
                            messageinc = "Incorrecto. Selecciona la empresa." />
                    </div>
                </div>
                {
                    form.servicio !== '' && 
                        <div className = 'mt-3 text-center'>
                            <Button icon = '' className = 'mx-auto' onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-servicio') } } text = 'Enviar' />
                        </div>
                }
            </Form>
        )
    }
}

export default ServicioForm