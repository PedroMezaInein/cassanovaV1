import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox, SelectSearch } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class FlujosForm extends Component{

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }
    updateEmpresa = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.empresas.map((empresa)=> {
            if(empresa.value === value)
                onChangeAndAdd({ target: { value: empresa.value, name: 'empresa' } }, 'empresas')
        })
        onChange({ target: { value: value, name: 'empresa' } })
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
                        <SelectSearch
                            options = { options.empresas } 
                            placeholder = "Selecciona la colonia" 
                            name="empresa"  
                            value = { form.empresa } 
                            onChange = { this.updateEmpresa } 
                            iconclass={"fas fa-building"} 
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
                                                            empresa.name
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
                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" type="submit" text="Descargar" />
                </div>
            </Form>
        )
    }
}

export default FlujosForm