import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'

export default class DevolucionCard extends Component {
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

    hasAdjunto = (tipo) => {
        const { devolucion } = this.props
        if(devolucion !== '' && devolucion){
            if(devolucion[tipo])
                if(devolucion[tipo].length)
                    return true
        }
        return false
    }

    hasAdjuntos = () => {
        const { devolucion } = this.props
        if(devolucion !== '' && devolucion){
            if(devolucion.presupuestos)
                if(devolucion.presupuestos.length)
                    return true
            if(devolucion.pagos)
                if(devolucion.pagos.length)
                    return true
            if(devolucion.facturas)
                if(devolucion.facturas.length)
                    return true
            if(devolucion.facturas_pdf)
                if(devolucion.facturas_pdf.length)
                    return true
        }
        return false
    }

    setTabAdjunto = () => {
        const { devolucion } = this.props
        if(devolucion !== '' && devolucion){
            if(devolucion.presupuestos)
                if(devolucion.presupuestos.length)
                    return 'first'
            if(devolucion.pagos)
                if(devolucion.pagos.length)
                    return 'second'
            if(devolucion.facturas)
                if(devolucion.facturas.length)
                    return 'third'
            if(devolucion.facturas_pdf)
                if(devolucion.facturas_pdf.length)
                    return 'fourth'
        }
        return ''
    }
    
    render() {
        const { devolucion } = this.props
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
                                    devolucion !== '' ?
                                        this.hasAdjuntos() ?
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
                                                            devolucion.id ?
                                                                <span>{devolucion.id}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.created_at ?
                                                                <span><Moment format="DD/MM/YYYY">{devolucion.created_at}</Moment></span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.subarea ?
                                                                devolucion.subarea.area ?
                                                                    <span>{devolucion.subarea.area.nombre}</span>
                                                                    : <span>-</span>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.subarea ?
                                                                <span>{devolucion.subarea.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROVEEDOR:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.proveedor ?
                                                                <span>{devolucion.proveedor.razon_social}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROYECTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.proyecto ?
                                                                <span>{devolucion.proyecto.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.descripcion ?
                                                                <span>{devolucion.descripcion}</span>
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
                                                            devolucion.empresa ?
                                                                <span>{devolucion.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.cuenta ?
                                                                <span>{devolucion.cuenta.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.cuenta ?
                                                                <span>{devolucion.cuenta.numero}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TIPO DE PAGO:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.tipo_pago ?
                                                                <span>{devolucion.tipo_pago.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.estatus_compra ?
                                                                <span>{devolucion.estatus_compra.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.tipo_impuesto ?
                                                                <span>{devolucion.tipo_impuesto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">MONTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.monto ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={devolucion.monto}
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
                                                    <label className="col-3 font-weight-bolder text-primary">COMISIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.comision || devolucion.comision === 0 ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={devolucion.comision}
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
                                                    <label className="col-3 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={devolucion.total}
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
                                                    <label className="col-3 font-weight-bolder text-primary">CONTRATO:</label>
                                                    <div className="col-9">
                                                        {
                                                            devolucion.contrato ?
                                                                <span>{devolucion.contrato.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Tab.Container defaultActiveKey = {this.setTabAdjunto()}>
                                        <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-2x border-0">
                                            {
                                                this.hasAdjunto('presupuestos') ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="first">
                                                            <span className="nav-text font-weight-bold">PRESUPUESTO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                : ''
                                            }
                                            {
                                                this.hasAdjunto('pagos') ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="second">
                                                            <span className="nav-text font-weight-bold">PAGO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                : ''
                                            }
                                            {
                                                this.hasAdjunto('facturas') ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="third">
                                                            <span className="nav-text font-weight-bold">FACTURAS</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                : ''
                                            }
                                            {
                                                this.hasAdjunto('facturas_pdf') ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="fourth">
                                                            <span className="nav-text font-weight-bold">FACTURAS EXTRANJERAS</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                : ''
                                            }
                                        </Nav>
                                        <Tab.Content className ='mt-4'>
                                            <Tab.Pane eventKey="first">
                                                {
                                                    devolucion.presupuestos ?
                                                        <ItemSlider items={devolucion.presupuestos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                {
                                                    devolucion.pagos ?
                                                        <ItemSlider items={devolucion.pagos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                {
                                                    devolucion.facturas ?
                                                        <ItemSlider items={this.setAdjuntosFacturas(devolucion.facturas)} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="fourth">
                                                {
                                                    devolucion.facturas_pdf ?
                                                        <ItemSlider items={devolucion.facturas_pdf} item='' />
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