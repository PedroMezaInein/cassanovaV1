import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'

class PresupuestoForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas: empresas } } = this.props

        const aux = empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
            }
        })
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
        })

    }


    render() {
        const { title, options, form, onChange, onSubmit, formeditado } = this.props
        return (
            <Form id="form-presupuesto"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-presupuesto')
                    }
                }
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.proyectos}
                            placeholder="SELECCIONA EL PROYECTO"
                            name="proyecto"
                            value={form.proyecto}
                            onChange={this.updateProyecto}
                            iconclass={"far fa-folder-open"}
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.areas}
                            placeholder="SELECCIONA EL ÁREA"
                            name="areas"
                            value={form.area}
                            onChange={this.updateArea}
                            iconclass={"far fa-window-maximize"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-4">
                        {
                            form.facturaObject ?
                                <Input
                                    placeholder="EMPRESA"
                                    name="empresa"
                                    readOnly
                                    value={form.empresa}
                                    onChange={onChange}
                                    iconclass={"far fa-building"}
                                />
                                :
                                <SelectSearch
                                    formeditado={formeditado}
                                    options={options.empresas}
                                    placeholder="SELECCIONA LA EMPRESA"
                                    name="empresas"
                                    value={form.empresa}
                                    onChange={this.updateEmpresa}
                                    iconclass={"far fa-building"}
                                />
                        }
                    </div>
                    <div className="col-md-4">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDate}
                            placeholder="FECHA"
                            name="fecha"
                            value={form.fecha}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-4">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            placeholder="TIEMPO DE EJECUCIÓN"
                            value={form.tiempo_ejecucion}
                            name="tiempo_ejecucion"
                            onChange={onChange}
                            iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                            messageinc="Incorrecto. Ingresa un tiempo de ejecución."
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                </div>
            </Form>
        )
    }
}

export default PresupuestoForm