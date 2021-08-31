import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, InputGray, ReactSelectSearchGray, RangeCalendar } from '../../form-components';

class TickesFilter extends Component {
    updateSelect = (value, name) => {
        const { onChangeFilter } = this.props
        onChangeFilter({ target: { value: value, name: name } })
    }
    
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    render() {
        const { filters, clearFiltros, onSubmitFilters, onChangeFilter, options } = this.props
        return (
            <Form onSubmit={onSubmitFilters} >
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'proyecto' placeholder = 'PROYECTO' value = { filters.proyecto }
                            onChange={onChangeFilter} iconclass='las la-folder icon-xl'
                        />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'solicito' placeholder = '¿QUIÉN REALIZÓ EL TICKET?' value = { filters.solicito }
                            onChange={onChangeFilter} iconclass='las la-user icon-xl'
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el estatus' defaultvalue = { filters.estatus } iconclass='las la-check-circle icon-xl'
                            options = { this.transformarOptions(options.estatus) } onChange={(value) => { this.updateSelect(value, 'estatus') }}
                        />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder = 'Selecciona el tipo de trabajo' defaultvalue = { filters.tipo_trabajo } iconclass='las la-tools icon-xl'
                            options = { this.transformarOptions(options.tiposTrabajo) } onChange={(value) => { this.updateSelect(value, 'tipo_trabajo') }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } requirevalidation = { 0 }
                            withformgroup = { 0 } name="id" placeholder="ID" value={filters.id} onChange={onChangeFilter} iconclass='las la-id-card icon-xl'
                        />
                    </div>
                    <div className="col-md-6">
                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 }
                            withformgroup = { 0 } name = 'descripcion' placeholder = 'DESCRIPCIÓN' value = { filters.descripcion }
                            onChange={onChangeFilter} iconclass='las la-folder icon-xl' customclass="px-2" 
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <label class="col-form-label font-weight-bold text-dark-60">¿Qué estatus de pago deseas filtrar?</label>
                        <div className="checkbox-outline pt-2">
                            <label className="checkbox font-weight-light mr-5">
                                <input
                                    name='por_pagar'
                                    type="checkbox"
                                    checked={filters.por_pagar}
                                    onChange={onChangeFilter}
                                /> POR PAGAR
                                <span></span>
                            </label>
                            <label className="checkbox font-weight-light">
                                <input
                                    name='pagado'
                                    type="checkbox"
                                    checked={filters.pagado}
                                    onChange={onChangeFilter}
                                />PAGADO
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label class="col-form-label font-weight-bold text-dark-60">¿Qué fecha deseas filtrar?</label>
                        <div className="checkbox-outline pt-2">
                            <label className="checkbox font-weight-light mr-5">
                                <input
                                    name='check_solicitud'
                                    type="checkbox"
                                    checked={filters.check_solicitud}
                                    onChange={onChangeFilter}
                                /> Fecha de solicitud
                                <span></span>
                            </label>
                            <label className="checkbox font-weight-light">
                                <input
                                    name='check_termino'
                                    type="checkbox"
                                    checked={filters.check_termino}
                                    onChange={onChangeFilter}
                                />Fecha de término
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                {
                    filters.check_solicitud || filters.check_termino ?
                        <>
                            <div className="separator separator-dashed mt-1 mb-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12 text-center">
                                    <label className="col-form-label font-weight-bold text-dark-60">{`Periodo de ${filters.check_solicitud ? 'fecha de solicitud' : 'fecha de termino'}`}</label><br />
                                    <RangeCalendar start={filters.check_solicitud ? filters.fecha_solicitud.start : filters.fecha_termino.start} end={filters.check_solicitud ? filters.fecha_solicitud.end : filters.fecha_termino.end}
                                        onChange={(value) => { onChangeFilter({ target: { name: `${filters.check_solicitud ? 'fecha_solicitud' : 'fecha_termino'}`, value: { start: value.startDate, end: value.endDate } } }) }} />
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