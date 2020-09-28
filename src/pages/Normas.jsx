import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../components/form-components/'
import { Tab, Nav, Col, Row } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../functions/routers"
class Normas extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        title: '',
        accordion: [
            {
                nombre: 'Acordeón 1',
                // icono: 'flaticon2-paper',
                tipo: 1,
                isActive: false,
            },
            {
                nombre: 'Acordeón 2',
                icono: 'flaticon2-calendar-5',
                tipo: 2,
                isActive: false,
            },
            {
                nombre: 'Acordeón 3',
                icono: 'flaticon2-wifi',
                tipo: 3,
                isActive: false,
            }
        ]
    };


    openAccordion = (indiceClick) => {
        let { accordion } = this.state
        accordion.map((element, key) => {
            if (indiceClick === key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: accordion
        });
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!tareas)
            history.push('/')
    }

    render() {
        const { accordion } = this.state
        const table = (element) => {
            switch (element.tipo) {
                case 1: return <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded">
                    <Nav.Item className="navi-item mb-2">
                        <Nav.Link className="navi-link px-2" eventKey="1">
                            <span class="navi-icon mr-2">
                                <span class="svg-icon">
                                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                </span>
                            </span>
                            <div class="navi-text">
                                <span class="d-block font-weight-bold">Paso 1</span>
                                <span class="text-muted">Descripción del paso 1</span>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="navi-item mb-2">
                        <Nav.Link className="navi-link px-2" eventKey="2">
                            <span class="navi-icon mr-2">
                                <span class="svg-icon">
                                    <SVG src={toAbsoluteUrl('/images/svg/Clock.svg')} />
                                </span>
                            </span>
                            <div class="navi-text">
                                <span class="d-block font-weight-bold">Paso 2</span>
                                <span class="text-muted">Descripción del paso 2</span>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>;
                case 2: return <Nav className="navi navi-hover navi-primary navi-accent">
                    <Nav.Item className="navi-item">
                        <Nav.Link className="navi-link" eventKey="3">
                            <span class="navi-icon"><i class="flaticon2-analytics"></i></span>
                            <span class="navi-text">Paso 1</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="navi-item">
                        <Nav.Link className="navi-link" eventKey="4">
                            <span class="navi-icon"><i class="flaticon2-analytics"></i></span>
                            <span class="navi-text">Paso 2</span>
                        </Nav.Link>
                    </Nav.Item> </Nav>;
                case 3: return '3';
                case 4: return '4';
                default:
                    return ''
            }
        }
        return (
            <Layout {...this.props}>
                <Tab.Container defaultActiveKey="first" className="p-5">
                    <Row>
                        <Col sm={3}>
                            <div class="card card-custom card-stretch">
                                <div class="d-flex justify-content-end pr-3 pt-3">
                                    <div class="card-toolbar">
                                        <Button
                                            className={"btn btn-icon btn-light-info btn-sm mr-2 ml-auto"}
                                            only_icon={"fas fa-phone-volume"}
                                            tooltip={{ text: 'Registro Telefónico' }}
                                        />
                                        <Button
                                            className={"btn btn-icon btn-light-primary btn-sm mr-2 ml-auto"}
                                            only_icon={"flaticon2-website"}
                                            tooltip={{ text: 'Sitio web' }}
                                        />
                                    </div>
                                </div>
                                {/* <div class="card-header">
                                    <div class="card-title">
                                        <h3 class="card-label">Registro</h3>
                                    </div>
                                    <div class="card-toolbar">
                                        <Button
                                            className={"btn btn-icon btn-light-info btn-sm mr-2 ml-auto"}
                                            only_icon={"fas fa-phone-volume"}
                                            tooltip={{ text: 'Registro Telefónico' }}
                                        />
                                        <Button
                                            className={"btn btn-icon btn-light-primary btn-sm mr-2 ml-auto"}
                                            only_icon={"flaticon2-website"}
                                            tooltip={{ text: 'Sitio web' }}
                                        />
                                    </div>
                                </div> */}
                                <div class="card-body px-3">
                                    <div className="accordion accordion-solid accordion-svg-toggle">
                                        {
                                            accordion.map((element, key) => {
                                                return (
                                                    <div className="card w-auto" key={key}>
                                                        <div className="card-header" >
                                                            <div className={(element.isActive) ? 'card-title text-primary collapsed rounded-0' : 'card-title text-dark-50 rounded-0'} onClick={() => { this.openAccordion(key) }}>
                                                                <div className="card-label">
                                                                    <i className={(element.isActive) ? element.icono + ' text-primary' : element.icono + ' text-dark-50'}>
                                                                    </i>&nbsp;&nbsp;&nbsp;{element.nombre}
                                                                </div>
                                                                <span className="svg-icon ">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className={(element.isActive) ? 'collapse show' : 'collapse'} >
                                                            <div className="card-body">
                                                                <div>{table(element)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col sm={9}>
                            <div class="card card-custom card-stretch">
                                <div class="card-body">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="1">
                                            <form class="form" id="kt_form">
                                                <div className="pb-3 px-2">
                                                    <h4 class="mb-5 font-weight-bold text-dark">Formulario</h4>
                                                    <div class="form-group">
                                                        <label>Nombre completo</label>
                                                        <input type="text" class="form-control form-control-solid" />
                                                        <span class="form-text text-muted">Introduzca su nombre completo.</span>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xl-6">
                                                            <div class="form-group">
                                                                <label>Teléfono</label>
                                                                <input type="tel" class="form-control form-control-solid" />
                                                                <span class="form-text text-muted">Introduzca su teléfono.</span>
                                                            </div>
                                                        </div>
                                                        <div class="col-xl-6">
                                                            <div class="form-group">
                                                                <label>Correo electrónico</label>
                                                                <input type="email" class="form-control form-control-solid" />
                                                                <span class="form-text text-muted">Introduzca su correo electrónico.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="2">
                                            2
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="3">
                                            3
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="4">
                                            4
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Tab.Container>
            </Layout >
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Normas);