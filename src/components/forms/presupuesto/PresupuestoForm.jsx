import React, { Component } from 'react'
import { Form, Accordion, Card } from 'react-bootstrap'
import { Input, SelectSearch, Button, Calendar, ToggleButton, SelectSearchSinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'
import ReactTooltip from "react-tooltip";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

class PresupuestoForm extends Component {

    state = {
        data: {
            partidas: []
        },
        options: {
            partidas: [],
            subpartidas: []
        }
    }

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

    render() {
        const { options, form, onChange, onSubmit, formeditado } = this.props
        const { data } = this.state
        console.log(data.partidas = options.partidas)
        console.log(data.partidas)
        return (

            <div className="row">
                <div className="col-lg-12">
                    <div className="flex-row-fluid ml-lg-8">
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="card card-custom gutter-b">
                                <div className="table-responsive-md card-body d-flex align-items-center justify-content-between flex-wrap py-3">
                                    <div className="d-flex align-items-center mr-2 py-2">
                                        <h4 className="font-weight-bold mb-0 mr-5">PARTIDAS Y SUB-PARTIDAS</h4>
                                    </div>
                                    <div className="d-flex">
                                        <div className="navi navi-hover navi-active navi-link-rounded navi-bold d-flex flex-row">
                                            <div className="navi-item">
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
                                            <div className="navi-item mx-2">
                                                {
                                                    form.partida ?
                                                        <SelectSearchSinText
                                                            formeditado={formeditado}
                                                            options={options.subpartidas}
                                                            placeholder="SELECCIONA LA SUBPARTIDA"
                                                            name="subpartida"
                                                            value={form.subpartida}
                                                            onChange={this.updateSubpartida}
                                                            customstyle={{ width: "250px" }}
                                                        />
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card card-custom card-stretch" id="kt_todo_list">
                                        <div
                                            className="card-header align-items-center flex-wrap py-4 border-0 h-auto">
                                            <div className="d-flex flex-wrap align-items-center">
                                                <div className="d-flex align-items-center mr-1 my-2">
                                                    <label data-inbox="group-select"
                                                        className="checkbox checkbox-single checkbox-primary mr-3">
                                                        <input type="checkbox" />
                                                        <span className="symbol-label"></span>
                                                    </label>
                                                    <div className="d-flex flex-column mr-2 py-2">
                                                        <a
                                                            className="text-dark text-hover-primary font-weight-bold font-size-h4 mx-3">CONCEPTOS</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <div className="list list-hover min-w-500px" data-inbox="list">
                                                    <div className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5" data-inbox="message">
                                                        <div className="d-flex align-items-center">
                                                            <div className="d-flex align-items-center mr-3" data-inbox="actions">
                                                                <label className="checkbox checkbox-single checkbox-primary flex-shrink-0 mr-3">
                                                                    <input type="checkbox" />
                                                                    <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 mt-1 mr-2" data-toggle="view">
                                                            <div className="font-weight-bold mr-2">25.1.20</div>
                                                        </div>
                                                        <div className="flex-grow-1 mt-1 mr-2" data-toggle="view">
                                                            <div className="font-weight-bold mr-2 font-size-sm text-justify">
                                                                SUMINISTRO Y COLOCACIÓN DE MURO DE 12 CM DE
                                                                ESPESOR A DOS CARAS, A BASE DE TABLAROCA
                                                                TIPO RH AL FUEGO MARCA USG DE 15.9 MM DE
                                                                ESPESOR, BASTIDOR ARMADO A BASE CANALES Y
                                                                POSTES DE LÁMINA GALVANIZADA CAL. 26 DE 7.5
                                                                CM. DE ANCHO COLOCADOS A CADA 60 CM DE
                                                                SEPARACIÓN. INCLUYE MATERIALES, ACARREOS,
                                                                ELEVACIONES, CORTES, DESPERDICIOS, FIJACIÓN,
                                                                MANO DE OBRA, EQUIPO Y HERRAMIENTA.
                                                                </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center flex-wrap" data-toggle="view">
                                                            <div className="font-weight-bolder" data-toggle="view">UNIDAD</div>
                                                            <span className="label label-light-primary  label-inline mr-2">EQUIPO</span>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center flex-wrap" data-toggle="view">
                                                            <div className="font-weight-bolder" data-toggle="view">COSTO</div>
                                                            <span className="label label-light-primary  label-inline mr-2">$10,8225.00</span>
                                                        </div>
                                                    </div>
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
                                                    <button className="btn btn-default btn-sm btn-icon" data-dismiss="modal" onClick={() => { this.mostrarFormulario() }}>
                                                        <i className="ki ki-bold-more-hor font-size-md"></i>
                                                    </button>
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