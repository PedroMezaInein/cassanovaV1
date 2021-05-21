import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { DATE } from '../../../constants';
import { validateAlert } from '../../../functions/alert';
import { SelectSearch, InputMoney, Calendar, Input, Button, InputNumber } from '../../form-components';
import { ItemSlider } from '../../singles'
export default class PrestamosForm extends Component {
    handleChangeDate = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha', value: date } })
    }
    handleChangeDateAbono = (date) => {
        const { onChange } = this.props
        onChange({ target: { name: 'fecha_abono', value: date } })
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
                    <div className="col-md-3">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empleados}
                            placeholder='EMPLEADO'
                            name='empleado'
                            value={form.empleado}
                            onChange={this.updateEmpleado}
                            iconclass='fas fa-user-alt'
                            messageinc="Incorrecto. Selecciona el empleado"
                        />
                    </div>
                    <div className="col-md-9">
                        <Input
                            requirevalidation={0}
                            formeditado={0}
                            rows="1"
                            as="textarea"
                            placeholder="DESCRIPCIÓN"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onChange}
                            style={{ paddingLeft: "10px" }}
                            messageinc="Incorrecto. Ingresa la descripción."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder='FECHA DEL PRESTAMO'
                            name='fecha'
                            value={form.fecha}
                            patterns={DATE}
                            iconclass='fas fa-calendar'
                        />
                    </div>
                    <div className="col-md-3">
                        <InputMoney
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="monto"
                            onChange={onChange}
                            value={form.monto}
                            type="text"
                            placeholder="MONTO DEL PRESTAMO"
                            iconclass="fas fa-dollar-sign"
                            thousandseparator={true}
                        />
                    </div>
                    <div className="col-md-3">
                        <Form.Label className="col-form-label">Selecciona el periodo</Form.Label>
                        <div className="input-icon">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className="far fa-calendar-alt kt-font-boldest text-primary"></i>
                                </span>
                            </span>
                            <Form.Control className="form-control is-valid text-uppercase sin_icono" value = {form.periodo} onChange={onChange} name='periodo' formeditado={formeditado} as="select">
                                <option disabled selected value = {0}> Selecciona el periodo</option>
                                <option value={"semanal"}>Semanal</option>
                                <option value={"quincenal"}>Quincenal</option>
                                <option value={"mensual"}>Mensual</option>
                                <option value={"bimestral"}>Bimestral</option>
                                <option value={"trimestral"}>Trimestral</option>
                            </Form.Control>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <InputNumber
                            requirevalidation={0}
                            formeditado={formeditado}
                            name="numero_abono"
                            onChange={onChange}
                            value={form.numero_abono}
                            type="text"
                            placeholder="Numero de abonos"
                            iconclass={"flaticon2-list-2"}
                            messageinc="Incorrecto. Ingresa el número de abonos."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless justify-content-center">
                    <div className="col-md-6">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            item='adjuntos' handleChange={handleChange}
                            deleteFile={deleteFile} />
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
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