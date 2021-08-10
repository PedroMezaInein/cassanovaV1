import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class IngresosCard extends Component {
    setAdjuntosFacturas = facturas => {
        let aux = [];
        facturas.map((factura) => {
            if (factura.xml) {
                aux.push({
                    name: factura.folio + '-xml.xml',
                    url: factura.xml.url
                })
            }
            if (factura.pdf) {
                aux.push({
                    name: factura.folio + '-pdf.pdf',
                    url: factura.pdf.url
                })
            }
            return false
        })
        return aux
    }
    render() {
        const { ingreso } = this.props
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
                                {
                                    ingreso !== '' ?
                                        ingreso.presupuestos.length > 0 || ingreso.pagos.length > 0 || ingreso.facturas.length > 0 ?
                                            <Nav.Item className="navi-item">
                                                <Nav.Link className="navi-link px-3" eventKey="third" >
                                                    <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                                    <span className="navi-text font-size-lg">Facturas</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            : ''
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
                                                    <label className="col-3 font-weight-bolder text-primary">ID:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.id ?
                                                                <span>{ingreso.id}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.created_at ?
                                                                <span>{dayDMY(ingreso.created_at)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.subarea ?
                                                                ingreso.subarea.area ?
                                                                    <span>{ingreso.subarea.area.nombre}</span>
                                                                    : <span>-</span>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.subarea ?
                                                                <span>{ingreso.subarea.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">Cliente:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.cliente ?
                                                                <span>{ingreso.cliente.empresa}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.descripcion ?
                                                                <span>{ingreso.descripcion}</span>
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
                                                    <label className="col-3 font-weight-bolder text-primary">EMPRESA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.empresa ?
                                                                <span>{ingreso.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.cuenta ?
                                                                <span>{ingreso.cuenta.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.cuenta ?
                                                                <span>{ingreso.cuenta.numero}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={ingreso.total}
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
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TIPO DE PAGO:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.tipo_pago ?
                                                                <span>{ingreso.tipo_pago.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.estatus_compra ?
                                                                <span>{ingreso.estatus_compra.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            ingreso.tipo_impuesto ?
                                                                <span>{ingreso.tipo_impuesto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Tab.Container defaultActiveKey={ingreso.presupuestos !== 0 ? "first" : ingreso.pagos !== 0 ? "second" : ingreso.facturas !== 0 ? "third" : ''}>
                                        <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-2x border-0">
                                            {
                                                ingreso.presupuestos !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="first"
                                                        >
                                                            <span className="nav-text font-weight-bold">PRESUPUESTO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                            {
                                                ingreso.pagos !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="second"
                                                        >
                                                            <span className="nav-text font-weight-bold">PAGO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                            {
                                                ingreso.facturas !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="third"
                                                        >
                                                            <span className="nav-text font-weight-bold">FACTURAS</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                                {
                                                    ingreso.presupuestos ?
                                                        <ItemSlider items={ingreso.presupuestos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                {
                                                    ingreso.pagos ?
                                                        <ItemSlider items={ingreso.pagos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                {
                                                    ingreso.facturas ?
                                                        <ItemSlider items={this.setAdjuntosFacturas(ingreso.facturas)} item='' />
                                                        : ''
                                                }
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