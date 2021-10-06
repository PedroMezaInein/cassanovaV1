import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import SVG from "react-inlinesvg";
import { URL_DEV } from '../../../../constants'
import { setNaviIcon } from '../../../../functions/setters'
import { toAbsoluteUrl } from "../../../../functions/routers"
import { setSingleHeader } from '../../../../functions/routers'
import { FilterCotizaciones } from "../../../../components/filters"
import { Modal as ModalCustom } from '../../../../components/singles'
import HistorialCotizacionesDiseño from '../info/HistorialCotizacionesDiseño'
import { Card, Dropdown, DropdownButton, Modal, Form } from 'react-bootstrap'
import PresupuestoDiseñoCRMForm from '../../leads/info/PresupuestoDiseñoCRMForm'
import { CalendarDaySwal, InputGray } from '../../../../components/form-components'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../../functions/alert'
class CotizacionesDiseño extends Component {
    state = {
        activeCotizacion: '',
        pdfs:'',
        modal: { orden_compra: false, filter: false },
        typeModal: '',
        form: {
            fechaEvidencia: new Date(),
            adjunto: '',
            numero_orden: '',
            estatus_cotizacion: '',
            motivo_cancelacion: '',
            pdf_id: 0
        },
        filtering: {},
        pdfs: []
    }
    componentDidMount() {
        const { lead } = this.props
        let { activeCotizacion } = this.state
        if (this.hasCorizaciones(lead)) {
            activeCotizacion = 'historial'
        } else {
            activeCotizacion = 'new'
        }
        this.setState({
            activeCotizacion
        })
    }

