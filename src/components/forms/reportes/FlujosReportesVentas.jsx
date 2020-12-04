import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch, Button } from '../../form-components'
import RangeCalendar from '../../form-components/RangeCalendar';

class FlujosReportesForm extends Component {

    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateMes = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'mes' } })
    }

    updateAño = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'año' } })
    }

    getMeses = () => {
        return [
            { name: 'Enero', value: '01' },
            { name: 'Febrero', value: '02' },
            { name: 'Marzo', value: '03' },
            { name: 'Abril', value: '04' },
            { name: 'Mayo', value: '05' },
            { name: 'Junio', value: '06' },
            { name: 'Julio', value: '07' },
            { name: 'Agosto', value: '08' },
            { name: 'Septiembre', value: '09' },
            { name: 'Octubre', value: '10' },
            { name: 'Noviembre', value: '11' },
            { name: 'Diciembre', value: '12' }
        ]
    }

    getAños = ()  => {
        var fecha = new Date().getFullYear()
        var arreglo = [];
        for(let i = 0; i < 10; i++)
            arreglo.push(
                {
                    name: fecha - i,
                    value: fecha - i
                }
            );
        return arreglo
    }

    render() {
        const { form, options, onSubmit } = this.props
        console.log(form, 'form')
        return (
            <Form onSubmit = { onSubmit } >
                <div className="row mx-0 justify-content-center mb-3">
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
                    <div className="col-md-3">
                        <SelectSearch
                            name = 'mes'
                            options = { this.getMeses() }
                            placeholder = 'SELECCIONA EL MES'
                            value = { form.mes }
                            onChange = { this.updateMes }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Incorrecto. Selecciona el mes."
                            />
                    </div>
                    <div className="col-md-3">
                        <SelectSearch
                            name = 'año'
                            options = { this.getAños() }
                            placeholder = 'SELECCIONA EL AÑO'
                            value = { form.año }
                            onChange = { this.updateAño }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Incorrecto. Selecciona el año."
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