import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputMoney, Calendar, Button } from '../../form-components'
import { DATE } from '../../../constants'
import { validateAlert } from '../../../functions/alert'
export default class componentName extends Component {
    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha', value: date } })
    }
    render() {
        const { onSubmit, form, formeditado, onChange, ...props } = this.props
        return (
            <Form
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'wizard-3-content')
                    }
                }
                {...props} >
                <div className="form-group row form-group-marginless pt-4 justify-content-md-center">
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder='FECHA'
                            name='fecha'
                            value={form.fecha}
                            patterns={DATE}
                            iconclass='fas fa-calendar' />
                    </div>
                    <div className="col-md-4">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="abono"
                            onChange={onChange}
                            value={form.abono}
                            type="text"
                            placeholder="ABONO"
                            iconclass="fas fa-dollar-sign"
                            thousandseparator={true}
                            messageinc="Incorrecto. Ingresa el monto." />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button 
                                icon='' 
                                className="btn btn-primary mr-2"
                                text='ENVIAR'
                                onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}