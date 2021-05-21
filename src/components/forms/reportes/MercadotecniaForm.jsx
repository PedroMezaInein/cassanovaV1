import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, SelectSearch } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles'

class MercadotecniaForm extends Component {

    getMeses = () => {
        return [
            { name: 'Enero', value: 'Enero' },
            { name: 'Febrero', value: 'Febrero' },
            { name: 'Marzo', value: 'Marzo' },
            { name: 'Abril', value: 'Abril' },
            { name: 'Mayo', value: 'Mayo' },
            { name: 'Junio', value: 'Junio' },
            { name: 'Julio', value: 'Julio' },
            { name: 'Agosto', value: 'Agosto' },
            { name: 'Septiembre', value: 'Septiembre' },
            { name: 'Octubre', value: 'Octubre' },
            { name: 'Noviembre', value: 'Noviembre' },
            { name: 'Diciembre', value: 'Diciembre' }
        ]
    }

    getAños = () => {
        var fecha = new Date().getFullYear()
        var arreglo = [];
        for (let i = 0; i < 10; i++)
            arreglo.push(
                {
                    name: fecha - i,
                    value: fecha - i
                }
            );
        return arreglo
    }

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

    render() {
        const { form, onChange, onSubmit, formeditado, options, handleChange, ...props } = this.props
        return (
            <Form id="form-reporte"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-reporte')
                    }
                }
                {...props}
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-4">
                        <SelectSearch name='empresa' options = { options.empresas }
                            placeholder = 'SELECCIONA LA EMPRESA' value = { form.empresa }
                            onChange = { this.updateEmpresa } iconclass = "far fa-building"
                            messageinc = "Incorrecto. Selecciona la empresa." />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch name = 'mes' options = { this.getMeses() }
                            placeholder = 'SELECCIONA EL MES' value = { form.mes }
                            onChange = { this.updateMes } iconclass = "fas fa-calendar-day"
                            messageinc = "Incorrecto. Selecciona el mes." />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch name = 'año' options = { this.getAños() }
                            placeholder = 'SELECCIONA EL AÑO' value = { form.año } 
                            onChange = { this.updateAño } iconclass="fas fa-calendar-day"
                            messageinc = "Incorrecto. Selecciona el año." />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 d-flex justify-content-center align-self-center mt-4">
                        <div>
                            <div className="text-center font-weight-bolder mb-2">
                                {form.adjuntos.adjuntos.placeholder}
                            </div>
                            <ItemSlider multiple = { false } items = { form.adjuntos.adjuntos.files }
                                item = 'adjuntos' handleChange = { handleChange } />
                        </div>
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row mx-0">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon = '' className = "mx-auto" text = "ENVIAR" 
                                onClick = { (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-reporte') } } />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default MercadotecniaForm