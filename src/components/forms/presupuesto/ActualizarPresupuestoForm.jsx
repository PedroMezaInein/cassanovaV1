import React, { Component } from 'react'
import { Form, Card } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas, dayDMY } from '../../../functions/setters'
class ActualizarPresupuestoForm extends Component {

    state = {
        desperdicio: 0
    }

    getTotalImport = () => {
        const { form } = this.props
        let aux = parseFloat(0);
        form.conceptos.forEach( (concepto) => {
            if(concepto.active)
                aux = aux + parseFloat(concepto.importe)
        })
        return aux.toFixed(2)
    }

    onChangeMensaje = ( e, key ) => {
        const { value } = e.target
        const { onChange } = this.props
        let aux = {
            active: true,
            mensaje: value
        }
        onChange(key, {target:{value: aux}}, 'mensajes')
    }

    onChangeDesperdicio = e =>{
        const { value } = e.target
        const { form, onChange } = this.props
        if(value)
            form.conceptos.forEach( (concepto, key) => {
                if(concepto.active)
                    if(!(concepto.unidad === 'VIAJE' || concepto.unidad === 'SAL' || concepto.unidad === 'PZA' || concepto.unidad === 'LOTE'
                        || concepto.unidad === 'JGO' || concepto.unidad === 'EQUIPO' || concepto.unidad === 'BULTO')){
                        onChange(key, e, 'desperdicio')
                    }
            })
        this.setState({
            ...this.state,
            desperdicio: value
        })
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

    getPartida = key => {
        const { presupuesto } = this.props
        if(key === 0)
            return true
        if(presupuesto.conceptos[key].concepto.subpartida.partida.id !== presupuesto.conceptos[key-1].concepto.subpartida.partida.id)
            return true
        return false
    }
    getSubpartida = key => {
        const { presupuesto } = this.props
        if(key === 0)
            return true
        if(presupuesto.conceptos[key].concepto.subpartida.id !== presupuesto.conceptos[key-1].concepto.subpartida.id)
            return true
        return false
    }

    getIdentificador = () => {
        const { presupuesto } = this.props
        let identificador = 100
        presupuesto.pdfs.forEach( (pdf, key) => {
            if( pdf.pivot.identificador >  identificador)
                identificador = pdf.pivot.identificador
        })
        identificador++
        return identificador.toString()
    }

    render() {
        const { onChange, formeditado, checkButton, form, presupuesto, openModal, onSubmit, showInputsCalidad, children } = this.props
        const { desperdicio } = this.state
        if (presupuesto)
            return (
                <>
                    < Card className="card-custom" >
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <div className="list min-w-1000px">
                                    <div className="px-9 py-6">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="text-dark font-size-h4 font-weight-bold">
                                                    {presupuesto.proyecto.nombre}
                                                </div>
                                                <div>
                                                    {
                                                        presupuesto.empresa ?
                                                            presupuesto.empresa.isotipos ?
                                                                presupuesto.empresa.isotipos.length > 0 ?
                                                                    presupuesto.empresa.isotipos.map((isotipo, key) => {
                                                                        return (
                                                                            <img alt="Pic" src={isotipo.url} style={{ height: '55px' }} key={key} />
                                                                        )
                                                                    })
                                                                    : ''
                                                                : ''
                                                            : ''
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div className="d-flex flex-wrap justify-content-center">
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4 mr-5">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <i className="las la-toolbox icon-2x text-primary"></i>
                                                                </div>
                                                            </div>
                                                            <div className="font-size-h5 font-weight-bold">
                                                                {presupuesto.area.nombre}
                                                                <div className="font-weight-normal font-size-lg text-muted">ÁREA</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4 mr-5">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <i className="flaticon-calendar-with-a-clock-time-tools icon-xl text-info"></i>
                                                                </div>
                                                            </div>
                                                            <div className="font-size-h5 font-weight-bold">
                                                                {presupuesto.tiempo_ejecucion}
                                                                <div className="font-weight-normal font-size-lg text-muted">Tiempo de ejecución</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4 mr-5">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <i className="flaticon2-calendar-8 icon-xl text-primary"></i>
                                                                </div>
                                                            </div>
                                                            <div className="font-size-h5 font-weight-bold">
                                                                {dayDMY(presupuesto.fecha)}
                                                                <div className="font-weight-normal font-size-lg text-muted">Fecha</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <i className="las la-file-invoice-dollar icon-2x text-info"></i>
                                                                </div>
                                                            </div>
                                                            <div className="font-size-h5 font-weight-bold">
                                                                No. {this.getIdentificador()}
                                                                <div className="font-weight-normal font-size-lg text-muted">Presupuesto</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mt-4 card-custom">
                        <Card.Header>
                            <div className="card-title">
                                <h3 className="card-label">Presupuesto Preliminar</h3>
                            </div>
                            <div className="card-toolbar" >
                                {children}
                                <button type="button" className="btn btn-sm btn-light-info font-weight-bolder font-size-13px" onClick={openModal}>
                                    AGREGAR CONCEPTO
                                </button>
                            </div>                    
                        </Card.Header>
                        <Card.Body className="pt-2">
                            <Form id="form-presupuesto"
                                    onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-presupuesto')
                                        }
                                    }
                                >
                                <table className="table table-separate table-responsive-sm">
                                    <thead>
                                        <tr>
                                            <th className="check_desc border-0">
                                                <div className="font-size-sm text-center"></div>
                                            </th>
                                            <th className="clave border-0 center_content">
                                                <div className="font-size-sm text-center">Clave</div>
                                            </th>
                                            <th className="descripcion border-0 center_content">
                                                <div className="font-size-sm text-center">Descripción</div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Unidad</div>
                                            </th>
                                            {
                                                !showInputsCalidad &&
                                                <th className="border-0 center_content">
                                                    <div className="font-size-sm text-center">Costo</div>
                                                </th>
                                            }
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Cantidad Preliminar</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center white-space-nowrap">% Despercicio</div>
                                                <div className="d-flex justify-content-center">
                                                    <InputNumberSinText identificador = "desperdicio-global" requirevalidation = { 0 } formeditado = { 1 }
                                                        name = " desperdicio " value = { desperdicio } onChange = { this.onChangeDesperdicio }
                                                        thousandseparator = { true } prefix = '%' customstyle = { {borderColor: "#e5eaee"} } />
                                                </div>
                                            </th>
                                            <th className="border-0 center_content"> <div className="font-size-sm text-center">Cantidad</div> </th>
                                            {
                                                !showInputsCalidad &&
                                                    <th className="border-0 center_content">
                                                        <div className="font-size-sm text-center">Importe</div>
                                                        <div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm text-center">
                                                            { setMoneyTableForNominas(this.getTotalImport()) }
                                                        </div>
                                                    </th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            presupuesto.conceptos.map((concepto, key) => {
                                                return (
                                                    <>
                                                        {
                                                            this.getPartida(key) ?
                                                                <tr>
                                                                    <td colSpan={9} className="bg-light text-primary font-size-lg font-weight-bolder border-0 ">
                                                                        <b className="font-weight-boldest text-primary font-size-h6 ml-2">
                                                                            { this.getPartidaClave(concepto.concepto.clave) }.
                                                                        </b>
                                                                        &nbsp;&nbsp; 
                                                                        {
                                                                            concepto.concepto ? 
                                                                                concepto.concepto.subpartida ?
                                                                                    concepto.concepto.subpartida.partida ?
                                                                                        concepto.concepto.subpartida.partida.nombre
                                                                                    : ''
                                                                                : ''
                                                                            : ''
                                                                        } 
                                                                    </td>
                                                                </tr>
                                                            : <></>
                                                        }
                                                        {
                                                            this.getSubpartida(key)?
                                                                <tr>
                                                                    <td colSpan={9} className="font-size-lg font-weight-bolder">
                                                                        <b  className="font-size-h6 label label-light-info label-pill label-inline mr-2 font-weight-bolder label-rounded">
                                                                        {
                                                                            this.getPartidaClave(concepto.concepto.clave)
                                                                        }
                                                                        .
                                                                        {
                                                                            this.getSubpartidaClave(concepto.concepto.clave)
                                                                        }
                                                                        </b>
                                                                        &nbsp;
                                                                        {
                                                                            concepto.concepto ? 
                                                                                concepto.concepto.subpartida ?
                                                                                    concepto.concepto.subpartida.nombre
                                                                                : ''
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            :<></>
                                                        }
                                                        <tr data-tip data-for = { key + '-th' } className = { form.conceptos[key].active ? 'concepto-active' : 'concepto-inactive bg-light-primary' } key = { key }>
                                                            <td className="check_desc text-center">
                                                                <label data-inbox = "group-select" className="checkbox checkbox-single checkbox-primary mr-3">
                                                                    <input name = 'active' type = "checkbox" onChange = { (e) => { checkButton(key, e) } }
                                                                        checked = { form.conceptos[key].active } value = { form.conceptos[key].active } />
                                                                    <span className="symbol-label"></span>
                                                                </label>
                                                            </td>
                                                            <td className="clave text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.clave}</div>
                                                            </td>
                                                            <td className="descripcion text-center">
                                                                <InputSinText requirevalidation = { 1 } formeditado = { formeditado } name = "descipcion" rows = "5" as = "textarea"
                                                                    value = { form['conceptos'][key]['descripcion'] } onChange = { (e) => { onChange(key, e, 'descripcion')} }  
                                                                    disabled = { !form.conceptos[key].active } customstyle = { { borderColor: "#e5eaee" } } />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.unidad.nombre}</div>
                                                            </td>
                                                            {
                                                                !showInputsCalidad &&
                                                                    <td className="text-center">
                                                                        <InputMoneySinText requirevalidation = { 1 } formeditado = { formeditado } name = "costo" 
                                                                            value = { form['conceptos'][key]['costo'] } onChange = { e => onChange(key, e, 'costo') }
                                                                            thousandseparator = { true } typeformat = "###########" disabled = { !form.conceptos[key].active }
                                                                            customstyle = { { borderColor: "#e5eaee" } } />
                                                                    </td>
                                                            }
                                                            <td className="text-center">
                                                                <InputMoneySinText requirevalidation = { 1 } formeditado = { formeditado } name = "cantidad_preliminar"
                                                                    value = { form['conceptos'][key]['cantidad_preliminar'] } onChange = { e => onChange(key, e, 'cantidad_preliminar') }
                                                                    thousandseparator = { true } typeformat = "###########" disabled = { !form.conceptos[key].active } 
                                                                    customstyle = { { borderColor: "#e5eaee" } } />
                                                            </td>
                                                            <td className="text-center">
                                                                <InputNumberSinText requirevalidation = { 0 } formeditado = { formeditado } name = "desperdicio" 
                                                                    value = { form['conceptos'][key]['desperdicio'] } onChange = { e => onChange(key, e, 'desperdicio') }
                                                                    thousandseparator = { true } prefix = '%' disabled = { !form.conceptos[key].active } 
                                                                    customstyle = { { borderColor: "#e5eaee" } } />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['cantidad']}</div>
                                                            </td>
                                                            {
                                                                !showInputsCalidad &&
                                                                    <td className="text-center">
                                                                        <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['importe']}</div>
                                                                    </td>
                                                            }
                                                        </tr>
                                                        {
                                                            form.conceptos[key].mensajes.active ?
                                                                <tr>
                                                                    <td className="px-3 mx-2" colSpan = { 9 }>
                                                                        <InputSinText requirevalidation = { 1 } formeditado = { formeditado } name = "mensaje"
                                                                            rows = "1" as = "textarea" className="form-control form-control-lg form-control-solid"
                                                                            value = { form.conceptos[key].mensajes.mensaje } onChange = { (e) => { this.onChangeMensaje(e, key) } }
                                                                            />
                                                                    </td>
                                                                </tr>
                                                            :<></>
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="mt-3 text-center">
                                    <Button icon = '' className = "mx-auto" onClick={ (e) => { e.preventDefault(); validateAlert(onSubmit, e, 'form-presupuesto') } } text="ENVIAR" />
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </>
            )
        else
            return (
                <>
                </>
            )
    }
}

export default ActualizarPresupuestoForm