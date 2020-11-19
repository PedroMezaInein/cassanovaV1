import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch, Button } from '../../form-components'
import RangeCalendar from '../../form-components/RangeCalendar';

class FlujosReportesForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateReferencia = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'referencia' } })
    }

    render() {
        const { form, onChangeRange, options, onSubmit } = this.props
        return (
            <Form onSubmit = { onSubmit } >
                <div className="row mx-0 justify-content-center mb-2">
                    <div className="col-md-1"></div>
                    <div className="col-md-4">
                        <SelectSearch
                            name = 'empresa'
                            options = { options.empresas }
                            placeholder = 'SELECCIONA LA EMPRESA'
                            value = { form.empresa }
                            onChange = { this.updateEmpresa }
                            iconclass = "far fa-building"
                            messageinc = "Incorrecto. Selecciona la empresa."
                            />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4">
                        <SelectSearch
                            name = 'referencia'
                            options = { [
                                { name: 'Mensual', value: 'mensual' },
                                { name: 'Bimestral', value: 'bimestral' },
                                { name: 'Trimestral', value: 'trimestral' },
                                { name: 'Cuatrimestral', value: 'cuatrimestral' },
                                { name: 'Semestral', value: 'semestral' },
                                { name: 'Anual', value: 'anual' },
                            ] }
                            placeholder = 'SELECCIONA LA TIEMPO DE REFERENCIA'
                            value = { form.referencia }
                            onChange = { this.updateReferencia }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Incorrecto. Selecciona el rango de referencia."
                            />
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-8 text-center my-4">
                        <div>
                            <label className="col-form-label text-center">Fecha del reporte</label>
                        </div>
                        <RangeCalendar
                            onChange = { onChangeRange }
                            start = { form.fechaInicio }
                            end = { form.fechaFin }
                            key = 'selection-range'
                        />
                    </div>
                </div>
                <div className='text-center'>
                    <Button icon='' className="mx-auto" type="submit" text="Buscar" />
                </div>
            </Form>
        )
    }
}

export default FlujosReportesForm