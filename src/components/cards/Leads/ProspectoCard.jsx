import React, { Component } from 'react'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import Moment from 'react-moment'
export default class ProspectoCard extends Component {
    render() {
        const { prospecto } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon2-file"></i></span>
                                        <span className="navi-text font-size-lg">DATOS DE GENERALES</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second" >
                                        <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                        <span className="navi-text font-size-lg">DESCRIPCIÓN Y MOTIVO</span>
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
                                                    <label className="col-5 font-weight-bolder text-primary">ESTATUS DEL PROSPECTO:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.estatus_prospecto ?
                                                                <span style={{ color: prospecto.estatus_prospecto.color_texto, backgroundColor: prospecto.estatus_prospecto.color_fondo }} className="font-weight-bolder label label-inline">{prospecto.estatus_prospecto.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary align-self-center">CLIENTE:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.cliente ?
                                                                <span>{prospecto.cliente.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">VENDEDOR:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.vendedor ?
                                                                <span>{prospecto.vendedor.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">PEREFENCIA DE CONTACTO:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.preferencia ?
                                                                <span>{prospecto.preferencia}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">TIPO DE PROYECTO:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.tipo_proyecto ?
                                                                <span>{prospecto.tipo_proyecto.tipo}</span>
                                                                : <span>-</span>
                                                        }
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
                                                <div className="row pb-2">
                                                    <label className="col-5 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN DEL PROSPECTO:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.descripcion ?
                                                                <span>{prospecto.descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary align-self-center">MOTIVO DE CONTRATACIÓN O RECHAZO:</label>
                                                    <div className="col-7">
                                                        {
                                                            prospecto.motivo ?
                                                                <span>{prospecto.motivo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}