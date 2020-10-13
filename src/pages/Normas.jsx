import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../components/form-components/'
import { Tab, Nav, Col, Row, OverlayTrigger, Tooltip, Card } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../functions/routers"
class Normas extends Component {
    
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
            return false
        })
        this.setState({
            accordion: accordion
        });
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
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
                            <span className="navi-icon mr-2">
                                <span className="svg-icon">
                                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                </span>
                            </span>
                            <div className="navi-text">
                                <span className="d-block font-weight-bold">Paso 1</span>
                                <span className="text-muted">Descripción del paso 1</span>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="navi-item mb-2">
                        <Nav.Link className="navi-link px-2" eventKey="2">
                            <span className="navi-icon mr-2">
                                <span className="svg-icon">
                                    <SVG src={toAbsoluteUrl('/images/svg/Clock.svg')} />
                                </span>
                            </span>
                            <div className="navi-text">
                                <span className="d-block font-weight-bold">Paso 2</span>
                                <span className="text-muted">Descripción del paso 2</span>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>;
                case 2: return <Nav className="navi navi-hover navi-primary navi-accent">
                    <Nav.Item className="navi-item">
                        <Nav.Link className="navi-link" eventKey="3">
                            <span className="navi-icon"><i className="flaticon2-analytics"></i></span>
                            <span className="navi-text">Paso 1</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="navi-item">
                        <Nav.Link className="navi-link" eventKey="4">
                            <span className="navi-icon"><i className="flaticon2-analytics"></i></span>
                            <span className="navi-text">Paso 2</span>
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
                            <div className="card card-custom card-stretch">
                                {/* <div className="d-flex justify-content-end pr-3 pt-3">
                                    <div className="card-toolbar">
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-light-info btn-xs mr-2 ml-auto"}
                                            only_icon={"fas fa-phone-volume"}
                                            tooltip={{ text: 'Registro Telefónico' }}
                                        />
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-light-primary btn-xs mr-2 ml-auto"}
                                            only_icon={"flaticon2-website"}
                                            tooltip={{ text: 'Sitio web' }}
                                        />
                                    </div>
                                </div> */}
                                <div className="card-header">
                                    <div className="card-title">
                                        <h3 className="card-label">Registro</h3>
                                    </div>
                                    <div className="card-toolbar">
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-light-info btn-xs mr-2 ml-auto"}
                                            only_icon={"fas fa-phone-volume"}
                                            tooltip={{ text: 'Registro Telefónico' }}
                                        />
                                        <Button
                                            icon=''
                                            className={"btn btn-icon btn-light-primary btn-xs mr-2 ml-auto"}
                                            only_icon={"flaticon2-website"}
                                            tooltip={{ text: 'Sitio web' }}
                                        />
                                    </div>
                                </div>
                                <div className="card-body px-3">
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
                                                            <Card.Body>
                                                                <div>{table(element)}</div>
                                                            </Card.Body>
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
                            <div className="card card-custom card-stretch">
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="1">
                                            <form className="form" id="kt_form">
                                                <div className="pb-3 px-2">
                                                    <h4 className="mb-5 font-weight-bold text-dark">Formulario</h4>
                                                    <div className="form-group">
                                                        <label>Nombre completo</label>
                                                        <input type="text" className="form-control form-control-solid" />
                                                        <span className="form-text text-muted">Introduzca su nombre completo.</span>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label>Teléfono</label>
                                                                <input type="tel" className="form-control form-control-solid" />
                                                                <span className="form-text text-muted">Introduzca su teléfono.</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                            <div className="form-group">
                                                                <label>Correo electrónico</label>
                                                                <input type="email" className="form-control form-control-solid" />
                                                                <span className="form-text text-muted">Introduzca su correo electrónico.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="2">
                                                <div className="tab-content">													
													<div className="table-responsive">
														<table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
															<thead>
																<tr className="text-left text-uppercase">
																	<th style={{minWidth: "250px"}}className="pl-7">
																		<span className="text-dark-75">Proyecto/Nombre</span>
                                                                    </th>
																	<th style={{minWidth: "100px"}}>Responsable</th>
																	<th style={{minWidth: "100px"}}>comission</th>
																	<th style={{minWidth: "100px"}}>company</th>
																	<th style={{minWidth: "130px"}}>rating</th>
																	<th style={{minWidth: "80px"}}></th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td className="pl-0 py-8">
																		<div className="d-flex align-items-center">
																			<div className="symbol symbol-50 symbol-light mr-4">
																				<span className="symbol-label">
																					<img src="/boy.png" className="h-75 align-self-end" alt=""/>
																				</span>
																			</div>
                                                                            <div className="symbol symbol-45 symbol-light-primary mr-3">
                                                                                <span className="symbol-label font-size-h5">P</span>
                                                                            </div>
																			<div>
																				<span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">Nombre cliente X</span>
																				<span className="text-muted font-weight-bold d-block">Proyecto X</span>
																			</div>
																		</div>
																	</td>
																	<td>
                                                                    <div className="symbol-group symbol-hover">
                                                                        <OverlayTrigger overlay={<Tooltip>OMAR ABAROA</Tooltip>}>
                                                                            <div className="symbol symbol-35 symbol-circle">
                                                                                <img alt="Pic" src="/100_1.jpg"/>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                                            <div className="symbol symbol-35 symbol-circle">
                                                                                <img alt="Pic" src="/100_2.jpg"/>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger overlay={<Tooltip>FERNANDO MÁRQUEZ</Tooltip>}>
                                                                            <div className="symbol symbol-35 symbol-circle">
                                                                                <img alt="Pic" src="/100_3.jpg"/>
                                                                            </div>
                                                                        </OverlayTrigger>
                                                                    </div>
																	</td>
																	<td>
																		<span className="text-dark-75 font-weight-bolder d-block font-size-lg">$520</span>
																		<span className="text-muted font-weight-bold">Paid</span>
																	</td>
																	<td>
																		<span className="text-dark-75 font-weight-bolder d-block font-size-lg">Intertico</span>
																		<span className="text-muted font-weight-bold">Web, UI/UX Design</span>
																	</td>
																	<td>
																		<img  alt="" style={{width: "5.5rem"}}/>
																		<span className="text-muted font-weight-bold d-block font-size-sm">Best Rated</span>
																	</td>
																	<td className="pr-0 text-right">
																		<span className="btn btn-light-success font-weight-bolder font-size-sm">View Offer</span>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
													
												</div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="3">
                                            3
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="4">
                                            4
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
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