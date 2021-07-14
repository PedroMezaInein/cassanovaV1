import React, { Component } from 'react'
import { Form, Card } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class ActualizarPresupuestoForm extends Component {

    state = {
        desperdicio: 0
    }

    getTotalImport = () => {
        const { form } = this.props
        let aux = parseFloat(0);
        form.conceptos.map( (concepto) => {
            if(concepto.active)
                aux = aux + parseFloat(concepto.importe)
            return false
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
            form.conceptos.map( (concepto, key) => {
                if(concepto.active)
                    if(!(concepto.unidad === 'VIAJE' || concepto.unidad === 'SAL' || concepto.unidad === 'PZA' || concepto.unidad === 'LOTE'
                        || concepto.unidad === 'JGO' || concepto.unidad === 'EQUIPO' || concepto.unidad === 'BULTO')){
                        onChange(key, e, 'desperdicio')
                    }
                return false
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
        presupuesto.pdfs.map( (pdf, key) => {
            if( pdf.pivot.identificador >  identificador)
                identificador = pdf.pivot.identificador
            return false
        })
        identificador++
        return identificador.toString()
    }

    render() {
        const { onChange, formeditado, checkButton, form, presupuesto, openModal, onSubmit} = this.props
        const { desperdicio } = this.state
        if (presupuesto)
            return (
                <>
                    < Card className="card-custom" >
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <div className="list min-w-1000px" data-inbox="list">
                                    <div className=" col-md-12 d-flex justify-content-center align-items-center list-item card-spacer-x py-4" data-inbox="message">
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Bulb1.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.proyecto.nombre}</div>
                                                <span className="text-muted">Proyecto</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Layout-top-panel-6.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.area.nombre}</div>
                                                <span className="text-muted">ÁREA</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.empresa.name}</div>
                                                <span className="text-muted">Empresa</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/clock.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">{presupuesto.tiempo_ejecucion}</div>
                                                <span className="text-muted">Tiempo de ejecución</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/Menu.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                                <div className="text-dark mb-1">
                                                    <Moment format="DD/MM/YYYY">
                                                        {presupuesto.fecha}
                                                    </Moment>
                                                </div>
                                                <span className="text-muted">Fecha</span>
                                            </div>
                                        </div>
                                        <div className="col-md-2 d-flex align-items-center justify-content-center">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-primary svg-icon-lg">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column font-weight-bold">
                                            <div className="text-dark mb-1">
                                                    No. {
                                                        this.getIdentificador()
                                                    }
                                                </div>
                                                <span className="text-muted">                                                    
                                                    PRESUPUESTO
                                                </span>
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
                                <button className="btn btn-sm btn-light-primary font-weight-bold" onClick={openModal}>
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
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Costo</div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Cantidad Preliminar</div>
                                            </th>
                                            <th className="border-0">
                                                <div className="font-size-sm text-center">% Despercicio</div>
                                                <div className="d-flex justify-content-center">
                                                    <InputNumberSinText
                                                        identificador = { "desperdicio-global" }
                                                        requirevalidation = { 0 }
                                                        formeditado = { 1 }
                                                        name = " desperdicio "
                                                        value = { desperdicio }
                                                        onChange = { this.onChangeDesperdicio }
                                                        thousandseparator = { 1 }
                                                        prefix = { '%' } 
                                                        customstyle={{borderColor: "#e5eaee"}}
                                                    />
                                                </div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Cantidad</div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Importe</div>
                                                <div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm text-center">
                                                    {
                                                        setMoneyTableForNominas(this.getTotalImport())
                                                    }
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            presupuesto.conceptos.map((concepto, key) => {
                                                return (
                                                    <>
                                                        {
                                                            this.getPartida(key)?
                                                                <tr>
                                                                    <td colSpan={9} className="bg-primary-o-20 text-primary font-size-lg font-weight-bolder border-0 ">
                                                                        <b className="font-weight-boldest text-primary font-size-h6">
                                                                        {
                                                                            this.getPartidaClave(concepto.concepto.clave)
                                                                        }.
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
                                                            :
                                                                ''
                                                        }
                                                        {
                                                            this.getSubpartida(key)?
                                                                <tr>
                                                                    <td colSpan={9} className="font-size-lg font-weight-bolder">
                                                                        <b  className="font-size-h6 label label-light-primary label-pill label-inline mr-2 font-weight-bolder label-rounded">
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
                                                            :
                                                                ''
                                                        }
                                                        <tr data-tip data-for = { key + '-th' } className = { form.conceptos[key].active ? 'concepto-active' : 'concepto-inactive bg-light-primary' } key = { key }>
                                                            <td className="check_desc text-center">
                                                                <label
                                                                    data-inbox="group-select"
                                                                    className="checkbox checkbox-single checkbox-primary mr-3">
                                                                    <input
                                                                        name='active'
                                                                        type="checkbox"
                                                                        onChange={(e) => { checkButton(key, e) }}
                                                                        checked={form.conceptos[key].active}
                                                                        value={form.conceptos[key].active} />
                                                                    <span className="symbol-label"></span>
                                                                </label>
                                                            </td>
                                                            <td className="clave text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.clave}</div>
                                                            </td>
                                                            <td className="descripcion text-center">
                                                                <InputSinText
                                                                    identificador={"descipcion"}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="descipcion"
                                                                    rows="5"
                                                                    as="textarea"
                                                                    value={form['conceptos'][key]['descripcion']}
                                                                    onChange={(e) => { onChange(key, e, 'descripcion')} } 
                                                                    disabled = { !form.conceptos[key].active }
                                                                    customstyle={{borderColor: "#e5eaee"}}
                                                                    />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.unidad.nombre}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <InputMoneySinText identificador={"costo"}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="costo"
                                                                    value={form['conceptos'][key]['costo']}
                                                                    onChange={e => onChange(key, e, 'costo')}
                                                                    thousandseparator={true}
                                                                    typeformat="###########" 
                                                                    disabled = { !form.conceptos[key].active }
                                                                    customstyle={{borderColor: "#e5eaee"}}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <InputMoneySinText
                                                                    identificador={"cantidad_preliminar"}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="cantidad_preliminar"
                                                                    value={form['conceptos'][key]['cantidad_preliminar']}
                                                                    onChange={e => onChange(key, e, 'cantidad_preliminar')}
                                                                    thousandseparator={true}
                                                                    typeformat="###########"
                                                                    disabled = { !form.conceptos[key].active } 
                                                                    customstyle={{borderColor: "#e5eaee"}}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <InputNumberSinText
                                                                    identificador={"desperdicio" + key}
                                                                    requirevalidation={0}
                                                                    formeditado={formeditado}
                                                                    name="desperdicio"
                                                                    value={form['conceptos'][key]['desperdicio']}
                                                                    onChange={e => onChange(key, e, 'desperdicio')}
                                                                    thousandseparator={true}
                                                                    prefix={'%'} 
                                                                    disabled = { !form.conceptos[key].active }
                                                                    customstyle={{borderColor: "#e5eaee"}}
                                                                    />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['cantidad']}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['importe']}</div>
                                                            </td>
                                                        </tr>
                                                        {
                                                            form.conceptos[key].mensajes.active ?
                                                                <tr >
                                                                    <td className="px-3 mx-2" colSpan = { 9 }>
                                                                        <InputSinText
                                                                            identificador = { "mensaje" + key }
                                                                            requirevalidation = { 1 }
                                                                            formeditado = { formeditado }
                                                                            name = "mensaje"
                                                                            rows = "1"
                                                                            as = "textarea"
                                                                            className="form-control form-control-lg form-control-solid"
                                                                            value = { form.conceptos[key].mensajes.mensaje}
                                                                            onChange = { (e) => { this.onChangeMensaje(e, key) } }
                                                                            />
                                                                    </td>
                                                                </tr>
                                                            :
                                                                ''
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="mt-3 text-center">
                                    <Button icon='' className="mx-auto" 
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(onSubmit, e, 'form-presupuesto')
                                            }
                                        }
                                        text="ENVIAR" />
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