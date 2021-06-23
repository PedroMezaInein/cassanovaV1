import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearchGray } from '../../form-components'
import RangeCalendar from '../../form-components/RangeCalendar';

class FlujosReportes extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    render() {
        const { form, onChangeRange, options } = this.props
        return (
            <Form>
                <div className="row mx-0" id="estado-resultados">
                    <div className="col-md-12">
                        <SelectSearchGray
                            name='empresa'
                            options={options.empresas}
                            placeholder='SELECCIONA LA EMPRESA'
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la empresa."
                            withtaglabel={0}
                            withtextlabel={0}
                            withicon={1}
                        />
                    </div>
                    <div className="col-md-12 text-center mt-3">
                        <RangeCalendar
                            onChange={onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                </div>
            </Form>
        )
    }
}

export default FlujosReportes