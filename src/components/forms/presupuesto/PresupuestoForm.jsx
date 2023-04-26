import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { InputGray, Button, SelectSearchGray, InputNumberGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableSinSmall } from '../../../functions/setters'
class PresupuestoForm extends Component {
    state = {
        showForm: false,
        partidas: [],
    }

    componentDidMount() { 
        this.filterPartidas()
    }

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
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
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
    getPartidaClave = tipo => {
        const { data } = this.props
        let clave = 0
        data.partidas.forEach((partida) => {
            partida.subpartidas.forEach((subpartida) => {
                subpartida.conceptos.forEach((concepto) => {
                    if(concepto.subpartida.partida.nombre === tipo){
                        clave = concepto.subpartida.partida.id
                    }
                })
            })
        })
        return clave
    }

    filterPartidas = () => { 
        const { options } = this.props
        let aux = []
        options.partidas.forEach((partida) => {
            if (partida.subpartidas.length > 0) {
                aux.push(partida)
            }    
        })
        this.setState({
            ...this.state,
            partidas: aux
        })
    }

    render() {
        const { options, form, onChange, onSubmit, formeditado, data, checkButton, showFormCalidad, showFormProyecto } = this.props
        const { showForm, partidas } = this.state
        // console.log(options)
        let options_conceptos  = {}
        // console.log(data.partidas)
        data.partidas.forEach((partida) => {
            if(partida.subpartidas){
                // console.log(partida.subpartidas)
                partida.subpartidas.forEach((subpartida) => {
                    subpartida.conceptos.forEach((concepto) => {
                        if (form.conceptos[concepto.clave]) {
                            let tipo = concepto.subpartida.partida.nombre
                            if (!options_conceptos[tipo]) {
                                options_conceptos[tipo] = []
                            }
                            options_conceptos[tipo].push(concepto)
                        }
                        return false
                    })
                })
            }
           
        })
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="flex-row-fluid">
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card card-custom card-stretch">
                                    <div className="card-header align-items-center flex-wrap py-4 border-0 h-auto">
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
                                                    <span className="text-dark font-weight-bold font-size-h4 mx-3">CONCEPTOS</span>
                                                </div>
                                            </div>
                                            <div className="card-toolbar">
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
                                    <div className="card card-custom card-stretch">
                                        <div className="card-header align-items-center flex-wrap py-4 border-0 h-auto">
                                            <div className="text-dark font-weight-bold font-size-h4 mr-3"> CONCEPTOS SELECCIONADOS</div>
                                            {
                                                (!showFormCalidad) && (!showFormProyecto) ?
                                                    <div className="card-toolbar">
                                                        <Button icon='' className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-light-primary text-primary font-weight-bolder font-size-13px"
                                                            onClick={() => { this.mostrarFormulario() }} only_icon="las la-clipboard-list icon-lg mr-3 px-0" type="button" text="LLENAR FORMULARIO" />
                                                    </div>
                                                    : !showForm ? this.mostrarFormulario() : ''
                                            }
                                        </div>
                                        <div className="card-body p-0">
                                            <Form id="form-presupuesto" className={`${!showForm ? 'd-none' : 'card-spacer pt-0'}`}
                                                onSubmit={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-presupuesto') } } >
                                                <div className="col-md-12">
                                                    <div className="form-group row form-group-marginless justify-content-center">
                                                        {
                                                            !showFormCalidad ?
                                                                <>
                                                                    {
                                                                        showFormProyecto ?'':
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
                                                                            <div className="col-md-12 separator separator-dashed mt-6 mb-2"></div>
                                                                        </>
                                                                    }
                                                                    <div className='col-md-6'>
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
                                                                :<></>
                                                        }
                                                        <div className='col-md-6'>
                                                            <InputNumberGray
                                                                withtaglabel={1}
                                                                withtextlabel={1}
                                                                withplaceholder={1}
                                                                withicon={1}
                                                                withformgroup={1}
                                                                iconvalid={1}
                                                                requirevalidation={1}
                                                                placeholder='TIEMPO DE EJECUCIÓN (DÍAS NATURALES)'
                                                                formeditado={formeditado}
                                                                name="tiempo_ejecucion"
                                                                value={form.tiempo_ejecucion}
                                                                onChange={onChange}
                                                                customdiv="mb-0 text-truncate"
                                                                iconclass='flaticon-calendar-with-a-clock-time-tools icon-xl'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer px-0 pt-4 pb-0">
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
                                                        Object.keys(options_conceptos).map((tipo, key1) => {
                                                            return (
                                                                <div key={key1} >
                                                                    {
                                                                        tipo !== '' ?
                                                                            <div className="bg-light text-primary font-size-lg font-weight-bolder border-0 card-spacer-x py-2">
                                                                                <b className="font-weight-boldest text-primary font-size-h6">
                                                                                    {this.getPartidaClave(tipo)}.{tipo}
                                                                                </b>
                                                                            </div>
                                                                            : <></>
                                                                    }
                                                                    <div>
                                                                        {
                                                                            options_conceptos[tipo].map((concepto, key2) => {
                                                                                return (
                                                                                    <div key={key2} className="d-flex align-items-start list-item card-spacer-x pt-4 pb-5" data-inbox="message">
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
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
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