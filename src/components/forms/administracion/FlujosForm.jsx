import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, RangeCalendar, TagSelectSearch } from '../../form-components'
import $ from "jquery";
class FlujosForm extends Component {
    nuevoUpdateCuenta = seleccionados =>{
        const { form,deleteOption } = this.props
        seleccionados = seleccionados?seleccionados:[];
        if(seleccionados.length>form.cuentas.length){
            let diferencia = $(seleccionados).not(form.cuentas).get();
            let val_diferencia = diferencia[0].value
            this.updateCuenta(val_diferencia)
        }
        else {
            let diferencia = $(form.cuentas ).not(seleccionados).get(); 
            diferencia.forEach(borrar=>{
                deleteOption(borrar,"cuentas")
            })
        }
    }
    updateCuenta = value => {
        const { onChange, onChangeAndAdd, options } = this.props
        options.cuentas.map((cuenta) => {
            if (cuenta.value === value)
                onChangeAndAdd({ target: { value: cuenta.value, name: 'cuenta' } }, 'cuentas')
            return false
        })
        onChange({ target: { value: value, name: 'cuenta' } })
    }

    mostrarTodasCuentas = () => {
        const { options, onChange } = this.props
        options.cuentas.map((cuenta) => {
            this.updateCuenta(cuenta.value)
            return false
        })
        onChange({ target: { value: '', name: 'cuenta' } })
    }
    transformarOptions = options => {  
        options = options?options:[]
        options.map((value)=>{
            value.label = value.name 
            return ''
        } );
        return options
    }

    render() {
        const { form, onChange, options, deleteOption, onChangeAndAdd, clear, onChangeRange, ...props } = this.props
        return (
            <Form {...props}>
                <div className="form-group row form-group-marginless d-flex justify-content-center mb-1">
                    <div className="col-md-11">
                        <TagSelectSearch
                            placeholder="SELECCIONA LA(S) CUENTA(S)"
                            options={this.transformarOptions(options.cuentas)}
                            defaultvalue={this.transformarOptions(form.cuentas)}
                            onChange={this.nuevoUpdateCuenta}
                            requirevalidation={1}
                            iconclass={"fas fa-credit-card"}
                            messageinc="Incorrecto. Selecciona la cuenta"
                        />
                    </div>
                    <div className="col-md-1 mt-4 d-flex justify-content-center align-items-center">
                        <Button
                            icon=''
                            className="btn btn-icon btn-light-primary mr-2"
                            onClick={this.mostrarTodasCuentas}
                            only_icon={"far fa-eye icon-md"}
                            tooltip={{ text: 'AGREGAR TODAS LAS CUENTAS' }}
                        />
                    </div>
                </div>
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    <div className="col-md-6 text-center">
                        <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                </div>
                {/* <div className="d-flex justify-content-center mb-5">
                    <Button
                        icon=''
                        className="btn btn-icon btn-light-danger mr-2"
                        onClick={clear}
                        only_icon={"flaticon2-rubbish-bin icon-md"}
                        tooltip={{ text: 'BORRAR CUENTAS SELECCIONADAS' }}
                    />
                </div> */}
                <div className="text-center">
                    <Button
                        icon=''
                        className="btn btn-primary"
                        type="submit"
                        text="AGREGAR"
                    />
                </div>
                
                <div className="separator separator-solid mb-2 mt-4"></div>
            </Form>
        )
    }
}

export default FlujosForm