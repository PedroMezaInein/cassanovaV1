import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { printResponseErrorAlert, waitAlert, doneAlert, originChangeAlert } from '../../../functions/alert'
import { apiPutForm, apiGet, catchErrors } from '../../../functions/api'
import { setDateTableLG, setOptions } from '../../../functions/setters'
import { OverlayTrigger, Tooltip, Dropdown, Form } from 'react-bootstrap'
import { Modal } from '../../modals'
import { FormProveedoresRh } from '../../forms'
import { InputGray } from '../../form-components'

class RhProveedores extends Component{

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
            estatus: 0
        }, 
        lead: '',
        modal: { form:false },
        opciones: { empresas: [], origenes: [] },
        title:''
    }

    componentDidMount =() => {
        this.getLeads()
    }

    getLeads = async() => {
        waitAlert()
        const { leads, form } = this.state
        const { at } = this.props
        apiPutForm(`crm/table/lead-rh-proveedor/${leads.numPage}`, form, at).then(
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

    changeOrigenAxios = async (data) => {
        waitAlert()
        const { at } = this.props
        apiPutForm(`crm/lead/origen/${data.id}`, data, at).then(
            (response) => {
                doneAlert('El origen fue actualizado con éxito.',
                    () => { this.getLeads() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getOptionsRh = async() => {
        waitAlert()
        const { at } = this.props
        apiGet('crm/table/lead-rh-proveedor/options', at).then(
            (response) => {
                const { empresas, origenes} = response.data
                const { opciones } = this.state
                opciones.empresas = setOptions(empresas, 'name', 'id')
                opciones.origenes = setOptions(origenes, 'origen', 'id')
                this.setState({ ...this.state, opciones })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    changeOrigen = (origen, id) => {
        originChangeAlert(origen.text, 
            () => this.changeOrigenAxios({ id: id, origen: origen.value }))
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

    openModalForm = ( lead, type ) => {
        this.getOptionsRh()
        const { form, modal } = this.state
        modal.form = true
        this.setState({ ...this.state, modal, form, lead: lead, title:type })
    }

    closeModal = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({ ...this.state, modal, lead: '' })
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
        form.tipo = 0
        this.setState({ ...this.state, form })
        this.getLeads()
    }

    refresh = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({ ...this.state, modal })
        this.getLeads()
    }

    render(){
        const { leads, modal, form, lead, opciones, title } = this.state
        const { clickLead, options, at } = this.props
        return(
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
                    <div className="col-md-2">
                        <Form.Control className="form-control text-uppercase form-control-solid"
                            value={form.tipo} onChange={this.onChange} name='tipo' as="select">
                            <option value={0} >Tipo</option>
                            <option value="proveedor" className="bg-white">PROVEEDOR</option>
                            <option value="bolsa_trabajo" className="bg-white">BOLSA DE TRABAJO</option>
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
                <div className="d-flex justify-content-end">
                    <span className="btn btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success" 
                        onClick={(e) => { this.openModalForm(lead, 'Nuevo') }} >
                        <i className="fas fa-user-plus text-pink mb-1" /> Nuevo
                    </span>
                </div>
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="7" className = 'text-pink p-2 text-center text-uppercase'>
                                        RRHH Y PROVEEDORES
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-pink text-pink">
                                    <th style={{ minWidth: "206px" }}> <span>Nombre</span> </th>
                                    <th style={{ minWidth: "180px" }} className="text-center">Fecha</th>
                                    <th style={{ minWidth: "152px" }} className="text-center">Tipo</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Empresa</th>
                                    <th style={{ minWidth: "150px" }} className="text-center">Origen</th>
                                    <th style={{ minWidth: "100px" }} className="text-center">Comentario</th>
                                    <th></th>
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
                                        leads.data.map((lead, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 mr-3">
                                                                <span className="symbol-label font-size-h5 bg-light-pink text-pink">
                                                                    {lead.nombre.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault(); clickLead(lead.id) } } 
                                                                    className="text-dark-75 font-weight-bolder text-hover-pink mb-1 font-size-lg cursor-pointer">
                                                                    {lead.nombre}
                                                                </span>
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
                                                                lead.fecha_cancelacion_rechazo !== null ?
                                                                    <span>
                                                                        <span>{lead.rechazado? 'Rechazo':'Cancelado'}: </span>
                                                                        <span className="text-muted font-weight-bold font-size-sm">
                                                                            { setDateTableLG(lead.fecha_cancelacion_rechazo) }
                                                                        </span>
                                                                    </span>
                                                                : <></>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="w-max-content mx-auto">
                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">
                                                                {
                                                                    lead.proveedor ? 'PROVEEDOR' :
                                                                        lead.rh ? 'BOLSA DE TRABAJO' : ''
                                                                }
                                                            </span>
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
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle
                                                                                style={
                                                                                    {
                                                                                        backgroundColor: '#F3F6F9', color: '#80808F', border: 'transparent', 
                                                                                        padding: '2.8px 5.6px', width: 'auto', margin: 0, display: 'inline-flex', 
                                                                                        justifyContent: 'center', alignItems: 'center', fontSize: '11.5px',
                                                                                        fontWeight: 500
                                                                                    }
                                                                                }
                                                                                className = 'no-arrow'
                                                                            >
                                                                                {lead.origen.origen.toUpperCase()}
                                                                            </Dropdown.Toggle>
                                                                            <Dropdown.Menu className="p-0">
                                                                                <Dropdown.Header>
                                                                                    <span className="font-size-sm">Elige una opción</span>
                                                                                </Dropdown.Header>
                                                                                {
                                                                                    options.origenes.map((origen, key) => {
                                                                                        return (
                                                                                            <div key={key}>
                                                                                                <Dropdown.Item className="p-0" key={key} 
                                                                                                    onClick={() => { this.changeOrigen(origen, lead.id) }} >
                                                                                                    <span className="navi-link w-100">
                                                                                                        <span className="navi-text">
                                                                                                            <span className="label label-xl label-inline 
                                                                                                                text-gray rounded-0 w-100 
                                                                                                                font-weight-bolder">
                                                                                                                {origen.text}
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                </Dropdown.Item>
                                                                                                <Dropdown.Divider className="m-0" 
                                                                                                    style={{ borderTop: '1px solid #fff' }} />
                                                                                            </div>
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
                                                    <td className="text-justify">
                                                        <span className="text-muted font-weight-bold font-size-sm">
                                                            {lead.comentario}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <OverlayTrigger rootClose overlay={<Tooltip>EDITAR INFORMACIÓN GENERAL</Tooltip>}>
                                                            <span onClick={(e) => { this.openModalForm(lead, 'Editar') }}
                                                                className="btn btn-icon btn-sm btn-rh-edit">
                                                                <i className="las la-edit icon-xl"></i>
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
                                    <span className="btn btn-icon btn-xs btn-light-pink mr-2 my-1" onClick={this.onClickPrev}>
                                        <i className="ki ki-bold-arrow-back icon-xs"></i>
                                    </span>
                                : ''
                            }
                            {
                                this.isActiveButton('next') ?
                                    <span className="btn btn-icon btn-xs btn-light-pink mr-2 my-1" onClick={this.onClickNext}>
                                        <i className="ki ki-bold-arrow-next icon-xs"></i>
                                    </span>
                                : ''
                            }
                        </div>
                    </div>
                </div>
                <Modal size = 'xl' title = {`${title} registro de proveedor o bolsa de trabajo`} show = { modal.form } handleClose = { this.closeModal }>
                    {
                        modal.form ?
                            <FormProveedoresRh options = { opciones } at = { at } refresh = { this.refresh } title = { title } lead = { lead }/>
                        : ''
                    }
                </Modal>
            </div>
        )
    }
}

export default RhProveedores