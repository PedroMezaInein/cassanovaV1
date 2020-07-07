import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox, SelectSearch } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class FlujosForm extends Component{

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }
    updateCuenta = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.cuentas.map((cuenta)=> {
            if(cuenta.value === value)
                onChangeAndAdd({ target: { value: cuenta.value, name: 'cuenta' } }, 'cuentas')
        })
        onChange({ target: { value: value, name: 'cuenta' } })
    }
    

    render(){
        const { form, onChange, options, deleteOption, onChangeAndAdd, clear, ...props } = this.props
        return(
            <Form { ... props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            options = { options.cuentas } 
                            placeholder = "Selecciona la cuenta" 
                            name="cuenta"  
                            value = { form.cuenta } 
                            onChange = { this.updateCuenta } 
                            iconclass={"fas fa-credit-card"} 
                            />
                        {/* <span className="form-text text-muted">Por favor, seleccione la(s) cuenta(s)</span> */}
                    </div>
                    <div className="col-md-4">
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
                        {/* <span className="form-text text-muted">Por favor, ingrese su fecha de inicio. </span> */}
                    </div>
                    <div className="col-md-4">
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
                        {/* <span className="form-text text-muted">Por favor, ingrese su fecha de fin. </span> */}
                    </div>
                    
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    
                    <div className="col-md-12">
                        {
                            form.cuentas.length > 0 ?
                                <div className="col-md-12 d-flex align-items-center image-upload">
                                    {
                                        form.cuentas.map((cuenta, key)=>{
                                            return(
                                                <Badge variant = "light" key = { key } className="d-flex px-3 align-items-center" pill>
                                                    <FontAwesomeIcon
                                                        icon = { faTimes }
                                                        onClick = { (e) => { e.preventDefault(); deleteOption(cuenta, 'cuentas')  }}
                                                        className = "small-button mr-2" />
                                                        {
                                                            cuenta.name
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
                    <Button icon='' className="mx-3" type="submit" text="Mostrar" />
                    <Button onClick = { clear } className="mx-3" text="Limpiar" />
                </div>
            </Form>
        )
    }
}

export default FlujosForm