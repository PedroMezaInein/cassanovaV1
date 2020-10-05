import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch } from '../../form-components'
import RangeCalendar from '../../form-components/RangeCalendar';

class FlujosReportesForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    render() {
        const { form, onChangeRange, onChangeRangeRef, options } = this.props
        return (
            <Form>
                <div className="row mx-0  justify-content-center">
                    <div className="col-md-4">
                        <SelectSearch
                            name='empresa'
                            options={options.empresas}
                            placeholder='SELECCIONA LA(S) EMPRESA(S)'
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la(s) empresa(s)."
                        />
                    </div>
                </div>
                <div className="row mx-0 mt-5 mb-3 justify-content-center">
                    <div className="col-md-6 text-center">
                        <div>
                            <label class="col-form-label text-center">Fechas del reporte</label>
                        </div>
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                    <div className="col-md-6 text-center">
                        <div>
                            <label class="col-form-label text-center">Fechas de referencia</label>
                        </div>
                        <RangeCalendar
                            onChange={onChangeRangeRef}
                            start={form.fechaInicioRef}
                            end={form.fechaFinRef}
                        />
                    </div>
                </div>
            </Form>
        )
    }
}

export default FlujosReportesForm