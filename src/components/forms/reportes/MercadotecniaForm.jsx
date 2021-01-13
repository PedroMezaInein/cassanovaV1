import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, SelectSearch } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { ItemSlider } from '../../../components/singles'

class MercadotecniaForm extends Component {

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
                        <SelectSearch
                            name='empresa'
                            options={options.empresas}
                            placeholder='SELECCIONA LA EMPRESA'
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass="far fa-building"
                            messageinc="Incorrecto. Selecciona la empresa."
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            name='mes'
                            options={this.getMeses()}
                            placeholder='SELECCIONA EL MES'
                            value={form.mes}
                            onChange={this.updateMes}
                            iconclass="fas fa-calendar-day"
                            messageinc="Incorrecto. Selecciona el mes."
                        />
                    </div>
                    <div className="col-md-4">
                        <SelectSearch
                            name='año'
                            options={this.getAños()}
                            placeholder='SELECCIONA EL AÑO'
                            value={form.año}
                            onChange={this.updateAño}
                            iconclass="fas fa-calendar-day"
                            messageinc="Incorrecto. Selecciona el año."
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 d-flex justify-content-center align-self-center mt-4">
                        <div>
                            <div className="text-center font-weight-bolder mb-2">
                                {form.adjuntos.adjuntos.placeholder}
                            </div>
                            <ItemSlider
                                multiple={false}
                                items={form.adjuntos.adjuntos.files}
                                item='adjuntos'
                                handleChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="card-footer py-3 pr-1">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(onSubmit, e, 'form-reporte')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default MercadotecniaForm