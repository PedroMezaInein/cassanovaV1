import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, RangeCalendar, SelectSearch } from '../../form-components'

class FlujosForm extends Component {
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

    render() {
        const { form, onChange, options, deleteOption, onChangeAndAdd, clear, onChangeRange, ...props } = this.props
        return (
            <Form {...props}>
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
                <div className="form-group row form-group-marginless d-flex justify-content-center">
                    <div className="col-md-4 mb-4">
                        <SelectSearch
                            options={options.cuentas}
                            placeholder="SELECCIONA LA CUENTA"
                            name="cuenta"
                            value={form.cuenta}
                            onChange={this.updateCuenta}
                            iconclass={"fas fa-credit-card"}
                            messageinc="Incorrecto. Selecciona la cuenta"
                        />
                    </div>
                    {
                        form.cuentas.length > 0 ?
                            <div className="col-md-12 row mx-0 align-items-center image-upload">
                                {
                                    form.cuentas.map((cuenta, key) => {
                                        return (
                                            <div key={key} className="tagify form-control p-1 col-md-3 px-2 d-flex justify-content-center align-items-center mb-3" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                                <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                    <div
                                                        title="Borrar archivo"
                                                        className="tagify__tag__removeBtn"
                                                        role="button"
                                                        aria-label="remove tag"
                                                        onClick={(e) => { e.preventDefault(); deleteOption(cuenta, 'cuentas') }}
                                                    >
                                                    </div>
                                                    <div><span className="tagify__tag-text p-1 white-space">{cuenta.name}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            : ''
                    }
                </div>
                <div className="d-flex justify-content-center mb-5">
                    <Button
                        icon=''
                        className="btn btn-icon btn-light-primary mr-2"
                        onClick={this.mostrarTodasCuentas}
                        only_icon={"far fa-eye icon-md"}
                        tooltip={{ text: 'Mostrar todas las cuentas' }}
                    />
                    <Button
                        icon=''
                        className="btn btn-icon btn-light-danger mr-2"
                        onClick={clear}
                        only_icon={"flaticon2-rubbish-bin icon-md"}
                        tooltip={{ text: 'Borrar cuentas seleccionadas' }}
                    />
                    <Button
                        icon=''
                        className="btn btn-icon btn-light-success"
                        type="submit"
                        only_icon={"flaticon2-plus icon-md"}
                        tooltip={{ text: 'Agregar a la tabla' }}
                    />
                </div>
                <div className="separator separator-dashed mt-1 mb-2 mt-2"></div>
            </Form>
        )
    }
}

export default FlujosForm