import React, { Component } from 'react'
import { Form, Card } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button, Calendar } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import Moment from 'react-moment'
import { DATE } from '../../../constants'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class UltimoPresupuesto extends Component {
    
    state = {
        margen: 0,
        showFechas:false
    }

    mostrarFormulario() {
        const { showFechas } = this.state
        this.setState({
            ...this.state,
            showFechas: !showFechas
        })
    } 

    handleChangeDateCreacion = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha_creacion' } })
    }

    handleChangeDateAceptado = date => {
        const { onChangeInput } = this.props
        onChangeInput({ target: { value: date, name: 'fecha_aceptacion' } })
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

    onChangeDesperdicio = e =>{
        const { value } = e.target
        const { form, onChange } = this.props
        if(value)
            form.conceptos.map( (concepto, key) => {
                if(concepto.active)
                    onChange(key, e, 'margen')
                return false
            })
        this.setState({
            ...this.state,
            margen: value
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
        const { aceptarPresupuesto, onChange, formeditado, checkButton, form, presupuesto, onSubmit, onChangeInput} = this.props
        const { margen } = this.state
        if (presupuesto)
            return (
                <>
                    < Card className="card-custom" >
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <div className="list min-w-1000px" data-inbox="list">
                                    <div className="col-md-12 d-flex justify-content-center align-items-center list-item card-spacer-x py-4" data-inbox="message">
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
                    <Form id="form-presupuesto"
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                validateAlert(onSubmit, e, 'form-presupuesto')
                            }
                        }
                    >
                        <Card className="mt-4 card-custom">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">Presupuesto Preliminar</h3>
                                </div>
                                <div className="card-toolbar" >
                                    <InputSinText
                                        placeholder='PERÍODO DE VALIDEZ'
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='tiempo_valido'
                                        value={form.tiempo_valido}
                                        onChange={onChangeInput}
                                    />
                                </div>
                            </Card.Header>

                            <Card.Body className="pt-2">
                                <div className="d-flex justify-content-start">
                                <div className="d-flex align-items-center">
                                        <Button 
                                            icon=''
                                            className={"btn btn-icon btn-light-primary"}
                                            onClick={() => { this.mostrarFormulario() }}
                                            only_icon={"flaticon2-calendar-9"}
                                            tooltip={{text:'MOSTRAR FECHAS'}}                                        
                                        />
                                </div>
                                <div className={this.state.showFechas ? 'w-100 formulario-escondido' : 'w-0 overflow-hidden formulario-escondido'}>
                                    <div className="form-group row form-group-marginless m-0 mb-3 d-flex justify-content-end">
                                        {/* <div className="col-md-5">
                                            <Calendar
                                                formeditado={formeditado}
                                                onChangeCalendar={this.handleChangeDateCreacion}
                                                placeholder="FECHA DE CREACIÓN"
                                                name="fecha_creacion"
                                                value={form.fecha_creacion}
                                                patterns={DATE}
                                            />
                                        </div> */}
                                        <div className="col-md-2 pr-0">
                                            <Calendar
                                                // requirevalidation={0}
                                                formeditado={formeditado}
                                                onChangeCalendar={this.handleChangeDateAceptado}
                                                placeholder="FECHA DE ACEPTACIÓN"
                                                name="fecha_aceptacion"
                                                value={form.fecha_aceptacion}
                                                patterns={DATE}
                                            />
                                        </div>
                                        <div className="px-3 align-self-end d-flex justify-content-center pb-1">
                                            <Button icon='' onClick = { aceptarPresupuesto } className="text-center mx-auto" text='ENVIAR' />
                                        </div>
                                        
                                    </div>
                                </div>
                                    
                                </div>

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
                                                <div className="font-size-sm text-center">% Margen</div>
                                                <div className="d-flex justify-content-center">
                                                    <InputNumberSinText
                                                        identificador={"margen-global"}
                                                        requirevalidation={0}
                                                        formeditado={1}
                                                        name=" margen "
                                                        value={margen}
                                                        onChange={this.onChangeDesperdicio}
                                                        thousandseparator={true}
                                                        prefix={'%'} 
                                                        customstyle={{borderColor: "#e5eaee", width: "57px"}}
                                                    />
                                                </div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Cantidad</div>
                                            </th>
                                            <th className="border-0 center_content">
                                                <div className="font-size-sm text-center">Precio Unitario</div>
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
                                                            this.getPartida(key) ?
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
                                                            this.getSubpartida(key) ?
                                                                <tr>
                                                                    <td colSpan={9} className="font-size-lg font-weight-bolder">
                                                                        <b className="font-size-h6 label label-light-primary label-pill label-inline mr-2 font-weight-bolder label-rounded">
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
                                                        <tr data-tip data-for={key + '-th'} className={form.conceptos[key].active ? 'concepto-active' : 'concepto-inactive bg-light-primary'} key={key}>
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
                                                                    rows="3"
                                                                    as="textarea"
                                                                    value={form['conceptos'][key]['descripcion']}
                                                                    onChange={(e) => { onChange(key, e, 'descripcion') }}
                                                                    disabled={!form.conceptos[key].active}
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
                                                                    disabled={!form.conceptos[key].active} 
                                                                    customstyle={{borderColor: "#e5eaee"}}
                                                                    prefix={"$"}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <InputNumberSinText
                                                                    identificador={"margen" + key}
                                                                    requirevalidation={0}
                                                                    formeditado={formeditado}
                                                                    name="margen"
                                                                    value={form['conceptos'][key]['margen']}
                                                                    onChange={e => onChange(key, e, 'margen')}
                                                                    thousandseparator={true}
                                                                    prefix={'%'}
                                                                    disabled={!form.conceptos[key].active}
                                                                    customstyle={{borderColor: "#e5eaee", width: "57px"}}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['cantidad']}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['precio_unitario']}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['importe']}</div>
                                                            </td>
                                                        </tr>
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
                                        text="ENVIAR Y GENERAR PDF" />
                                </div>

                            </Card.Body>
                        </Card>
                    </Form>
                </>
            )
        else
            return (
                <>
                </>
            )
    }
}

export default UltimoPresupuesto