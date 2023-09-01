import React, { Component } from 'react'
import { apiGet, apiPutForm, catchErrors } from '../../../functions/api'
import Swal from 'sweetalert2'
import { printResponseErrorAlert, questionAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { MAIN_FRONT, LEADS_FRONT } from '../../../constants'
import { setDateTableLG, setNaviIcon } from '../../../functions/setters'
import { OverlayTrigger, Tooltip, DropdownButton, Dropdown, Form } from 'react-bootstrap'
import { Modal } from '../../modals'
import InfoProyecto from '../../forms/info/InfoProyecto'
import { InputGray } from '../../form-components'

class TableLeadContratados extends Component{

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
            continuidad: 'recontratacion',
            editar: {
                name: '',
                email: '',
                telefono: '',
                fecha: new Date(),
                estado: ''
            }
        }, 
        modal: { proyecto: false },
        proyecto: ''
    }

    componentDidMount = () => {
        this.getLeads()
    }

    getLeads =  async() => {
        waitAlert()
        const { at } = this.props
        const { leads, form } = this.state
        apiPutForm(`crm/table/lead-contratados/${leads.numPage}`, form, at).then(
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

    getOneProyecto = async(proyecto) => {
        const { at } = this.props
        waitAlert()
        apiGet(`v2/proyectos/proyectos/proyecto/${proyecto.id}`, at).then(
            (response) => {
                const { proyecto } = response.data
                const { modal } = this.state
                modal.proyecto = true 
                this.setState({ ...this.state, modal, proyecto: proyecto, })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    changeContinuidadLead = async (lead) => {
        const { at, refreshTimeLine } = this.props
        apiPutForm(`v2/leads/crm/prospecto/${lead.id}/continuidad`, {}, at).then(
            (response) => {
                doneAlert('La continuidad del lead fue actualizada con éxito.',
                    () => { this.getLeads() } );
                refreshTimeLine()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    hasProyecto = lead => {
        if(lead)
            if(lead.prospecto)
                if(lead.prospecto.proyecto)
                    return true
        return false
    }

    changePageEditProyecto = proyecto => {
        window.location.href = `${MAIN_FRONT}/proyectos/proyectos?id=${proyecto.id}&prev=crm`
    }

    changePage = lead => {
        window.location.href = `${LEADS_FRONT}/leads/crm/info/info?lead=${lead.id}&tipo=Contratado` 
    }

    handleClose = () => {
        const { modal } = this.state
        modal.proyecto = false
        this.setState({ ...this.state, modal, proyecto: '' })
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
        form.continuidad = 'recontratacion'
        this.setState({ ...this.state, form })
        this.getLeads()
    }

       //funcion para paginador
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

    render(){
        const { clickLead, options } = this.props
        const { leads, modal, proyecto, form } = this.state
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
                    <div className="col-md-2">
                        <Form.Control className = "form-control text-uppercase form-control-solid"
                            value = { form.continuidad } onChange = { this.onChange }
                            name = 'continuidad' as = "select">
                            <option value = { 0 } >Selecciona la continuidad</option>
                            <option value = 'terminado' className="bg-white" >Terminado</option>
                            <option value = 'recontratacion' className="bg-white">Contratar otra fase</option>
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
                <Modal show = { modal.proyecto } size="xl" title = { proyecto ? proyecto.estatus ?
                            <span>
                                {proyecto.nombre}
                                <span className="label label-lg label-inline font-weight-bold py-1 px-2" style={{
                                    color: `${proyecto.estatus.letra}`, backgroundColor: `${proyecto.estatus.fondo}`,
                                    fontSize: "75%", marginLeft:'10px' }} >
                                    {proyecto.estatus.estatus}
                                </span>
                            </span>
                        : <span>-</span>
                    :''
                } handleClose = { this.handleClose } >
                    { proyecto ? <InfoProyecto proyecto = { proyecto } /> : '' }
                </Modal>
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th colSpan="9" className='text-green p-2 text-center text-uppercase'>
                                        LEADS CONTRATADOS
                                    </th>
                                </tr>
                                <tr className="text-uppercase bg-light-green text-green">
                                    <th className="min-width-225px">
                                        <span>Nombre del cliente y proyecto</span>
                                    </th>
                                    <th className="text-center">Fecha</th>
                                    <th className="text-center">Origen</th>
                                    <th className="text-center min-width-100px">Empresa</th>
                                    <th className="text-center min-width-100px">Vendedor</th>
                                    <th className="text-center min-width-100px">Fase</th>
                                    <th className="text-center">Estatus</th>
                                    <th className="text-center min-width-175px">Continuidad</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    leads.total === 0 ?
                                        <tr>
                                            <td colSpan = "6" className = 'text-center text-dark-75 font-weight-bolder font-size-lg pt-3'>
                                                NO SE ENCONTRARON RESULTADOS
                                            </td>
                                        </tr>
                                    :
                                        leads.data.map((lead, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td className="pl-0 py-8">
                                                        <div className="d-flex align-items-center">
                                                            <div className="symbol symbol-45 symbol-light-success mr-3">
                                                                <span className="symbol-label font-size-h5">{lead.nombre.charAt(0)}</span>
                                                            </div>
                                                            <div>
                                                                <span onClick = { ( e ) => { e.preventDefault(); clickLead(lead.id) } } 
                                                                    className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg cursor-pointer">
                                                                        {lead.nombre}
                                                                </span>
                                                                {
                                                                    this.hasProyecto(lead) ?
                                                                        <a href = {`${MAIN_FRONT}/proyectos/proyectos?id=${lead.prospecto.proyecto.id}`}>
                                                                            <span className="text-muted font-weight-bolder text-hover-primary d-block">
                                                                                { lead.prospecto.proyecto.nombre }
                                                                            </span>
                                                                        </a>
                                                                    :
                                                                        <span className="text-muted font-weight-bold d-block">
                                                                            {
                                                                                lead.prospecto.tipo_proyecto ?
                                                                                    lead.prospecto.tipo_proyecto.tipo
                                                                                : ''
                                                                            }
                                                                        </span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="font-size-lg text-left font-weight-bolder">
                                                        <div className="w-max-content mx-auto">
                                                            <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                            <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">
                                                                {setDateTableLG(lead.prospecto.contactos[0].created_at)}
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
                                                        <span className="label label-md label-light-success label-inline font-weight-bold" 
                                                            style={{fontSize: '10.7px'}}>CONTRATADO</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className = { `text-hover label label-md label-inline font-weight-bold 
                                                            ${lead.prospecto.continuidad === 0 ? 'label-light-danger' : 'label-light-info'}` } 
                                                            style={{fontSize: '10.7px'}}
                                                            onClick={
                                                                (e) => { 
                                                                    questionAlert( `Cambiarás la continuidad del lead`,
                                                                        `¿Deseas continuar?`,
                                                                        () => this.changeContinuidadLead(lead)) }} >
                                                                { lead.prospecto.continuidad ? 'Contratar otra fase' : 'Terminado' }
                                                        </span>
                                                    </td>
                                                    <td className="pr-0 text-center">
                                                        <DropdownButton menualign="right" title='' className="dropdown-table-contratados">
                                                            <Dropdown.Item className="item-contratados" onClick={(e) => { this.changePage(lead) }}>
                                                                {setNaviIcon(`las la-plus icon-xl`, 'VER MÁS')}
                                                            </Dropdown.Item>
                                                            {
                                                                this.hasProyecto(lead) &&
                                                                <Dropdown.Item className="item-contratados" onClick={(e) => { this.getOneProyecto(lead.prospecto.proyecto) }}>
                                                                    {setNaviIcon(`las la-eye icon-xl`, 'VER PROYECTO')}
                                                                </Dropdown.Item>
                                                            }
                                                            {
                                                                this.hasProyecto(lead) &&
                                                                <Dropdown.Item className="item-contratados" onClick = { (e) => { this.changePageEditProyecto(lead.prospecto.proyecto) }}>
                                                                    {setNaviIcon(`las la-pencil-alt icon-xl`, 'EDITAR PROYECTO')}
                                                                </Dropdown.Item>
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
                    <div className = { leads.total === 0 ? "d-flex justify-content-end" : "d-flex justify-content-between" } >
                        {
                            leads.total > 0 ?
                                <div className="text-body font-weight-bolder font-size-sm align-self-center">
                                    Página { parseInt(leads.numPage) + 1} de { leads.total_paginas }
                                </div>
                            : ''
                        }
                        <div>
                            {
                                this.isActiveButton('prev') ?
                                    <span className="btn btn-icon btn-xs btn-light-primary mr-2" onClick={this.onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                    : ''
                            }
                            {
                                this.isActiveButton('next') ?
                                    <span className="btn btn-icon btn-xs btn-light-primary" onClick={this.onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                    : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TableLeadContratados