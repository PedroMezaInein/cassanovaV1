import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { Button, Select, Calendar, RadioGroup, OptionsCheckbox, SelectSearch } from '../../form-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

class FlujosForm extends Component {

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
        options.cuentas.map((cuenta) => {
            if (cuenta.value === value)
                onChangeAndAdd({ target: { value: cuenta.value, name: 'cuenta' } }, 'cuentas')
        })
        onChange({ target: { value: value, name: 'cuenta' } })
    }

    mostrarTodasCuentas = () => {
        const { options, onChange } = this.props
        options.cuentas.map((cuenta) => {
            this.updateCuenta(cuenta.value)
        })
        onChange({ target: { value: '', name: 'cuenta' } })
    }

    render() {
        const { form, onChange, options, deleteOption, onChangeAndAdd, clear, ...props } = this.props
        return (
            <Form {...props}>
                <h1 className="text-center mb-3">Flujos</h1>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <SelectSearch
                            options={options.cuentas}
                            placeholder="Selecciona la cuenta"
                            name="cuenta"
                            value={form.cuenta}
                            onChange={this.updateCuenta}
                            iconclass={"fas fa-credit-card"}
                        />
                        {/* <div className="btn btn-outline-primary mt-3 p-2" onClick = { this.mostrarTodasCuentas }>
                            <i className={"fas fa-list-ol icon-nm"}><span className="pl-2 font-size-sm">Muestra todas las cuentas</span></i> 
                        </div> */}

                        <a className="btn btn-outline-primary mt-3" onClick={this.mostrarTodasCuentas}>
                            <i className="fas fa-list-ol icon-md"></i> Seleccionar todas las cuentas
                        </a>
                    </div>
                    <div className="col-md-3">
                        <Calendar
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="Fecha de inicio"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                        />
                    </div>
                    <div className="col-md-3">
                        <Calendar
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="Fecha final"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                        />
                    </div>

                </div>
                <div className="form-group row form-group-marginless">
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
                <div className="separator separator-dashed mt-1"></div>
                <div className="mt-3 text-center mb-4">
                    <Button icon='' className="btn btn-light-primary font-weight-bold mr-2" type="submit" text="MOSTRAR" />
                    <Button onClick={clear} className="btn btn-light-danger font-weight-bold mr-2" text="LIMPIAR" />
                </div>
                <div className="separator separator-dashed mt-1 mb-2 mt-2"></div>
            </Form>
        )
    }
}

export default FlujosForm