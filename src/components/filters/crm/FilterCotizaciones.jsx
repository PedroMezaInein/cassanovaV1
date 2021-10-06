import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Button, ReactSelectSearchGray, RangeCalendar, InputNumberGray } from '../../form-components';
import { optionsEsquemas } from '../../../functions/options'

class FilterPresupuestos extends Component {

    state = {
        form: {
            identificador:'',
            esquema: '',
            costo:'',
            fechas: { start: null, end: null },
        }
    }

    updateSelect = (value, type) => {
        const { form } = this.state
        form[type] = value
        this.setState({...this.state, form})
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({...this.state, form})
    }

    componentDidMount = async() => {
        const { filters } = this.props
        const { form } = this.state
        if (Object.keys(filters).length > 0) {
            if (filters.esquema)
                form.esquema = filters.esquema
            if (filters.costo)
                form.costo = filters.costo
            if (filters.identificador)
                form.identificador = filters.identificador
            if (filters.fechas)
                form.fechas = filters.fechas
        }
        this.setState({ ...this.state, form })
    }
    clear = e => {
        e.preventDefault()
        const { form } = this.state
        const { filtering } = this.props
        form.esquema = ''
        form.costo = ''
        form.identificador = ''
        form.fechas = { start: null, end: null }
        filtering({})
        this.setState({ ...this.state, form })
    }
    onSubmit = (e) => {
        e.preventDefault()
        const { form } = this.state
        const { filtering } = this.props
        filtering(form)
    }
    render() {
        const { form } = this.state
        return (
            <Form onSubmit={this.onSubmit} >
                <Row className="mx-0 mt-5 mb-8">
                    <Col md={6}>
                        <div className="text-center">
                            <label className="col-form-label font-weight-bold text-dark-60">Fechas</label><br />
                            <RangeCalendar start={form.fechas.start} end={form.fechas.end} onChange={(value) => { this.onChange({ target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) }} />
                        </div>
                    </Col>
                    <Col md={6} className="align-self-center">
                        <div className="col-md-12 form-group px-0">
                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                                withformgroup={0} name='identificador' placeholder='IDENTIFICADOR' value={form.identificador}
                                onChange={this.onChange} iconclass="las la-hashtag icon-xl" />
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="col-md-12 form-group px-0">
                            <ReactSelectSearchGray placeholder='Esquema' defaultvalue={form.esquema} iconclass='las la-tools icon-xl'
                                options={optionsEsquemas()} onChange={(value) => { this.updateSelect(value, 'esquema') }}
                            />
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="col-md-12 px-0">
                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                                withformgroup={0} name='costo' placeholder='COSTO' value={form.costo}
                                onChange={this.onChange} iconclass="las la-coins icon-xl" />
                        </div>
                    </Col>
                </Row>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold d-flex align-items-center" type='button' text="LIMPIAR" onClick={this.clear} />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold d-flex align-items-center" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default FilterPresupuestos