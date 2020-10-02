import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
export default class EmpleadosCard extends Component {
    render() {
        const { rendimiento } = this.props
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
                                {
                                    rendimiento.adjunto ?
                                        <Nav.Item className="navi-item">
                                            <Nav.Link className="navi-link px-3" eventKey="second" >
                                                <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                                <span className="navi-text font-size-lg">Adjunto</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        : ''
                                }
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">MATERIALES:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.materiales ?
                                                                <span>{rendimiento.materiales}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROVEEDOR:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.proveedor ?
                                                                <span>{rendimiento.proveedor.razon_social}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">UNIDAD:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.unidad ?
                                                                <span>{rendimiento.unidad.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">COSTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.costo ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={rendimiento.costo}
                                                                        displayType={'text'}
                                                                        thousandseparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">RENDIMIENTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.rendimiento ?
                                                                <span>{rendimiento.rendimiento}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            rendimiento.descripcion ?
                                                                <span>{rendimiento.descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    {
                                        rendimiento.adjunto ?
                                            <ItemSlider items={[rendimiento.adjunto]} item='' />
                                            : ''
                                    }
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}