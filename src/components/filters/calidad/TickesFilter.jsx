import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, InputGray, ReactSelectSearchGray, RangeCalendar } from '../../form-components';

class TickesFilter extends Component {

    state = {
        form: {
            check_solicitud: false,
            check_termino: false,
            descripcion: '',
            estatus: '',
            estatus_pago: '',
            fecha_solicitud: { start: null, end: null },
            fecha_termino: { start: null, end: null },
            filtrado_fecha: '',
            id: '',
            pagado: false,
            por_pagar: false,
            proyecto: '',
            solicito: '',
            tipo_trabajo: ''
        }
    }

    componentDidMount = () => {
        const { filters } = this.props
        const { form } = this.state
        Object.keys(filters).forEach((elemento) => {
            form[elemento] = filters[elemento]
        })
        this.setState({...this.state, form})
    }

    updateSelect = (value, name) => {
        this.onChange({ target: { value: value, name: name } })
    }
    
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }

    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form } = this.state
        form[name] = value
        if (type === 'checkbox'){
            switch(name){
                case 'pagado':
                    form.pagado = checked
                    form.por_pagar = false
                    form.estatus_pago = 'Pagado'
                    break;
                case 'por_pagar':
                    form.pagado = false
                    form.por_pagar = checked
                    form.estatus_pago = 'Por pagar'
                    break;
                case 'check_solicitud':
                    form.check_solicitud = checked
                    form.check_termino = false
                    form.fecha_termino = { start: null, end: null }
                    break;
                case 'check_termino':
                    form.check_termino = checked
                    form.check_solicitud = false
                    form.fecha_solicitud = { start: null, end: null }
                    break;
                default:
                    break;
            }
            if( form.pagado === false &&  form.por_pagar === false){
                form.estatus_pago = ''
            }
        }
        this.setState({...this.state, form})
        
    }

    onSubmit = e => {
        e.preventDefault();
        const { onSubmitFilters, onChangeFilter } = this.props
        const { form } = this.state
        Object.keys(form).forEach((elemento) => {
            onChangeFilter({target:{value:form[elemento], name: elemento}})
        })
        onSubmitFilters()
    }

    render() {
        const { clearFiltros, options } = this.props
        const { form } = this.state
        return (
            <Form onSubmit={this.onSubmit} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'proyecto' placeholder = 'PROYECTO' value = { form.proyecto } onChange = { this.onChange } 
                            iconclass='las la-folder icon-xl' />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'solicito' placeholder = '¿QUIÉN REALIZÓ EL TICKET?' value = { form.solicito }
                            onChange = { this.onChange } iconclass='las la-user icon-xl' />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el estatus' defaultvalue = { form.estatus } iconclass='las la-check-circle icon-xl'
                            options = { this.transformarOptions(options.estatus) } onChange={(value) => { this.updateSelect(value, 'estatus') }} />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el tipo de trabajo' defaultvalue = { form.tipo_trabajo } 
                            iconclass='las la-tools icon-xl' options = { this.transformarOptions(options.tiposTrabajo) } 
                            onChange={(value) => { this.updateSelect(value, 'tipo_trabajo') }} />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = "id" placeholder = "ID" value = { form.id } onChange = { this.onChange } 
                            iconclass='las la-id-card icon-xl' />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCIÓN' value = { form.descripcion }
                            onChange = { this.onChange } iconclass='las la-folder icon-xl' customclass="px-2"  />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <label className="col-form-label font-weight-bold text-dark-60">¿Qué estatus de pago deseas filtrar?</label>
                        <div className="checkbox-outline pt-2">
                            <label className="checkbox font-weight-light mr-5">
                                <input name = 'por_pagar' type = "checkbox" checked = { form.por_pagar } onChange = { this.onChange } /> POR PAGAR
                                <span></span>
                            </label>
                            <label className="checkbox font-weight-light">
                                <input name = 'pagado' type = "checkbox" checked = { form.pagado } onChange = { this.onChange } />PAGADO
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="col-form-label font-weight-bold text-dark-60">¿Qué fecha deseas filtrar?</label>
                        <div className="checkbox-outline pt-2">
                            <label className="checkbox font-weight-light mr-5">
                                <input name = 'check_solicitud' type = "checkbox" checked = { form.check_solicitud } onChange = { this.onChange } /> 
                                    Fecha de solicitud
                                <span></span>
                            </label>
                            <label className="checkbox font-weight-light">
                                <input name = 'check_termino' type = "checkbox" checked = { form.check_termino } onChange = { this.onChange } />
                                    Fecha de término
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                {
                    form.check_solicitud || form.check_termino ?
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12 text-center">
                                    <label className="col-form-label font-weight-bold text-dark-60">{`Periodo de ${form.check_solicitud ? 'fecha de solicitud' : 'fecha de termino'}`}</label><br />
                                    <RangeCalendar start={form.check_solicitud ? form.fecha_solicitud.start : form.fecha_termino.start} end={form.check_solicitud ? form.fecha_solicitud.end : form.fecha_termino.end}
                                        onChange={(value) => { this.onChange({ target: { name: `${form.check_solicitud ? 'fecha_solicitud' : 'fecha_termino'}`, value: { start: value.startDate, end: value.endDate } } }) }} />
                                </div>
                            </div>
                        </>
                        : <></>
                }
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR" onClick={clearFiltros} />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>
            </Form>
        )
    }
}

export default TickesFilter