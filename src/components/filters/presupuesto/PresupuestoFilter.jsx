import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, InputGray, InputNumberGray, ReactSelectSearchGray, RangeCalendar } from '../../form-components';

class PresupuestoFilter extends Component {
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
                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                            withformgroup={0} name='proyecto' placeholder='PROYECTO' value={filters.proyecto}
                            onChange={onChangeFilter} iconclass='las la-folder icon-xl'
                        />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder='Selecciona la empresa' defaultvalue={filters.empresa} iconclass='las la-building icon-xl'
                            options={this.transformarOptions(options.empresas)} onChange={(value) => { this.updateSelect(value, 'empresa') }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder='Selecciona el área' defaultvalue={filters.area} iconclass='las la-boxes icon-xl'
                            options={this.transformarOptions(options.areas)} onChange={(value) => { this.updateSelect(value, 'area') }}
                        />
                    </div>
                    <div className="col-md-6">
                        <ReactSelectSearchGray placeholder='Selecciona el estatus' defaultvalue={filters.estatus} iconclass='las la-check-circle icon-xl'
                            options={this.transformarOptions(options.estatus)} onChange={(value) => { this.updateSelect(value, 'estatus') }}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={0}
                            withformgroup={0} name='tiempo_ejecucion' placeholder='TIEMPO DE EJECUCIÓN (DÍAS NATURALES)' value={filters.tiempo_ejecucion}
                            onChange={onChangeFilter} iconclass="flaticon-calendar-with-a-clock-time-tools"
                        />
                    </div>
                    {/* <div className="col-md-6">
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
                    </div> */}
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12 text-center">
                        <label className="col-form-label font-weight-bold text-dark-60">Fecha del presuesto</label><br />
                        <RangeCalendar start={filters.fecha.start} end={filters.fecha.end}
                            onChange={(value) => { onChangeFilter({ target: { name: 'fecha', value: { start: value.startDate, end: value.endDate } } }) }} />
                    </div>
                </div>
                <div className="mx-0 row justify-content-between border-top pt-4">
                    <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type='button' text="LIMPIAR" onClick={clearFiltros} />
                    <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type='submit' text="FILTRAR" />
                </div>

            </Form>

        )
    }
}

export default PresupuestoFilter