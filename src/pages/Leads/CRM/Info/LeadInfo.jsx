import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Col, Row, Card, Tab, Nav } from 'react-bootstrap'
import { Button, InputGray, InputPhoneGray } from '../../../../components/form-components';
import { TEL } from '../../../../constants'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
class LeadInfo extends Component {

    render() {
        const { formeditado, onChange } = this.props
        return (
            <Layout active={'leads'}  {...this.props}>
                <Tab.Container defaultActiveKey="1" className="p-5">
                    <Row>
                        <Col md={3} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Card.Body >
                                    <div className="d-flex justify-content-end mb-2">
                                        <Button
                                            icon=''
                                            className="btn btn-light-success mr-2 btn-sm"
                                            only_icon="fab fa-whatsapp pr-0"
                                            tooltip={{ text: 'CONTACTAR POR WHATSAPP' }}
                                        />
                                    </div>
                                    <div className="table-responsive">
                                        <div className="list min-w-300px" >
                                            <div className="d-flex align-items-center">
                                                <div className="symbol symbol-75  symbol-xxl-100 mr-3 align-self-start align-self-xxl-center">
                                                    <span className="symbol-label font-size-h5 font-weight-bolder">KERALTY</span>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-weight-bolder font-size-h6 text-dark-75 mb-2">JORDI TIMONEDA </div>
                                                    <div className="text-muted font-size-sm">KERALTY CENTAURO - OBRA - CUAUHTEMOC MONTERREY</div>
                                                </div>
                                            </div>
                                            <div className="my-4">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <span className="font-weight-bolder mr-2">Correo electrónico:</span>
                                                    <a href="mailto:KERALTY@KERALTY.com" className="text-muted font-weight-bold text-hover-dark">KERALTY@KERALTY.com</a>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <span className="font-weight-bolder mr-2">Teléfono:</span>
                                                    <a href="tel:+5500112233" className="text-muted font-weight-bold text-hover-dark">(55) 0011 - 2233</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded">
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="1">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Información personal</span>
                                                    {/* <span className="text-muted">Descripción del paso 1</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className="navi-item mb-2">
                                            <Nav.Link className="navi-link px-2" eventKey="2">
                                                <span className="navi-icon mr-2">
                                                    <span className="svg-icon">
                                                        <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                    </span>
                                                </span>
                                                <div className="navi-text">
                                                    <span className="d-block font-weight-bold">Contrato</span>
                                                    {/* <span className="text-muted">Descripción del paso 2</span> */}
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Body>
                            </Card >
                        </Col >
                        <Col md={9} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Información general</span>
                                                    {/* <span class="text-muted mt-3 font-weight-bold font-size-sm">890,344 Sales</span> */}
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className="pt-0">
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='nombre'
                                                        value={''}
                                                        onChange={onChange}
                                                        type='text'
                                                        placeholder='NOMBRE DEL LEAD'
                                                        iconclass={'far fa-user'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='correo'
                                                        value={''}
                                                        onChange={onChange}
                                                        type='text'
                                                        placeholder='CORREO ELECTRÓNICO'
                                                        iconclass={'far fa-envelope'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputPhoneGray
                                                        thousandseparator={false}
                                                        prefix={''}
                                                        name='telefono'
                                                        value={''}
                                                        placeholder='TELÉFONO'
                                                        onChange={onChange}
                                                        iconclass={'fas fa-mobile-alt'}
                                                        messageinc='Incorrecto. Ingresa el número de teléfono.'
                                                        patterns={TEL}
                                                        formeditado={formeditado}
                                                    />
                                                </div>
                                            </div>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless">
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='nombre'
                                                        value={''}
                                                        onChange={onChange}
                                                        type='text'
                                                        placeholder='NOMBRE DEL LEAD'
                                                        iconclass={'far fa-user'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        name='correo'
                                                        value={''}
                                                        onChange={onChange}
                                                        type='text'
                                                        placeholder='CORREO ELECTRÓNICO'
                                                        iconclass={'far fa-envelope'}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <InputPhoneGray
                                                        thousandseparator={false}
                                                        prefix={''}
                                                        name='telefono'
                                                        value={''}
                                                        placeholder='TELÉFONO'
                                                        onChange={onChange}
                                                        iconclass={'fas fa-mobile-alt'}
                                                        messageinc='Incorrecto. Ingresa el número de teléfono.'
                                                        patterns={TEL}
                                                        formeditado={formeditado}
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <InputGray
                                                        formeditado={formeditado}
                                                        as="textarea"
                                                        placeholder="DESCRIPCIÓN"
                                                        rows="2"
                                                        name='correo'
                                                        value={'dedee'}
                                                        onChange={onChange}
                                                        type='text'
                                                        style={{ paddingLeft: "10px" }}
                                                    />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Contrato</span>
                                                    {/* <span class="text-muted mt-3 font-weight-bold font-size-sm">890,344 Sales</span> */}
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            1
                                        </Card.Body>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card>
                        </Col>
                    </Row >
                </Tab.Container>
            </Layout >
        )
    }
}

export default LeadInfo