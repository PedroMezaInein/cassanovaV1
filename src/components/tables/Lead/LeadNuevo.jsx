import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown, DropdownButton, Button } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
class LeadNuevo extends Component {
    render() {
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-left text-uppercase bg-light-pink text-pink">
                                <th style={{ minWidth: "250px" }} className="pl-7">
                                    <span>Nombre del cliente / Nombre del proyecto</span>
                                </th>
                                <th style={{ minWidth: "100px" }} className="text-center">Empresa</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Origen</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                <th style={{ minWidth: "80px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="pl-0 py-8">
                                    <div className="d-flex align-items-center">
                                        <div className="symbol symbol-45 mr-3">
                                            <span className="symbol-label font-size-h5 bg-light-pink text-pink">P</span>
                                        </div>
                                        <div>
                                            <span className="text-dark-75 font-weight-bolder text-hover-pink mb-1 font-size-lg">Nombre cliente X</span>
                                            <span className="text-muted font-weight-bold d-block">Proyecto X</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="d-flex justify-content-center">
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">INEIN</span>
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
                                            <span className="navi-link">
                                                <span className="navi-text">
                                                    <span className="label label-xl label-inline label-light-success rounded-0">CONTRATADO</span>
                                                </span>
                                            </span>
                                        </Dropdown.Item>
                                        <Dropdown.Item eventKey="2">
                                            <span className="navi-link">
                                                <span className="navi-text">
                                                    <span className="label label-xl label-inline label-light-danger rounded-0">DETENIDO</span>
                                                </span>
                                            </span>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </td>
                                <td className="pr-0 text-right">
                                    {/* <OverlayTrigger overlay={<Tooltip>Enviar correo</Tooltip>}>
                                        <a href='/leads/crm/info/info' className="btn btn-default btn-icon btn-sm mr-2">
                                            <i className="flaticon2-plus icon-nm"></i>
                                        </a>
                                    </OverlayTrigger> */}
                                    <OverlayTrigger overlay={<Tooltip>ENVIAR CORREO</Tooltip>}>
                                        <a href="#" className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                            </span>
                                        </a>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>AGENDAR LLAMADA</Tooltip>}>
                                        <a href="#" className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                            <span className="svg-icon svg-icon-md">
                                                <SVG src={toAbsoluteUrl('/images/svg/Active-call.svg')} />
                                            </span>
                                        </a>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>SEGUIMIENTO (SCRIPT)</Tooltip>}>
                                        <a href="#" className="btn btn-icon btn-light btn-hover-secondary btn-sm mr-2">
                                            <span className="svg-icon svg-icon-md">
                                                <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                            </span>
                                        </a>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
        )
    }
}


export default LeadNuevo