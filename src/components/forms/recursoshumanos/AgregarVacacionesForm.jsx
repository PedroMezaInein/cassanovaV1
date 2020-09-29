import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, Calendar, SelectSearch, RangeCalendar } from '../../form-components'
import { DATE } from '../../../constants'

class AgregarVacacionesForm extends Component {

    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }

    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empleado' } })
    }

    render() {
        const { onSubmit, form, onChange, formeditado, options } = this.props
        return (
            <Form id="form-add-vacaciones"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-add-vacaciones')
                    }
                }
            >
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6">
                        <SelectSearch
                            options={options.empleados}
                            placeholder="SELECCIONA EL EMPLEADO"
                            name="empleado"
                            value={form.empleado}
                            onChange={this.updateEmpleado}
                            iconclass={"fas fa-layer-group"}
                            formeditado={formeditado}
                        />
                    </div>
                </div>

                <div className = "d-flex justify-content-center p-2">
                    <RangeCalendar
                        onChange = { this.updateRangeCalendar }
                        start = { form.fechaInicio }
                        end = { form.fechaFin }/>
                </div>

                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" 
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-add-vacaciones')
                            }
                        }
                        text="ENVIAR" />
                </div>

            </Form>
        )
    }
}

export default AgregarVacacionesForm