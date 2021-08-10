import React, { Component } from 'react'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class ProyectosCard extends Component {
    render() {
        const { proyecto } = this.props
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
                                        <span className="navi-icon"><i className="fas flaticon2-pin"></i></span>
                                        <span className="navi-text font-size-lg">Ubicación</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="third" >
                                        <span className="navi-icon"><i className="flaticon2-calendar-1"></i></span>
                                        <span className="navi-text font-size-lg">Fechas e Imagen</span>
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
                                                    <div className="col d-flex justify-content-end">
                                                        {
                                                            proyecto.estatus ?
                                                            <>
                                                                <span className="label label-lg bg- label-inline font-weight-bold py-2" style={{
                                                                    color: `${proyecto.estatus.letra}`,
                                                                    backgroundColor: `${proyecto.estatus.fondo}`,
                                                                    fontSize: "75%"
                                                                }} >
                                                                    {proyecto.estatus.estatus}
                                                                </span>
                                                            </>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">NOMBRE DEL PROYECTO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.nombre ?
                                                                <span>{proyecto.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">TIPO DEL PROYECTO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.tipo_proyecto ?
                                                                <span>{proyecto.tipo_proyecto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">NOMBRE DE CONTACTO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.contacto ?
                                                                <span>{proyecto.contacto}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">NÚMERO DE CONTACTO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.numero_contacto ?
                                                                <span>{proyecto.numero_contacto}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">CORREO ELECTRÓNICO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.contactos ?
                                                                proyecto.contactos.map((contacto, key) => {
                                                                    return (
                                                                        <span key={key}>{contacto.correo}</span>
                                                                    )
                                                                })
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">CLIENTE:</label>
                                                    <div className="col-8">
                                                        <ul className="pl-0 ml-4">
                                                            {
                                                                proyecto.clientes ?
                                                                    proyecto.clientes.map((cliente, key) => {
                                                                        return (
                                                                            <li key={key}>
                                                                                <span>{cliente.empresa}</span>
                                                                            </li>
                                                                        )
                                                                    })
                                                                    : <span>-</span>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">FASES:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1=== 0   ?
                                                                <span>-</span>
                                                                : ''
                                                        }
                                                        <ul className="pl-0 ml-4">
                                                            {
                                                                proyecto.fase1 ?
                                                                    <li><span>Fase 1</span></li>
                                                                : ''
                                                            }
                                                            {
                                                                proyecto.fase2 ?
                                                                <li><span>Fase 2</span></li>
                                                            :''
                                                            }
                                                            {
                                                                proyecto.fase3 ?
                                                                    <li><span>Fase 3</span></li>
                                                                    : ''
                                                            }
                                                        </ul>
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
                                                    <label className="col-4 font-weight-bolder text-primary">CÓDIGO POSTAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.cp ?
                                                                <span>{proyecto.cp}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">ESTADO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.estado ?
                                                                <span>{proyecto.estado}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">MUNICIPIO/DELEGACIÓN:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.municipio ?
                                                                <span>{proyecto.municipio}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">COLONIA:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.colonia ?
                                                                <span>{proyecto.colonia}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">CALLE Y NÚMERO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.calle ?
                                                                <span>{proyecto.calle}</span>
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
                                                    <label className="col-4 font-weight-bolder text-primary">EMPRESA:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.empresa ?
                                                                <span>{proyecto.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FECHA DE INICIO:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.fecha_inicio ?
                                                                <span>{dayDMY(proyecto.fecha_inicio)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FECHA FINAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.fecha_fin ?
                                                                <span>{dayDMY(proyecto.fecha_fin)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.descripcion ?
                                                                <span>{proyecto.descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">IMAGEN:</label>
                                                    <div className="col-8">
                                                        {
                                                            proyecto.imagen ?
                                                                <ItemSlider items={[proyecto.imagen]} item='' />
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