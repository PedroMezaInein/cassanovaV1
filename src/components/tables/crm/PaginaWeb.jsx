import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Scrollbar from 'perfect-scrollbar-react'
import { LEADS_FRONT } from '../../../constants'
import { InputGray } from '../../form-components'
import 'perfect-scrollbar-react/dist/style.min.css'
import { setDate } from '../../../functions/setters'
import { AgendaLlamada, InformacionGeneral } from '../../forms'
import { LeadContactosModal, Modal,LeadNecesidadesModal } from '../../../components/modals'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton, Form, Button } from 'react-bootstrap'
import { apiPutForm, apiGet, apiPostForm, apiDelete, catchErrors } from '../../../functions/api'
import { questionAlert, printResponseErrorAlert, errorAlert, waitAlert, questionAlert2, originChangeAlert,
        doneAlert, solicitudLlamadaAlert,relacionesPublicasAlert, leadDuplicadoAlert } from '../../../functions/alert'

class PaginaWeb extends Component {
    state = {
        estatus: [
            { name: 'Cancelado' },
            { name: 'Rechazado' },
            /* { name: 'En negociación' }, */
            { name: 'Lead duplicado' }
        ],
        dropdown_options: [
            { text: 'EDITAR INFORMACIÓN GENERAL', icon:'las la-edit', show:true },
            { text: 'ENVIAR CORREO', icon:'las la-envelope', show:false },
            { text: 'AGENDAR LLAMADA', icon:'las la-phone', show:true },
            { text: 'SEGUIMIENTO', icon:'las la-file-alt', show:true },
            { text: 'HISTORIAL DE CONTACTO', icon:'las la-list-alt', show:true },
            { text: 'ELIMINAR LEAD DUPLICADO', icon:'las la-minus-circle', show:true },
            { text: 'RELACIONES PÚBLICAS', icon:'las la-handshake', show:true },
            { text: 'PROGRAMA DE NECESIDADES', icon:'las la-handshake', show:true }

        ],
        leads: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0
        },
        form: {
            editar:{
                name: '',
                email: '',
                telefono: '',
                fecha: '',
                estado: ''
            },
            agendar:{
                fecha: null,
                hora: 0,
                minuto: 0,
            },
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0
        },
        modal:{
            editar: false,
            agendar: false,
            historial: false,
            necesidades: false

        },
        data:{
            lead:''
        }
    }
    componentDidMount = () => {
        this.getLeads()
    }
    // componentDidUpdate = (prev) => {
    //     const { isActive } = this.props
    //     const { isActive: prevActive } = prev
    //     if (isActive && !prevActive) {
    //         this.getLeads();
    //     }
    // }
    /* ----------------------- GET ------------------------- */
    canSendFirstEmail = lead => {
        if (lead.prospecto) {
            if (lead.prospecto.contactos) {
                if (lead.prospecto.contactos.length) {
                    let aux = true
                    lead.prospecto.contactos.forEach((contacto) => {
                        if (contacto.comentario === 'SE ENVIÓ CORREO PARA SOLICITAR UNA PRIMERA LLAMADA.') {
                            aux = false
                        }
                    })
                    return aux
                }
                return true
            }
            return true
        }
        return true
    }
    getColorStatus(estatus) {
        let color = ''
        if (estatus === 'Cancelado' || estatus === 'Rechazado') {
            color = 'danger'
        } else if (estatus === 'En negociación') {
            color = 'negociacion'
        } else {
            color = 'primary'
        }
        return color
    }
    /* ---------------- ANCHOR CRM TABLE PUT LEADS DE PÁGINAS WEB --------------- */
    getLeads = async () => {
        waitAlert()
        const { leads, form } = this.state
        const { at } = this.props
        apiPutForm(`crm/table/lead-web/${leads.numPage}`, form, at).then(
            (response) => {
                Swal.close()
                const { leads: leadResponse, total, page } = response.data
                leads.data = leadResponse
                leads.total = total
                leads.numPage = page
                leads.total_paginas = Math.ceil(total / 10)
                this.setState({ ...this.state, leads })
            }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })

    }

    getLead = async(lead) => {
        const { at } = this.props
        apiGet(`crm/lead/${lead.id}`, at).then((response) => {
            const { lead: leadResponse } = response.data
            const { data } = this.state
            data.lead = leadResponse
            this.setState({ ...this.state, data })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    onClickNext = (e) => {
        e.preventDefault()
        const { leads } = this.state
        if (leads.numPage < leads.total_paginas - 1) {
            this.setState({
                numPage: leads.numPage++
            })
        }
        this.getLeads()
    }
    onClickPrev = (e) => {
        e.preventDefault()
        const { leads } = this.state
        if (leads.numPage > 0) {
            this.setState({
                numPage: leads.numPage--
            })
            this.getLeads()
        }
    }
    isActiveButton(direction) {
        const { leads } = this.state
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) {
                    return true;
                }
            } else {
                if (leads.numPage < 10) {
                    if (leads.numPage < leads.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /* ----------------------- ANCHOR CRM GET ALL OPTIONS ----------------------- */
    
    /* --------------------- ANCHOR CRM PUT CAMBIO DE ORIGEN -------------------- */
    changeOrigen = (origen, id) => {
        originChangeAlert(origen.text, () => this.changeOrigenAxios({ id: id, origen: origen.value }))
    }
    changeOrigenAxios = async (data) => {
        waitAlert()
        const { at } = this.props
        apiPutForm(`crm/lead/origen/${data.id}`, data, at).then(
            (response) => {
                doneAlert('El origen fue actualizado con éxito.', () => { this.getLeads() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    /* ----------------------- CAMBIO DE ESTATUS ----------------------- */
    changeEstatus = (estatus, lead) => {
        switch (estatus) {
            case 'Cancelado':
                this.openModalWithInput('Cancelado', lead.id);
                break;
            case 'Rechazado':
                this.openModalWithInput('Rechazado', lead.id);
                break;
            case 'En negociación':
                this.openModalWithInput('En negociación', lead.id);
                break;
            case 'Lead duplicado':
                leadDuplicadoAlert('¡NO PODRÁS REVERTIR ESTO!', 'ESTE LEAD SERÁ MARCADO COMO', 'ELIMINAR', () => this.deleteDuplicadoAxios(lead))
                break;
            default: break;
        }
    }
    openModalWithInput = (estatus, id) => {
        const { options } = this.props
        if (estatus === 'En negociación') {
            questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }))
        } else {
            questionAlert2(
                estatus === 'Cancelado' ?
                    'ESCRIBE EL MOTIVO DE CANCELACIÓN' :
                    'ESCRIBE EL MOTIVO DE RECHAZO',
                '',
                () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
                <div style={{ display: 'flex', maxHeight: '250px' }} >
                    <Scrollbar>
                        {
                            estatus === 'Cancelado' ?
                                <form id='canceladoForm' name='canceladoForm' className="mx-auto w-95 pr-3">
                                    {
                                        options.motivosCancelacion.map((option, key) => {
                                            return (
                                                <Form.Check key={key} id={`motivo-cancelado-${option.id}`}
                                                    type="radio" label={option.motivo} name='motivoCancelado'
                                                    className="text-justify mb-3" value={option.motivo}
                                                    onChange={this.onChangeMotivoCancelado}
                                                />
                                            )
                                        })
                                    }
                                    <Form.Check
                                        id="motivo-cancelado-7"
                                        type="radio"
                                        label="Otro"
                                        name='motivoCancelado'
                                        className="text-justify mb-3"
                                        value="Otro"
                                        onChange={this.onChangeMotivoCancelado}
                                    />
                                    <div id='customInputCancelado' className='d-none'>
                                        <Form.Control
                                            placeholder='MOTIVO DE CANCELACIÓN'
                                            className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                            id='otro-motivo-cancelado'
                                            as="textarea"
                                            rows="3"
                                        />
                                    </div>
                                </form>
                                :
                                <form id='rechazoForm' name='rechazoForm' className="mx-auto w-95 pr-3">
                                    {
                                        options.motivosRechazo.map((option, key) => {
                                            return (
                                                <Form.Check key={key} id={`motivo-rechazo-${option.id}`}
                                                    type="radio" label={option.motivo} name='motivoRechazo'
                                                    className="text-justify mb-3" value={option.motivo}
                                                    onChange={this.onChangeMotivoRechazo}
                                                />
                                            )
                                        })
                                    }
                                    <Form.Check
                                        id="motivo-rechazo-14"
                                        type="radio"
                                        label="Otro"
                                        name='motivoRechazo'
                                        className="text-justify mb-3"
                                        value="Otro"
                                        onChange={this.onChangeMotivoRechazo}
                                    />
                                    <div id='customInputRechazo' className='d-none'>
                                        <Form.Control
                                            placeholder='MOTIVO DE RECHAZO'
                                            className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                            id='otro-motivo-rechazo'
                                            as="textarea"
                                            rows="3"
                                        />
                                    </div>
                                </form>
                        }
                    </Scrollbar>
                </div>
            )
        }
    }
    onChangeMotivoCancelado = e => {
        const { value } = e.target
        var element = document.getElementById("customInputCancelado");
        if(value === 'Otro'){
            element.classList.remove("d-none");
        }else{
            element.classList.add("d-none");
        }
    }
    onChangeMotivoRechazo =  e => {
        const { value } = e.target
        var element = document.getElementById("customInputRechazo");
        if(value === 'Otro'){
            element.classList.remove("d-none");
        }else{
            element.classList.add("d-none");
        }
    }
    /* --------- ANCHOR CRM PUT CAMBIO DE ESTATUS CANCELADO Y RECHAZADO --------- */
    changeEstatusCanceladoRechazadoAxios = async (data) => {
        const { estatus } = data
        let elemento = ''
        let motivo = ''
        if (estatus === 'Rechazado') {
            elemento = document.rechazoForm.motivoRechazo.value;
            motivo = document.getElementById('otro-motivo-rechazo').value
        }
        if (estatus === 'Cancelado') {
            elemento = document.canceladoForm.motivoCancelado.value;
            motivo = document.getElementById('otro-motivo-cancelado').value
        }
        if (elemento === '')
            errorAlert('No seleccionaste el motivo')
        else {
            waitAlert()
            if (elemento === 'Otro')
                if (motivo !== '')
                    elemento = motivo
            data.motivo = elemento
            this.changeEstatusAxios(data)
        }
    }
    /* -------------------- ANCHOR LEAD PUT CAMBIO DE ESTATUS ------------------- */
    changeEstatusAxios = async (data) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiPutForm(`v2/leads/crm/lead/estatus/${data.id}`, data, at).then(
            (response) => {
                doneAlert('El estatus fue actualizado con éxito.', () => { this.getLeads() })
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------- ANCHOR CRM DELETE LEAD DUPLICADO -------------------- */
    deleteDuplicadoAxios = async (lead) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiGet(`crm/lead/duplicado/${lead}`, at).then(
            (response) => {
                doneAlert('Lead eliminado con éxito', ()=> { this.getLeads() })
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    /* ----------------------- DROPDOWN OPTIONS ----------------------- */
    dropdownOptions = (nav, lead) => {
        switch (nav.text) {
            case 'EDITAR INFORMACIÓN GENERAL':
                this.openModalEditar(lead);
                break;
            case 'ENVIAR CORREO':
                solicitudLlamadaAlert('¡NO PODRÁS REVERTIR ESTO!', () => this.sendEmailNewWebLead(lead))
                break;
            case 'AGENDAR LLAMADA':
                this.openModalAgendarLlamada(lead);
                break;
            case 'SEGUIMIENTO':
                this.changePageLlamadaSalida(lead)
                break;
            case 'HISTORIAL DE CONTACTO':
                this.openModalHistorial(lead)
                break;
            case 'ELIMINAR LEAD DUPLICADO':
                leadDuplicadoAlert('¡NO PODRÁS REVERTIR ESTO!', 'ESTE LEAD SERÁ MARCADO COMO', 'ELIMINAR', () => this.deleteDuplicadoAxios(lead))
                break;
            case 'RELACIONES PÚBLICAS':
                relacionesPublicasAlert('¿ESTÁS SEGURO?', () => this.moveToRelacionesPublicasAxios(lead))
                break;
            case 'PROGRAMA DE NECESIDADES':
                this.openModalNecesidades(lead)
                break;
            default: break;
        }
    }

    activeOptions(lead) {
        const { dropdown_options } = this.state
        dropdown_options.forEach((nav) => {
            if (nav.text === 'ENVIAR CORREO') {
                if (this.canSendFirstEmail(lead)) {
                    nav.show = true
                }
            }
        })
        this.setState({ ...this.state, dropdown_options })
    }
    /* -------------------------------------------------------------------------- */
    /*                   MODAL EDITAR INFORMACIÓN GENERAL                         */
    /* -------------------------------------------------------------------------- */
    openModalEditar = lead => {
        const { form, modal, data } = this.state
        modal.editar = true
        form.editar.name = lead.nombre.toUpperCase()
        form.editar.email = lead.email!==null?lead.email:''
        form.editar.telefono = lead.telefono
        form.editar.fecha = new Date(lead.created_at)
        form.editar.estado = lead.estado ? lead.estado.toString() : ''
        data.lead = lead
        this.setState({ ...this.state, modal, form, data })
    }
    
    closeModal = () => {
        const { modal, data } = this.state
        modal.editar = false
        data.lead = ''
        modal.historial = false
        modal.necesidades = false
        this.setState({ ...this.state, modal, data })
    }

    onChangeEditar = e => {
        const { name, value } = e.target
        const { form } = this.state
        form.editar[name] = value
        this.setState({ ...this.state, form })
    }
    /* ----------------------- ANCHOR CRM UPDATE INFO LEAD ---------------------- */
    addLeadInfoAxios = async () => {
        const { at, refreshTimeLine } = this.props
        const { form, data, modal } = this.state
        apiPutForm(`v2/leads/crm/update/lead-en-contacto/${data.lead.id}`, form.editar, at).then(
            (response) => {
                refreshTimeLine()
                form.editar.name = ''
                form.editar.telefono = ''
                form.editar.email = ''
                modal.editar = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.', 
                    () => { this.getLeads() })
                this.setState({ ...this.state, modal, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------------------------------------------------------------- */
    /*                     ALERTA DE SOLICITUD DE LLAMADA                         */
    /* -------------------------------------------------------------------------- */
    sendEmailNewWebLead = async lead => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiPutForm(`crm/email/solicitud-llamada/${lead.id}`, {}, at).then(
            (response) => {
                refreshTimeLine()
                doneAlert('Correo enviado con éxito', () => { this.getLeads() });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------------------------------------------------------------- */
    /*                        MODAL AGENDAR NUEVA LLAMADA                         */
    /* -------------------------------------------------------------------------- */
    openModalAgendarLlamada = lead => {
        const { modal, data } = this.state
        modal.agendar = true
        data.lead = lead
        this.setState({ ...this.state, modal, data })
    }

    openModalHistorial = lead => {
        const { modal, data } = this.state
        modal.historial = true
        data.lead = lead
        this.setState({ ...this.state, modal, data })
    }
    openModalNecesidades = lead => {
        const { modal, data } = this.state
        modal.necesidades = true
        data.lead = lead
        this.setState({ ...this.state, modal, data })
    }

    closeModalAgendarLlamada = () => {
        const { modal, data, form } = this.state
        modal.agendar = false
        form.agendar.fecha = null
        form.agendar.hora = 0
        form.agendar.minuto = 0
        data.lead = ''
        this.setState({ ...this.state, modal, data, form })
    }

    onChangeAgendar = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form.agendar[name] = value
        this.setState({ ...this.state, form })
    }

    agendarLlamada = async () => {
        waitAlert()
        const { data, form, modal } = this.state
        const { at, refreshTimeLine } = this.props
        apiPostForm(`crm/add/evento/${data.lead.id}`, form.agendar, at).then(
            (response) => {
                refreshTimeLine()
                form.agendar.fecha = null
                form.agendar.hora = 0
                form.agendar.minuto = 0
                modal.agendar = false
                this.setState({ ...this.state, form, modal })
                doneAlert('Evento generado con éxito', () => { this.getLeads() });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------------------------------------------------------------- */
    /*                                    SEGUIMIENTO                             */
    /* -------------------------------------------------------------------------- */
    changePageLlamadaSalida = (lead) => {
        window.location.href = `${LEADS_FRONT}/leads/crm/add/llamada-salida?lead=${lead.id}`
    }
    /* -------------------------------------------------------------------------- */
    /*                  ANCHOR CRM DELETE LEAD DUPLICADO                          */
    /* -------------------------------------------------------------------------- */
    deleteDuplicadoAxios = async (lead) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiDelete(`crm/lead/duplicado/${lead.id}`, at).then(
            (response) => {
                doneAlert('Lead eliminado con éxito',  () => { this.getLeads() })
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------------------------------------------------------------- */
    /*                  ANCHOR CRM UPDATE LEAD SET RR.PP                          */
    /* -------------------------------------------------------------------------- */
    moveToRelacionesPublicasAxios = async ( lead ) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiPutForm(`crm/lead/relaciones-publicas/${lead.id}`, {}, at).then(
            (response) => {
                doneAlert('Contacto en relaciones públicas generado con éxito.',  () => { this.getLeads() })
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    refresh = () => {
        const { data } = this.state
        this.getLead(data.lead)
        this.getLeads()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    cleanForm = () => {
        const { form } = this.state
        form.empresa = 0
        form.cliente = ''
        this.setState({ ...this.state, form })
        this.getLeads()
    }

    render() {
        const { leads, estatus, dropdown_options, form, modal, data } = this.state
        const { clickOneLead, user, options, at } = this.props
        return (
            <div>
                <div>
                    <div className="form-group row form-group-marginless d-flex justify-content-center mb-0">
                        <div className="col-md-2">
                            <InputGray letterCase = { true } withtaglabel = { 0 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                requirevalidation = { 0 } withformgroup = { 1 } name = "cliente" value = { form.cliente } onChange = { this.onChange }
                                type = "text" placeholder = "BUSCAR CLIENTE" iconclass = "flaticon2-search-1" />
                        </div>
                        <div className="col-md-2">
                            <Form.Control className="form-control text-uppercase form-control-solid"
                                value={form.empresa} onChange={this.onChange} name='empresa' as="select">
                                <option value={0}>Selecciona la empresa</option>
                                {
                                    options.empresas.map((empresa, key) => {
                                        return (
                                            <option key={key} value={empresa.value} className="bg-white" >{empresa.name}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </div>
                        <div className="col-md-2 mt-2 mt-md-0 text-center text-md-left">
                            <span className="btn btn-light-primary px-3 font-weight-bold mt-md-0 mt-2 mr-3" 
                                onClick={(e) => { e.preventDefault(); this.getLeads() }}>
                                    Buscar
                            </span>
                            <span className="btn btn-light-danger px-3 font-weight-bold mt-md-0 mt-2" onClick={this.cleanForm}>
                                Limpiar
                            </span>
                        </div>
                    </div>        
                </div>
                <div className="tab-content">
                    <div className="table-responsive-xl">
                        <table className="table table-borderless table-vertical-center mb-0">
                            <thead>
                                <tr>
                                    <th colSpan="7" className='text-info p-2 text-left text-md-center text-uppercase'>
                                        LEADS DE PÁGINA WEB
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-info-o-30 text-info">
                                    <th className="min-width-100px">
                                        <span>Nombre del cliente</span>
                                    </th>
                                    <th className="min-width-140px text-center">Fecha</th>
                                    <th className="min-width-100px text-center">Servicios</th>
                                    <th className="min-width-95px text-center">Empresa</th>
                                    <th className="min-width-100px text-center">Origen</th>
                                    <th className="min-width-100px text-center">Estatus</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total ?
                                        leads.total === 0 ?
                                            <tr>
                                                <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                            </tr>
                                            :
                                            leads.data.map((lead, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td className="pl-0 py-8">
                                                            <div className="d-flex align-items-center ">
                                                                <div className="symbol symbol-45 mr-3">
                                                                    <span className="symbol-label font-size-h5 bg-info-o-20 text-info">{lead.nombre.charAt(0)}</span>
                                                                </div>
                                                                <div>
                                                                    <span onClick={(e) => { e.preventDefault(); clickOneLead(lead.id) }} className="text-dark-75 font-weight-bolder text-hover-info mb-1 font-size-lg cursor-pointer">{lead.nombre}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="font-size-lg text-center font-weight-bolder">
                                                            <div className="w-max-content mx-auto">
                                                                <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDate(lead.created_at)}</span><br />
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="w-max-content mx-auto">
                                                                <ul className="list-unstyled mb-0">
                                                                    {
                                                                        lead.servicios.length > 0 ?
                                                                            lead.servicios.map((servicio, key) => {
                                                                                return (
                                                                                    <li key={key} className="text-dark-75 font-weight-bolder">{servicio.servicio}</li>
                                                                                )
                                                                            })
                                                                            : <span className="text-dark-75 font-weight-bolder">Sin servicios</span>
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                lead.empresa.isotipos.length > 0 ?
                                                                    lead.empresa.isotipos.map((isotipo, key) => {
                                                                        return (
                                                                            <OverlayTrigger rootClose key={key} overlay={<Tooltip>{lead.empresa.name}</Tooltip>}>
                                                                                <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                                                    <div className="symbol symbol-40 symbol-circle">
                                                                                        <img alt="Pic" src={isotipo.url} />
                                                                                    </div>
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        )
                                                                    })
                                                                    : <span className="text-dark-75 font-weight-bolder">{lead.empresa.name}</span>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="text-dark-75 font-weight-bolder font-size-lg">
                                                                {
                                                                    lead.origen ?
                                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                                            <Dropdown className="dropdown-origenes">
                                                                                <Dropdown.Toggle>
                                                                                    {lead.origen.origen.toUpperCase()}
                                                                                </Dropdown.Toggle>
                                                                                <Dropdown.Menu className="p-0">
                                                                                    <Dropdown.Header className="text-center">
                                                                                        <span className="font-size-sm">Elige una opción</span>
                                                                                    </Dropdown.Header>
                                                                                    {
                                                                                        options.origenes.map((origen, key) => {
                                                                                            return (
                                                                                                <span  key={key}>
                                                                                                    <Dropdown.Item className="p-0" onClick={() => { this.changeOrigen(origen, lead.id) }} >
                                                                                                        <span className="navi-link w-100">
                                                                                                            <span className="navi-text">
                                                                                                                <span className="label label-lg label-inline color-text-origenes rounded-0 w-100 font-weight-bolder">
                                                                                                                    {origen.text}
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </Dropdown.Item>
                                                                                                    <Dropdown.Divider className={`${key === options.origenes.length - 1 ? 'd-none':'m-0 border-top border-white'}`} />
                                                                                                </span>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </span>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            {
                                                                lead.estatus ?
                                                                    <Dropdown className="dropdown-estatus-crm">
                                                                        <Dropdown.Toggle style={{ backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto }} >
                                                                            {lead.estatus.estatus.toUpperCase()}
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu className="p-0">
                                                                            <Dropdown.Header>
                                                                                <span className="font-size-sm font-weight-bold">Elige una opción</span>
                                                                            </Dropdown.Header>
                                                                            {
                                                                                estatus.map((estatus, key) => {
                                                                                    return (
                                                                                        <Dropdown.Item key={key} className="p-0" onClick={() => { this.changeEstatus(estatus.name, lead) }} >
                                                                                            <span className="navi-link w-100">
                                                                                                <span className="navi-text">
                                                                                                    <span className={`label label-lg label-inline label-light-${this.getColorStatus(estatus.name)} rounded-0 w-100 font-weight-bold`}>{estatus.name}</span>
                                                                                                </span>
                                                                                            </span>
                                                                                        </Dropdown.Item>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                    : ''
                                                            }
                                                        </td>
                                                        
                                                        <td className="pr-0 text-center">
                                                            <div className="dropdown-crm btn btn-icon">

                                                                <DropdownButton title={<span><i className="flaticon2-plus icon-nm icon-mas"></i></span>} menualign="right" className="dropdown-pagina-web" onClick={(e) => this.activeOptions(lead)}>
                                                                    {
                                                                        dropdown_options.map((nav, key) => {
                                                                            return (
                                                                                <Dropdown.Item key={key} className={`${!nav.show?'d-none':'item-pagina-web'}`} onClick={(e) => { this.dropdownOptions(nav, lead) }} >                                                                                
                                                                                    <span className="navi-icon">
                                                                                        <i className={`${nav.icon} icon-xl pr-3`}></i>
                                                                                    </span>
                                                                                    <span className="navi-text align-self-center">{nav.text}</span>
                                                                                </Dropdown.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </DropdownButton>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        :
                                        <tr>
                                            <td colSpan="6" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">NO SE ENCONTRARON RESULTADOS</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className={leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between mr-3"} >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm align-self-center">
                                    Página {parseInt(leads.numPage) + 1} de {leads.total_paginas}
                                </div>
                                : ''
                        }
                        <div>
                            {
                                this.isActiveButton('prev') ?
                                    <span className="btn btn-icon btn-xs btn-light-info mr-2" onClick={this.onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                    : ''
                            }
                            {
                                this.isActiveButton('next') ?
                                    <span className="btn btn-icon btn-xs btn-light-info mr-2" onClick={this.onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                    : ''
                            }
                        </div>
                    </div>
                </div >
                <Modal size="xl" title='Editar información general' show={modal.editar} handleClose={this.closeModal}>
                    <div className="mt-7">
                        <InformacionGeneral form = { form.editar } onChange = { this.onChangeEditar } onSubmit = { this.addLeadInfoAxios } lead = { data.lead } 
                            formeditado = { false } />
                    </div>
                </Modal>
                <Modal title='Agenda llamada' show={modal.agendar} handleClose={this.closeModalAgendarLlamada}>
                    <AgendaLlamada form={form.agendar} onChange={this.onChangeAgendar} onSubmit={this.agendarLlamada} user={user} lead={data.lead} />
                </Modal>
                <LeadContactosModal lead = { data.lead } show={modal.historial} handleClose={this.closeModal}
                    at = { at } options = { options } refresh = { this.refresh } />
               
                <Modal size="xl" title='Progama de necesidades' show={modal.necesidades} handleClose={this.closeModal}>
                    <div className="mt-7">
                    <LeadNecesidadesModal lead = { data.lead } show={modal.necesidades} handleClose={this.closeModal}
                    at = { at } options = { options } refresh = { this.refresh } />
                     </div>  
                </Modal>
               
            </div>
        )
    }
}

export default PaginaWeb