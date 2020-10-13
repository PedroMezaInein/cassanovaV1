import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton } from 'react-bootstrap'

class LeadContacto extends Component {

    render() {
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-left text-uppercase bg-primary-o-20 text-primary">
                                <th style={{ minWidth: "250px" }} className="pl-7">
                                    <span>Nombre del cliente / Nombre del proyecto</span>
                                </th>
                                <th style={{ minWidth: "100px" }}>Fecha</th>
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
                                <td className="font-size-lg text-left font-weight-bolder">
                                    <span>Ingreso: </span><span className="text-muted font-weight-bold">01/10/2020</span><br/>
                                    <span>Último contacto: </span><span className="text-muted font-weight-bold">09/10/2020</span>
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
                                        <a href='/leads/crm/info/info'className="btn btn-default btn-icon btn-sm mr-2">
                                            <i className="flaticon2-plus icon-nm"></i>
                                        </a>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default LeadContacto