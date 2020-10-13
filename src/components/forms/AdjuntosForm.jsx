import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, FileInput } from '../form-components'
class AdjuntosForm extends Component{
    
    activateButton = () => {
        const { adjuntos, form } = this.props
        let aux = false
        adjuntos.map( (adjunto) => {
            if(form.adjuntos[adjunto].files.length)
                aux = true
            return aux
        })
        return aux
    }

    render(){

        const { form, onChangeAdjunto, clearFiles, adjuntos, ...props } = this.props
        return(
            <>
                <Form {... props} >
                    <div className="row mx-0">
                        {
                            adjuntos === undefined 
                                ?
                                    <>
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
                                                multiple
                                            />
                                            {/* <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.presupuesto.placeholder}</label>
                                            <ItemSlider
                                                items={form.adjuntos.presupuesto.files}
                                                item='adjunto'
                                                handleChange={handleChange}
                                                multiple={true}
                                            /> */}
                                        </div>
                                        <div className="col-md-12 px-2">
                                            <FileInput 
                                                onChangeAdjunto = { onChangeAdjunto } 
                                                placeholder = { form['adjuntos']['pago']['placeholder'] }
                                                value = { form['adjuntos']['pago']['value'] }
                                                name = { 'pago' } 
                                                id = { 'pago' }
                                                accept = "text/xml, application/pdf, image/*" 
                                                files = { form['adjuntos']['pago']['files'] }
                                                deleteAdjunto = { clearFiles } 
                                                multiple
                                            />
                                            {/* <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.pago.placeholder}</label>
                                            <ItemSlider
                                                items={form.adjuntos.pago.files}
                                                item='adjunto'
                                                handleChange={handleChange}
                                                multiple={true}
                                            /> */}
                                        </div>
                                    </>
                                :
                                    adjuntos.map( (adjunto, key) => {
                                        return(
                                            <div className="col-md-12 px-2" key = { key } >
                                                <FileInput 
                                                    onChangeAdjunto = { onChangeAdjunto } 
                                                    placeholder = { form['adjuntos'][adjunto]['placeholder'] }
                                                    value = { form['adjuntos'][adjunto]['value'] }
                                                    name = { adjunto } 
                                                    id = { adjunto }
                                                    accept = "text/xml, application/pdf, image/*" 
                                                    files = { form['adjuntos'][adjunto]['files'] }
                                                    deleteAdjunto = { clearFiles } 
                                                    multiple
                                                />
                                            </div>
                                        )
                                    })
                        }
                        
                    </div>
                    {
                        adjuntos === undefined
                            ?
                                form.adjuntos.presupuesto.files.length || form.adjuntos.pago.files.length ?
                                    <div className="mt-3 text-center">
                                        <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                    </div>
                                : ''
                            :
                                this.activateButton() ?
                                    <div className="mt-3 text-center">
                                        <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                    </div>
                                : ''
                    }
                    
                </Form>
            </>
        )
    }
}

export default AdjuntosForm