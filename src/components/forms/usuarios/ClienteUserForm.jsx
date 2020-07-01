import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox, SelectSearch } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class ClienteUserForm extends Component{

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
            <div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                {/* <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        <SelectSearch
                            options = { options.cuentas } 
                            placeholder = "Selecciona la cuenta" 
                            name="cuenta"  
                            value = { form.cuenta } 
                            onChange = { this.updateCuenta } 
                            iconclass={"fas fa-credit-card"} 
                            />
                        <span className="form-text text-muted">Por favor, seleccione el(los) cuenta(s)</span>
                    </div>
                    <div className="col-md-8">
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
                </div> */}
            </div>

        )
    }
}

export default ClienteUserForm