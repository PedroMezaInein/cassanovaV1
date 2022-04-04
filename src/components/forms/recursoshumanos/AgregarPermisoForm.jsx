import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, SelectSearch, RangeCalendar } from '../../form-components'
class AgregarPermisosForm extends Component {
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
        const { onSubmit, form, formeditado, options, disabledDates } = this.props
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
                            messageinc="Incorrecto. Selecciona el empleado"
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center p-2">
                    <RangeCalendar
                        disabledDates={disabledDates}
                        onChange={this.updateRangeCalendar}
                        start={form.fechaInicio}
                        end={form.fechaFin} />
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-add-vacaciones')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AgregarPermisosForm