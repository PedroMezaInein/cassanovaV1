import React, { Component } from 'react'

import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { Button, Calendar} from '../../form-components'
import { DATE } from '../../../constants'

class SolicitarVacacionesForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange, form } = this.props
        if(date > form.fechaFin){
            onChange({ target: { value: date, name: 'fechaFin' } })    
        }
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }
    render() {
        const { onSubmit, form, onChange, formeditado } = this.props
        return (
            <Form id="form-calendario"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-calendario')
                    }
                }
            >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="FECHA DE INICIO"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="FECHA FINAL"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
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