import React, { Component } from 'react'
import { InputGray , InputNumberGray, RangeCalendar } from '../form-components'
import { ItemSlider } from '../../components/singles'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Button } from '../../components/form-components'
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'

class ComentarioSemana extends Component {

    updateRangeCalendar = range => {
        const { startDate, endDate } = range
        const { onChange } = this.props
        onChange({ target: { value: startDate, name: 'fechaInicio' } })
        onChange({ target: { value: endDate, name: 'fechaFin' } })
    }
    // const classes = useStyles();

    render() {
        
        const { addSemanas, form, onChange, handleChange, color } = this.props
        return (
            <div>
                <Form id="form-semana"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(addSemanas, e, 'form-semana')
                        }
                    }>
                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                         
                          <div className="align-self-center col">
                            <div className="form-group row form-group-marginless justify-content-start">
                                <div className="col-md-4 align-self-center">

                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={0}
                                        requirevalidation={1}
                                        placeholder='Semana'
                                        value={form.semana}
                                        name='semana'
                                        onChange={onChange}
                                        as="textarea"
                                        rows="1"
                                    />
                                </div>

                                    <div className="col-sm-4">
                                        <InputNumberGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withformgroup={0}
                                            withicon={1}
                                            requirevalidation={1}
                                            placeholder="% DE OBRA Programado"
                                            value={form.programado}
                                            name="programado"
                                            onChange={onChange}
                                            iconclass="people"
                                            messageinc="Ingresa el % de programado."
                                            type="text"
                                        />
                                    </div>
                                    <div className="col-sm-4">
                                        <InputNumberGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withformgroup={0}
                                            withicon={1}
                                            requirevalidation={1}
                                            placeholder="% DE OBRA EJECUTADO"
                                            value={form.ejecutado}
                                            name="ejecutado"
                                            onChange={onChange}
                                            iconclass="people"
                                            messageinc="Ingresa el % de obra ejecutado."
                                            type="text"
                                        />
                                    </div>
                            </div>
                          </div>                           

                        </div>
                        <div className="text-center col-md-auto">
                                <label className="col-form-label mb-2 font-weight-bolder text-dark-60">Periodo del avance</label><br />
                                <RangeCalendar
                                    onChange={this.updateRangeCalendar}
                                    start={form.fechaInicio}
                                    end={form.fechaFin}
                                    tils={DateFnsUtils} locale={es}
                                />
                            </div>
               
                    <div className="card-footer py-3 pr-1">
                        <div className="row mx-0">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className={`btn btn-light-${color} font-weight-bold`}
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(addSemanas, e, 'form-semana')
                                        }
                                    } text="ENVIAR" />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}

export default ComentarioSemana