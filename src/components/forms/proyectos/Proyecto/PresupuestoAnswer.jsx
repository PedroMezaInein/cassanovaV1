import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { HistorialPresupuestos } from '../../../forms'
import { Modal, Form, Row } from "react-bootstrap"
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../../functions/alert'
import { CalendarDaySwal, InputGray } from '../../../../components/form-components'
import { setSingleHeader } from '../../../../functions/routers'
import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../../functions/wizard'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"

class PresupuestoAnswer extends Component {
    state = {
        modal: { orden_compra: false },
        typeModal: '',
        pdfId: 0,
        form: {
            fechaEvidencia: new Date(),
            adjunto: '',
            numero_orden: '',
            estatus_presupuesto:'',
            motivo_cancelacion:''
        }
    }
    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.orden_compra = false
        form.fechaEvidencia = new Date()
        form.adjunto = ''
        form.numero_orden = ''
        form.estatus_presupuesto = ''
        form.motivo_cancelacion = ''
        this.setState({...this.state, modal, form })
    }
    onClickOrden = (type, pdf) => {
        let { typeModal, pdfId } = this.state
        const { modal } = this.state
        modal.orden_compra = true
        switch(type){
            case 'add-orden':
                typeModal = 'add'
                pdfId = pdf.id
                this.setState({...this.state, typeModal, modal, pdfId})
                break;
            case 'modify-orden':
                typeModal = 'modify'
                pdfId = pdf.id
                this.setState({...this.state, typeModal, modal, pdfId})
                break;
            default: break;
        }
    }
    onSubmitOrden = async () => {
        const { form, modal, pdfId, typeModal } = this.state
        const { at, presupuesto, getPresupuestos } = this.props
        waitAlert();
        if(typeModal === 'modify'){
            if(pdfId){
                let data = new FormData()
                data.append('file', form.adjunto)
                data.append('adjunto', pdfId)
                data.append('orden', form.numero_orden)
                await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/orden-compra?_method=PUT`, data, 
                    { headers: setSingleHeader(at) }).then(
                    (response) => {
                        modal.orden_compra = false
                        this.setState({ ...this.state, modal })
                        doneAlert('La orden de compra fue adjuntada con éxito.', () => { getPresupuestos() })
                    }, (error) => { printResponseErrorAlert(error) }
                ).catch((error) => {
                    errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                    console.error(error, 'error')
                })
            }else{ errorAlert(`No fue posible encontrar el presupuesto`) }
        }else{
            
            let data = new FormData()
            data.append(`adjuntoEvidencia`, form.adjunto)
            data.append(`estatus_final`, `${form.estatus_presupuesto===1?'Aceptado':'Rechazado'}`)
            data.append(`fechaEvidencia`, (new Date(form.fechaEvidencia)).toDateString())
            data.append(`orden_compra`, form.numero_orden)
            data.append(`pdfId`, pdfId)
            data.append('motivo_cancelacion', form.motivo_cancelacion)
            await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/estatus?_method=PUT`, data, 
                { headers: setSingleHeader(at) }).then(
                (response) => {
                    modal.orden_compra = false
                    this.setState({ ...this.state, modal })
                    doneAlert('La orden de compra fue adjuntada con éxito.', () => { getPresupuestos() })
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }
    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }
    onChangeRadio = e => {
        const { name, value, type } = e.target
        const { form } = this.state
        if(type === 'radio'){
            if(name === 'estatus_presupuesto'){
                form[name] = parseInt(value)
            }
        }
        this.setState({
            ...this.state,
            form,
        })
    }
    changeNameFile(id){
        var pdrs = document.getElementById(id).files[0].name;
        document.getElementById('info').innerHTML = pdrs;
    }
    formAceptar(form, typeModal) {
        return (
            <>
                {
                    form.estatus_presupuesto === 1 || typeModal === 'modify'?
                        <div className='row mx-0 justify-content-center'>
                            <div className="col-md-12 mt-6">
                                {
                                    typeModal === 'add' ?
                                        <>
                                            <div className="form-group row form-group-marginless mb-0">
                                                <div className="col-md-12 text-center">
                                                    <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                        <label className="text-center font-weight-bolder">Fecha de visto bueno</label>
                                                    </div>
                                                    <CalendarDaySwal
                                                        value={form.fechaEvidencia} name='fechaEvidencia' date={form.fechaEvidencia}
                                                        onChange={(e) => { this.onChange(e.target.value, 'fechaEvidencia') }} withformgroup={0} />
                                                </div>
                                            </div>
                                            <div className="separator separator-dashed my-5"></div>
                                        </>
                                        : <></>
                                }
                                <div className="row mx-0 form-group-marginless">
                                    <div className="col-md-12 text-justify">
                                        <InputGray
                                            withtaglabel={0}
                                            withtextlabel={0}
                                            withplaceholder={1}
                                            withicon={1}
                                            iconclass='las la-hashtag icon-xl'
                                            requirevalidation={0}
                                            value={form.numero_orden}
                                            name='numero_orden'
                                            onChange={(e) => { this.onChange(e.target.value, 'numero_orden') }}
                                            swal={true}
                                            placeholder='NÚMERO DE ORDEN DE COMPRA'
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-5 mb-2"></div>
                                <div className="form-group row form-group-marginless mt-5 mb-0">
                                    <div className="col-md-12">
                                        <label htmlFor="adjunto" className="drop-files">
                                            <i className="las la-file-pdf icon-xl text-primary"></i>
                                            <input
                                                id="adjunto"
                                                type="file"
                                                onChange={(e) => { this.onChange(e.target.files[0], 'adjunto'); this.changeNameFile('adjunto') }}
                                                name='adjunto'
                                                accept="application/pdf"
                                            />
                                            <div className="font-weight-bolder font-size-md ml-2" id="info">Subir orden de compra (PDF)</div>
                                        </label>
                                        {
                                            form.adjunto === '' ?
                                                <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :form.estatus_presupuesto === 2?
                        <div className="row mx-0 form-group-marginless mt-5">
                            <div className="col-md-12 text-justify">
                                <InputGray
                                    withtaglabel={0}
                                    withtextlabel={0}
                                    withplaceholder={1}
                                    withicon={0}
                                    value={form.motivo_cancelacion}
                                    name='motivo_cancelacion'
                                    onChange={(e) => { this.onChange(e.target.value, 'motivo_cancelacion') }}
                                    swal={true}
                                    requirevalidation={1}
                                    rows="3"
                                    as="textarea"
                                    placeholder="MOTIVO DE RECHAZO"
                                    customclass="px-2"
                                    messageinc="Incorrecto. Ingresa el motivo de rechazo."
                                />
                            </div>
                        </div>
                        :<></>
                }
            </>
        )
    }
    render() {
        const { presupuesto } = this.props
        const { modal, form, typeModal } = this.state
        return (
            <>
                <HistorialPresupuestos presupuesto = { presupuesto } actionsEnable = { false } btnOrden = { true } onClickOrden = { this.onClickOrden }/>
                <Modal show = { modal.orden_compra } onHide = { this.handleCloseOrden } centered contentClassName = 'swal2-popup d-flex w-40rem'>
                    <Modal.Header className = {`${typeModal === 'add' && (form.estatus_presupuesto === 1 || form.estatus_presupuesto === 2) ? 'd-none':'mt-5'} border-0 justify-content-center swal2-title text-center font-size-h4`}>
                        {typeModal === 'modify'? 'MODIFICAR NOTA DE OBRA': 'EL PRESUPUESTO FUE:'}
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        {
                            typeModal === 'add' ?
                                <div className="wizard wizard-6" id="for2-wizardP" data-wizard-state="first">
                                    <div className="wizard-content d-flex flex-column mx-auto">
                                        <div className={`${form.estatus_presupuesto? 'd-flex' : 'd-none'} flex-column-auto flex-column px-0`}>
                                            <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                                <div className="wizard-steps d-flex flex-column flex-md-row">
                                                    <div id="for2-wizard-1" className="wizard-step flex-grow-1 flex-basis-0 mb-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                                            <div className="wizard-icon">
                                                                <i className="wizard-check fas fa-check"></i>
                                                                <span className="wizard-number">1</span>
                                                            </div>
                                                            <div className="wizard-label mr-3">
                                                                <h3 className="wizard-title mb-0">{form.estatus_presupuesto ? 'Presupuesto' : 'Estatus de presupuesto'}</h3>
                                                                <div className="wizard-desc">{form.estatus_presupuesto === 1 ? 'Aceptado' : 'Rechazado'}</div>
                                                            </div>
                                                            <span className={`${form.estatus_presupuesto === 1 ? 'svg-icon' : 'd-none'}`}>
                                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div id="for2-wizard-2" className="wizard-step flex-grow-1 flex-basis-0 mb-0" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                                                        <div className={`${form.estatus_presupuesto? 'wizard-wrapper' : 'd-none'}`}>
                                                            <div className="wizard-icon">
                                                                <i className="wizard-check fas fa-check"></i>
                                                                <span className="wizard-number">2</span>
                                                            </div>
                                                            <div className="wizard-label">
                                                                <h3 className="wizard-title mb-0">{form.estatus_presupuesto === 1 ? 'Orden de compra' : 'Motivo de rechazo'}</h3>
                                                                <div className="wizard-desc">{form.estatus_presupuesto === 1 ? 'Agregar orden' : 'Agregar de motivo'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Form
                                            onSubmit={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(this.onSubmitOrden, e, 'for2-wizardP')
                                                }
                                            }
                                        >
                                            <div id="for2-wizard-1-content" data-wizard-type="step-content" data-wizard-state="current">
                                                <div className="d-flex justify-content-center mt-5">
                                                    <div className="text-center">
                                                        <label className={`${form.estatus_presupuesto ? 'd-flex' : 'd-none'} w-auto py-0 col-form-label text-dark-75 font-weight-bolder font-size-h6 mb-5 justify-content-center`}>El presupuesto fue:</label>
                                                        <div className="w-auto">
                                                            <div className="radio-inline">
                                                                <label className="radio radio-outline radio-brand text-dark-75 font-weight-light">
                                                                    <input type="radio" name='estatus_presupuesto' value={1} onChange={this.onChangeRadio} checked={form.estatus_presupuesto === 1 ? true : false} />Aceptado
                                                                    <span></span>
                                                                </label>
                                                                <label className="radio radio-outline radio-brand text-dark-75 font-weight-light">
                                                                    <input type="radio" name='estatus_presupuesto' value={2} onChange={this.onChangeRadio} checked={form.estatus_presupuesto === 2 ? true : false} />Rechazado
                                                                    <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    form.estatus_presupuesto ?
                                                        <div className="d-flex justify-content-end pt-3 border-top mt-5">
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold mt-0" onClick={() => { openWizard2_for2_wizard() }}>Siguiente
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    : <></>
                                                }
                                            </div>
                                            <div id="for2-wizard-2-content" data-wizard-type="step-content">
                                                {this.formAceptar(form, typeModal)}
                                                <div className="d-flex justify-content-between border-top pt-3 mt-5">
                                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold mt-0" onClick={() => { openWizard1_for2_wizard() }}>
                                                        <span className="svg-icon svg-icon-md mr-2">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                                        </span>Anterior
                                                    </button>
                                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold mt-0" onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'for2-wizardP') }} >Enviar
                                                        <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                                :
                                <Form id="form-orden" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                                    {this.formAceptar(form, typeModal)}
                                </Form>
                        }
                    </Modal.Body>
                    {
                        typeModal === 'modify' ?
                            <Modal.Footer className='border-0 justify-content-center'>
                                <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex"
                                    onClick={this.handleCloseOrden}>
                                    CANCELAR
                                </button>
                                <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex"
                                    onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }} >
                                    MODIFICAR
                                </button>
                            </Modal.Footer>
                        : <></>
                    }
                </Modal>
            </>
        )
    }
}

export default PresupuestoAnswer