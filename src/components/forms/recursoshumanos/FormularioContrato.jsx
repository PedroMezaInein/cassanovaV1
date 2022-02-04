import React, { Component } from 'react'
import { deleteAlert, validateAlert } from '../../../functions/alert'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { InputGray, RangeCalendar, InputNumberGray, FileInput, CalendarDay } from '../../form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import $ from "jquery";
import { dayDMY } from '../../../functions/setters'
class FormularioContrato extends Component {
    state = {
        renovar: false,
        showForm: true,
        showHistorial: true
    }
    mostrarFormulario() {
        $("#show_buttons").removeClass("d-none").addClass("d-flex");
        this.setState({
            ...this.state,
            showForm: true,
            showHistorial: false
        })
    }
    mostrarForm(){
        $("#show_buttons").removeClass("d-none").addClass("d-flex");
        this.setState({
            ...this.state, 
            renovar: true,  
            showForm: true, 
            showHistorial:false 
        })
    }
    
    mostrarHistorial() {
        $("#show_buttons").removeClass("d-none").addClass("d-flex");
        this.setState({
            ...this.state,
            showHistorial: true,
            showForm: false
        })
    }

    isAdmin = ( contrato ) => {
        const { user } = this.props
        if(contrato.contrato_firmado)
            return false
        if(user){
            if(user.tipo){
                if(user.tipo.tipo === 'Administrador'){
                    return true
                }
            }
        }
        return false
    }

    canSendContrado = () => {
        const { form, empleado } = this.props

        if(empleado.tipo_empleado === 'Administrativo'){
            switch(form.periodo){
                case 'determinado':
                case 'servicios':
                    if(form.dias !== '')
                        return true
                    break;
                case 'indefinido':
                    return true
                default: break;
            }
        }else{
            if(form.dias !== '')
                return true   
        }
        
        return false
    }

    printContratoType = contrato => {
        switch(contrato.indefinido){
            case 'servicios':
                return `SERVICIOS PROFESIONALES POR ${contrato.dias} DÍAS`
            case 'determinado':
                return `TIEMPO DETERMINADO POR ${contrato.dias} DÍAS`
            default:
                return `TIEMPO INDETERMINADO`
        }
    }

