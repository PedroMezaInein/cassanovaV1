import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../../../functions/alert';
import { Button, ReactSelectSearchGray, RangeCalendar, InputNumberGray } from '../../../form-components';
import axios from 'axios';
import { setSingleHeader } from '../../../../functions/routers';
import Swal from 'sweetalert2';
import { URL_DEV } from '../../../../constants';
import { setOptions } from '../../../../functions/setters';
import { optionsPresupuestos, transformOptions } from '../../../../functions/options';

class FilterPresupuestos extends Component {

    state = {
        form: {
            identificador:'',
            estatus: '',
            area:'',
            fechas: { start: null, end: null },
        },
        options: { 
            estatus: [], areas: []
        }
    }

    updateSelect = (value, type) => {
        const { form, options } = this.state
        form[type] = value
        this.setState({...this.state, form, options})
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({...this.state, form})
    }

    componentDidMount = async() => {
        waitAlert()
        const { at} = this.props
        const { options } = this.state
        await axios.get(`${URL_DEV}presupuestos/options`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { areas } = response.data;
                options.areas = setOptions(areas, "nombre", "id")
                Swal.close();
            this.setState({...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
            console.error(error, "error");
        });
    }
    clear = e => {
        e.preventDefault()
        const { form } = this.state
        const { filtering } = this.props
        form.area = ''
        form.estatus = ''
        form.identificador = ''
        form.fechas = { start: null, end: null }
        filtering(form)
        this.setState({ ...this.state, form })
    }
    onSubmit = (e) => {
        e.preventDefault()
        const { form } = this.state
        const { filtering } = this.props
        filtering(form)
    }
    render() {
        const { form, options } = this.state
        console.log(form, 'form')
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
                            <ReactSelectSearchGray placeholder='Área' defaultvalue={form.area} iconclass='las la-tools icon-xl'
                                options={transformOptions(options.areas)} onChange={(value) => { this.updateSelect(value, 'area') }}
                            />
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="col-md-12 form-group px-0">
                            <ReactSelectSearchGray placeholder='Estatus' defaultvalue={form.estatus} iconclass='las la-check-circle icon-xl'
                                options={optionsPresupuestos()} onChange={(value) => { this.updateSelect(value, 'estatus') }} />
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="col-md-12 px-0">
                            <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                                withformgroup={0} name='identificador' placeholder='IDENTIFICADOR' value={form.identificador}
                                onChange={this.onChange} iconclass="las la-ruler-combined icon-xl" />
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