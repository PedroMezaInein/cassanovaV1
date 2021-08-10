import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { dayDMY } from '../../../functions/setters'
export default class EmpleadosCard extends Component {
    render() {
        const { empleado } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon-user"></i></span>
                                        <span className="navi-text font-size-lg">Información del empleado</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second">
                                        <span className="navi-icon"><i className="fas fa-coins"></i></span>
                                        <span className="navi-text font-size-lg">Información del puesto</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="third" >
                                        <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                        <span className="navi-text font-size-lg">Información de prestaciones</span>
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
                                                    <label className="col-5 font-weight-bolder text-primary">NOMBRE DEL EMPLEADO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.nombre ?
                                                                <span>{empleado.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">CURP:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.curp ?
                                                                <span>{empleado.curp}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">RFC:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.rfc ?
                                                                <span>{empleado.rfc}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">NSS:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.nss ?
                                                                <span>{empleado.nss}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">BANCO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.banco ?
                                                                <span>{empleado.banco}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.cuenta ?
                                                                <span>{empleado.cuenta}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">CLABE:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.clabe ?
                                                                <span>{empleado.clabe}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">NOMBRE DEL CONTACTO DE EMERGENCIA:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.nombre_emergencia ?
                                                                <span>{empleado.nombre_emergencia}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">TELÉFONO DE EMERGENCIA:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.telefono_emergencia ?
                                                                <span>{empleado.telefono_emergencia}</span>
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
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">TIPO DE EMPLEADO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.tipo_empleado ?
                                                                <span>{empleado.tipo_empleado}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">ESTATUS DEL EMPLEADO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.estatus_empleado ?
                                                                <span>{empleado.estatus_empleado}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">EMPRESA:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.empresa ?
                                                                <span>{empleado.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">FECHA DE INICIO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.fecha_inicio ?
                                                                <span>{dayDMY(empleado.fecha_inicio)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">FECHA FINAL:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.fecha_fin ?
                                                                <span>{dayDMY(empleado.fecha_fin)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">PUESTO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.puesto ?
                                                                <span>{empleado.puesto}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">IMSS ESTATUS:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.estatus_imss || empleado.estatus_imss === 0 ?
                                                                <span>{empleado.estatus_imss === 0 ? 'Inactivo' : 'Activo'}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">VACACIONES DISPONIBLES AL AÑO:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.vacaciones_disponibles || empleado.vacaciones_disponibles === 0 ?
                                                                <span>{empleado.vacaciones_disponibles}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">FECHA DE ALTA AL IMSS:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.fecha_alta_imss ?
                                                                <span>{dayDMY(empleado.fecha_alta_imss)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">NÚMERO DE ALTA IMSS:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.numero_alta_imss ?
                                                                <span>{empleado.numero_alta_imss}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-5 font-weight-bolder text-primary">NOMINA IMSS:</label>
                                                    <div className="col-7">
                                                        {
                                                            empleado.nomina_imss ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={empleado.nomina_imss}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    empleado.tipo_empleado ==="Administrativo"?
                                                    <div className="row pb-1">
                                                        <label className="col-5 font-weight-bolder text-primary">RESTANTE DE NÓMINA:</label>
                                                        <div className="col-7">
                                                            {
                                                                empleado.nomina_imss ?
                                                                    <span>
                                                                        <NumberFormat
                                                                            value={empleado.nomina_extras}
                                                                            displayType={'text'}
                                                                            thousandSeparator={true}
                                                                            prefix={'$'}
                                                                            renderText={value => <div>{value}</div>}
                                                                        />
                                                                    </span>
                                                                    : <span>-</span>
                                                            }
                                                        </div>
                                                    </div> 
                                                :''
                                                }
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