import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Modal } from '../components/modals'
import Layout from '../components/layout/layout'

import { setOptions } from '../functions/setters'
import { OneLead } from '../components/sections/crm'
import { apiGet, apiPostForm, catchErrors } from '../functions/api'
import { PaginaRp, PaginaWeb, LeadContacto, NoContratados, RhProveedores, TableLeadContratados, TableLeadDetenidos, 
    TableLeadsNegociacion } from '../components/tables'
import { waitAlert, printResponseErrorAlert, doneAlert } from '../functions/alert'
import { UltimosIngresos, SinContacto, UltimosContactados} from '../components/cards'
import { Col, Row, Card, Tab, Nav, DropdownButton, Dropdown, OverlayTrigger, Tooltip, Form} from 'react-bootstrap'
import { BuscarLead } from '../components/forms'
import { Button, RangeCalendar } from '../components/form-components'
class Crm extends Component{
    state = {
        lead:'',
        modal:{
            info: false,
            bucar: false,
            descargar:false
        },
        navs: [
            { eventKey: 'web', name: 'PÁGINA WEB' },
            { eventKey: 'contacto', name: 'EN CONTACTO' },
            { eventKey: 'negociacion', name: 'EN NEGOCIACIÓN' },
            { eventKey: 'contratados', name: 'CONTRATADOS' },
            { eventKey: 'detenidos', name: 'DETENIDOS' },
            { eventKey: 'rh-proveedores', icon:'fas fa-users', dropdown:true, name: 'RH/PROVEEDORES' },
            { eventKey: 'cancelados', icon:'fas fa-user-times', dropdown:true, name: 'CANCELADOS/RECHAZADOS' },
            { eventKey: 'rp', icon:'far fa-handshake', dropdown:true, name: 'RELACIONES PÚBLICAS' }
        ],
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(), 
            name:''
        },
        leads: [],
        options: {
            empresas: [],
            servicios: [],
            origenes: [],
            motivosCancelacion: [],
            motivosRechazo: []
        },
        activeTable: 'web',
        flag: false
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const escuchamos = permisos.find(function (ventana, index) {
            const { modulo: { url } } = ventana
            return pathname === url
        });
        // console.log(escuchamos)
        if (!escuchamos)
            history.push('/')
        // this.getOptions()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, filters } = this.state
                filters.identificador = id
                modal.see = true
                this.setState({ ...this.state, modal, filters })
                this.reloadTable(filters)
                this.getVentaAxios(id)
            }
        }
        this.getOptionsAxios()
    }

    refreshTimeLine = (type) => {
        const { flag } = this.state
        this.setState({ ...this.state, flag: !flag })
    }

    /* ----------------------- ANCHOR CRM GET ALL OPTIONS ----------------------- */
    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`crm/options`, access_token).then(
            (response) => {
                Swal.close()
                const { empresas, origenes, medios, motivosCancelacion, motivosRechazo} = response.data
                const { options } = this.state
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                options.motivosCancelacion = motivosCancelacion
                options.motivosRechazo = motivosRechazo
                options.motivosCancelacion.map((motivo)=>{
                    motivo.checked = false
                    return ''
                })
                options.motivosRechazo.map((motivo)=>{
                    motivo.checked = false
                    return ''
                })
                let aux = []
                origenes.map((origen) => {
                    aux.push({
                        value: origen.id.toString(),
                        text: origen.origen
                    })
                    return ''
                })
                options.origenes = aux

                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* -------------------- ANCHOR CRM GET ONE LEAD ALL INFO -------------------- */
    getOneLeadInfoAxios = async (lead) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`crm/lead/${lead}`, access_token).then(
            (response) => {
                Swal.close()
                const { lead } = response.data
                const { modal } = this.state
                modal.info = true
                this.setState({
                    ...this.state,
                    modal,
                    lead: lead,
                    activePage: 1
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    closeModalOneLead = () => {
        const { modal } = this.state
        modal.info = false
        this.setState({
            ...this.state,
            modal,
            lead: ''
        })
    }
    changeActiveTable = value => {
        this.setState({ ...this.state, activeTable: value })
    }
    /* ------------------------------------------------------------------------- */
    /*                                  BUSCAR LEAD                              */
    /* ------------------------------------------------------------------------- */
    openModalBuscar = () => {
        const { modal } = this.state
        modal.bucar = true
        this.setState({
            ...this.state,
            modal
        })
    }
    handleCloseBuscar = () => { 
        const { form, modal } = this.state
        modal.bucar = false
        form.name = ''
        this.setState({
            ...this.state,
            modal,
            leads: [],
            form
        }) 
    }
    onSubmitSearch = async(e) => {
        e.preventDefault()
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        apiGet(`v2/leads/crm/search/${form.name}`, access_token).then(
            (response) => {
                const { leads }= response.data
                Swal.close()
                this.setState({...this.state, leads})
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    onChangeBuscar = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    /* ------------------------------------------------------------------------- */
    /*                               DESCARGAR LEAD                              */
    /* ------------------------------------------------------------------------- */
    openModalDescargar = () => { 
        const { modal } = this.state
        modal.descargar = true
        this.setState({
            ...this.state,
            modal
        })
    }
    handleCloseDescargar = () => { 
        const { form, modal } = this.state
        modal.descargar = false
        form.fechaInicio = new Date()
        form.fechaFin = new Date()
        this.setState({
            ...this.state,
            modal,
            form
        })
    }
    onChangeDescargar = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }
    onSubmitDescargar = async(e) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        e.preventDefault();
        waitAlert()
        apiPostForm(`v2/exportar/leads`, form, access_token).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'leads.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert('Leads consultados con éxito')
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    /* ------------------------------------------------------------------------- */
    /*                                  NUEVO LEAD                               */
    /* ------------------------------------------------------------------------- */
    changePageAdd = () => {
        const { history } = this.props
        history.push({ pathname: '/leads/crm/add/telefono' })
    }
    refresh = (lead) => {
        this.getOneLeadInfoAxios(lead)
    }
    render(){
        const { lead, modal, activeTable, navs, form, leads, options, flag } = this.state
        const { access_token, user, history } = this.props.authUser
        return(
            <Layout active = 'leads'  { ...this.props } >
                <Row>
                    <Col lg={4}>
                        <UltimosIngresos at = { access_token } clickOneLead = { this.getOneLeadInfoAxios }
                            flag = { flag } />
                    </Col>
                    <Col lg={4}>
                        <SinContacto at = { access_token } clickOneLead = { this.getOneLeadInfoAxios }
                            flag = { flag } />
                    </Col>
                    <Col lg={4}>
                        <UltimosContactados at = { access_token } clickOneLead = { this.getOneLeadInfoAxios }
                            flag = { flag } />
                    </Col>
                </Row>
                <Col md={12} className="px-0">
                    <Tab.Container defaultActiveKey="web" activeKey={activeTable} onSelect={(select) => { this.changeActiveTable(select) }}>
                        <Card className="card-custom card-stretch gutter-b py-2">
                            <Card.Header className="align-items-center border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark">Leads</span>
                                </h3>
                                <div className="card-toolbar">
                                    <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                        {
                                            navs.map((nav, key) => {
                                                if(!nav.dropdown){
                                                    return (
                                                        <Nav.Item key={key} className="nav-item">
                                                            <Nav.Link eventKey={nav.eventKey} 
                                                                onClick={(e) => { e.preventDefault(); this.changeActiveTable(nav.eventKey) }}>
                                                                {nav.name}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                }else return <span key = { key } ></span>
                                            })
                                        }
                                        {/* <Nav.Item className="nav-item align-self-center"> */}
                                        <div className="dropdown-crm btn btn-icon">
                                            <DropdownButton title={<span><i className="flaticon2-plus icon-nm icon-mas"></i></span>} menualign="right" >
                                                {
                                                    navs.map((nav, key) => {
                                                        if(nav.dropdown){
                                                            return (
                                                                <Dropdown.Item eventKey={nav.eventKey} className={nav.eventKey} key={key} 
                                                                    onClick={(e) => { e.preventDefault(); this.changeActiveTable(nav.eventKey) }}>
                                                                    <span className="navi-icon">
                                                                        <i className={`${nav.icon} pr-3 text`}></i>
                                                                    </span>
                                                                    <span className="navi-text align-self-center">{nav.name}</span>
                                                                </Dropdown.Item>
                                                            )
                                                        }else return <span key = { key } ></span>
                                                    })
                                                }
                                            </DropdownButton>
                                        </div>

                                        {/* </Nav.Item> */}
                                    </Nav>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="web">
                                        {
                                            activeTable === 'web' ?
                                                <PaginaWeb at = { access_token } clickOneLead = { this.getOneLeadInfoAxios } user = { user } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine } />
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contacto">
                                        {
                                            activeTable === 'contacto' ? 
                                                <LeadContacto at = { access_token } clickOneLead = { this.getOneLeadInfoAxios } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine }/>
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="negociacion">
                                        {
                                            activeTable === 'negociacion' ?
                                                <TableLeadsNegociacion at = { access_token } clickLead = { this.getOneLeadInfoAxios } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine }/>
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contratados">
                                        {
                                            activeTable === 'contratados' ?
                                                <TableLeadContratados at = { access_token } clickLead = { this.getOneLeadInfoAxios } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine } />
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="detenidos">
                                        {
                                            activeTable === 'detenidos' ?
                                                <TableLeadDetenidos at = { access_token } clickLead = { this.getOneLeadInfoAxios } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine } />
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="rh-proveedores">
                                        {
                                            activeTable === 'rh-proveedores' ?
                                                <RhProveedores at = { access_token } clickLead = { this.getOneLeadInfoAxios } 
                                                    options = { options } refreshTimeLine = { this.refreshTimeLine } />
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cancelados">
                                        {
                                            activeTable === 'cancelados' ?
                                                <NoContratados at = { access_token } clickLead = { this.getOneLeadInfoAxios }
                                                    options = { options } history = { history } refreshTimeLine = { this.refreshTimeLine }/>
                                            : ''
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="rp">
                                        {
                                            activeTable === 'rp' ?
                                                <PaginaRp at = { access_token } options = { options } refreshTimeLine = { this.refreshTimeLine }/>
                                            : ''
                                        }
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>

                {/* ANCHOR MODAL SINGLE ONE LEAD */}
                <Modal size="lg" title={`INFORMACIÓN DE ${lead.nombre}`} show = { modal.info } handleClose = { this.closeModalOneLead } >
                    <OneLead lead={lead} at = { access_token } refresh = { this.refresh } />
                </Modal>

                {/* STICKY OPTIONS LEADS */}
                <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                    <OverlayTrigger rootClose overlay={<Tooltip><span className="text-dark-50 font-weight-bold">BUSCAR LEAD</span></Tooltip>}>
                        <li className="nav-item mb-2" data-placement="right" onClick={(e) => { e.preventDefault(); this.openModalBuscar() }}>
                            <span className="btn btn-sm btn-icon btn-bg-light btn-text-success btn-hover-success" >
                                <i className="la la-search icon-xl"></i>
                            </span>
                        </li>
                    </OverlayTrigger>
                    <OverlayTrigger rootClose overlay={<Tooltip><span className="text-dark-50 font-weight-bold">DESCARGAR LEADS</span></Tooltip>}>
                        <li className="nav-item mb-2" title="" data-placement="left" onClick={(e) => { e.preventDefault(); this.openModalDescargar() }} >
                            <span className="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
                                <i className="la la-file-excel icon-xl"></i>
                            </span>
                        </li>
                    </OverlayTrigger>
                    <OverlayTrigger rootClose overlay={<Tooltip><span className="text-dark-50 font-weight-bold">NUEVO LEAD</span></Tooltip>}>
                        <li className="nav-item mb-2" data-placement="left" onClick={() => { this.changePageAdd() }}>
                            <span className="btn btn-sm btn-icon btn-bg-light btn-text-info btn-hover-info">
                                <i className="la la-user-plus icon-xl"></i>
                            </span>
                        </li>
                    </OverlayTrigger>
                </ul>
                <Modal show = { modal.bucar } size ="lg" title = 'Buscar lead' handleClose = { this.handleCloseBuscar } >
                    <BuscarLead form = { form } onSubmit = { this.onSubmitSearch } onChange = { this.onChangeBuscar } leads = { leads } 
                        changePageDetails = { this.changePageDetailsContacto } />
                </Modal>
                <Modal show = { modal.descargar } title = 'Descargar leads' handleClose = { this.handleCloseDescargar } >
                    <Form onSubmit = { this.onSubmitDescargar} >
                        <div className="text-center">
                            <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br/>
                            <RangeCalendar onChange = { this.onChangeDescargar } start = { form.fechaInicio } end = { form.fechaFin } />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="boton- btn btn-primary mr-2" onClick={ this.onSubmitDescargar } text="ENVIAR" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Crm)