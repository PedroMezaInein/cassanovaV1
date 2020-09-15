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
        const { form, onChangeRange, options } = this.props
        return (
            <Form>
                <div className="">
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
                <div className="text-center mt-4">
                    <RangeCalendar
                        onChange={onChangeRange}
                        start={form.fechaInicio}
                        end={form.fechaFin}
                    />
                </div>
            </Form>
        )
    }
}

export default FlujosReportesForm