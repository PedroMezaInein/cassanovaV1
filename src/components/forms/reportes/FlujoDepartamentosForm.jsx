import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Select} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import RangeCalendar from '../../../components/form-components/RangeCalendar';

class FlujoDepartamentosForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }

    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
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
        const { form, onChange, onChangeEmpresa,  options, formeditado, onSubmit, ...props } = this.props
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
                    <Select
                        requirevalidation={1}
                        formeditado={formeditado}
                        name='empresa'
                        options={options.empresas}
                        placeholder='SELECCIONA LA(S) EMPRESA(S)'
                        value={form.empresa}
                        onChange={onChangeEmpresa}
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
                    <div className="text-center">
                        <div className="mt-4 font-size-h6 label label-light-primary label-inline p-3"><strong>Cuentas por cobrar:</strong><span className="font-weight-normal font-size-lg">&nbsp;Suma</span></div>
                    </div>
                    {/* <div className="card-title font-weight-bolder mt-4 font-size-h5 text-center ">Cuentas por cobrar: <span className="font-weight-normal font-size-h6">Suma</span></div> */}
                </Form>
            </>
        )
    }
}

export default FlujoDepartamentosForm