    // componentDidMount() {
    //     this.getCotizaciones()
    // }
    componentDidUpdate = (prev) => {
        const { isActive } = this.props
        const { isActive: prevActive } = prev
        if(isActive && !prevActive){
            this.setState({ ...this.state, filtering: {} })
            this.getCotizaciones({});
        }
    }
    getCotizaciones = async(filtering) => {
        const { at, lead } = this.props
        let { activeCotizacion } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/leads/crm/presupuestos/${lead.id}`, {filters: filtering}, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { pdfs } = response.data
                if (pdfs.length === 0) {
                    if (filtering !== {})
                        activeCotizacion = 'historial'
                    else
                        activeCotizacion = 'new'
                } else {
                    activeCotizacion = 'historial'
                }
                Swal.close()
                this.setState({ ...this.state, pdfs: pdfs, activeCotizacion })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openWizard1() {
        document.getElementById('validateWizard').setAttribute("data-wizard-state", "first");
        document.getElementById('wizard-1').setAttribute("data-wizard-state", "current");
        document.getElementById('wizard-2').setAttribute("data-wizard-state", "pending");
        document.getElementById('wizard-1-content').setAttribute("data-wizard-state", "current");
        document.getElementById("wizard-2-content").removeAttribute("data-wizard-state");
    }

    openWizard2() {
        var elementsInvalid = document.getElementById("wizard-1-content").getElementsByClassName("is-invalid");
        if (elementsInvalid.length === 0) {
            document.getElementById('validateWizard').setAttribute("data-wizard-state", "last");
            document.getElementById('wizard-1').setAttribute("data-wizard-state", "done");
            document.getElementById('wizard-2').setAttribute("data-wizard-state", "current");
            document.getElementById('wizard-2-content').setAttribute("data-wizard-state", "current");
            document.getElementById("wizard-1-content").removeAttribute("data-wizard-state");
        } else {
            Swal.fire({
                title: '¡LO SENTIMOS!',
                text: 'Llena todos los campos requeridos',
                icon: 'warning',
                customClass: {
                    actions: 'd-none'
                },
                timer: 2500,
            })
        }
    }
    getTitle = () => {
        const { activeCotizacion } = this.state
        const { lead } = this.props
        switch (activeCotizacion) {
            case 'new':
                if (!this.hasCorizaciones(lead)) {
                    return 'NUEVA COTIZACIÓN'
                } else {
                    return 'ACTUALIZAR COTIZACIÓN'
                }
            case 'historial':
                return 'COTIZACIONES GENERADAS'
            case 'contratar':
                return 'CONVERTIR LEAD'
            default:
                return ''
        }
    }
    showBtnHistorial(lead){
        const { activeCotizacion } = this.state
        if((activeCotizacion === 'new' && this.hasCorizaciones(lead)) || (activeCotizacion === 'contratar')){
            return true
        }
        return false
    }
    onClickCotizacion = (type) => {
        const { filtering } = this.state
        if( type === 'historial'){
            this.getCotizaciones(filtering)
        }
        this.setState({
            ...this.state,
            activeCotizacion: type
        })
    }

    hasCorizaciones(lead) {
        if (lead)
            if (lead.presupuesto_diseño)
                if (lead.presupuesto_diseño.pdfs)
                    if (lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }
    changePageContratar = (pdf) => {
        const { au } = this.props
        console.log(`AU`, au)
        /* window.location.href = `http://localhost:3001?tag=${au.access_token}` */

        /* window.location.href = '/enrollment-form/citizenship'; */
        const { history, lead } = this.props
        
        history.push({ pathname: '/leads/crm/contratar', state: { lead: lead, cotizacionId : pdf} })
    }
    /* -------------------------------------------------------------------------- */
    /*                              ORDEN DE COMPRA                               */
    /* -------------------------------------------------------------------------- */
    onClickOrden = (type, pdf) => {
        let { typeModal, form } = this.state
        const { modal } = this.state
        modal.orden_compra = true
        switch(type){
            case 'add-orden':
                typeModal = 'add'
                form.pdf_id = pdf
                this.setState({...this.state, typeModal, modal, form})
                break;
            case 'modify-orden':
                typeModal = 'modify'
                form.pdf_id = pdf
                this.setState({...this.state, typeModal, modal, form})
                break;
            default: break;
        }
    }
    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.orden_compra = false
        form.fechaEvidencia = new Date()
        form.adjunto = ''
        form.numero_orden = ''
        form.estatus_cotizacion = ''
        form.motivo_cancelacion = ''
        this.setState({ ...this.state, modal, form })
    }
    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onChangeRadio = e => {
        const { name, value, type } = e.target
        const { form } = this.state
        if (type === 'radio') {
            if (name === 'estatus_cotizacion') {
                form[name] = parseInt(value)
            }
        }
        this.setState({
            ...this.state,
            form,
        })
    }
    changeNameFile(id) {
        var pdrs = document.getElementById(id).files[0].name;
        document.getElementById('info').innerHTML = pdrs;
    }
    onSubmitOrden = async () => {
        const { form, typeModal } = this.state
        const { at, history, lead } = this.props
        waitAlert();
            if(typeModal === 'add'){
                history.push({ pathname: '/leads/crm/contratar', state: { lead: lead, form_orden: form } })
            }else{
                let data = new FormData()
                data.append(`adjuntoEvidencia`, form.adjunto)
                data.append(`estatus_final`, `${form.estatus_cotizacion===1?'Aceptado':'Rechazado'}`)
                data.append(`fechaEvidencia`, (new Date(form.fechaEvidencia)).toDateString())
                data.append(`orden_compra`, form.numero_orden)
                data.append(`pdfId`, form.pdf_id)
                data.append('motivo_rechazo', form.motivo_cancelacion)
                await axios.post(`${URL_DEV}2/leads/crm/info/info/${lead.id}/estatus?_method=PUT`, data, 
                    { headers: setSingleHeader(at) }).then(
                    (response) => {
                        this.handleCloseOrden()
                        doneAlert( `${form.estatus_cotizacion===1 ? 'La orden de compra fue adjuntada con éxito.' : 'La cotización fue rechazada con éxito'}`)
                    },
                    (error) => { printResponseErrorAlert(error) }
                ).catch((error) => {
                    errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                    console.error(error, 'error')
                })
            }
        // }
    }
    formAceptar(form, typeModal) {
        return (
            <>
                {
                    form.estatus_cotizacion === 1 || typeModal === 'modify'?
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
                        :form.estatus_cotizacion === 2?
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
    /* -------------------------------------------------------------------------- */
    /*                           FILTRADO COTIZACIONES                            */
    /* -------------------------------------------------------------------------- */
    openFormFilter = () => {
        const { modal } = this.state
        modal.filter = true
        this.setState({
            ...this.state,
            modal,
            formeditado: 0
        })
    }
    handleCloseFilter = () => {
        const { modal } = this.state
        modal.filter = false
        this.setState({ ...this.state, modal})
    }
    filterTable = async(form) => {
        waitAlert()
        const { modal } = this.state
        modal.filter = false
        this.setState({ ...this.state, filtering: form, modal })
        this.getCotizaciones(form)
    }
    
    render() {
        const { lead, sendPresupuesto, options, formDiseño, onChange, onChangeConceptos, checkButtonSemanas, onChangeCheckboxes,
            onSubmit, submitPDF, formeditado, onClickTab, activeKey, defaultKey, onChangePartidas, at } = this.props
        const { activeCotizacion, modal, form, typeModal, filtering, pdfs } = this.state
        return (
            <>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                        <div className="card-toolbar">
                            <div className="card-toolbar toolbar-dropdown">
                                <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                    {
                                        activeCotizacion === 'historial' ?
                                            <>
                                                <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.onClickCotizacion('new') }}>
                                                    {setNaviIcon(`las icon-lg la-${!this.hasCorizaciones(lead) ? 'plus' : 'edit'}`, `${!this.hasCorizaciones(lead) ? 'AGREGAR NUEVA COTIZACIÓN' : 'MODIFICAR COTIZACIÓN'}`)}
                                                </Dropdown.Item>
                                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => { this.openFormFilter('filter') }}>
                                                    {setNaviIcon(`las la-filter icon-lg`, 'FILTRAR COTIZACIONES')}
                                                </Dropdown.Item>
                                            </>
                                        : <></>
                                    }
                                    {
                                        this.showBtnHistorial(lead) ?
                                            <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickCotizacion('historial') }}>
                                                {setNaviIcon(`las la-clipboard-list icon-lg`, 'HISTORIAL DE COTIZACIONES')}
                                            </Dropdown.Item>
                                        : <></>
                                    }
                                </DropdownButton>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            activeCotizacion === 'historial' ?
                                <HistorialCotizacionesDiseño pdfs={pdfs} sendPresupuesto={sendPresupuesto} changePageContratar={this.changePageContratar} onClickOrden={this.onClickOrden} options={options} />
                                : activeCotizacion === 'new' ?
                                    <PresupuestoDiseñoCRMForm
                                        options={options}
                                        formDiseño={formDiseño}
                                        onChange={onChange}
                                        onChangeConceptos={onChangeConceptos}
                                        checkButtonSemanas={checkButtonSemanas}
                                        onChangeCheckboxes={onChangeCheckboxes}
                                        onSubmit={onSubmit}
                                        submitPDF={submitPDF}
                                        formeditado={formeditado}
                                        onClickTab={onClickTab}
                                        activeKey={activeKey}
                                        defaultKey={defaultKey}
                                        onChangePartidas={onChangePartidas}
                                    />
                                    : <></>
                        }
                    </Card.Body>
                </Card>
                <Modal show={modal.orden_compra} onHide={this.handleCloseOrden} centered contentClassName='swal2-popup d-flex w-40rem'>
                    <Modal.Header className={`${typeModal === 'add' && (form.estatus_cotizacion === 1 || form.estatus_cotizacion === 2) ? 'd-none':'mt-5'} border-0 justify-content-center swal2-title text-center font-size-h4`}>
                        {typeModal === 'modify'? 'MODIFICAR ORDEN DE COMPRA': 'LA COTIZACIÓN FUE:'}
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        {
                            typeModal === 'add' ?
                                <div className="wizard wizard-6" id="validateWizard" data-wizard-state="first">
                                    <div className="wizard-content d-flex flex-column mx-auto">
                                        <div className={`${form.estatus_cotizacion ? 'd-flex' : 'd-none'} flex-column-auto flex-column px-0`}>
                                            <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                                <div className="wizard-steps d-flex flex-column flex-md-row">
                                                    <div id="wizard-1" className="wizard-step flex-grow-1 flex-basis-0 mb-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { this.openWizard1() }}>
                                                        <div className="wizard-wrapper pr-lg-7 pr-5">
                                                            <div className="wizard-icon">
                                                                <i className="wizard-check fas fa-check"></i>
                                                                <span className="wizard-number">1</span>
                                                            </div>
                                                            <div className="wizard-label mr-3">
                                                                <h3 className="wizard-title mb-0">{form.estatus_cotizacion ? 'Cotización' : 'Estatus de cotización'}</h3>
                                                                <div className="wizard-desc">{form.estatus_cotizacion === 1 ? 'Aceptada' : 'Rechazada'}</div>
                                                            </div>
                                                            <span className={`${form.estatus_cotizacion === 1 ? 'svg-icon' : 'd-none'}`}>
                                                                <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div id="wizard-2" className="wizard-step flex-grow-1 flex-basis-0 mb-0" data-wizard-type="step" onClick={() => { this.openWizard2() }}>
                                                        <div className={`${form.estatus_cotizacion ? 'wizard-wrapper' : 'd-none'}`}>
                                                            <div className="wizard-icon">
                                                                <i className="wizard-check fas fa-check"></i>
                                                                <span className="wizard-number">2</span>
                                                            </div>
                                                            <div className="wizard-label">
                                                                <h3 className="wizard-title mb-0">{form.estatus_cotizacion === 1 ? 'Orden de compra' : 'Motivo de rechazo'}</h3>
                                                                <div className="wizard-desc">{form.estatus_cotizacion === 1 ? 'Agregar orden' : 'Agregar de motivo'}</div>
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
                                                    validateAlert(this.onSubmitOrden, e, 'validateWizard')
                                                }
                                            }
                                        >
                                            <div id="wizard-1-content" data-wizard-type="step-content" data-wizard-state="current">
                                                <div className="d-flex justify-content-center mt-5">
                                                    <div className="text-center">
                                                        <label className={`${form.estatus_cotizacion ? 'd-flex' : 'd-none'} w-auto py-0 col-form-label text-dark-75 font-weight-bolder font-size-h6 mb-5 justify-content-center`}>La cotización fue:</label>
                                                        <div className="w-auto">
                                                            <div className="radio-inline">
                                                                <label className="radio radio-outline radio-brand text-dark-75 font-weight-light">
                                                                    <input type="radio" name='estatus_cotizacion' value={1} onChange={this.onChangeRadio} checked={form.estatus_cotizacion === 1 ? true : false} />Aceptada
                                                                    <span></span>
                                                                </label>
                                                                <label className="radio radio-outline radio-brand text-dark-75 font-weight-light">
                                                                    <input type="radio" name='estatus_cotizacion' value={2} onChange={this.onChangeRadio} checked={form.estatus_cotizacion === 2 ? true : false} />Rechazada
                                                                    <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    form.estatus_cotizacion ?
                                                        <div className="d-flex justify-content-end pt-3 border-top mt-5">
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold mt-0" onClick={() => { this.openWizard2() }}>Siguiente
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                </span>
                                                            </button>
                                                        </div>
                                                        : <></>
                                                }
                                            </div>
                                            <div id="wizard-2-content" data-wizard-type="step-content">
                                                {this.formAceptar(form, typeModal)}
                                                <div className="d-flex justify-content-between border-top pt-3 mt-5">
                                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold mt-0" onClick={() => { this.openWizard1() }}>
                                                        <span className="svg-icon svg-icon-md mr-2">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                                        </span>Anterior
                                                    </button>
                                                    <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold mt-0" onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'validateWizard') }} >Enviar
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
                <ModalCustom size = "lg" title = 'Filtrar historial' show = { modal.filter } handleClose = { this.handleCloseFilter} >
                    <FilterCotizaciones at={at} filtering = { this.filterTable } filters = { filtering } />
                </ModalCustom>
            </>
        )
    }
}

export default CotizacionesDiseño