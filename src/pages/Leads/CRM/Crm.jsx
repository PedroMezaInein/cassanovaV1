import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../components/layout/layout';
import { Button } from '../../../components/form-components';
import { Tab, Nav, Col, Row, OverlayTrigger, Tooltip, Card, Dropdown, DropdownButton } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { UltimosContactosCard, SinContacto, UltimosIngresosCard } from '../../../components/cards'
class Crm extends Component {

    changePageAdd = tipo => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/' + tipo
        });
    }

    render() {
        return (
            <Layout active='leads' {... this.props} >
                <Row>
                    <Col lg={4}>
                        <UltimosContactosCard />
                    </Col>
                    <Col lg={4}>
                        <SinContacto />
                    </Col>
                    <Col lg={4}>
                        <UltimosIngresosCard />
                    </Col>
                </Row>
                <Col md={12} className="px-0">
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="align-items-center border-0">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">Nuevos leads</span>
                            </h3>
                        </Card.Header>
                        <Card.Body className="py-2">
                            <div className="tab-content">
                                <div className="table-responsive-lg">
                                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                                        <thead>
                                            <tr className="text-left text-uppercase">
                                                <th style={{ minWidth: "250px" }} className="pl-7">
                                                    <span className="text-dark-75">Proyecto/Nombre</span>
                                                </th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                                <th style={{ minWidth: "80px" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="pl-0 py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div className="symbol symbol-45 symbol-light-primary mr-3">
                                                            <span className="symbol-label font-size-h5">P</span>
                                                        </div>
                                                        <div>
                                                            <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">Nombre cliente X</a>
                                                            <span className="text-muted font-weight-bold d-block">Proyecto X</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="d-flex justify-content-center">
                                                    <div className="symbol-group symbol-hover">
                                                        <OverlayTrigger overlay={<Tooltip>OMAR ABAROA</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_1.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>CARINA JIMÉNEZ</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_2.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>FERNANDO MÁRQUEZ</Tooltip>}>
                                                            <div className="symbol symbol-35 symbol-circle">
                                                                <img alt="Pic" src="/100_3.jpg" />
                                                            </div>
                                                        </OverlayTrigger>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">WEB</span>
                                                </td>
                                                <td className="text-center">
                                                    <DropdownButton
                                                        variant={"secondary"}
                                                        title={"Estatus"}
                                                    >
                                                        <Dropdown.Header>
                                                            <span className="font-size-sm">Elige una opción</span>
                                                        </Dropdown.Header>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item eventKey="1">
                                                            <a href="#" className="navi-link">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-success rounded-0">CONTRATADO</span>
                                                                </span>
                                                            </a>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="2">
                                                            <a href="#" className="navi-link">
                                                                <span className="navi-text">
                                                                    <span className="label label-xl label-inline label-light-danger rounded-0">DETENIDO</span>
                                                                </span>
                                                            </a>
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </td>
                                                <td className="pr-0 text-right">
                                                    <OverlayTrigger overlay={<Tooltip>Ver más</Tooltip>}>
                                                        <a className="btn btn-default btn-icon btn-sm mr-2">
                                                            <span className="svg-icon svg-icon-md">
                                                                <SVG src={toAbsoluteUrl('/images/svg/Arrow-right.svg')} />
                                                            </span>
                                                        </a>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(Crm)