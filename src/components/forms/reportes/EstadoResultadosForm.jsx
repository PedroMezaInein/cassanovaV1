import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import RangeCalendar from '../../../components/form-components/RangeCalendar';

class EstadoResultadosForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }

    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })
    }

    render() {
        const { form, onChange,  options, formeditado, onSubmit, ...props } = this.props
        return (
            <>
                <Form id="form-flujo-proyectos"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-flujo-proyectos')
                        }
                    }
                    {...props}
                >
                    <SelectSearch
                        formeditado={formeditado}
                        name='empresa'
                        options={options.empresas}
                        placeholder='SELECCIONA LA(S) EMPRESA(S)'
                        value={form.empresa}
                        onChange={this.updateEmpresa}
                        iconclass={"far fa-building"}
                        messageinc="Incorrecto. Selecciona la(s) empresa(s)."
                    />
                    <div className="text-center mt-4">
                        <RangeCalendar
                            onChange={this.onChangeRange}
                            start={form.fechaInicio}
                            end={form.fechaFin}
                        />
                    </div>
                </Form>
            </>
        )
    }
}

export default EstadoResultadosForm