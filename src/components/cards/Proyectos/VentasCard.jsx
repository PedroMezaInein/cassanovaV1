import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class VentasCard extends Component {

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
        const { venta } = this.props
        if(venta !== '' && venta){
            if(venta[tipo])
                if(venta[tipo].length)
                    return true
        }
        return false
    }

    hasAdjuntos = () => {
        const { venta } = this.props
        if(venta !== '' && venta){
            if(venta.presupuestos)
                if(venta.presupuestos.length)
                    return true
            if(venta.pagos)
                if(venta.pagos.length)
                    return true
            if(venta.facturas)
                if(venta.facturas.length)
                    return true
            if(venta.facturas_pdf)
                if(venta.facturas_pdf.length)
                    return true
        }
        return false
    }

    setTabAdjunto = () => {
        const { venta } = this.props
        if(venta !== '' && venta){
            if(venta.presupuestos)
                if(venta.presupuestos.length)
                    return 'first'
            if(venta.pagos)
                if(venta.pagos.length)
                    return 'second'
            if(venta.facturas)
                if(venta.facturas.length)
                    return 'third'
            if(venta.facturas_pdf)
                if(venta.facturas_pdf.length)
                    return 'fourth'
        }
        return ''
    }

    render() {
        const { venta } = this.props
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
                                    venta !== '' ?
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
                                                            venta.id ?
                                                                <span>{venta.id}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.created_at ?
                                                                <span>{dayDMY(venta.created_at)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.subarea ?
                                                                venta.subarea.area ?
                                                                    <span>{venta.subarea.area.nombre}</span>
                                                                    : <span>-</span>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.subarea ?
                                                                <span>{venta.subarea.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CLIENTE:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.cliente ?
                                                                <span>{venta.cliente.empresa}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROYECTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.proyecto ?
                                                                <span>{venta.proyecto.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.descripcion ?
                                                                <span>{venta.descripcion}</span>
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
                                                            venta.empresa ?
                                                                <span>{venta.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.cuenta ?
                                                                <span>{venta.cuenta.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.cuenta ?
                                                                <span>{venta.cuenta.numero}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={venta.total}
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
                                                            venta.tipo_pago ?
                                                                <span>{venta.tipo_pago.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.estatus_compra ?
                                                                <span>{venta.estatus_compra.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.tipo_impuesto ?
                                                                <span>{venta.tipo_impuesto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CONTRATO:</label>
                                                    <div className="col-9">
                                                        {
                                                            venta.contrato ?
                                                                <span>{venta.contrato.nombre}</span>
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
                                        <Tab.Content className = 'mt-4'>
                                            <Tab.Pane eventKey="first">
                                                {
                                                    venta.presupuestos ?
                                                        <ItemSlider items={venta.presupuestos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                {
                                                    venta.pagos ?
                                                        <ItemSlider items={venta.pagos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                {
                                                    venta.facturas ?
                                                        <ItemSlider items={this.setAdjuntosFacturas(venta.facturas)} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="fourth">
                                                {
                                                    venta.facturas_pdf ?
                                                        <ItemSlider items={venta.facturas_pdf} item='' />
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