import React, { Component } from 'react'
import { Form, Card } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button, InputGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas, dayDMY } from '../../../functions/setters'
class UltimoPresupuesto extends Component {
    
    state = {
        margen: 0
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
        const { onChange, formeditado, checkButton, form, presupuesto, onChangeInput, sendPresupuesto, generarPDF } = this.props
        const { margen } = this.state
        if (presupuesto)
            return (
                <>
                    < Card className="card-custom" >
                        <Card.Body className="p-0">
                        <div className="table-responsive">
                                <div className="list min-w-1000px">
                                    <div className="px-9 py-6">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
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
                                                                <div className="font-weight-normal font-size-lg text-muted">Tpo. de ejecución</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4  mr-5">
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
                                                    <div className="border border-gray-300 border-dashed rounded py-3 px-4 mr-5">
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
                                                    {
                                                        typeof presupuesto.estatus.estatus === 'string' &&
                                                        <div className="border border-gray-300 border-dashed rounded py-3 px-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                                    <div className="symbol-label">
                                                                        <i className="las la-check-circle icon-2x text-primary"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="font-size-h5 font-weight-bold">
                                                                    { presupuesto.estatus.estatus }
                                                                    <div className="font-weight-normal font-size-lg text-muted">Estatus</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
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
                                validateAlert(generarPDF, e, 'form-presupuesto')
                            }
                        }
                    >
                        <Card className="mt-4 card-custom">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">Presupuesto preeliminar</h3>
                                </div>
                                <div className="card-toolbar" >
                                    <InputGray
                                        withtaglabel = { 0 }
                                        withtextlabel = { 0 }
                                        withplaceholder = { 1 }
                                        withicon = { 1 }
                                        withformgroup = { 0 }
                                        iconclass = 'flaticon-calendar-with-a-clock-time-tools icon-xl'
                                        iconvalid= { 1 }
                                        placeholder='PERÍODO DE VALIDEZ'
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        name='tiempo_valido'
                                        value={form.tiempo_valido}
                                        onChange={onChangeInput}
                                        inputsolid='bg-white border'
                                    />
                                </div>
                            </Card.Header>
                            <Card.Body className="pt-2">
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
                                                <div className="font-size-sm text-center white-space-nowrap">% Margen</div>
                                                <div className="d-flex justify-content-center">
                                                    <InputNumberSinText
                                                        identificador={"margen-global"}
                                                        requirevalidation={0}
                                                        formeditado={1}
                                                        name=" margen "
                                                        value={margen}
                                                        onChange={this.onChangeDesperdicio}
                                                        thousandseparator={true}
                                                        prefix='%'
                                                        customclass='rounded-pill px-2 text-center border'
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
                                                                        <b className="font-size-h6 label label-light-info label-pill label-inline mr-2 font-weight-bolder label-rounded">
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
                                                                    identificador={"descipcion" + key}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="descipcion"
                                                                    rows="4"
                                                                    as="textarea"
                                                                    value={form['conceptos'][key]['descripcion']}
                                                                    onChange={(e) => { onChange(key, e, 'descripcion') }}
                                                                    disabled={!form.conceptos[key].active}
                                                                    customclass='rounded-pill px-2 border text-justify'
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <div className="font-weight-bold font-size-sm">{concepto.concepto.unidad.nombre}</div>
                                                            </td>
                                                            <td className="text-center">
                                                                <InputMoneySinText
                                                                    identificador={"costo" + key}
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    name="costo"
                                                                    value={form['conceptos'][key]['costo']}
                                                                    onChange={e => onChange(key, e, 'costo')}
                                                                    thousandseparator={true}
                                                                    typeformat="###########"
                                                                    disabled={!form.conceptos[key].active} 
                                                                    prefix="$"
                                                                    customclass='rounded-pill px-2 text-center border'
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
                                                                    prefix='%'
                                                                    disabled={!form.conceptos[key].active}
                                                                    customclass='rounded-pill px-2 text-center border'
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
                            </Card.Body>
                            <Card.Footer className="card-footer">
                                <div className="d-flex justify-content-end">
                                    <Button icon='' className="btn btn-bg-light btn-hover-light-success font-weight-bolder text-success align-self-center font-size-13px px-2 btn-sm"
                                        only_icon="las la-paper-plane icon-lg mr-2 px-0 text-success" text="ENVIAR"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(sendPresupuesto, e, 'form-presupuesto')
                                            }
                                        }
                                    />
                                    <Button icon='' className="btn btn-bg-light btn-hover-light-primary font-weight-bolder text-primary align-self-center font-size-13px ml-2 px-2 btn-sm"
                                        only_icon="las la-file-pdf icon-lg mr-1 px-0 text-primary" text="GENERAR PDF"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                validateAlert(generarPDF, e, 'form-presupuesto')
                                            }
                                        }
                                    />
                                </div>
                            </Card.Footer>
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