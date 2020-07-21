import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, FileInput } from '../form-components'

class AdjuntosForm extends Component{

    render(){

        const { form, onChangeAdjunto, clearFiles, ...props } = this.props
        return(
            <>
                <Form {... props} >
                    <div className="row mx-0">
                        <div className="col-md-12 px-2">
                            <FileInput 
                                onChangeAdjunto = { onChangeAdjunto } 
                                placeholder = { form['adjuntos']['presupuesto']['placeholder'] }
                                value = { form['adjuntos']['presupuesto']['value'] }
                                name = { 'presupuesto' } 
                                id = { 'presupuesto' }
                                accept = "text/xml, application/pdf, image/*" 
                                files = { form['adjuntos']['presupuesto']['files'] }
                                deleteAdjunto = { clearFiles } 
                                multiple/>
                        </div>
                        <div className="col-md-12 px-2">
                            <FileInput 
                                onChangeAdjunto = { this.onChangeAdjunto } 
                                placeholder = { form['adjuntos']['pago']['placeholder'] }
                                value = { form['adjuntos']['pago']['value'] }
                                name = { 'pago' } 
                                id = { 'pago' }
                                accept = "text/xml, application/pdf, image/*" 
                                files = { form['adjuntos']['pago']['files'] }
                                deleteAdjunto = { this.clearFiles } 
                                multiple/>
                        </div>
                    </div>
                    {
                        form.adjuntos.presupuesto.files.length || form.adjuntos.pago.files.length ?
                            <div className="mt-3 text-center">
                                <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                            </div>
                        : ''
                    }
                </Form>
            </>
        )
    }
}

export default AdjuntosForm