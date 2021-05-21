import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, RangeCalendar } from '../../form-components'
class SolicitarVacacionesForm extends Component {
    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    render() {
        const { onSubmit, form, disabledDates } = this.props
        return (
            <Form id="form-calendario"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-calendario')
                    }
                }
            >
                <div className="d-flex justify-content-center p-2">
                    <RangeCalendar
                        onChange={this.updateRangeCalendar}
                        disabledDates={disabledDates}
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
                                        validateAlert(onSubmit, e, 'form-calendario')
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

export default SolicitarVacacionesForm