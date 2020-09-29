import React, { Component } from 'react'

import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, Calendar, RangeCalendar} from '../../form-components'
import { DATE } from '../../../constants'

class SolicitarVacacionesForm extends Component {

    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }

    render() {
        const { onSubmit, form, onChange, onChangeRange, formeditado, disabledDates } = this.props
        return (
            <Form id="form-calendario"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-calendario')
                    }
                }
            >

                <div className = "d-flex justify-content-center p-2">
                    <RangeCalendar
                        onChange = { this.updateRangeCalendar }
                        disabledDates = { disabledDates }
                        start = { form.fechaInicio }
                        end = { form.fechaFin }/>
                </div>

                <div className="mt-3 text-center">
                    <Button icon='' className="mx-auto" 
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-calendario')
                            }
                        }
                        text="ENVIAR" />
                </div>

            </Form>
        )
    }
}

export default SolicitarVacacionesForm