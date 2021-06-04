import React, { Component } from 'react'
import { validateAlert, sendFileAlert } from '../../../functions/alert'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { InputGray, RangeCalendar, InputNumberGray, FileInput } from '../../form-components'
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
        const { showForm } = this.state
        $("#show_buttons").removeClass("d-none").addClass("d-flex");
        this.setState({
            ...this.state,
            showForm: !showForm,
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
        const { showHistorial } = this.state
        $("#show_buttons").removeClass("d-none").addClass("d-flex");
        this.setState({
            ...this.state,
            showHistorial: !showHistorial,
            showForm: false
        })
    }
    render() {
        const { empleado, form, onChangeContrato, onChangeRange, generarContrato, onChangeAdjuntos } = this.props
        const { renovar, showForm, showHistorial } = this.state
        return (
            <>
                <div id='show_buttons' className="justify-content-end mb-10 mt-5 d-none">
                    
                    {
                        empleado ?
                            empleado.contratos.length > 0 &&
                            // <button className={`btn font-weight-bolder ${showHistorial  ? 'btn-success' : 'btn-light-success'}`} onClick={() => { this.mostrarHistorial() }}>
                            //     <i className="flaticon2-list-2"></i> HISTORIAL DE CONTRATOS
                            // </button>
                            <div className={`btn btn-icon btn-clean w-auto btn-clean d-inline-flex align-items-center btn-lg px-2 mr-5 ${showHistorial  ? 'active' : ''}`} onClick={() => { this.mostrarHistorial() }}>
                                <span className="text-dark-50 font-weight-bolder font-size-base mr-2">HISTORIAL DE CONTRATOS</span>
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
                                <div className={`btn btn-icon btn-clean w-auto btn-clean d-inline-flex align-items-center btn-lg px-2 ${showForm  ? 'active' : ''}`} onClick={() => { this.mostrarFormulario() }}>
                                    <span className="text-dark-50 font-weight-bolder font-size-base mr-2">FORMULARIO DE CONTRATO</span>
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
                                        <th style={{ minWidth: '160px' }}>Fecha</th>
                                        <th style={{ minWidth: '115px' }}>Estatus</th>
                                        <th style={{ minWidth: '120px' }}>Contrato</th>
                                        <th style={{ minWidth: '90px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        empleado.contratos.map((contrato, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="text-center">
                                                        <a className="text-dark-75 font-weight-bolder font-size-lg">
                                                            { 
                                                                contrato.tipo_contrato === 'obra' ? 
                                                                    'OBRA DETERMINADA' 
                                                                :  contrato.indefinido === 1 ? 'TIEMPO DETERMINADO' : 'INDEFINIDO'
                                                            }
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="w-fit-content mx-auto">
                                                            <div>
                                                                <span className="text-dark-75 font-weight-bolder font-size-lg">Inicio:</span>
                                                                <span className="text-muted font-weight-bold ml-1">{<Moment format="DD/MM/YYYY">{contrato.fecha_inicio}</Moment>}</span>
                                                            </div>
                                                            {
                                                                contrato.indefinido !== 0 &&
                                                                <div>
                                                                    <span className="text-dark-75 font-weight-bolder font-size-lg">Final:</span>
                                                                    <span className="text-muted font-weight-bold ml-1">{<Moment format="DD/MM/YYYY">{contrato.fecha_fin}</Moment>}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>
                                                    {/* `icon-${item.isCollapsed ? 'expander' : 'collapser'} */}
                                                    <td className="text-center">
                                                        <span className={`label label-light-${contrato.terminado === 0 ? 'success' : 'danger'} label-pill label-inline font-weight-bolder`}>{contrato.terminado === 0 ? 'ACTIVO' : 'TERMINADO'}</span>
                                                    </td>
                                                    <td>
                                                        <FileInput requirevalidation = { 0 } onChangeAdjunto = { onChangeAdjuntos }
                                                            placeholder = 'Adjuntar' value = { form.adjuntos.contrato.value } name = {contrato.id} id = 'adjunto-contrato'
                                                            accept = "application/pdf" files = { form.adjuntos.contrato.files } deleteAdjunto = { this.clearFiles }
                                                            classbtn = 'btn btn-hover-icon-success font-weight-bolder text-dark-50 mb-0 p-0'
                                                            iconclass = 'flaticon-attachment text-primary' />
                                                    </td>
                                                    <td className="text-center">
                                                        <OverlayTrigger overlay={<Tooltip>RENOVAR</Tooltip>}>
                                                            <a className="btn btn-light btn-icon h-35px mr-2 font-weight-bolder" onClick = { (e) => { e.preventDefault();  this.mostrarForm()   }}>
                                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                                                                </span>
                                                            </a>
                                                        </OverlayTrigger>
                                                        {
                                                            contrato.terminado === 0 ?
                                                                <OverlayTrigger overlay={<Tooltip>TERMINAR</Tooltip>}>
                                                                    <a className="btn btn-light btn-icon h-35px font-weight-bolder">
                                                                        <span className="svg-icon svg-icon-lg svg-icon-danger">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                                                                        </span>
                                                                    </a>
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
                                        <div className="form-group row form-group-marginless mt-8">
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
                                <div className="card-footer pt-3 pr-1 mt-5 pb-0">
                                    <div className="row mx-0">
                                        <div className="col-lg-12 text-right pr-0 pb-0">
                                            {
                                                (empleado.contratos.length === 0 || renovar) ?
                                                <a className={`btn btn-light h-40px px-3 font-weight-bolder text-${renovar ? 'info' : 'success'}`}
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(generarContrato, e, 'form-empleados-contrato')
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
                                                </a>
                                                :''
                                            }
                                        </div>
                                    </div>
                                </div>
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