    render() {
        const { empleado, form, onChangeContrato, onChangeRange, generarContrato, onChangeAdjuntos, cancelarContrato, renovarContrato, regeneratePdf, formeditado, deleteContrato } = this.props
        const { renovar, showForm, showHistorial } = this.state
        return (
            <>
                <div id='show_buttons' className="justify-content-end mb-10 mt-5 d-none">
                    
                    {
                        empleado ?
                            empleado.contratos.length > 0 &&
                            <span className={`btn btn-light btn-hover-bg-primary btn-text-primary btn-hover-text-white px-2 mr-2 font-weight-bolder text-primary ${showHistorial  ? 'active' : ''}`} onClick={() => { this.mostrarHistorial() }}>
                                HISTORIAL
                                <i className="flaticon2-list-3 text-primary px-0 ml-2 icon-lg"></i> 
                            </span>
                            :''
                    }
                    {
                        empleado ?
                            (empleado.contratos.length === 0 || renovar) ?
                                <div className={`btn btn-light btn-hover-bg-info btn-text-info btn-hover-text-white px-2 font-weight-bolder text-info ${showForm  ? 'active' : ''}`} onClick={() => { this.mostrarFormulario() }}>
                                    RENOVAR
                                    <i className="flaticon2-writing text-info px-0 ml-2 icon-lg"></i>
                                </div>
                            :''
                        :''
                    }
                </div>
                {
                    empleado ?
                        empleado.contratos.length > 0 &&
                        <div className={`table-responsive mt-8 ${showHistorial ? '' : 'd-none'}`}>
                            <table className="table table-responsive-lg table-head-custom table-vertical-center w-100">
                                <thead>
                                    <tr>
                                        <th className="text-center">Tipo de contrato</th>
                                        <th>Fecha</th>
                                        <th>Estatus</th>
                                        <th>Adjuntar</th>
                                        <th style={{ minWidth: '163px' }}>ADJ. AGREGADOS</th>
                                        <th style={{ minWidth: '148px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        empleado.contratos.map((contrato, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="text-center">
                                                        <span className="text-dark-75 font-weight-bolder font-size-lg">
                                                            { 
                                                                contrato.tipo_contrato === 'obra' ? 
                                                                    'OBRA DETERMINADA' 
                                                                :  this.printContratoType(contrato)
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="w-fit-content mx-auto">
                                                            <div>
                                                                <span className="text-dark-75 font-weight-bold font-size-lg">Inicio:</span>
                                                                <span className="text-dark-50 font-weight-normal ml-1 white-space-nowrap">{dayDMY(contrato.fecha_inicio)}</span>
                                                            </div>
                                                            {
                                                                contrato.fecha_fin !== null &&
                                                                <div>
                                                                    <span className="text-dark-75 font-weight-bold font-size-lg">Final:</span>
                                                                    <span className="text-dark-50 font-weight-normal ml-1 white-space-nowrap">{dayDMY(contrato.fecha_fin)}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>
                                                    
                                                    <td className="text-center">
                                                        <span className={`label label-light-${contrato.terminado === 0 ? 'success' : 'danger'} label-pill label-inline font-weight-bolder`}>{contrato.terminado === 0 ? 'ACTIVO' : 'TERMINADO'}</span>
                                                    </td>
                                                    <td>
                                                        <div className="text-center d-flex justify-content-center">
                                                            <OverlayTrigger rootClose overlay={<Tooltip>ADJUNTAR CONTRATO FIRMADO</Tooltip>}>
                                                                <div>
                                                                    <FileInput requirevalidation = { 0 } onChangeAdjunto = { onChangeAdjuntos } 
                                                                        value = { form.adjuntos.contrato.value } name = {contrato.id} id = 'adjunto-contrato'
                                                                        accept = "application/pdf" files = { form.adjuntos.contrato.files }
                                                                        classbtn = 'btn btn-hover-icon-success font-weight-bolder text-dark-50 mb-0 p-0'
                                                                        iconclass = 'la la-file-signature text-dark-50 icon-2x' />
                                                                </div>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger rootClose overlay={<Tooltip>ADJUNTAR CARTA FIRMADA</Tooltip>}>
                                                                <div>
                                                                    <FileInput requirevalidation = { 0 } onChangeAdjunto = { onChangeAdjuntos }
                                                                        value = { form.adjuntos.carta.value } name = {contrato.id} id = 'adjunto-carta'
                                                                        accept = "application/pdf" files = { form.adjuntos.carta.files }
                                                                        classbtn = 'btn btn-hover-icon-success font-weight-bolder text-dark-50 mb-0 p-0'
                                                                        iconclass = 'la la-file-alt text-dark-50 icon-2x' />
                                                                </div>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="w-fit-content mx-auto">
                                                            {
                                                                contrato.contrato !== null &&
                                                                <a className="text-dark-50 font-weight-normal text-hover-primary d-block" rel="noopener noreferrer" href={contrato.contrato} target="_blank">CONTRATO GENERADO</a>
                                                            }
                                                            {
                                                                contrato.contrato_firmado !== null &&
                                                                <a className="text-dark-50 font-weight-normal  mt-1 text-hover-primary" rel="noopener noreferrer" href={contrato.contrato_firmado} target="_blank">CONTRATO FIRMADO</a>
                                                            }
                                                            {
                                                                contrato.carta !== null &&
                                                                <a className="text-dark-50 font-weight-normal text-hover-primary d-block" rel="noopener noreferrer" href={contrato.carta} target="_blank">CARTA GENERADA</a>
                                                            }
                                                            {
                                                                contrato.carta_firmada !== null &&
                                                                <a className="text-dark-50 font-weight-normal  mt-1 text-hover-primary" rel="noopener noreferrer" href={contrato.carta_firmada} target="_blank">CARTA FIRMADA</a>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <OverlayTrigger rootClose overlay={<Tooltip>RENOVAR</Tooltip>}>
                                                            <span className="btn btn-light btn-icon h-35px font-weight-bolder my-1" onClick = { (e) => { e.preventDefault();  this.mostrarForm()   }}>
                                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                                </span>
                                                            </span>
                                                        </OverlayTrigger>
                                                        {
                                                            contrato.terminado === 0 ?
                                                                <OverlayTrigger rootClose overlay={<Tooltip>TERMINAR</Tooltip>}>
                                                                    <span className="btn btn-light btn-icon h-35px font-weight-bolder ml-2 my-1"  onClick={() => { cancelarContrato(contrato) }} >
                                                                        <span className="svg-icon svg-icon-lg svg-icon-danger">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                                                                        </span>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            : <></>
                                                        }
                                                        {
                                                            contrato.contrato_firmado === null ? 
                                                                <OverlayTrigger rootClose overlay={<Tooltip>REGENERAR PDF</Tooltip>}>
                                                                    <span className="btn btn-light btn-icon h-35px font-weight-bolder ml-2 my-1" onClick = { (e) => { e.preventDefault(); regeneratePdf(contrato)   }}>
                                                                        <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                            <i className="far fa-file-pdf svg-icon-info"></i>
                                                                        </span>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            : ''
                                                        }
                                                        {
                                                            this.isAdmin(contrato) ? 
                                                                <OverlayTrigger rootClose overlay={<Tooltip>ELIMINAR CONTRATO</Tooltip>}>
                                                                    <span className="btn btn-light btn-icon h-35px font-weight-bolder ml-2 my-1" 
                                                                        onClick = { (e) => { e.preventDefault(); deleteAlert(`¿Estás seguro?`, `Eliminarás el contrato`, () => { deleteContrato(contrato) } ) }}>
                                                                        <span className="svg-icon svg-icon-lg svg-icon-danger text-danger">
                                                                            <i className="far fa-trash-alt svg-icon-danger text-danger"></i>
                                                                        </span>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            : ''
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        : ''
                }
                {
                    empleado ?
                        (empleado.contratos.length === 0 || renovar) ?
                            <div className={`${showForm ? '' : 'd-none'}`}>
                            <Form id="form-empleados-contrato"
                                onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(generarContrato, e, 'form-empleados-contrato')
                                    }
                                }
                            >
                                {
                                    empleado.tipo_empleado === 'Administrativo' ?
                                        <div className="row mx-0 my-5">
                                            <div className = { `${form.periodo !== '' ? 'col-md-6' : 'col-md-12'}` }>
                                                <div className="mx-auto w-fit-content">
                                                    <label className="font-weight-bold col-form-label text-dark-60">Periodo del contrato</label>
                                                    <div className="radio-list">
                                                        <label className="radio radio-outline radio-success">
                                                            <input type = "radio" name = 'periodo' value = 'determinado'
                                                                onChange = { onChangeContrato } checked = { form.periodo === 'determinado' ? true : false} />
                                                            <span></span>DETERMINADO
                                                        </label>
                                                        <label className="radio radio-outline radio-success">
                                                            <input type = "radio" name = 'periodo' value = 'indefinido'
                                                                onChange = { onChangeContrato } checked={form.periodo === 'indefinido' ? true : false } />
                                                            <span></span>INDETERMINADO
                                                        </label>
                                                        <label className="radio radio-outline radio-success">
                                                            <input type = "radio" name = 'periodo' value = 'servicios'
                                                                onChange = { onChangeContrato } checked = { form.periodo === 'servicios' ? true : false } />
                                                            <span></span>SERVICIOS PROFESIONALES
                                                        </label>
                                                    </div>
                                                </div>
                                                {
                                                    form.periodo === 'determinado' || form.periodo === 'servicios' ?
                                                        <div className = 'mt-3'>
                                                            <InputNumberGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                                                withicon={1} requirevalidation={1} onChange = { onChangeContrato }
                                                                name = "dias" type = "text" value = { form.dias } placeholder="DÍAS"
                                                                iconclass="flaticon2-calendar-6" messageinc="Incorrecto. Ingresa el número de días." />
                                                        </div>
                                                    : ''
                                                }
                                            </div>
                                            <div className={`${form.periodo !== '' ? 'col-md-6' : 'd-none'}`}>
                                                <div className="text-center">
                                                    <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                        <label className="text-center font-weight-bolder">Fecha de contrato</label>
                                                    </div>
                                                    <CalendarDay date = { form.fechaInicio } onChange = { onChangeContrato } name = 'fechaInicio' 
                                                        requirevalidation = { 1 } withformgroup = { 0 } />
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        <div className="form-group row form-group-marginless mt-8">
                                            <div className="col-md-6 text-align-last-center align-self-center">
                                                <label className="text-center font-weight-bolder text-bodymb-2">Fecha de inicio - Fecha final</label><br />
                                                <RangeCalendar
                                                    onChange={onChangeRange}
                                                    start={form.fechaInicio}
                                                    end={form.fechaFin}
                                                />
                                            </div>
                                            <div className="col-md-6 align-self-center">
                                                <div className="col-md-12 mb-4">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        withformgroup={0}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="periodo_pago"
                                                        type="text"
                                                        value={form.periodo_pago}
                                                        placeholder="PERIODO DE PAGO"
                                                        iconclass="flaticon2-calendar-4"
                                                        messageinc="Incorrecto. Ingresa el periodo de pago."
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 mb-4">
                                                    <InputNumberGray
                                                        withtaglabel = { 1 }
                                                        withtextlabel = { 1 }
                                                        withplaceholder = { 1 }
                                                        withicon={1}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="pagos_hr_extra"
                                                        type="text"
                                                        value={form.pagos_hr_extra}
                                                        placeholder="PAGOS DE HORA EXTRA "
                                                        iconclass="far fa-money-bill-alt"
                                                        messageinc="Incorrecto. Ingresa el pago de hora extra."
                                                        thousandseparator = { true }
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 mb-4">
                                                    <InputNumberGray
                                                        withtaglabel = { 1 }
                                                        withtextlabel = { 1 }
                                                        withplaceholder = { 1 }
                                                        withicon={1}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="total_obra"
                                                        type="text"
                                                        value={form.total_obra}
                                                        placeholder="TOTAL DE LA OBRA"
                                                        iconclass="fas fa-dollar-sign"
                                                        messageinc="Incorrecto. Ingresa el total de la obra."
                                                        thousandseparator = { true }
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 mb-4">
                                                    <InputNumberGray
                                                        withtaglabel = { 1 }
                                                        withtextlabel = { 1 }
                                                        withplaceholder = { 1 }
                                                        withicon={1}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="dias"
                                                        type="text"
                                                        value={form.dias}
                                                        placeholder="DÍAS DEL CONTRATO"
                                                        iconclass="flaticon2-calendar-6"
                                                        messageinc="Incorrecto. Ingresa el número de días del contrato."
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        withformgroup={0}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="dias_laborables"
                                                        type="text"
                                                        value={form.dias_laborables}
                                                        placeholder="DÍAS LABORABLES"
                                                        iconclass="flaticon2-calendar-9"
                                                        messageinc="Incorrecto. Ingresa el número de días laborables."
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <div className="col-md-12 mb-4">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        withformgroup={0}
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="ubicacion_obra"
                                                        type="text"
                                                        value={form.ubicacion_obra}
                                                        placeholder="UBICACIÓN DE LA OBRA"
                                                        iconclass="flaticon2-map"
                                                        messageinc="Incorrecto. Ingresa la ubicación de la obra."
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <InputGray
                                                        withtaglabel={1}
                                                        withtextlabel={1}
                                                        withplaceholder={1}
                                                        withicon={1}
                                                        withformgroup={0}
                                                        requirevalidation={1}
                                                        formeditado={formeditado}
                                                        onChange={onChangeContrato}
                                                        name="direccion_contrato"
                                                        type="text"
                                                        value={form.direccion_contrato}
                                                        placeholder="DIRECCIÓN DEL CONTRATO"
                                                        iconclass="las la-map-marked-alt icon-xl p-0"
                                                        messageinc="Incorrecto. Ingresa la dirección del contrato."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                }      
                                {
                                    this.canSendContrado() ?
                                        <div className="card-footer pt-3 pr-1 mt-5 pb-0">
                                            <div className="row mx-0">
                                                <div className="col-lg-12 text-right pr-0 pb-0">
                                                    {
                                                        (empleado.contratos.length === 0 || renovar) ?
                                                        <span className={`btn btn-light h-40px px-3 font-weight-bolder text-${renovar ? 'info' : 'success'}`}
                                                            onClick={
                                                                (e) => {
                                                                    e.preventDefault();
                                                                    if(empleado.contratos.length === 0)
                                                                        validateAlert(generarContrato, e, 'form-empleados-contrato')
                                                                    else
                                                                        validateAlert(renovarContrato, e, 'form-empleados-contrato')
                                                                }
                                                            }>
                                                            <span className={`svg-icon svg-icon-lg svg-icon-${renovar ? 'info' : 'success'}`}>
                                                                {
                                                                    renovar?
                                                                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                                    :
                                                                    <SVG src={toAbsoluteUrl('/images/svg/File-plus.svg')} />
                                                                }
                                                            </span>{renovar?'Renovar':'Generar'}
                                                        </span>
                                                        :''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    :''
                                }
                            </Form>
                            </div>
                            : ''
                        : ''
                }
            </>
        )
    }
}

export default FormularioContrato