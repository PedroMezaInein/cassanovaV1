import React, { Component } from 'react'
import { Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { InputMoneySinText, InputNumberSinText, InputSinText, Button, InputNumberGray } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas, dayDMY } from '../../../functions/setters'
import NumberFormat from 'react-number-format'
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

    tooltip(estatus, details, dotHover, colorText ){
        const { aux_presupuestos } = this.props
        let activeHoverP=false;
        switch (estatus) {
            case 'Conceptos':
                if(aux_presupuestos.conceptos){ activeHoverP= true }
                break;
            case 'Volumetrías':
                if(aux_presupuestos.volumetrias){ activeHoverP= true }
                break;
            case 'Costos':
                if(aux_presupuestos.costos){ activeHoverP= true }
                break;
            case 'En revisión':
                if(aux_presupuestos.revision){ activeHoverP= true }
                break;
            case 'Utilidad':
                if(aux_presupuestos.utilidad){ activeHoverP= true }
                break;
            case 'En espera':
                if(aux_presupuestos.espera){ activeHoverP= true }
                break;
            case 'Aceptado':
                if(aux_presupuestos.aceptado){ activeHoverP= true }
                break;
            case 'Rechazado':
                if(aux_presupuestos.rechazado){ activeHoverP= true }
                break;
            default:
                break;
        }
        return(
            <OverlayTrigger overlay={
                <Tooltip className="mb-4 tool-time-line">
                    <div className={`tool-titulo ${colorText} font-weight-bolder letter-spacing-0-4 py-1`}> {estatus === 'Aceptado/Rechazado' ?<span><span className="color-aceptado-presupuesto">Aceptado</span> <span className="font-weight-light">/</span> <span className="color-rechazado-presupuesto">Rechazado</span></span> : estatus} </div>
                    <div className="text-justify px-5 pb-3 mt-1">{details}</div>
                </Tooltip>
            }>
                <div className={`status ${activeHoverP?dotHover:''}`}>
                    <h4>{estatus}</h4>
                </div>
            </OverlayTrigger>
        )
    }
    bgActiveCheck(key){
        const { form } = this.props
        let css = ''
        if(form.conceptos[key].vicio_oculto){
            css= 'concepto-inactive bg-success-o-30'
        }
        if(!form.conceptos[key].active){ 
            css= 'concepto-inactive bg-danger-o-30'
        }
        return css
    }
    render() {
        const { onChange, formeditado, checkButton, form, presupuesto, onChangeInput, sendPresupuesto, generarPDF, aux_presupuestos } = this.props
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
                            <Card.Header className="border-0">
                                <div className="card-title">
                                    <h3 className="card-label">Presupuesto preeliminar</h3>
                                </div>
                                <div className="card-toolbar justify-content-end">
                                    <div className="col-md-10 px-0">
                                        <InputNumberGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            withformgroup={0}
                                            iconvalid={1}
                                            requirevalidation={1}
                                            placeholder='VALIDEZ EN DÍAS'
                                            formeditado={1}
                                            name='tiempo_valido'
                                            value={form.tiempo_valido}
                                            onChange={onChangeInput}
                                            inputsolid='bg-white border'
                                            iconclass='flaticon-calendar-with-a-clock-time-tools icon-xl'
                                        />
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="pt-2">
                                <div className="row mx-0">
                                    <div className="col-md-10 px-0 mx-auto">
                                        {
                                            presupuesto.estatus &&
                                            <div className="table-responsive mt-5">
                                                <div className="list min-w-fit-content" data-inbox="list">
                                                    <ul className="timeline-estatus p-0">
                                                        <li className={`li ${aux_presupuestos.conceptos ? 'complete-conceptos' : ''}`}>
                                                            {this.tooltip('Conceptos', 'Se asignan los conceptos al presupuesto.', 'dot-conceptos-presupuesto', 'header-presupuesto-conceptos')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.volumetrias ? 'complete-volumetrias' : ''}`}>
                                                            {this.tooltip('Volumetrías', 'Se agregan las volumetrías al presupuesto.', 'dot-volumetrias-presupuesto', 'header-presupuesto-volumetrias')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.costos ? 'complete-costos' : ''}`}>
                                                            {this.tooltip('Costos', 'El departamento de compras estima los costos de los conceptos del presupuesto.', 'dot-costos-presupuesto', 'header-presupuesto-costos')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.revision ? 'complete-revision' : ''}`}>
                                                            {this.tooltip('En revisión', 'El departamento de calidad se encarga de verificar las medidas, volumetrias y conceptos del presupuesto.', 'dot-revision-presupuesto', 'header-presupuesto-revision')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.utilidad ? 'complete-utilidad' : ''}`}>
                                                            {this.tooltip('Utilidad', 'El departamento de finanzas añade la utilidad al presupuesto y es el encargado de enviar al cliente.', 'dot-utilidad-presupuesto', 'header-presupuesto-utilidad')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.espera ? 'complete-espera' : ''}`}>
                                                            {this.tooltip('En espera', 'El presupuesto es revisado por el cliente y se obtiene una respuesta del presupuesto.', 'dot-espera-presupuesto', 'header-presupuesto-espera')}
                                                        </li>
                                                        <li className={`li ${aux_presupuestos.aceptado ? 'complete-aceptado' : aux_presupuestos.rechazado ? 'complete-rechazado' : ''}`}>
                                                            {this.tooltip(aux_presupuestos.aceptado ? 'Aceptado' : aux_presupuestos.rechazado ? 'Rechazado' : 'Aceptado/Rechazado',
                                                                aux_presupuestos.aceptado ? 'El cliente aprueba el presupuesto.' : aux_presupuestos.rechazado ? 'El cliente declina el presupuesto.' : 'El cliente aprueba o declina el presupuesto.',
                                                                aux_presupuestos.aceptado ? 'dot-aceptado-presupuesto' : 'dot-rechazado-presupuesto',
                                                                aux_presupuestos.aceptado ? 'header-presupuesto-aceptado' : aux_presupuestos.rechazado ? 'header-presupuesto-rechazado' : 'bg-aceptado-rechazado')}
                                                        </li> 
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-separate table-vertical-center">
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
                                                    <div className="font-size-sm text-center">Cantidad</div>
                                                </th>
                                                <th className="border-0 center_content" style={{minWidth:'120px'}}>
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
                                                    <div className="font-size-sm text-center">Precio <br/> Unitario</div>
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
                                                                        <td colSpan={9} className="bg-light text-primary font-size-lg font-weight-bolder border-0">
                                                                            <b className="font-weight-boldest text-primary font-size-h6 ml-2">
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
                                                                : <></>
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
                                                                : <></>
                                                            }
                                                            <tr data-tip data-for={key + '-th'} className = { this.bgActiveCheck(key) } key={key}>
                                                                <td className="check_desc text-center">
                                                                    <div className="d-flex justify-content-center">
                                                                        <OverlayTrigger overlay={<Tooltip>{form.conceptos[key].active?<span>ELIMINAR<br/>CONCEPTO</span>:<span>AGREGAR<br/>CONCEPTO</span>}</Tooltip>}>
                                                                            <label data-inbox = "group-select" className="checkbox checkbox-single checkbox-danger">
                                                                                <input name = 'active' type = "checkbox" onChange = { (e) => { checkButton(key, e) } }
                                                                                    checked = { form.conceptos[key].active } value = { form.conceptos[key].active } />
                                                                                <span className="symbol-label"></span>
                                                                            </label>
                                                                        </OverlayTrigger>
                                                                        {
                                                                            form.conceptos[key].active ?
                                                                            <OverlayTrigger overlay={<Tooltip>{form.conceptos[key].vicio_oculto?<span>QUITAR COMO<br/>VICIO OCULTO</span>:<span>AGREGAR COMO<br/>VICIO OCULTO</span>}</Tooltip>}>
                                                                                <label data-inbox = "group-select" className="checkbox checkbox-single checkbox-success ml-2">
                                                                                    <input name = 'vicio_oculto' type = "checkbox" onChange = { (e) => { checkButton(key, e) } }
                                                                                        checked = { form.conceptos[key].vicio_oculto } value = { form.conceptos[key].vicio_oculto } />
                                                                                    <span className="symbol-label"></span>
                                                                                </label>
                                                                            </OverlayTrigger>
                                                                            :<></>
                                                                        }
                                                                    </div>
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
                                                                        as="textarea"
                                                                        value={form['conceptos'][key]['descripcion']}
                                                                        onChange={(e) => { onChange(key, e, 'descripcion') }}
                                                                        disabled={!form.conceptos[key].active}
                                                                        customclass={`disable-presupuesto ${form.conceptos[key].vicio_oculto?'vicio_oculto-presupuesto':''}  rounded-pill px-2 border text-justify textarea-input`}
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="font-weight-bold font-size-sm">{concepto.concepto.unidad.nombre}</div>
                                                                </td>
                                                                
                                                                <td className="text-center">
                                                                    <div className="font-weight-bold font-size-sm">{form['conceptos'][key]['cantidad']}</div>
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
                                                                        customclass={`disable-presupuesto ${form.conceptos[key].vicio_oculto?'vicio_oculto-presupuesto':''} rounded-pill px-2 text-center border`}
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
                                                                        customclass={`disable-presupuesto ${form.conceptos[key].vicio_oculto?'vicio_oculto-presupuesto':''} rounded-pill px-2 text-center ${ presupuesto.estatus.estatus === 'Utilidad'?form.conceptos[key].bg_margen ?'bg-light-info text-info font-weight-bolder border-0':'bg-light text-dark-50 font-weight-bolder border-0':'border'}`}
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="font-weight-bold font-size-sm">
                                                                        <NumberFormat
                                                                            value= {form['conceptos'][key]['precio_unitario']}
                                                                            displayType={'text'}
                                                                            thousandSeparator={true}
                                                                            renderText={value => <div>{value}</div>}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="font-weight-bold font-size-sm">
                                                                        <NumberFormat
                                                                            value= {form['conceptos'][key]['importe']}
                                                                            displayType={'text'}
                                                                            thousandSeparator={true}
                                                                            renderText={value => <div>{value}</div>}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                            <Card.Footer className="card-footer">
                                <div className="d-flex justify-content-end">
                                    <Button icon='' className="btn btn-bg-light btn-hover-light-success font-weight-bolder text-success align-self-center font-size-13px px-2 btn-sm"
                                        only_icon="las la-save icon-lg mr-2 px-0 text-success" text="GUARDAR"
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