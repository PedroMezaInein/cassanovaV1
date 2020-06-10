import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'

class ConceptoForm extends Component{

    updateCategoria = value => {
        const { onChange, form } = this.props
        if(form.clave === '')
            onChange({target:{value: value+'.', name:'clave'}})
        onChange({target:{value: value, name:'categoria'}})
    }

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({target:{value: value, name:'unidad'}})
    }

    render(){
        const { title, options, form, onChange, ... props } = this.props
        return(
            <Form { ... props}>
                <Subtitle className="text-center" color="gold">
                    {
                        title
                    }
                </Subtitle>
                <div className="">
                    <div className="form-group row form-group-marginless mt-5">

                        <div className="col-md-4">
                            <SelectSearch options={options.categorias} placeholder = "Selecciona la categoría" 
                                name = "categoria" value = { form.categoria } onChange = { this.updateCategoria }/>
                                <span className="form-text text-muted">Por favor, selecciona la categoría</span>
                        </div>

                        <div className="col-md-4">
                            <Input placeholder = "Clave" value = { form.clave } name = "clave" onChange = { onChange } iconclass={"fas fa-key"} spantext={"clave."} />
                        </div>

                        <div className="col-md-4">
                            <Input placeholder = "Mano de obra" value = { form.manoObra } name = "manoObra" onChange = { onChange }  iconclass={"fas fa-tractor"} spantext={"mano de obra."} />
                        </div>

                    </div>
                    <div className="form-group row form-group-marginless">
                        <div className="col-md-4">
                            <Input placeholder = "Herramienta" value = { form.herramienta } name = "herramienta" onChange = { onChange } iconclass={"fas fa-toolbox"} spantext={"herramienta."}/>
                        </div>

                        <div className="col-md-4">
                            <Input placeholder = "Materiales" value = { form.materiales } name = "materiales" onChange = { onChange } iconclass={"fas fa-tools"} spantext={"material."}/>
                        </div>

                        <div className="col-md-4">
                            <InputMoney thousandSeparator={true}  placeholder = "Costo" value = { form.costo } name = "costo" onChange = { onChange } iconclass={"fas fa-dollar-sign"} spantext={"costo."}/>
                        </div>
                    </div>
                    
                    <div className="form-group row form-group-marginless"> 
                        <div className="col-md-4">
                            <SelectSearch options={options.unidades} placeholder = "Selecciona la unidad" 
                                name = "unidad" value = { form.unidad } onChange = { this.updateUnidades }/>
                            <span className="form-text text-muted">Por favor, selecciona la unidad</span>
						</div>
                        
                        <div className = "col-md-8">
                            <Input as = "textarea" placeholder = "Descripción" rows = "1" value = { form.descripcion }
                                name = "descripcion" onChange = { onChange } spantext={"descripción."} iconclass={"far fa-file-alt"}  />
                        </div>
                    </div>
                    </div>
                    <div className="d-flex justify-content-center my-3">
                        <Button  icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                    </div>
                
            </Form>
        )
    }
}

export default ConceptoForm