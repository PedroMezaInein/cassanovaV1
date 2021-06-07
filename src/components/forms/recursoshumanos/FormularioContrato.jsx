import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { InputGray, RangeCalendar, InputNumberGray, FileInput, CalendarDay } from '../../form-components'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Moment from 'react-moment'
import $ from "jquery";
class FormularioContrato extends Component {
    state = {
        renovar: false,
        showForm: true,
        showHistorial: true
    }
    clearFiles = (name, key) => {
        const { form } = this.props
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
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
    render() {
        const { empleado, form, onChangeContrato, onChangeRange, generarContrato, onChangeAdjuntos, cancelarContrato, renovarContrato } = this.props
        const { renovar, showForm, showHistorial } = this.state
        return (
            <>
                <div id='show_buttons' className="justify-content-center mb-10 mt-5 d-none">
                    
                    {
                        empleado ?
                            empleado.contratos.length > 0 &&
                            // <button className={`btn font-weight-bolder ${showHistorial  ? 'btn-success' : 'btn-light-success'}`} onClick={() => { this.mostrarHistorial() }}>
                            //     <i className="flaticon2-list-2"></i> HISTORIAL DE CONTRATOS
                            // </button>
                            <div className={`btn btn-icon btn-clean w-auto btn-clean d-inline-flex align-items-center btn-lg px-2 mr-5 border ${showHistorial  ? 'active border-0' : ''}`} onClick={() => { this.mostrarHistorial() }}>
                                <span className="text-dark-50 font-weight-bolder font-size-base mr-2">HISTORIAL</span>
                                <span className="symbol symbol-35 symbol-light-primary">
                                    <span className="symbol-label font-size-h5 font-weight-bold"><i className="flaticon2-list-3 text-primary"></i></span>
                                </span>
                            </div>
                            :''
                    }
                    {
                        empleado ?
                            (empleado.contratos.length === 0 || renovar) ?
                                // <button className={`btn font-weight-bolder ml-2 ${showForm  ? 'btn-primary' : 'btn-light-primary'}`} onClick={() => { this.mostrarFormulario() }}>
                                //     <i className="flaticon2-writing"></i> FORMULARIO DE CONTRATO
                                // </button>
                                <div className={`btn btn-icon btn-clean w-auto btn-clean d-inline-flex align-items-center btn-lg px-2 border ${showForm  ? 'active border-0' : ''}`} onClick={() => { this.mostrarFormulario() }}>
                                    <span className="text-dark-50 font-weight-bolder font-size-base mr-2">RENOVAR</span>
                                    <span className="symbol symbol-35 symbol-light-info">
                                        <span className="symbol-label font-size-h5 font-weight-bold"><i className="flaticon2-writing text-info"></i></span>
                                    </span>
                                </div>
                            :''
                        :''
                    }
                </div>
                {
                    empleado ?
                        empleado.contratos.length > 0 &&
                        <div className={`table-responsive-lg mt-8  ${showHistorial ? '' : 'd-none'}`}>
                            <table className="table table-responsive-lg table-head-custom table-vertical-center w-100">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ minWidth: '155px' }}>Tipo de contrato</th>
                                        <th style={{ minWidth: '140px' }}>Fecha</th>
                                        <th style={{ minWidth: '100px' }}>Estatus</th>
                                        <th style={{ minWidth: '125px' }}>Adjuntar</th>
                                        <th style={{ minWidth: '102px' }}>Contrato</th>
                                        <th style={{ minWidth: '103px' }}></th>
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
                                                                :  contrato.indefinido === 0 ? 'INDEFINIDO' : 'TIEMPO DETERMINADO'
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="w-fit-content mx-auto">
                                                            <div>
                                                                <span className="text-dark-75 font-weight-bolder font-size-lg">Inicio:</span>
                                                                <span className="text-muted font-weight-bold ml-1">{<Moment format="DD/MM/YYYY">{contrato.fecha_inicio}</Moment>}</span>
                                                            </div>
                                                            {
                                                                contrato.fecha_fin !== null &&
                                                                <div>
                                                                    <span className="text-dark-75 font-weight-bolder font-size-lg">Final:</span>
                                                                    <span className="text-muted font-weight-bold ml-1">{<Moment format="DD/MM/YYYY">{contrato.fecha_fin}</Moment>}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>
                                                    
                                                    <td className="text-center">
                                                        <span className={`label label-light-${contrato.terminado === 0 ? 'success' : 'danger'} label-pill label-inline font-weight-bolder`}>{contrato.terminado === 0 ? 'ACTIVO' : 'TERMINADO'}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <FileInput requirevalidation = { 0 } onChangeAdjunto = { onChangeAdjuntos }
                                                            placeholder = 'CONTRATO' value = { form.adjuntos.contrato.value } name = {contrato.id} id = 'adjunto-contrato'
                                                            accept = "application/pdf" files = { form.adjuntos.contrato.files } deleteAdjunto = { this.clearFiles }
                                                            classbtn = 'btn btn-hover-icon-success font-weight-bolder text-dark-50 mb-0 p-0'
                                                            iconclass = 'flaticon-attachment text-primary' />
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="w-fit-content mx-auto">
                                                            <a className="text-primary font-weight-bolder text-hover-success d-block" rel="noopener noreferrer" href={contrato.contrato} target="_blank">GENERADO</a>
                                                            {
                                                                contrato.contrato_firmado !== null &&
                                                                <a className="text-primary font-weight-bolder  mt-1 text-hover-success" rel="noopener noreferrer" href={contrato.contrato_firmado} target="_blank">FIRMADO</a>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <OverlayTrigger overlay={<Tooltip>RENOVAR</Tooltip>}>
                                                            <span className="btn btn-light btn-icon h-35px font-weight-bolder" onClick = { (e) => { e.preventDefault();  this.mostrarForm()   }}>
                                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                                </span>
                                                            </span>
                                                        </OverlayTrigger>
                                                        {
                                                            contrato.terminado === 0 ?
                                                                <OverlayTrigger overlay={<Tooltip>TERMINAR</Tooltip>}>
                                                                    <span className="btn btn-light btn-icon h-35px font-weight-bolder ml-2"  onClick={() => { cancelarContrato(contrato) }} >
                                                                        <span className="svg-icon svg-icon-lg svg-icon-danger">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                                                                        </span>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            : <></>
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
                                        <div className="form-group row form-group-marginless mt-8 align-items-center">
                                            <div className={form.periodo === true ? 'col-md-6' : 'col-md-12'}>
                                                <div className="mx-auto w-fit-content">
                                                    <label className="font-weight-bolder">Periodo del contrato</label>
                                                    <div className="radio-list">
                                                        <label className="radio radio-outline radio-success">
                                                            <input
                                                                type="radio"
                                                                name='periodo'
                                                                value={true}
                                                                onChange={onChangeContrato}
                                                                checked={form.periodo === true ? true : false}
                                                            />
                                                            <span></span>DÍAS</label>
                                                        <label className="radio radio-outline radio-success">
                                                            <input
                                                                type="radio"
                                                                name='periodo'
                                                                value={false}
                                                                onChange={onChangeContrato}
                                                                checked={form.periodo === false ? true : false}
                                                            />
                                                            <span></span>INDEFINIDO</label>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                form.periodo === true &&
                                                <div className="col-md-6">
                                                    <InputNumberGray
                                                        formgroup="mb-0"
                                                        requirevalidation={1}
                                                        onChange={onChangeContrato}
                                                        name="dias"
                                                        type="text"
                                                        value={form.dias}
                                                        placeholder="DÍAS"
                                                        iconclass="flaticon2-calendar-6"
                                                        messageinc="Incorrecto. Ingresa el número de días."
                                                    />
                                                </div>
                                            }
                                            {
                                                renovar &&
                                                <div className="col-md-12 text-center align-self-center mt-10">
                                                    <div className="text-center">
                                                        <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                            <label className="text-center font-weight-bolder">Fecha de contrato</label>
                                                        </div>
                                                        <CalendarDay date={form.fechaInicio} onChange={onChangeContrato} name='fechaInicio' requirevalidation={1} withformgroup={0} />
                                                    </div>
                                                </div>
                                            }
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
                                                        formgroup="mb-0"
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
                                                        formgroup="mb-0"
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
                                                <div className="form-group col-md-12">
                                                    <InputNumberGray
                                                        formgroup="mb-0"
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
                                                <div className="col-md-12">
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
                                            </div>
                                        </div>
                                }      
                                {
                                    ( (form.periodo === false)  || (form.periodo === true && form.dias !== '' ) || (form.periodo_pago !== '' && form.pagos_hr_extra !== '' && form.total_obra !== '' && form.dias !== '' && form.dias_laborables !== '' && form.ubicacion_obra !== '')) ?
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