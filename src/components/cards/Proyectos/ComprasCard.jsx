import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
import { dayDMY } from '../../../functions/setters'
export default class ComprasCard extends Component {
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
        const { compra } = this.props
        if(compra !== '' && compra){
            if(compra[tipo])
                if(compra[tipo].length)
                    return true
        }
        return false
    }

    hasAdjuntos = () => {
        const { compra } = this.props
        if(compra !== '' && compra){
            if(compra.presupuestos)
                if(compra.presupuestos.length)
                    return true
            if(compra.pagos)
                if(compra.pagos.length)
                    return true
            if(compra.facturas)
                if(compra.facturas.length)
                    return true
            if(compra.facturas_pdf)
                if(compra.facturas_pdf.length)
                    return true
        }
        return false
    }

    setTabAdjunto = () => {
        const { compra } = this.props
        if(compra !== '' && compra){
            if(compra.presupuestos)
                if(compra.presupuestos.length)
                    return 'first'
            if(compra.pagos)
                if(compra.pagos.length)
                    return 'second'
            if(compra.facturas)
                if(compra.facturas.length)
                    return 'third'
            if(compra.facturas_pdf)
                if(compra.facturas_pdf.length)
                    return 'fourth'
        }
        return ''
    }
    
    render() {
        const { compra } = this.props
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
                                    compra !== '' ?
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
                                                            compra.id ?
                                                                <span>{compra.id}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.created_at ?
                                                                <span>{dayDMY(compra.created_at)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.subarea ?
                                                                compra.subarea.area ?
                                                                    <span>{compra.subarea.area.nombre}</span>
                                                                    : <span>-</span>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.subarea ?
                                                                <span>{compra.subarea.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROVEEDOR:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.proveedor ?
                                                                <span>{compra.proveedor.razon_social}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROYECTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.proyecto ?
                                                                <span>{compra.proyecto.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.descripcion ?
                                                                <span>{compra.descripcion}</span>
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
                                                            compra.empresa ?
                                                                <span>{compra.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.cuenta ?
                                                                <span>{compra.cuenta.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.cuenta ?
                                                                <span>{compra.cuenta.numero}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TIPO DE PAGO:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.tipo_pago ?
                                                                <span>{compra.tipo_pago.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.estatus_compra ?
                                                                <span>{compra.estatus_compra.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.tipo_impuesto ?
                                                                <span>{compra.tipo_impuesto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">MONTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            compra.monto ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={compra.monto}
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
                                                            compra.comision || compra.comision === 0 ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={compra.comision}
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
                                                            compra.total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={compra.total}
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
                                                            compra.contrato ?
                                                                <span>{compra.contrato.nombre}</span>
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
                                                    compra.presupuestos ?
                                                        <ItemSlider items={compra.presupuestos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                {
                                                    compra.pagos ?
                                                        <ItemSlider items={compra.pagos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                {
                                                    compra.facturas ?
                                                        <ItemSlider items={this.setAdjuntosFacturas(compra.facturas)} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="fourth">
                                                {
                                                    compra.facturas_pdf ?
                                                        <ItemSlider items={compra.facturas_pdf} item='' />
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