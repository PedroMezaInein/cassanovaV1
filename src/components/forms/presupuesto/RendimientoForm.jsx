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
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-4">
                        <Input 
                            placeholder = "Materiales" 
                            value = { form.materiales }
                            name = "materiales"
                            onChange = { onChange }
                            iconclass={"fas fa-tools"}
                            messageinc="Incorrecto. Ingresa el material."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su material. </span>*/}
                    </div>
                    <div className="col-md-4">
                        <SelectSearch 
                            options={options.unidades}
                            placeholder = "Selecciona la unidad" 
                            name = "unidad"
                            value = { form.unidad }
                            onChange = { this.updateUnidades }
                            iconclass={"fas fa-weight-hanging"}
                        />
                        {/*<span className="form-text text-muted">Por favor, selecciona la unidad</span>*/}                        
                    </div>
                    <div className="col-md-4">
                        <InputMoney 
                            thousandSeparator={true}  
                            placeholder = "Costo"
                            value = { form.costo }
                            name = "costo"
                            onChange = { onChange }
                            iconclass={"fas fa-dollar-sign"}
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su costo. </span>*/}
                    </div>
                </div>
                
                <div className="separator separator-dashed mt-1 mb-2"></div>
                
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Input 
                            placeholder = "Rendimiento"
                            value = { form.rendimiento }
                            name = "rendimiento"
                            onChange = { onChange }
                            iconclass={" fas fa-chart-line "}
                            messageinc="Incorrecto. Ingresa el rendimieno."
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su rendimiento</span>*/}
                    </div>
                    <div className="col-md-4">
                        <SelectSearch 
                            options={options.proveedores}
                            placeholder = "Selecciona el proveedor" 
                            name = "proveedor"
                            value = { form.proveedor }
                            onChange = { this.updateProveedor }
                            iconclass={"far fa-user"}
                        />
                        {/*<span className="form-text text-muted">Por favor, selecciona el proveedor </span>*/}
                    </div>
                    <div className="col-md-4">
                        <FileInput 
                            onChangeAdjunto = { onChangeAdjunto } 
                            placeholder = 'Adjunto'
                            value = { form['adjunto']['value'] }
                            name = { 'adjunto' } id = { 'adjunto' }
                            accept = "image/*, application/pdf" 
                            files = { form['adjunto']['files'] }
                            deleteAdjunto = { clearFiles } />
                        {/*<span className="form-text text-muted">Por favor, adjunte su documento. </span>*/}
                    </div>
                </div>

                <div className="separator separator-dashed mt-1 mb-2"></div>

                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input 
                            as = "textarea"
                            placeholder = "Descripción"
                            rows = "2"
                            value = { form.descripcion }
                            name = "descripcion"
                            onChange = { onChange } 
                            messageinc="Incorrecto. Ingresa una descripción."
                            style={{paddingLeft:"10px"}}
                        />
                        {/*<span className="form-text text-muted">Por favor, ingrese su descripción. </span>*/}
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