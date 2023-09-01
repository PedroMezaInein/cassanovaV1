import React, { Component } from 'react'
import { apiPutForm, catchErrors } from '../../../functions/api'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert, questionAlert2, questionAlert } from '../../../functions/alert'
import Swal from 'sweetalert2'
import { setDateTableLG } from '../../../functions/setters'
import { OverlayTrigger, Tooltip, Dropdown, Form } from 'react-bootstrap'
import Scrollbar from 'perfect-scrollbar-react'
import { LEADS_FRONT } from '../../../constants'
import { InputGray } from '../../form-components'

class TableLeadDetenidos extends Component{

    state = {
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
    }

    componentDidMount = () => {
        this.getLeads()
    }

    getLeads =  async() => {
        waitAlert()
        const { at } = this.props
        const { leads, form } = this.state
        apiPutForm(`crm/table/lead-detenidos/${leads.numPage}`, form, at).then(
            (response) => {
                const { leads: leadsResponse, total, page } = response.data
                const { leads } = this.state
                leads.data = leadsResponse
                leads.total = total
                leads.numPage = page
                leads.total_paginas = Math.ceil(total / 10)
                this.setState({ ...this.state, leads })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    changeEstatusCanceladoRechazadoAxios = (data) => {
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
            this.changeEstatus(data)
        }
    }

    changeEstatus = async (data) => {
        waitAlert()
        const { at, refreshTimeLine } = this.props
        apiPutForm(`v2/leads/crm/lead/estatus/${data.id}`, data, at).then(
            (response) => {
                doneAlert('El estatus fue actualizado con éxito.', () => { this.getLeads() })
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
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

    openModalWithInput = (estatus, id) => {
        const { options } = this.props
        questionAlert2(
            `ESCRIBE EL MOTIVO DE ${estatus === 'Cancelado' ? 'CANCELACIÓN' : 'RECHAZO'}`,
            '',
            () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
            <div style={{ display: 'flex', maxHeight: '250px' }} >
                <Scrollbar>
                    {
                        estatus === 'Cancelado' ?
                            <Form id='canceladoForm' name='canceladoForm' className="mx-auto w-95 pr-3">
                                {
                                    options.motivosCancelacion.map((option, key) => {
                                        return (
                                            <Form.Check key = { key } id = { `motivo-cancelado-${option.id}` } type = "radio" label = { option.motivo } 
                                                name = 'motivoCancelado' className = "text-justify mb-3" value = { option.motivo }
                                                onChange = { this.onChangeMotivoCancelado } />
                                        )
                                    })
                                }
                                <Form.Check id = "motivo-cancelado-7" type = "radio" label = "Otro" name = 'motivoCancelado'
                                    className = "text-justify mb-3" value = "Otro" onChange = { this.onChangeMotivoCancelado } />
                                <div id='customInputCancelado' className='d-none'>
                                    <Form.Control placeholder = 'MOTIVO DE CANCELACIÓN' id = 'otro-motivo-cancelado'
                                        className = "form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                        as = "textarea" rows = "3" />
                                </div>
                            </Form>
                        :
                            <Form id='rechazoForm' name='rechazoForm' className="mx-auto w-95 pr-3">
                                {
                                    options.motivosRechazo.map((option, key) => {
                                        return (
                                            <Form.Check key = { key } id = { `motivo-rechazo-${option.id}` } type = "radio" label = { option.motivo } 
                                                name = 'motivoRechazo' className = "text-justify mb-3" value = { option.motivo }
                                                onChange = { this.onChangeMotivoRechazo } />
                                        )
                                    })
                                }
                                <Form.Check id = "motivo-rechazo-14" type = "radio" label = "Otro" name = 'motivoRechazo' className = "text-justify mb-3"
                                    value = "Otro" onChange = { this.onChangeMotivoRechazo } />
                                <div id='customInputRechazo' className='d-none'>
                                    <Form.Control placeholder = 'MOTIVO DE RECHAZO' className = "form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                        id = 'otro-motivo-rechazo' as = "textarea" rows = "3" />
                                </div>
                            </Form>
                    }
                </Scrollbar>
            </div>
        )
    }

    changePage = lead => {
        window.location.href = `${LEADS_FRONT}/leads/crm/info/info?lead=${lead.id}&tipo=Detenido` 
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
        form.proyecto = ''
        form.origen = 0
        this.setState({ ...this.state, form })
        this.getLeads()
    }

    render(){
        const { leads, form } = this.state
        const { clickLead, options } = this.props
        return(
            <div>
                <div className="form-group row form-group-marginless d-flex justify-content-center mb-0">
                    <div className="col-md-2">
                        <InputGray letterCase = { true } withtaglabel = { 0 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                            requirevalidation = { 0 } withformgroup = { 1 } name = "cliente" value = { form.cliente } onChange = { this.onChange }
                            type = "text" placeholder = "BUSCAR CLIENTE" iconclass = "flaticon2-search-1" />
                    </div>
                    <div className="col-md-2">
                        <InputGray letterCase = { true } withtaglabel = { 0 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                            requirevalidation = { 0 } withformgroup = { 1 } name = "proyecto" value = { form.proyecto } onChange = { this.onChange }
                            type = "text" placeholder = "BUSCAR TIPO DE PROYECTO" iconclass = "flaticon2-search-1" />
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
                                    <th colSpan="8" className = 'text-gray p-2 text-center text-uppercase'>
                                        LEADS DETENIDOS
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-gray text-gray">
                                    <th style={{ minWidth: "174px" }}>
                                        <span>Nombre del cliente y proyecto</span>
                                    </th>
                                    <th style={{ minWidth: "120px" }} className="text-center">Fecha</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                    <th style={{ minWidth: "120px" }} className="text-center">Empresa</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Fase</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                    <th style={{ minWidth: "70px" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total === 0 ?
                                        <tr>
                                            <td colSpan = '6' className = 'text-center text-dark-75 font-weight-bolder font-size-lg pt-3'>
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
                                                                <span className="symbol-label font-size-h5 bg-light-gray text-gray">
                                                                    {lead.nombre.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault(); clickLead(lead.id) } } 
                                                                    className="text-dark-75 font-weight-bolder text-hover-gray mb-1 font-size-lg cursor-pointer">
                                                                    {lead.nombre}
                                                                </span>
                                                                <span className="text-muted font-weight-bold d-block">
                                                                    {
                                                                        lead.prospecto.tipo_proyecto ?
                                                                            lead.prospecto.tipo_proyecto.tipo
                                                                            : ''
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <div className="w-max-content mx-auto">
                                                            <span>Ingreso: </span>
                                                            <span className="text-muted font-weight-bold font-size-sm">
                                                                {setDateTableLG(lead.created_at)}
                                                            </span><br />
                                                            <span>Último contacto: </span>
                                                            <span className="text-muted font-weight-bold font-size-sm">
                                                                {
                                                                    lead.prospecto ?
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                            : '-'
                                                                        : '-'
                                                                    : '-'
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
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
                                                    <td>
                                                        <div className="symbol-group symbol-hover d-flex justify-content-center">
                                                            {
                                                                lead.prospecto.vendedores.map((vendedor, index) => {
                                                                    return (
                                                                        <OverlayTrigger rootClose key={index} overlay={<Tooltip>{vendedor.name}</Tooltip>}>
                                                                            <div className="symbol symbol-35 symbol-circle">
                                                                                <img alt="Pic" src={vendedor.avatar ? vendedor.avatar : "/default.jpg"} />
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="text-center text-dark-75 font-weight-bold">
                                                        {
                                                            lead.prospecto ?
                                                                lead.prospecto.diseño ?
                                                                    'Fase 1'
                                                                : lead.prospecto.obra ?
                                                                    'Fase 2'
                                                                : ''
                                                            : ''
                                                        }
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            lead.estatus ?
                                                                <Dropdown className="dropdown-estatus-crm">
                                                                    <Dropdown.Toggle style={{ backgroundColor: lead.estatus.color_fondo, color: lead.estatus.color_texto }}>
                                                                        {lead.estatus.estatus.toUpperCase()}
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu className="p-0">
                                                                        <Dropdown.Header>
                                                                            <span className="font-size-sm">Elige una opción</span>
                                                                        </Dropdown.Header>
                                                                        <Dropdown.Item className="p-0" onClick = {
                                                                            (e) => { 
                                                                                e.preventDefault(); 
                                                                                questionAlert(`Cambiarás el estatu del lead ${lead.nombre}`, 
                                                                                    '¿Deseas continuar?',
                                                                                    () => this.changeEstatus( { id: lead.id, estatus: `En proceso` } )
                                                                                )
                                                                            }}>
                                                                            <span className="navi-link w-100">
                                                                                <span className="navi-text">
                                                                                    <span className="label label-lg label-inline label-light-proceso rounded-0 w-100 font-weight-bold">
                                                                                        EN PROCESO
                                                                                    </span>
                                                                                </span>
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item className="p-0" onClick = {
                                                                            (e) => { e.preventDefault(); this.openModalWithInput('Cancelado', lead.id) }}>
                                                                            <span className="navi-link w-100">
                                                                                <span className="navi-text">
                                                                                    <span className="label label-lg label-inline label-light-danger rounded-0 w-100 font-weight-bold">
                                                                                        CANCELADO
                                                                                    </span>
                                                                                </span>
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item className="p-0" onClick = { 
                                                                            (e) => { e.preventDefault(); this.openModalWithInput('Rechazado', lead.id) }} >
                                                                            <span className="navi-link w-100">
                                                                                <span className="navi-text">
                                                                                    <span className="label label-lg label-inline label-light-danger rounded-0 w-100 font-weight-bold">
                                                                                        RECHAZADO
                                                                                    </span>
                                                                                </span>
                                                                            </span>
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            : ''
                                                        }
                                                    </td>
                                                    <td className="pr-0 text-center">
                                                        <OverlayTrigger rootClose overlay={<Tooltip>VER MÁS</Tooltip>}>
                                                            <span onClick={(e) => { this.changePage(lead) }} 
                                                                className="btn btn-detenidos btn-icon">
                                                                <i className="flaticon2-plus icon-nm"></i>
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
                    <div className = { leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between" } >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm">
                                    Página { parseInt(leads.numPage) + 1} de { leads.total_paginas }
                                </div>
                            : ''
                        }
                        <div>
                            {
                                this.isActiveButton('prev') ?
                                    <span className="btn btn-icon btn-xs btn-light-gray mr-2 my-1" onClick={this.onClickPrev}>
                                        <i className="ki ki-bold-arrow-back icon-xs"></i>
                                    </span>
                                : ''
                            }
                            {
                                this.isActiveButton('next') ?
                                    <span className="btn btn-icon btn-xs btn-light-gray mr-2 my-1" onClick={this.onClickNext}>
                                        <i className="ki ki-bold-arrow-next icon-xs"></i>
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

export default TableLeadDetenidos