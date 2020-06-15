import React, { Component } from 'react'
import { Subtitle } from '../../texts'
import { SelectSearch, Select, Calendar, RadioGroup, FileInput, Button, Input, InputMoney } from '../../form-components'
import { Form } from 'react-bootstrap'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class AvanceForm extends Component {

    render(){
        const { form, onChangeAdjuntoAvance, onChangeAvance, clearFilesAvances, addRowAvance, ... props } = this.props    
        return(
            <Form {...props}>
                {
                    form.avances.map( ( avance, key ) => {
                        return(
                            <>
                                <div className="row mx-0" key = { key }>
                                    <div className = "col-md-6 px-2">
                                        <FileInput
                                            onChangeAdjunto={ e => onChangeAdjuntoAvance(e, key, 'adjuntos') }
                                            placeholder={form['avances'][key]['adjuntos']['placeholder']}
                                            value={form['avances'][key]['adjuntos']['value']}
                                            name={`${key}-avance`} id={`${key}-avance`}
                                            accept="image/*"
                                            files={form['avances'][key]['adjuntos']['files']}
                                            _key = { key }
                                            deleteAdjuntoAvance = { clearFilesAvances } 
                                            multiple />
                                    </div>
                                    <div className = "col-md-6 px-2">
                                        <Input
                                            as = "textarea"
                                            rows = "3"
                                            placeholder = "Descripción" 
                                            name = "descripcion" 
                                            value = {form['avances'][key]['descripcion']} 
                                            onChange = { e => onChangeAvance(key, e, 'descripcion')} />
                                    </div>
                                </div>
                                <hr />
                            </>
                        )
                    })
                }
                {
                    form.avances[form.avances.length - 1].descripcion && form.avances[form.avances.length - 1].adjuntos.files.length > 1 ?
                        <div className="d-flex justify-content-end my-2">
                            <Button icon = { faPlus }  tooltip = {{ id: 'add-avance', text: 'Nuevo' }} onClick = { addRowAvance } color = 'transparent' />
                        </div>
                    : ''
                }
                
                <div className="d-flex justify-content-end my-2">
                    <Button text = 'Enviar' type = 'submit' />
                </div>
            </Form>
        )
    }
}

export default AvanceForm