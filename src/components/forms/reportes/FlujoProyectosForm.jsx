import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Button, Select } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import RangeCalendar from '../../../components/form-components/RangeCalendar';

class FlujoProyectosForm extends Component {

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
        const { form, onChange, options, formeditado, onSubmit, ...props } = this.props
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
                <RangeCalendar   
                    onChange={this.onChangeRange}
                    start = { form.fechaInicio } 
                    end = { form.fechaFin }
                />
                        
                        {/* <Select
                            requirevalidation={1}
                            formeditado={formeditado}
                            name='empresa'
                            options={options.empresas}
                            placeholder='SELECCIONA LA(S) EMPRESA(S)'
                            value={form.empresa}
                            onChange={onChangeEmpresa}
                            iconclass={"far fa-building"}
                            messageinc="Incorrecto. Selecciona la(s) empresa(s)."
                        /> */}

                {/* <div className="separator separator-dashed mt-1 mb-2"></div>
                Cuentas por cobrar*/}

                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''/>
                        </div>
                    </div>
                </div>
            </Form>
            </>
        )
    }
}

export default FlujoProyectosForm