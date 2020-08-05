import React, { Component } from 'react'
import { Form, Accordion, Card } from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar, ToggleButton, SelectSearchSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'
import ReactTooltip from "react-tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { setMoneyTable } from '../../../functions/setters'

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

        const { options: { partidas: partidas } } = this.props
        const aux = partidas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subpartidas', element.subpartidas)
            }
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
        const { value } = e.target
        const { form, data, checkButton } = this.props
        data.subpartidas.map( (subpartida) => {
            subpartida.conceptos.map( (concepto) => {
                checkButton({ target: { name: concepto.clave, value: value, checked: value } })
            })
        })
    }

    disableButton = () => {
        const { form } = this.props
        if(form.partida)
            return false
        else
            return true
    }

    checkGroupButton = () => {
        const { form, data } = this.props
        if(!form.partida)
            return false

        let aux = true
        data.subpartidas.map( (subpartida) => {
            subpartida.conceptos.map( (concepto) => {
                aux = aux && form.conceptos[concepto.clave]
            })
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
                                                            onChange = { (e) => { this.onChange(e) }}
                                                            checked = { this.checkGroupButton() }
                                                            value = { this.checkGroupButton() } 
                                                            disabled = { this.disableButton() } />
                                                        <span className="symbol-label"></span>
                                                    </label>
                                                    <div className="d-flex flex-column mr-2 py-2">
                                                        <a className="text-dark text-hover-primary font-weight-bold font-size-h4 mx-3">CONCEPTOS</a>
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
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <div className="list list-hover min-w-500px" data-inbox="list">
                                                    {
                                                        data.subpartidas.map((subpartida, key) => {
                                                            return (
                                                                <>
                                                                    <div key={key} className="d-flex align-items-center bg-light-primary">
                                                                        <div className="ml-4 font-weight-bold text-primary font-size-lg mb-1 py-2">{subpartida.nombre}</div>
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
                                                                                        <div className="font-weight-bold font-size-sm">{concepto.clave}</div>
                                                                                    </div>
                                                                                    <div className="flex-grow-1 col-6 p-0" data-toggle="view">
                                                                                        <div className="font-weight-bold font-size-sm text-justify">
                                                                                            {
                                                                                                concepto.descripcion
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center justify-content-center flex-wrap col-2 pr-0" data-toggle="view">
                                                                                        <div className="font-weight-bolder position-absolute font-size-sm" data-toggle="view">UNIDAD</div>
                                                                                        <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }} >hola</span>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center justify-content-center flex-wrap col-2 p-0" data-toggle="view">
                                                                                        <div className="font-weight-bolder position-absolute font-size-sm" data-toggle="view">COSTO</div>
                                                                                        <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }}>
                                                                                            {
                                                                                                setMoneyTable(concepto.costo)
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 pt-4 pt-xl-0">
                                    <div className="card card-custom card-stretch" id="kt_todo_view">
                                        <div className="card-body p-0">
                                            <div
                                                className="d-flex align-items-center justify-content-between flex-wrap card-spacer-x py-3">
                                                <div className="d-flex flex-column mr-2 py-2">
                                                    <a className="text-dark text-hover-primary font-weight-bold font-size-h4 mr-3"> CONCEPTOS SELECCIONADOS</a>
                                                </div>
                                                <div className="d-flex py-2">
                                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Formulario</Tooltip>}>
                                                        <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={() => { this.mostrarFormulario() }}>Siguiente</button>
                                                    </OverlayTrigger>
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
                                                    <div className="d-flex justify-content-center my-3">
                                                        <Button icon='' type="submit" className="text-center mx-auto" text='Enviar' />
                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="table-responsive">
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
                                                                                            <div className="d-flex align-items-center mr-3" data-inbox="actions">
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
                                                                                        <div className="flex-grow-1 mt-1 mr-2 col-2" data-toggle="view">
                                                                                            <div className="font-weight-bold mr-2">{concepto.clave}</div>
                                                                                        </div>
                                                                                        <div className="flex-grow-1 mt-1 mr-2 col-5" data-toggle="view">
                                                                                            <div className="font-weight-bold mr-2 font-size-sm text-justify">
                                                                                                {
                                                                                                    concepto.descripcion
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center justify-content-center flex-wrap col-2" data-toggle="view">
                                                                                            <div className="font-weight-bolder position-absolute" data-toggle="view">UNIDAD</div>
                                                                                            <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }} >hola</span>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center justify-content-center flex-wrap col-2" data-toggle="view">
                                                                                            <div className="font-weight-bolder position-absolute" data-toggle="view">COSTO</div>
                                                                                            <span className="label label-light-primary  label-inline position-relative" style={{ top: "22px" }}>
                                                                                                {
                                                                                                    setMoneyTable(concepto.costo)
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
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