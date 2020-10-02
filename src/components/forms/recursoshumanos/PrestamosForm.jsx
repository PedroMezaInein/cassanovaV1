import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { DATE } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { SelectSearch, InputMoney, Calendar, Input, Button } from '../../form-components';
import { ItemSlider } from '../../singles'
export default class componentName extends Component {
    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha', value: date } })
    }
    updateEmpleado = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empleado' } })
    }
    render() {
        const { form, onSubmit, formeditado, options, onChange, handleChange, deleteFile, ...props } = this.props
        return (
            <Form
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'wizard-3-content')
                    }
                }
                {...props} >
                <div className="form-group row form-group-marginless justify-content-md-center">
                    <div className="col-md-4">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empleados}
                            placeholder='EMPLEADO'
                            name='empleado'
                            value={form.empleado}
                            onChange={this.updateEmpleado}
                            iconclass='fas fa-user-alt' />
                    </div>
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
                            name="monto"
                            onChange={onChange}
                            value={form.monto}
                            type="text"
                            placeholder="MONTO"
                            iconclass="fas fa-dollar-sign"
                            thousandseparator={true}
                            messageinc="Incorrecto. Ingresa el monto." />
                    </div>
                </div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <Input
                            requirevalidation={0}
                            formeditado={0}
                            rows="2"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onChange}
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa la descripción." />
                    </div>
                </div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            item='adjuntos' handleChange={handleChange}
                            deleteFile={deleteFile} />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' text='ENVIAR'
                                onClick={(e) => { e.preventDefault(); onSubmit(e) }} />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}