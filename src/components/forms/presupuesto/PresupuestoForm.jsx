import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar, SelectSearchSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'
import { setMoneyTableSinSmall } from '../../../functions/setters'
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
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateArea = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'area' } })
    }

    updatePartida = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'partida' } })
        onChange({ target: { value: '', name: 'subpartida' } })

        const { options: { partidas } } = this.props
        partidas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subpartidas', element.subpartidas)
            }
            return false
        })
    }

    updateSubpartida = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'subpartida' } })
    }

    mostrarFormulario() {
        var element = document.getElementById("form-presupuesto");
        if (element.style.display === "none") {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }

    onChange = e => {
        const { checked } = e.target
        const { data, checkButton } = this.props

        data.subpartidas.map((subpartida) => {
            subpartida.conceptos.map((concepto) => {
                checkButton({ target: { name: concepto.clave, value: checked, checked: checked } })
                return false
            })
            return false
        })
    }

    disableButton = () => {
        const { form } = this.props
        if (form.partida)
            return false
        else
            return true
    }

    checkGroupButton = () => {
        const { form, data } = this.props
        if (!form.partida)
            return false

        let aux = true
        data.subpartidas.map((subpartida) => {
            subpartida.conceptos.map((concepto) => {
                aux = aux && form.conceptos[concepto.clave]
                return false
            })
            return false
        })
        return aux
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, data, checkButton } = this.props
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="flex-row-fluid ml-lg-8">
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card card-custom card-stretch" id="kt_todo_list">
                                        <div className="card-header align-items-center flex-wrap py-4 border-0 h-auto">
                                            <div className="d-flex flex-wrap align-items-center">
                                                <div className="d-flex align-items-center mx-3 my-2">
                                                    <label data-inbox="group-select" className="checkbox checkbox-single checkbox-primary mr-3">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => { this.onChange(e) }}
                                                            checked={this.checkGroupButton()}
                                                            value={this.checkGroupButton()}
                                                            disabled={this.disableButton()} />
                                                        <span className="symbol-label"></span>
                                                    </label>
                                                    <div className="d-flex flex-column mr-2 py-2">
                                                        <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mx-3">CONCEPTOS</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column mr-2 py-2 d-flex justify-content-end ">
                                                <SelectSearchSinText
                                                    formeditado={formeditado}
                                                    options={options.partidas}
                                                    placeholder="SELECCIONA LA PARTIDA"
                                                    name="partida"
                                                    value={form.partida}
                                                    onChange={this.updatePartida}
                                                    customstyle={{ width: "250px" }}
                                                />
                                            </div>
                                        </div>
                                        {
                                            form.partida ?
                                                <div className="card-body p-0">
                                                    <div className="table-responsive">
                                                        <div className="list min-w-500px" data-inbox="list">
                                                            <div className="d-flex align-items-start list-item card-spacer-x  pb-3" data-inbox="message">
                                                                <div className="d-flex align-items-center col-1">
                                                                </div>
                                                                <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                                    <div className="font-weight-bold font-size-lg text-center">CLAVE</div>
                                                                </div>
                                                                <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                    <div className="font-weight-bold font-size-lg text-center"> DESCRIPCIÓN</div>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                    <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">UNIDAD</div>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                    <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">COSTO</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="list list-hover min-w-500px" data-inbox="list">
                                                            {
                                                                data.subpartidas.map((subpartida, key) => {
                                                                    return (
                                                                        <div key={key}>
                                                                            <div className="d-flex align-items-center bg-primary-o-20">
                                                                                <div className="ml-4 font-weight-bolder text-primary font-size-lg mb-1 py-2">{subpartida.nombre}</div>
                                                                            </div>
                                                                            {
                                                                                subpartida.conceptos.map((concepto, key) => {
                                                                                    return (
                                                                                        <div key={key} className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5 rounded-0" data-inbox="message">
                                                                                            <div className="d-flex align-items-center col-1">
                                                                                                <div className="d-flex align-items-center" data-inbox="actions">
                                                                                                    <label className="checkbox checkbox-single checkbox-primary flex-shrink-0">
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            onChange={(e) => { checkButton(e) }}
                                                                                                            name={concepto.clave}
                                                                                                            checked={form.conceptos[concepto.clave]}
                                                                                                            value={form.conceptos[concepto.clave]}
                                                                                                        />
                                                                                                        <span></span>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                                                                <div className="font-size-xs font-weight-bold">
                                                                                                    {concepto.clave}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                                                <div className="font-size-xs text-justify font-weight-bold">
                                                                                                    {concepto.descripcion}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                                                <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                                                    {concepto.unidad.nombre}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                                                <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                                                    {setMoneyTableSinSmall(concepto.costo)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                    </div>
                                </div>
                                <div className="col-xl-6 pt-4 pt-xl-0">
                                    <div className="card card-custom card-stretch" id="kt_todo_view">
                                        <div className="card-body p-0">
                                            <div
                                                className="d-flex align-items-center justify-content-between flex-wrap card-spacer-x py-3">
                                                <div className="d-flex flex-column mr-2 py-2">
                                                    <span className="text-dark text-hover-primary font-weight-bold font-size-h4 mr-3"> CONCEPTOS SELECCIONADOS</span>
                                                </div>
                                                <div className="d-flex py-2">
                                                    <Button
                                                        type="button"
                                                        className="btn btn-light-primary font-weight-bold mr-2"
                                                        onClick={() => { this.mostrarFormulario() }}
                                                        tooltip={{ text: 'Mostrar formulario' }}
                                                        text={"SIGUIENTE"}
                                                        icon=''
                                                    />
                                                </div>
                                                <Form id="form-presupuesto"
                                                    onSubmit={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'form-presupuesto')
                                                        }
                                                    }
                                                >
                                                    <div className="col-md-12">
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
                                                                    messageinc="Incorrecto. Selecciona el proyecto"
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
                                                                    messageinc="Incorrecto. Selecciona el área"
                                                                />
                                                            </div>
                                                            <div className="col-md-12 separator separator-dashed mt-4 mb-2"></div>
                                                            <div className="col-md-6">
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
                                                                            messageinc="Incorrecto. Selecciona la empresa"
                                                                        />
                                                                }
                                                            </div>
                                                            <div className="col-md-6">
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
                                                            <div className="col-md-12 separator separator-dashed mt-4 mb-2"></div>
                                                            <div className="col-md-6">
                                                                <Calendar
                                                                    formeditado={formeditado}
                                                                    onChangeCalendar={this.handleChangeDate}
                                                                    placeholder="FECHA"
                                                                    name="fecha"
                                                                    value={form.fecha}
                                                                    patterns={DATE}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer py-3 pr-1">
                                                        <div className="row mx-0">
                                                            <div className="col-lg-12 text-right pr-0 pb-0">
                                                                <Button icon=''
                                                                    onClick={
                                                                        (e) => {
                                                                            e.preventDefault();
                                                                            validateAlert(onSubmit, e, 'form-presupuesto')
                                                                        }
                                                                    }
                                                                    className="btn btn-primary mr-2" text='ENVIAR Y CONTINUAR'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="table-responsive">
                                                {
                                                    form.partida ?
                                                        <div className="list min-w-500px" data-inbox="list">
                                                            <div className="d-flex align-items-start list-item card-spacer-x pt-4" data-inbox="message">
                                                                <div className="d-flex align-items-center col-1">
                                                                </div>
                                                                <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                                    <div className="font-weight-bold font-size-lg text-center">CLAVE</div>
                                                                </div>
                                                                <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                    <div className="font-weight-bold font-size-lg text-center"> DESCRIPCIÓN</div>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                    <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">UNIDAD</div>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                    <div className="font-weight-bolder font-size-lg text-center" data-toggle="view">COSTO</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : ''
                                                }
                                                <div className="list list-hover min-w-500px" data-inbox="list">
                                                    {
                                                        data.partidas.map((partida, key1) => {
                                                            return (
                                                                partida.subpartidas.map((subpartida, key2) => {
                                                                    return (
                                                                        subpartida.conceptos.map((concepto, key3) => {
                                                                            if (form.conceptos[concepto.clave]) {
                                                                                return (
                                                                                    <div key={concepto.clave} className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5" data-inbox="message">
                                                                                        <div className="d-flex align-items-center col-1">
                                                                                            <div className="d-flex align-items-center" data-inbox="actions">
                                                                                                <label className="checkbox checkbox-single checkbox-danger flex-shrink-0 mr-3">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        onChange={(e) => { checkButton(e) }}
                                                                                                        name={concepto.clave}
                                                                                                        checked={form.conceptos[concepto.clave]}
                                                                                                        value={form.conceptos[concepto.clave]}
                                                                                                    />
                                                                                                    <span></span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex-grow-1 col-1 pl-0" data-toggle="view">
                                                                                            <div className="font-size-xs font-weight-bold">
                                                                                                {concepto.clave}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                                            <div className="font-size-xs text-justify font-weight-bold">
                                                                                                {concepto.descripcion}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                                            <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                                                {concepto.unidad.nombre}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                                            <div className="font-size-xs font-weight-bold" data-toggle="view">
                                                                                                {setMoneyTableSinSmall(concepto.costo)}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            return false
                                                                        })
                                                                    )
                                                                })
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PresupuestoForm