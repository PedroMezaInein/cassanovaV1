import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'

export default class ComprasCard extends Component {
    render() {
        const { compras, children } = this.props
        console.log(compras)
        return (
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon2-file"></i></span>
                                        <span className="navi-text font-size-lg">Datos generales</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second">
                                        <span className="navi-icon"><i className="fas fa-coins"></i></span>
                                        <span className="navi-text font-size-lg">Pago</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="third" >
                                        <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                        <span className="navi-text font-size-lg">Facturas</span>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ID:</label>
                                                    <div className="col-9">
                                                        <span>5892</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        <span>11/09/2020</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        <span>SISTEMA CONTRA INCENDIOS</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        <span>TECNOLOGÍAS DE INFORMACIÓN</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROVEEDOR:</label>
                                                    <div className="col-9">
                                                        <span>ALFREDO MARTINEZ BARCENAS - ESCOMBRO</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROYECTO:</label>
                                                    <div className="col-9">
                                                        <span>KERALTY CENTAURO - OBRA - CUAUHTEMOC MONTERREY</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        <span>MUDANZA FINAL DE BODEGA QRO A CENTAURO MUDANZA FINAL DE BODEGA QRO A CENTAURO MUDANZA FINAL DE BODEGA QRO A CENTAURO</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">EMPRESA:</label>
                                                    <div className="col-9">
                                                        <span>INEIN</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        <span>CAJA CHICA - ALTAVISTA</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        <span>211</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">MONTO:</label>
                                                    <div className="col-9">
                                                        <span>1,700</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PAGO:</label>
                                                    <div className="col-9">
                                                        <span>TOTAL</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        <span>PAGO, PENDIENTE FACTURA</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        <span>IVA</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">COMISIÓN:</label>
                                                    <div className="col-9">
                                                        <span>$200</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CONTRATO:</label>
                                                    <div className="col-9">
                                                        <span>CONSTRUCCION OBRA CIVIL</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Tab.Container defaultActiveKey="first">
                                        <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-2x border-0">
                                        {/* border-0 d-flex justify-content-end*/}
                                            <Nav.Item>
                                                <Nav.Link className="pt-0" eventKey="first">
                                                    <span className="nav-text font-weight-bold">PRESUPUESTO</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className="pt-0" eventKey="second">
                                                    <span className="nav-text font-weight-bold">PAGO</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">

                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">

                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>

        )
    }
}