import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup, FileInput } from '../../form-components'

class RendimientoForm extends Component{

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'unidad'}})
    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'proveedor'}})
    }

    render(){
        const { title, options, form, onChange, clearFiles, onChangeAdjunto, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                
                <div className="row mx-0">
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Materiales" value = { form.materiales } name = "materiales" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.unidades} placeholder = "Selecciona la unidad" 
                            name = "unidad" value = { form.unidad } onChange = { this.updateUnidades }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Costo" value = { form.costo } name = "costo" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Rendimiento" value = { form.rendimiento } name = "rendimiento" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.proveedores} placeholder = "Selecciona el proveedor" 
                            name = "proveedor" value = { form.proveedor } onChange = { this.updateProveedor }/>
                    </div>
                    <div className = "col-md-6 px-2 ">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = 'Adjunto'
                            value = { form['adjunto']['value'] }
                            name = { 'adjunto' } id = { 'adjunto' }
                            accept = "image/*, application/pdf" 
                            files = { form['adjunto']['files'] }
                            deleteAdjunto = { clearFiles } />
                    </div>
                    <div className = " col-md-12 px-2">
                        <Input as = "textarea" placeholder = "Descripción" rows = "3" value = { form.descripcion }
                            name = "descripcion" onChange = { onChange } />
                    </div>

                    
                </div>

                <div className="d-flex justify-materialescontent-center my-3">
                    <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
                
            </Form>
        )
    }
}

export default RendimientoForm