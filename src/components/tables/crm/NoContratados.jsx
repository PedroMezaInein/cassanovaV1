import React, { Component } from 'react'
import { apiPutForm, catchErrors } from '../../../functions/api'
import { printResponseErrorAlert, questionAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { setDateTableLG, setNaviIcon } from '../../../functions/setters'
import { OverlayTrigger, Tooltip, DropdownButton, Dropdown, Form } from 'react-bootstrap'
import { LeadContactosModal, Modal } from '../../modals'
import Swal from 'sweetalert2'
import { PresupuestoList } from '../../../components/sections/crm'
import { LEADS_FRONT } from '../../../constants'
import { InputGray } from '../../form-components'

class NoContratados extends Component{

    state = {
        modal: { presupuesto: false, historial: false },
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
        apiPutForm(`crm/table/lead-cancelados/${leads.numPage}`, form, at).then(
            (response) => {
                Swal.close()
                const { leads: leadsResponse, total, page } = response.data
                const { leads } = this.state
                leads.data = leadsResponse
                leads.total = total
                leads.numPage = page
                leads.total_paginas = Math.ceil(total / 10)
                this.setState({ ...this.state, leads })
            }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    hasProspecto = (value, lead) => {
        let flag = false
        if(lead){
            if(lead.prospecto){
                flag = true
            }
        }
        if(flag){
            switch(value){
                case 'estatus':
                    if(lead.prospecto.estatus_prospecto)
                        flag = true
                    else flag = false
                    break;
                case 'contactos':
                    if(lead.prospecto.contactos){
                        if(lead.prospecto.contactos.length){
                            flag = true
                        }else flag = false
                    }else flag = false
                    break;
                default:
                    break;
            }
        }return flag
    }

    hasPresupuesto= lead => {
        if(lead)
            if(lead.presupuesto_diseño)
                if(lead.presupuesto_diseño.pdfs)
                    if(lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }

    openModalHistorial = (lead) => {
        const { modal } = this.state
        modal.historial = true
        this.setState({ ...this.state, modal, lead: lead })
    }

    openModalPresupuesto = lead => {
        const { modal } = this.state
        modal.presupuesto = true
        this.setState({ ...this.state, modal, lead: lead })
    }

    closeModal = () => {
        const { modal } = this.state
        modal.presupuesto = false
        modal.historial = false
        this.setState({ ...this.state, modal, lead: '' })
    }

    isActiveButton(direction) {
        const { leads } = this.state
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) {
                    return true;
                }
            } else {
                if (leads.numPage < leads.total_paginas - 1) {
                    return true;
                }
            }
        }
        return false;
    }

    onClickNext = (e) => {
        e.preventDefault()
        const { leads } = this.state
        if (leads.numPage < leads.total_paginas - 1) {
            this.setState({
                numPage: leads.numPage++
            })
            this.getLeads()
        }
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

    getMoveStatus = (lead) => {
        if(lead.presupuesto_diseño)
            return 'En negociación'
        if(lead.prospecto)
            if(lead.prospecto.tipo_proyecto)
                return 'En proceso'
        return 'En espera'
    }

    changeEstatus = async (data) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiPutForm(`v2/leads/crm/lead/estatus/${data.id}`, data, at).then(
            (response) => { 
                doneAlert('El estatus fue actualizado con éxito.', () => { this.getLeads(); }) 
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    changePage = lead => {
        window.location.href = `${LEADS_FRONT}/leads/crm/info/info?lead=${lead.id}&tipo=${lead.estatus.estatus}` 
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
        form.estatus = 0
        form.origen = 0
        this.setState({ ...this.state, form })
        this.getLeads()
    }

    render(){
        const { leads, lead, modal, form } = this.state
        const { clickLead, at, options } = this.props
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
                    <div className="col-md-2">
                        <Form.Control className="form-control text-uppercase form-control-solid"
                            value={form.estatus} onChange={this.onChange} name='estatus' as="select">
                            <option value={0} > Selecciona el estatus </option>
                            <option value="cancelado" className="bg-white" >CANCELADO</option>
                            <option value="rechazado" className="bg-white" >RECHAZADO</option>
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
                <LeadContactosModal lead = { lead } show={modal.historial} handleClose={this.closeModal}
                    at = { at } options = { options } refresh = { this.refresh } />
                <Modal size="lg" show = { modal.presupuesto } handleClose = { this.closeModal } title = 'Presupuestos generados'>
                    <div className="mt-5">
                        {
                            this.hasPresupuesto(lead) ?
                                <PresupuestoList pdfs={lead.presupuesto_diseño.pdfs} />
                            : <></>
                        }
                    </div>
                </Modal>
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="7" className = 'text-danger p-2 text-center text-uppercase'>
                                        LEADS CANCELADOS/RECHAZADOS
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-danger-o-30 text-danger">
                                    <th style={{ minWidth: "100px" }}>
                                        <span>Nombre del cliente</span>
                                    </th>
                                    <th style={{ minWidth: "145px" }} className="text-center">Fecha</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Motivo</th>
                                    <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                    <th style={{ minWidth: "70px" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total === 0 ?
                                        <tr>
                                            <td colSpan="7" className="text-center text-dark-75 font-weight-bolder font-size-lg pt-3">
                                                NO SE ENCONTRARON RESULTADOS
                                            </td>
                                        </tr>
                                    : 
                                        leads.data.map((lead, index) => {
                                            return(
                                                <tr key = { index }>
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 symbol-light-danger mr-3">
                                                                <span className="symbol-label font-size-h5">
                                                                    {lead.nombre.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault(); clickLead(lead.id) } } 
                                                                    className="text-dark-75 font-weight-bolder text-hover-danger mb-1 font-size-lg cursor-pointer">
                                                                    {lead.nombre}
                                                                </span>
                                                                {
                                                                    lead.prospecto ?
                                                                        lead.prospecto.tipo_proyecto ?
                                                                            <span className="text-muted font-weight-bold d-block">
                                                                                {lead.prospecto.tipo_proyecto.tipo}
                                                                            </span>
                                                                            : ''
                                                                        : ''
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <div className="w-max-content mx-auto">
                                                            <span>Ingreso: </span>
                                                            <span className="text-muted font-weight-bold font-size-sm">
                                                                {setDateTableLG(lead.created_at)}
                                                            </span>
                                                            <br />
                                                            {
                                                                lead.prospecto ?
                                                                    lead.prospecto.contactos ?
                                                                        lead.prospecto.contactos.length > 0 ?
                                                                            <span>
                                                                                <span>Último contacto: </span>
                                                                                <span className="text-muted font-weight-bold font-size-sm">
                                                                                    {setDateTableLG(lead.prospecto.contactos[0].created_at)}
                                                                                </span><br />
                                                                            </span>
                                                                        : ''
                                                                    : ''
                                                                : ''
                                                            }
                                                            {
                                                                lead.fecha_cancelacion_rechazo !== null ?
                                                                    <span>
                                                                        <span>{lead.rechazado? 'Rechazo':'Cancelado'}: </span>
                                                                        <span className="text-muted font-weight-bold font-size-sm">
                                                                            { setDateTableLG(lead.fecha_cancelacion_rechazo) }
                                                                        </span>
                                                                    </span>
                                                                : ''
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {
                                                            lead.origen ?
                                                                <div className="w-max-content mx-auto">
                                                                    <span className="label-origenes">
                                                                        {lead.origen.origen}
                                                                    </span>
                                                                </div>
                                                            : <></>
                                                        }
                                                    </td>
                                                    <td className="text-justify">
                                                        <span className="text-muted font-weight-bold font-size-sm">
                                                            { lead.motivos ? lead.motivos.motivo : lead.motivo }
                                                        </span>
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
                                                        {
                                                            lead.estatus ?
                                                                <span className="label label-md label-light-danger label-inline font-weight-bold" 
                                                                    style={{fontSize: '10.7px'}}>
                                                                    {lead.estatus.estatus.toUpperCase()}
                                                                </span>
                                                            : ''
                                                        }
                                                    </td>
                                                    <td className="pr-0 text-center">
                                                        <DropdownButton menualign="right" title='' className="dropdown-table-rechazados">
                                                            <Dropdown.Item className="item-rechazados" onClick={(e) => { this.changePage(lead) }}>
                                                                {setNaviIcon(`las la-plus icon-xl`, 'VER MÁS')}
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className="item-rechazados"
                                                                onClick={(e) => {
                                                                    questionAlert(
                                                                        '¿ESTÁS SEGURO?',
                                                                        `MOVERÁS AL LEAD ${lead.nombre} AL ESTATUS ${this.getMoveStatus(lead)}`,
                                                                        () => this.changeEstatus({
                                                                            id: lead.id,
                                                                            estatus: this.getMoveStatus(lead)
                                                                        })
                                                                    )
                                                                }}>
                                                                {setNaviIcon(`las la-eye icon-xl`, 'REACTIVAR')}
                                                            </Dropdown.Item>
                                                            {
                                                                this.hasProspecto('contactos', lead) ?
                                                                    <Dropdown.Item className="item-rechazados" onClick={(e) => { this.openModalHistorial(lead) }}>
                                                                        {setNaviIcon(`las la-comments icon-xl`, 'Historial de contacto')}
                                                                    </Dropdown.Item>
                                                                    : <></>
                                                            }
                                                            {
                                                                this.hasPresupuesto(lead) ?
                                                                    <Dropdown.Item className="item-rechazados" onClick={(e) => { this.openModalPresupuesto(lead) }}>
                                                                        {setNaviIcon(`las la-file-invoice-dollar icon-xl`, 'Presupuesto de diseño')}
                                                                    </Dropdown.Item>
                                                                    : <></>
                                                            }
                                                        </DropdownButton>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className={leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between"} >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm">
                                    Página {parseInt(leads.numPage) + 1} de {leads.total_paginas}
                                </div>
                                : ''
                        }
                        <div>
                            {
                                this.isActiveButton('prev') ?
                                    <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={this.onClickPrev}>
                                        <i className="ki ki-bold-arrow-back icon-xs" />
                                    </span>
                                : ''
                            }
                            {
                                this.isActiveButton('next') ?
                                    <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={this.onClickNext}>
                                        <i className="ki ki-bold-arrow-next icon-xs" />
                                    </span>
                                : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoContratados