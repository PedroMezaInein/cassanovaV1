import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Subtitle, Small } from '../../texts'
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup } from '../../form-components'

class ConceptoForm extends Component{

    updateCategoria = value => {
        const { onChange, form } = this.props
        if(form.clave === '')
            onChange({target:{value: value.value+'.', name:'clave'}})
        onChange({target:{value: value.value, name:'categoria'}})
    }

    updateUnidades = value => {
        const { onChange } = this.props
        onChange({target:{value: value.value, name:'unidad'}})
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
                <div className="row mx-0 my-3">
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.categorias} placeholder = "Selecciona la categoría" 
                            name = "categoria" value = { form.categoria } onChange = { this.updateCategoria }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Clave" value = { form.clave } name = "clave" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Mano de obra" value = { form.manoObra } name = "manoObra" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Herramienta" value = { form.herramienta } name = "herramienta" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <Input placeholder = "Materiales" value = { form.materiales } name = "materiales" onChange = { onChange } />
                    </div>
                    <div className="col-md-6 px-2">
                        <InputMoney thousandSeparator={true}  placeholder = "Costo" value = { form.costo } name = "costo" onChange = { onChange }/>
                    </div>
                    <div className="col-md-6 px-2">
                        <SelectSearch options={options.unidades} placeholder = "Selecciona la unidad" 
                            name = "unidad" value = { form.unidad } onChange = { this.updateUnidades }/>
                    </div>
                    <div className = " col-md-12 px-2">
                        <Input as = "textarea" placeholder = "Descripción" rows = "3" value = { form.descripcion }
                            name = "descripcion" onChange = { onChange } />
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