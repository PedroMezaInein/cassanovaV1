import React, { Component } from 'react'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../singles'
export default class BodegaCard extends Component {
    render() {
        const { bodega } = this.props
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
                                        <span className="navi-icon"><i className="fas fa-file-upload"></i></span>
                                        <span className="navi-text font-size-lg">Adjunto</span>
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
                                                    <label className="col-5 font-weight-bolder text-primary">{`NOMBRE ${bodega.tipo ==='material'?'DEL MATERIAL':'DE LA HERRAMIENTA'}`}:</label>
                                                    <div className="col-7">
                                                        {
                                                            bodega.nombre ?
                                                                <span>{bodega.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">PARTIDA:</label>
                                                    <div className="col-7">
                                                        {
                                                            bodega.partida ?
                                                                <span>{bodega.partida.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">UNIDAD:</label>
                                                    <div className="col-7">
                                                        {
                                                            bodega.unidad ?
                                                                <span>{bodega.unidad.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">CANTIDAD:</label>
                                                    <div className="col-7">
                                                        <span>{bodega.cantidad}</span>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">UBICACIÓN DEL MATERIAL:</label>
                                                    <div className="col-7">
                                                        {
                                                            bodega.ubicacion ?
                                                                <span>{bodega.ubicacion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-7">
                                                        {
                                                            bodega.descripcion ?
                                                                <span>{bodega.descripcion}</span>
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
                                            {
                                                bodega.adjuntos ?
                                                    <ItemSlider items={bodega.adjuntos} item='' />
                                                    : <span>-</span>
                                            }
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