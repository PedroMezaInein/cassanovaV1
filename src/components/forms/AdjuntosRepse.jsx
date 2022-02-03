import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, FileInput } from '../form-components'
import ItemSlider from '../singles/ItemSlider'
class AdjuntosForm extends Component{
    
    activateButton = () => {
        const { adjuntos, form, onSubmit } = this.props
        if(onSubmit === undefined)
            return false
        let aux = false
        adjuntos.map( (adjunto) => {
            if(form.adjuntos[adjunto].files.length)
                aux = true
            return aux
        })
        return aux
    }

    render(){

        const { form, onChangeAdjunto, clearFiles, adjuntos, deleteFile, ...props } = this.props
        const { onSubmit } = this.props
        
        return(
            <>
                <Form {... props} >
                    <div className="row mx-0">
                        {
                            adjuntos === undefined 
                                ?

                                 form.type === 'isn' ?
                                    <>
                                        <div className="col-md-12 px-2 text-center align-self-center">
                                            <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.isn.placeholder}</label>
                                            <ItemSlider items = { form.adjuntos.isn.files } item = 'isn'
                                                handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                        </div>
                                        </>
                                :
                                form.type === 'repse' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.repse.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.repse.files } item = 'repse'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                               :
                                form.type === 'patronal' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.patronal.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.patronal.files } item = 'patronal'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                                :
                                form.type === 'siroc' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.siroc.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.siroc.files } item = 'siroc'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                                :
                                form.type === 'nomina' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.nomina.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.nomina.files } item = 'nomina'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                                :
                                form.type === 'sipare' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.sipare.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.sipare.files } item = 'sipare'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                                :
                                form.type === 'Accesos claves' ?
                                <>
                                    <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.claves.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.claves.files } item = 'claves'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                    </div>
                                    </>
                                :
                                
                                        <div className="col-md-12 px-2 text-center align-self-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.repse.placeholder}</label>
                                        <ItemSlider items = { form.adjuntos.repse.files } item = 'repse'
                                            handleChange = { onChangeAdjunto } multiple = { true } deleteFile = { deleteFile } />
                                        </div>

                                :
                                adjuntos.map( (adjunto, key) => {
                                    return(
                                        <div className="col-md-12 px-2 mt-5 text-center" key = { key } >
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
                                                classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0'
                                                iconclass='flaticon2-clip-symbol text-primary'
                                            />
                                        </div>
                                    )
                                })
                        }
                        
                    </div>
                    {
                        onSubmit === undefined ? ''
                        :
                            adjuntos === undefined
                                ?
                                    form.adjuntos.files.length ?
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