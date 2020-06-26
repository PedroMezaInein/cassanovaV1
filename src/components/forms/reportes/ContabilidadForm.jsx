import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class ContabilidadForm extends Component{

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }
    
    handleChangeCheckbox = (e, aux) => {
        const { value, checked, name } = e.target
        const { options, form, onChange } = this.props
        let optionesChecked = form[aux]
        console.log(optionesChecked, 'optionesChecked')
        optionesChecked.find(function(element, index){
            if(element.id.toString() === name.toString()){
                element.checked = checked
            }
        })
        onChange({ target: { value: optionesChecked, name: aux } })
    }

    render(){
        const { form, onChange, options, onChangeEmpresa, updateEmpresa,  ...props } = this.props
        return(
            <Form { ... props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateInicio }
                            placeholder = "Fecha de inicio"
                            name = "fechaInicio"
                            value = { form.fechaInicio }
                            selectsStart
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            iconclass={"far fa-calendar-alt"}                            
                        />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span>
                    </div>
                    <div className="col-md-6">
                        <Calendar 
                            onChangeCalendar = { this.handleChangeDateFin }
                            placeholder = "Fecha final"
                            name = "fechaFin"
                            value = { form.fechaFin }
                            selectsEnd
                            startDate={ form.fechaInicio }
                            endDate={ form.fechaFin }
                            minDate={ form.fechaInicio }
                            iconclass={"far fa-calendar-alt"}                          
                        />
                        <span className="form-text text-muted">Por favor, ingrese su fecha de fin. </span>
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <Select 
                            required 
                            name = 'empresa' 
                            options = { options.empresas } 
                            placeholder = 'Selecciona la(s) empresa(s)' 
                            value = { form.empresa }
                            onChange = { onChangeEmpresa } 
                            iconclass={"far fa-building"} 
                        />
                        <span className="form-text text-muted">Por favor, seleccione la(s) empresa(s)</span>
                    </div>
                    <div className="col-md-8">
                        {
                            form.empresas.length > 0 ?
                                <div className="col-md-12 d-flex align-items-center image-upload">
                                    {
                                        form.empresas.map((empresa, key)=>{
                                            return(
                                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                                    <FontAwesomeIcon
                                                        icon = { faTimes }
                                                        onClick = { (e) => { e.preventDefault(); updateEmpresa(empresa) }}
                                                        className = "small-button mr-2" />
                                                        {
                                                            empresa.text
                                                        }
                                                </Badge>
                                            )
                                        })
                                    }
                                </div>
                            : ''
                        }
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <OptionsCheckbox placeholder="Selecciona los modulos a importar" 
                            options = { form.modulos } 
                            name="modulos" 
                            value = { form.modulos } 
                            onChange =  { (e) => {this.handleChangeCheckbox(e, 'modulos') } }/>
                    </div>

                    <div className="col-md-4">
                        <OptionsCheckbox placeholder="Selecciona los archivos a inluir" 
                            options = { form.archivos } 
                            name="archivos" 
                            value = { form.archivos } 
                            onChange =  { (e) => {this.handleChangeCheckbox(e, 'archivos') } }/>
                    </div>
                    <div className="col-md-4">
                        <OptionsCheckbox placeholder="Lleva factura" 
                            options = { form.facturas } 
                            name="facturas" 
                            value = { form.facturas } 
                            onChange =  { (e) => {this.handleChangeCheckbox(e, 'facturas') } }/>
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Descargar" />
                </div>
            </Form>
        )
    }
}

export default ContabilidadForm