import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Layout from '../../../components/layout/layout';
import { Col, Row, Card, Form, Tab, Nav } from 'react-bootstrap'
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
import { forbiddenAccessAlert, errorAlert } from '../../../functions/alert'
import LeadNuevo from '../../../components/tables/Lead/LeadNuevo'
import LeadContacto from '../../../components/tables/Lead/LeadContacto'
import LeadNegociacion from '../../../components/tables/Lead/LeadNegociacion'
import LeadContrato from '../../../components/tables/Lead/LeadContrato'
class Crm extends Component {
    state = {
        ultimos_contactados: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "ultimos_contactados"
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
        this.getUltimosContactos()
        this.getSinContactar()
        this.getUltimosIngresados()
        this.getLeadsWeb()
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
        await axios.get(URL_DEV + 'crm/table/lead-web/' + lead_web.numPage , { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, total } = response.data
                const { lead_web } = this.state
                lead_web.data = leads
                lead_web.total = total
                let total_paginas = Math.ceil(total / 5)
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    changePageAdd = tipo => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/' + tipo
        });
    }

    render() {
        const { ultimos_contactados, prospectos_sin_contactar, ultimos_ingresados,lead_web } = this.state
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
                    <Tab.Container defaultActiveKey="1">
                        <Card className="card-custom card-stretch gutter-b py-2">
                            <Card.Header className="align-items-center border-0">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark">Leads</span>
                                </h3>
                                <div className="card-toolbar">
                                    <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="1">PAGINA WEB</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="2">EN CONTACTO</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="3">EN NEGOCIACIÓN</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="nav-item">
                                            <Nav.Link eventKey="4">CONTRATADOS</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </Card.Header>
                            <div className="card-body">
                                <div className="mb-5">
                                    <div className="form-group row form-group-marginless d-flex justify-content-center">
                                        <div className="col-md-3">
                                            <div className="input-icon">
                                                <input type="text" className="form-control form-control-solid" placeholder="Buscar cliente" />
                                                <span>
                                                    <i className="flaticon2-search-1 text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-icon">
                                                <input type="text" className="form-control form-control-solid" placeholder="Buscar proyecto" />
                                                <span>
                                                    <i className="flaticon2-search-1 text-muted"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <Form.Control
                                                className="form-control text-uppercase form-control-solid"
                                                defaultValue = { 0 }
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
                                        <div className="col-md-2">
                                            <Form.Control
                                                className="form-control text-uppercase form-control-solid"
                                                defaultValue = { 0 }
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
                                        </div>
                                        <div className="col-md-1">
                                            <span className="btn btn-light-primary px-6 font-weight-bold">Buscar</span>
                                        </div>
                                        {/* <div className="col-md-1">
                                            <a href="#" className="btn btn-light-primary px-6 font-weight-bold">Buscar</a>
                                        </div> */}
                                    </div>
                                </div>
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <LeadNuevo 
                                            lead_web={lead_web}
                                            onClick={this.nextPageLeadWeb}
                                            onClickPrev={this.prevPageLeadWeb}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <LeadContacto />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="3">
                                        <LeadNegociacion />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="4">
                                        <LeadContrato />
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