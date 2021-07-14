import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, Button, CalendarDay, SelectSearchGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableSinSmall } from '../../../functions/setters'
class PresupuestoForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
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
    getPartida = (key, conceptos) => {
        if(key === 0)
            return true
        if(conceptos[key].subpartida.partida.id !== conceptos[key-1].subpartida.partida.id)
            return true
        return false
    }
    getSubpartida = (key, conceptos) => {
        if(key === 0)
            return true
        if(conceptos[key].subpartida.id !== conceptos[key-1].subpartida.id)
            return true
        return false
    }
    getPartidaClave = clave => {
        let aux = clave.split('.')
        if(aux.length)
            return aux[0]
    }
    getSubpartidaClave = clave => {
        let aux = clave.split('.')
        if(aux.length)
            return aux[1]
    }
    render() {
        const { options, form, onChange, onSubmit, formeditado, data, checkButton, showFormCalidad } = this.props
        // console.log(data, 'data')
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="flex-row-fluid">
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
                                                <SelectSearchGray
                                                    formeditado={formeditado}
                                                    options={options.partidas}
                                                    placeholder="SELECCIONA LA PARTIDA"
                                                    name="partida"
                                                    value={form.partida}
                                                    onChange={this.updatePartida}
                                                    customstyle={{ width: "250px" }}
                                                    withtaglabel={0}
                                                    withtextlabel={0}
                                                    withicon={1}
                                                    customclass="form-control-sm"
                                                    customdiv="mb-0"
                                                    iconvalid={1}
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
                                                                <div className="flex-grow-1 col-1 pl-0 white-space-nowrap" data-toggle="view">
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
                                                                            <div className="d-flex align-items-center bg-light">
                                                                                <div className="ml-6 font-weight-bolder text-primary font-size-lg py-2">{subpartida.nombre}</div>
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
                                                                                            <div className="flex-grow-1 col-1 pl-0 white-space-nowrap" data-toggle="view">
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
                                                        icon=''
                                                        className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-light-primary text-primary font-weight-bolder font-size-13px"
                                                        onClick={() => { this.mostrarFormulario() }}
                                                        only_icon = "las la-clipboard-list icon-lg mr-3 px-0"
                                                        type="button"
                                                        text="LLENAR FORMULARIO"
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
                                                        <div className="form-group row form-group-marginless pt-4 justify-content-center">
                                                            {
                                                                !showFormCalidad?
                                                                <>
                                                                    <div className="col-md-6">
                                                                        <SelectSearchGray
                                                                            formeditado={formeditado}
                                                                            options={options.proyectos}
                                                                            placeholder="SELECCIONA EL PROYECTO"
                                                                            name="proyecto"
                                                                            value={form.proyecto}
                                                                            onChange={this.updateProyecto}
                                                                            iconclass="las la-swatchbook icon-2x"
                                                                            customdiv="mb-0"
                                                                            iconvalid={1}
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withicon={1}
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        {
                                                                            form.facturaObject ?
                                                                                <InputGray
                                                                                    placeholder="EMPRESA"
                                                                                    name="empresa"
                                                                                    readOnly
                                                                                    value={form.empresa}
                                                                                    onChange={onChange}
                                                                                    iconclass="las la-building icon-xl"
                                                                                    withtaglabel={1}
                                                                                    withtextlabel={1}
                                                                                    withplaceholder={1}
                                                                                    withicon={1}
                                                                                    withformgroup={1}
                                                                                    requirevalidation={1}
                                                                                />
                                                                                :
                                                                                <SelectSearchGray
                                                                                    formeditado={formeditado}
                                                                                    options={options.empresas}
                                                                                    placeholder="SELECCIONA LA EMPRESA"
                                                                                    name="empresas"
                                                                                    value={form.empresa}
                                                                                    onChange={this.updateEmpresa}
                                                                                    iconclass="las la-building icon-xl"
                                                                                    customdiv="mb-0"
                                                                                    iconvalid={1}
                                                                                    withtaglabel={1}
                                                                                    withtextlabel={1}
                                                                                    withicon={1}
                                                                                />
                                                                        }
                                                                    </div>
                                                                    <div className="col-md-12 separator separator-dashed mt-4 mb-2"></div>
                                                                    <div className="col-md-6">
                                                                        <SelectSearchGray
                                                                            formeditado={formeditado}
                                                                            options={options.areas}
                                                                            placeholder="SELECCIONA EL ÁREA"
                                                                            name="areas"
                                                                            value={form.area}
                                                                            onChange={this.updateArea}
                                                                            iconclass="las la-toolbox icon-xl"
                                                                            customdiv="mb-0"
                                                                            iconvalid={1}
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withicon={1}
                                                                        />
                                                                    </div>
                                                                </>
                                                                :''
                                                            }
                                                            <div className="col-md-6">
                                                                <InputGray
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    placeholder="TIEMPO DE EJECUCIÓN"
                                                                    value={form.tiempo_ejecucion}
                                                                    name="tiempo_ejecucion"
                                                                    onChange={onChange}
                                                                    iconclass={"flaticon-calendar-with-a-clock-time-tools"}
                                                                    customdiv="mb-0"
                                                                    iconvalid={1}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withicon={1}
                                                                />
                                                            </div>
                                                            <div className="col-md-12 separator separator-dashed mt-4 mb-2"></div>
                                                            <div className="col-md-12 text-center align-self-center mt-5">
                                                                <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                                    <label className="text-center font-weight-bolder">Fecha del presupuesto</label>
                                                                </div>
                                                                <CalendarDay
                                                                    value={form.fecha}
                                                                    date={form.fecha}
                                                                    onChange={onChange}
                                                                    name='fecha'
                                                                    withformgroup={0}
                                                                    requirevalidation={1}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer px-0 pt-4">
                                                        <div className="col-lg-12 text-right px-0">
                                                            <Button icon=''
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        validateAlert(onSubmit, e, 'form-presupuesto')
                                                                    }
                                                                }
                                                                className="btn btn-sm btn-light-primary font-weight-bolder btn-hover-bg-light text-hover-primary font-size-13px"
                                                                text='ENVIAR Y CONTINUAR'
                                                                only_icon="las la-arrow-right icon-lg mr-2 px-0"
                                                            />
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="table-responsive">
                                                {
                                                    form.partida ?
                                                        <div className="list min-w-500px mb-2" data-inbox="list">
                                                            <div className="d-flex align-items-start list-item card-spacer-x pt-4" data-inbox="message">
                                                                <div className="d-flex align-items-center col-1">
                                                                </div>
                                                                <div className="flex-grow-1 col-1 pl-0 white-space-nowrap" data-toggle="view">
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
                                                                                    <React.Fragment key={key3}>
                                                                                    {
                                                                                        this.getPartida(key3, subpartida.conceptos)?
                                                                                        <div className="bg-light text-primary font-size-lg font-weight-bolder border-0 card-spacer-x py-2">
                                                                                            <b className="font-weight-boldest text-primary font-size-h6">
                                                                                            {
                                                                                                this.getPartidaClave(concepto.clave)
                                                                                            }.
                                                                                            </b>
                                                                                            &nbsp;&nbsp; 
                                                                                                {
                                                                                                    concepto ? 
                                                                                                        concepto.subpartida ?
                                                                                                            concepto.subpartida.partida ?
                                                                                                                concepto.subpartida.partida.nombre
                                                                                                            : ''
                                                                                                        : ''
                                                                                                    : ''
                                                                                                }
                                                                                        </div>
                                                                                        :''
                                                                                    }
                                                                                    {/* {
                                                                                        this.getSubpartida(key3, subpartida.conceptos )?
                                                                                        <div className="font-size-lg font-weight-bolder">
                                                                                                <b  className="font-size-h6 label label-light-primary label-pill label-inline mr-2 font-weight-bolder label-rounded">
                                                                                                {
                                                                                                    this.getPartidaClave(concepto.clave)
                                                                                                }
                                                                                                .
                                                                                                {
                                                                                                    this.getSubpartidaClave(concepto.clave)
                                                                                                }
                                                                                                </b>
                                                                                                &nbsp;
                                                                                                {
                                                                                                    concepto ? 
                                                                                                        concepto.subpartida ?
                                                                                                            concepto.subpartida.nombre
                                                                                                        : ''
                                                                                                    : ''
                                                                                                }
                                                                                        </div>
                                                                                    :
                                                                                        ''
                                                                                    } */}
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
                                                                                        <div className="flex-grow-1 col-1 pl-0 white-space-nowrap" data-toggle="view">
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
                                                                                    </React.Fragment>
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