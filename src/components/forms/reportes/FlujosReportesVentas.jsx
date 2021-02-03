import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearchGray, Button } from '../../form-components'
import ItemSlider from '../../singles/ItemSlider'

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

    updateRango = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'rango' } })
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
    
    getRangos = () => {
        return [
            { name: 'Bimestral', value: '2'},
            { name: 'Semestral', value: '5'},
            { name: 'Anual', value: '11'},
        ]
    }

    render() {
        const { form, options, onSubmit, onChange, handleChange, onSubmitAdjunto} = this.props
        return (
            <Form>
                <div className="row mx-0 justify-content-center mb-3">
                    <div className="col-md-3">
                        <SelectSearchGray
                            withtaglabel={1}
                            withtextlabel={1}
                            name = 'empresa'
                            options = { options.empresas }
                            placeholder = 'SELECCIONA LA EMPRESA'
                            value = { form.empresa }
                            onChange = { this.updateEmpresa }
                            iconclass = "far fa-building"
                            messageinc = "Selecciona la empresa."
                            />
                    </div>
                    <div className="col-md-3">
                        <SelectSearchGray
                            withtaglabel={1}
                            withtextlabel={1}
                            name = 'mes'
                            options = { this.getMeses() }
                            placeholder = 'SELECCIONA EL MES'
                            value = { form.mes }
                            onChange = { this.updateMes }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Selecciona el mes."
                            />
                    </div>
                    <div className="col-md-2">
                        <SelectSearchGray
                            withtaglabel={1}
                            withtextlabel={1}
                            name = 'año'
                            options = { this.getAños() }
                            placeholder = 'SELECCIONA EL AÑO'
                            value = { form.año }
                            onChange = { this.updateAño }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Selecciona el año."
                            />
                    </div>
                    <div className="col-md-2">
                        <SelectSearchGray
                            withtaglabel={1}
                            withtextlabel={1}
                            name = 'año'
                            options = { this.getRangos() }
                            placeholder = 'SELECCIONA EL RANGO'
                            value = { form.rango }
                            onChange = { this.updateRango }
                            iconclass = "fas fa-calendar-day"
                            messageinc = "Selecciona el rango."
                            />
                    </div>
                    <div className="col-md-2">
                        <div className="form-group row">
                            <label className="col-form-label col-md-12 font-weight-bold text-dark-60">¿Se adjuntará el reporte?</label>
                            <div className="col-md-12">
                                <div className="radio-inline text-dark-50 font-weight-bold">
                                    <label className="radio radio-outline radio-outline-2x radio-primary">
                                        <input 
                                            type="radio" 
                                            name="si_adjunto"
                                            checked={form.si_adjunto}
                                            onChange={onChange}
                                            value={form.si_adjunto}
                                        />Si
                                            <span></span>
                                        </label>
                                    <label className="radio radio-outline radio-outline-2x radio-primary">
                                        <input
                                            type="radio" 
                                            name="no_adjunto"
                                            checked={form.no_adjunto}
                                            onChange={onChange}
                                            value={form.no_adjunto}
                                        />No
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        form.si_adjunto?
                            <>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless justify-content-center mt-3 text-center">
                                        <div className="col-md-12 text-center">
                                        <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.reportes.placeholder}</label>
                                            <ItemSlider
                                                items={form.adjuntos.reportes.files}
                                                item='reportes' 
                                                handleChange={handleChange}
                                                multiple={false} 
                                            />
                                    </div>
                                </div>
                            </>
                        :''
                    }
                </div>
                {
                    form.no_adjunto?
                        <div className="card-footer pt-3 pb-0 pr-1">
                            <div className="row">
                                <div className="col-lg-12 text-center pr-0 pb-0">
                                    <Button icon='' className="btn btn-light-primary font-weight-bold" text="GENERAR REPORTE" 
                                        onClick={ onSubmit } 
                                    />
                                </div>
                            </div>
                        </div>
                    : form.si_adjunto?
                        <div className="card-footer pt-3 pb-0 pr-1">
                            <div className="row">
                                <div className="col-lg-12 text-center pr-0 pb-0">
                                    <Button icon='' className="btn btn-light-primary font-weight-bold" text="ENVIAR REPORTE" 
                                        onClick={ onSubmitAdjunto } 
                                    />
                            </div>
                        </div>
                    </div>
                    :''
                }
                
            </Form>
        )
    }
}

export default FlujosReportesForm