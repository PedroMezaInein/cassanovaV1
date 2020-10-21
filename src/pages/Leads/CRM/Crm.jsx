import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import swal from 'sweetalert'
import { Col, Row, Card, Form, Tab, Nav } from 'react-bootstrap'
import { setOptions } from '../../../functions/setters'
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert, waitAlert } from '../../../functions/alert'
import LeadNuevo from '../../../components/tables/Lead/LeadNuevo'
import LeadContacto from '../../../components/tables/Lead/LeadContacto'
import LeadNegociacion from '../../../components/tables/Lead/LeadNegociacion'
import LeadContrato from '../../../components/tables/Lead/LeadContrato'
import LeadNoContratado from '../../../components/tables/Lead/LeadNoContratado'
import LeadDetenido from '../../../components/tables/Lead/LeadDetenido'

class Crm extends Component {
    state = {
        ultimos_contactados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_contactados"
        },
        activeTable: 'web',
        options: {
            empresas: [],
            servicios: []
        },
        prospectos_sin_contactar: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "prospectos_sin_contactar"
        },
        ultimos_ingresados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_ingresados"
        },
        lead_web: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_ingresados"
        },
        leads_en_contacto: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "en_contacto"
        },
        leads_contratados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "contratados"
        },
        leads_cancelados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "cancelados"
        },
        leads_detenidos: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "detenidos"
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const crm = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!crm)
            history.push('/')
        this.getOptionsAxios()
        this.getUltimosContactos()
        this.getSinContactar()
        this.getUltimosIngresados()
        this.getLeadsWeb()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    nextUltimosContactados = (e) => {
        e.preventDefault()
        const { ultimos_contactados } = this.state
        if (ultimos_contactados.numPage < ultimos_contactados.total_paginas - 1) {
            this.setState({
                numPage: ultimos_contactados.numPage++
            })
            this.getUltimosContactos()
        }
    }
    prevUltimosContactados = (e) => {
        e.preventDefault()
        const { ultimos_contactados } = this.state
        if (ultimos_contactados.numPage > 0) {
            this.setState({
                numPage: ultimos_contactados.numPage--
            })
            this.getUltimosContactos()
        }
    }
    nextPageProspectosSinContactar = (e) => {
        e.preventDefault()
        const { prospectos_sin_contactar } = this.state
        if (prospectos_sin_contactar.numPage < prospectos_sin_contactar.total_paginas - 1) {
            this.setState({
                numPage: prospectos_sin_contactar.numPage++
            })
            this.getSinContactar()
        }
    }
    prevPageProspectosSinContactar = (e) => {
        e.preventDefault()
        const { prospectos_sin_contactar } = this.state
        if (prospectos_sin_contactar.numPage > 0) {
            this.setState({
                numPage: prospectos_sin_contactar.numPage--
            })
            this.getSinContactar()
        }
    }
    nextPageUltimosIngresados = (e) => {
        e.preventDefault()
        const { ultimos_ingresados } = this.state
        if (ultimos_ingresados.numPage < ultimos_ingresados.total_paginas - 1) {
            this.setState({
                numPage: ultimos_ingresados.numPage++
            })
        }
        this.getUltimosIngresados()
    }
    prevPageUltimosIngresados = (e) => {
        e.preventDefault()
        const { ultimos_ingresados } = this.state
        if (ultimos_ingresados.numPage > 0) {
            this.setState({
                numPage: ultimos_ingresados.numPage--
            })
            this.getUltimosIngresados()
        }
    }
    nextPageLeadWeb = (e) => {
        e.preventDefault()
        const { lead_web } = this.state
        if (lead_web.numPage < lead_web.total_paginas - 1) {
            this.setState({
                numPage: lead_web.numPage++
            })
        }
        this.getLeadsWeb()
    }
    prevPageLeadWeb = (e) => {
        e.preventDefault()
        const { lead_web } = this.state
        if (lead_web.numPage > 0) {
            this.setState({
                numPage: lead_web.numPage--
            })
            this.getLeadsWeb()
        }
    }
    nextPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { leads_en_contacto } = this.state
        if (leads_en_contacto.numPage < leads_en_contacto.total_paginas - 1) {
            leads_en_contacto.numPage++
            this.setState({
                leads_en_contacto
            })
        }
        this.getLeadsEnContacto()
    }
    prevPageLeadEnContacto = (e) => {
        e.preventDefault()
        const { leads_en_contacto } = this.state
        if (leads_en_contacto.numPage > 0) {
            leads_en_contacto.numPage--
            this.setState({
                leads_en_contacto
            })
            this.getLeadsEnContacto()
        }
    }
    nextPageLeadCancelados = (e) => {
        e.preventDefault()
        const { leads_cancelados } = this.state
        if (leads_cancelados.numPage < leads_cancelados.total_paginas - 1) {
            leads_cancelados.numPage++
            this.setState({
                leads_cancelados
            })
        }
        this.getLeadsCancelados()
    }
    prevPageLeadCancelados = (e) => {
        e.preventDefault()
        const { leads_cancelados } = this.state
        if (leads_cancelados.numPage > 0) {
            leads_cancelados.numPage--
            this.setState({
                leads_cancelados
            })
            this.getLeadsCancelados()
        }
    }
    nextPageLeadContratados = (e) => {
        e.preventDefault()
        const { leads_contratados } = this.state
        if (leads_contratados.numPage < leads_contratados.total_paginas - 1) {
            leads_contratados.numPage++
            this.setState({
                leads_contratados
            })
        }
        this.getLeadsContratados()
    }
    prevPageLeadContratados = (e) => {
        e.preventDefault()
        const { leads_contratados } = this.state
        if (leads_contratados.numPage > 0) {
            leads_contratados.numPage--
            this.setState({
                leads_contratados
            })
            this.getLeadsContratados()
        }
    }
    nextPageLeadDetenidos = (e) => {
        e.preventDefault()
        const { leads_detenidos } = this.state
        if (leads_detenidos.numPage < leads_detenidos.total_paginas - 1) {
            leads_detenidos.numPage++
            this.setState({
                leads_detenidos
            })
        }
        this.getLeadsDetenidos()
    }
    prevPageLeadDetenidos = (e) => {
        e.preventDefault()
        const { leads_detenidos } = this.state
        if (leads_detenidos.numPage > 0) {
            leads_detenidos.numPage--
            this.setState({
                leads_detenidos
            })
            this.getLeadsDetenidos()
        }
    }    
    async getUltimosContactos() {
        const { access_token } = this.props.authUser
        const { ultimos_contactados } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-contactos/' + ultimos_contactados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total } = response.data
                const { ultimos_contactados } = this.state
                let total_paginas = Math.ceil(total / 5)
                ultimos_contactados.data = contactos
                ultimos_contactados.total = total
                ultimos_contactados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    ultimos_contactados
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getSinContactar() {
        const { access_token } = this.props.authUser
        const { prospectos_sin_contactar } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-prospectos-sin-contactar/' + prospectos_sin_contactar.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contactos, total } = response.data
                const { prospectos_sin_contactar } = this.state
                prospectos_sin_contactar.data = contactos
                prospectos_sin_contactar.total = total
                let total_paginas = Math.ceil(total / 5)
                prospectos_sin_contactar.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    prospectos_sin_contactar
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getUltimosIngresados() {
        const { access_token } = this.props.authUser
        const { ultimos_ingresados } = this.state
        await axios.get(URL_DEV + 'crm/timeline/ultimos-leads-ingresados/' + ultimos_ingresados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { ultimos_ingresados } = this.state
                ultimos_ingresados.data = leads
                ultimos_ingresados.total = total
                let total_paginas = Math.ceil(total / 5)
                ultimos_ingresados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    ultimos_ingresados
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getLeadsWeb() {
        const { access_token } = this.props.authUser
        const { lead_web } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-web/' + lead_web.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { lead_web } = this.state
                lead_web.data = leads
                lead_web.total = total
                let total_paginas = Math.ceil(total / 10)
                lead_web.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    lead_web
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getLeadsEnContacto() {
        const { access_token } = this.props.authUser
        const { leads_en_contacto } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-en-contacto/' + leads_en_contacto.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { leads_en_contacto } = this.state
                leads_en_contacto.data = leads
                leads_en_contacto.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_en_contacto.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_en_contacto
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getLeadsCancelados() {
        const { access_token } = this.props.authUser
        const { leads_cancelados } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-cancelados/' + leads_cancelados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { leads_cancelados } = this.state
                leads_cancelados.data = leads
                leads_cancelados.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_cancelados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_cancelados
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getLeadsContratados() {
        const { access_token } = this.props.authUser
        const { leads_contratados } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-contratados/' + leads_contratados.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { leads_contratados } = this.state
                leads_contratados.data = leads
                leads_contratados.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_contratados.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_contratados
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }    
    async getLeadsDetenidos() {
        const { access_token } = this.props.authUser
        const { leads_detenidos } = this.state
        await axios.get(URL_DEV + 'crm/table/lead-detenidos/' + leads_detenidos.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { leads_detenidos } = this.state
                leads_detenidos.data = leads
                leads_detenidos.total = total
                let total_paginas = Math.ceil(total / 10)
                leads_detenidos.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    leads_detenidos
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    sendEmailNewWebLead = async lead => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/email/solicitud-llamada/' + lead.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    changeActiveTable = key => {
        switch (key) {
            case 'web':
                this.getLeadsWeb();
                break;
            case 'contacto':
                this.getLeadsEnContacto();
                break;
            case 'contratados':
                this.getLeadsContratados();
                break;
            case 'cancelados':
                this.getLeadsCancelados();
                break;
            case 'detenidos':
                this.getLeadsDetenidos();
                break;
            default: break;
        }
        this.setState({
            ...this.state,
            activeTable: key
        })
    }

    render() {
        const { ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados, lead_web, activeTable, leads_en_contacto,
            leads_contratados, leads_cancelados, leads_detenidos } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <Row>
                    <Col lg={4}>
                        <UltimosIngresosCard
                            ultimos_ingresados={ultimos_ingresados}
                            onClick={this.nextPageUltimosIngresados}
                            onClickPrev={this.prevPageUltimosIngresados}
                        />
                    </Col>
                    <Col lg={4}>
                        <SinContacto
                            prospectos_sin_contactar={prospectos_sin_contactar}
                            onClick={this.nextPageProspectosSinContactar}
                            onClickPrev={this.prevPageProspectosSinContactar}
                        />
                    </Col>
                    <Col lg={4}>
                        <UltimosContactosCard
                            ultimos_contactados={ultimos_contactados}
                            onClick={this.nextUltimosContactados}
                            onClickPrev={this.prevUltimosContactados}
                        />
                    </Col>
                </Row>
                <Col md={12} className="px-0">
                    <Tab.Container defaultActiveKey="web"
                        activeKey={activeTable}
                        onSelect={(select) => { this.changeActiveTable(select) }}>
                        <Card className="card-custom card-stretch gutter-b py-2">
                            <Card.Header className="align-items-center border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark">Leads</span>
                                </h3>
                                <div className="card-toolbar">
                                    <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="web">PAGINA WEB</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="contacto">EN CONTACTO</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="negociacion">EN NEGOCIACIÓN</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="contratados">CONTRATADOS</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="detenidos">DETENIDOS</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="cancelados">CANCELADOS</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </Card.Header>
                            <div className="card-body">
                                <div className="mb-5">
                                    <div className="form-group row form-group-marginless d-flex justify-content-center">
                                        <div className="col-md-3">
                                            <div className="input-icon">
                                                <input type="text" className="form-control form-control-solid" placeholder="BUSCAR CLIENTE" />
                                                <span>
                                                    <i className="flaticon2-search-1 text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-icon">
                                                <input type="text" className="form-control form-control-solid" placeholder="BUCAR PROYECTO" />
                                                <span>
                                                    <i className="flaticon2-search-1 text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Control
                                                className="form-control text-uppercase form-control-solid"
                                                defaultValue={0}
                                                // value = {form.origen} 
                                                // onChange={onChange} 
                                                name='origen'
                                                // formeditado={formeditado} 
                                                as="select">
                                                <option disabled value={0}>Selecciona el origen</option>
                                                <option value={"web"} className="bg-white" >Web</option>
                                                <option value={"facebook"} className="bg-white">Facebook</option>
                                                <option value={"google"} className="bg-white">Google</option>
                                                <option value={"linkedin"} className="bg-white">Linkedin</option>
                                            </Form.Control>
                                        </div>
                                        {/* <div className="col-md-2">
                                            <Form.Control
                                                className="form-control text-uppercase form-control-solid"
                                                defaultValue={0}
                                                // value = {form.estatus} 
                                                // onChange={onChange} 
                                                // name='estatus' 
                                                // formeditado={formeditado} 
                                                as="select">
                                                <option disabled value={0}>Selecciona el estatus</option>
                                                <option value={"pendiente"} className="bg-white">Pendiente</option>
                                                <option value={"contacto"} className="bg-white">En contacto</option>
                                                <option value={"negociacion"} className="bg-white">En negociación</option>
                                                <option value={"contratado"} className="bg-white">Contratado</option>
                                            </Form.Control>
                                        </div> */}
                                        <div className="col-md-1">
                                            <span className="btn btn-light-primary px-6 font-weight-bold">Buscar</span>
                                        </div>
                                        {/* <div className="col-md-1">
                                            <a href="#" className="btn btn-light-primary px-6 font-weight-bold">Buscar</a>
                                        </div> */}
                                    </div>
                                </div>
                                <Tab.Content>
                                    <Tab.Pane eventKey="web">
                                        <LeadNuevo
                                            leads={lead_web}
                                            onClickNext={this.nextPageLeadWeb}
                                            onClickPrev={this.prevPageLeadWeb}
                                            sendEmail={this.sendEmailNewWebLead}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contacto">
                                        <LeadContacto
                                            leads={leads_en_contacto}
                                            onClickNext={this.nextPageLeadEnContacto}
                                            onClickPrev={this.prevPageLeadEnContacto}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="negociacion">
                                        <LeadNegociacion

                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contratados">
                                        <LeadContrato
                                            leads={leads_contratados}
                                            onClickNext={this.nextPageLeadContratados}
                                            onClickPrev={this.prevPageLeadContratados}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="detenidos">
                                        <LeadDetenido
                                            leads={leads_detenidos}
                                            onClickNext={this.nextPageLeadDetenidos}
                                            onClickPrev={this.prevPageLeadDetenidos}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="cancelados">
                                        <LeadNoContratado
                                            leads={leads_cancelados}
                                            onClickNext={this.nextPageLeadCancelados}
                                            onClickPrev={this.prevPageLeadCancelados}
                                        />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Card>
                    </Tab.Container>
                </Col>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Crm)