import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { printResponseErrorAlert, doneAlert, waitAlert } from '../../../functions/alert'
import { apiGet, apiPutForm, catchErrors } from '../../../functions/api'
import { setDateTableLG } from '../../../functions/setters'
import InformacionGeneral from '../../forms/paginaWeb/InformacionGeneral'
import { LeadContactosModal, Modal } from '../../modals'
import { InputGray } from '../../form-components'
class PaginaRp extends Component{

    state = {
        modal: { editar: false, historial: false },
        leads: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0
        }, 
        form: {
            fecha: new Date(),
            hora: '08',
            minuto: '00',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0,
            editar: {
                name: '',
                email: '',
                telefono: '',
                fecha: new Date(),
                estado: ''
            }
        }, 
        lead: ''
    }

    componentDidMount = () => {
        this.getLeads()
    }

    getLeads = async() => {
        waitAlert()
        const { leads, form } = this.state
        const { at } = this.props
        apiPutForm(`crm/table/lead-rp/${leads.numPage}`, form, at).then(
            (response) => {
                const { leads: leadsResponse, total, page } = response.data
                const { leads } = this.state
                leads.data = leadsResponse
                leads.total = total
                leads.numPage = page
                leads.total_paginas = Math.ceil(total / 10)
                this.setState({ ...this.state, leads })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    getLead = async(lead) => {
        const { at } = this.props
        apiGet(`crm/lead/${lead.id}`, at).then((response) => {
            const { lead: leadResponse } = response.data
            this.setState({ ...this.state, lead: leadResponse })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    onSubmit = async() => {
        const { at, refreshTimeLine } = this.props
        const { form, lead } = this.state
        apiPutForm(`v2/leads/crm/update/lead-en-contacto/${lead.id}`, form.editar, at).then((response) => {
            this.closeModal()
            doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.', () => {this.getLeads()} )
            refreshTimeLine()
        }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    openModalEditar = lead => {
        const { form, modal } = this.state
        modal.editar = true
        form.editar.name = lead.nombre.toUpperCase()
        form.editar.email = lead.email!==null?lead.email:''
        form.editar.telefono = lead.telefono
        form.editar.fecha = new Date(lead.created_at)
        form.editar.estado = lead.estado ? lead.estado.toString() : ''
        this.setState({ ...this.state, modal, form, lead })
    }

    closeModal = () => {
        const { modal, form } = this.state
        modal.editar = false
        modal.historial = false
        form.editar.name = ''
        form.editar.email = ''
        form.editar.telefono = ''
        form.editar.fecha = new Date()
        form.editar.estado = ''
        this.setState({ ...this.state, modal, lead: '', form})
    }

    openModalHistorial = (lead) => {
        const { form, modal } = this.state
        modal.historial = true
        this.setState({ ...this.state, modal, form, lead })
    }

    onChangeEditar = e => {
        const { name, value } = e.target
        const { form } = this.state
        form.editar[name] = value
        this.setState({ ...this.state, form })
    }

    refresh = () => {
        const { lead } = this.state
        this.getLead(lead)
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
        form.origen = 0
        this.setState({ ...this.state, form })
        this.getLeads()
    }

    render(){
        const { leads, modal, lead, form } = this.state
        const { at, options } = this.props
        return(
            <div>
                <div className="form-group row form-group-marginless d-flex justify-content-center mb-0">
                    <div className="col-md-2">
                        <InputGray letterCase = { true } withtaglabel = { 0 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                            requirevalidation = { 0 } withformgroup = { 1 } name = "cliente" value = { form.cliente } onChange = { this.onChange }
                            type = "text" placeholder = "BUSCAR CLIENTE" iconclass = "flaticon2-search-1" />
                    </div>
                    <div className="col-md-2">
                        <Form.Control className = "form-control text-uppercase form-control-solid" value = { form.origen }
                            onChange = { this.onChange } name = 'origen' as = "select">
                            <option value={0}>Selecciona el origen</option>
                            {
                                options.origenes.map((origen, key) => {
                                    return (
                                        <option key={key} value={origen.value} className="bg-white" >{origen.text}</option>
                                    )
                                })
                            }
                        </Form.Control>
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
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="5" className = 'text-orange p-2 text-center text-uppercase'>
                                        LEADS RELACIONES PÚBLICAS
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-orange text-orange">
                                    <th>Nombre del cliente</th>
                                    <th>Fecha</th>
                                    <th className="text-center">Origen</th>
                                    <th className="text-center">Empresa</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total === 0 ?
                                        <tr>
                                            <td colSpan="5" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">
                                                NO SE ENCONTRARON RESULTADOS
                                            </td>
                                        </tr>
                                    : 
                                        leads.data.map((lead, index) => {
                                            return(
                                                <tr key = { index }>
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 mr-3">
                                                                <span className="symbol-label font-size-h5 text-orange bg-light-orange">
                                                                    {lead.nombre.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault();  } } 
                                                                    className="text-dark-75 font-weight-bolder text-hover-orange mb-1 font-size-lg cursor-pointer">
                                                                    { lead.nombre }
                                                                </span>
                                                                {
                                                                    lead.prospecto ?
                                                                        lead.prospecto.tipo_proyecto ?
                                                                            <span className="text-muted font-weight-bold d-block">
                                                                                { lead.prospecto.tipo_proyecto.tipo }
                                                                            </span>
                                                                        : ''
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <div>
                                                            <span>Ingreso: </span>
                                                            <span className="text-muted font-weight-bold font-size-sm">
                                                                { setDateTableLG(lead.created_at) }
                                                            </span>
                                                            <br />
                                                            <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">
                                                                {
                                                                    lead.prospecto ?
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length > 0 ?
                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                                : ''
                                                                            : ''
                                                                        : ''
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {
                                                            lead.origen &&
                                                            <div className="w-max-content mx-auto">
                                                                <span className="label-origenes">
                                                                    {lead.origen.origen}
                                                                </span>
                                                            </div>
                                                        }
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
                                                    <td className="pr-0 text-center">
                                                        <OverlayTrigger rootClose overlay={<Tooltip>EDITAR INFORMACIÓN GENERAL</Tooltip>}>
                                                            <span onClick={(e) => { this.openModalEditar(lead) }}
                                                                className="btn btn-rp btn-icon btn-sm mr-2">
                                                                <i className="las la-edit icon-lg"></i>
                                                            </span>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger rootClose overlay={<Tooltip>HSITORIAL DE CONTACTO</Tooltip>}>
                                                            <span onClick={(e) => { this.openModalHistorial(lead) }} 
                                                                className="btn btn-rp btn-icon btn-sm">
                                                                <i className="las la-clipboard-list icon-lg"></i>
                                                            </span>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal size="xl" title='Editar información general' show={modal.editar} handleClose={this.closeModal}>
                    <div className="mt-7">
                        <InformacionGeneral form = { form.editar } onChange = { this.onChangeEditar } lead = { lead } formeditado = { false }
                            onSubmit = { this.onSubmit }   />
                    </div>
                </Modal>
                <LeadContactosModal lead = { lead } show={modal.historial} handleClose={this.closeModal}
                    at = { at } options = { options } refresh = { this.refresh } />
            </div>
        )
    }
}

export default PaginaRp