import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
class LeadNegociacion extends Component {

    render() {
        // const { leads, onClickNext, onClickPrev,openModalWithInput, changeEstatus} = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-left text-uppercase bg-light-brown text-brown">
                                <th style={{ minWidth: "100px" }} className="pl-7">
                                    <span>Nombre del cliente y proyecto</span>
                                </th>
                                <th style={{ minWidth: "140px" }}>Fecha</th>
                                <th style={{ minWidth: "100px" }}>Origen</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                <th style={{ minWidth: "70px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="pl-0 py-8">
                                    <div className="d-flex align-items-center">
                                        <div className="symbol symbol-45 mr-3">
                                            <span className="symbol-label font-size-h5 bg-light-brown text-brown">P</span>
                                        </div>
                                        <div>
                                            <span className="text-dark-75 font-weight-bolder text-hover-brown mb-1 font-size-lg">Nombre cliente X</span>
                                            <span className="text-muted font-weight-bold d-block">Proyecto X</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-size-lg text-left font-weight-bolder">
                                    <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">01/10/2020</span><br />
                                    <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">09/10/2020</span>
                                </td>
                                <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">WEB</span>
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
                                
                                <td className="text-center">
                                    <Dropdown>
                                        <Dropdown.Toggle style={{ backgroundColor: '#EFEBE9', color: '#5D4037', border: 'transparent', padding: '2.8px 5.6px', width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.863rem', fontWeight: 500 }}
                                        >
                                            EN NEGOCIACIÓN
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="p-0">
                                            <Dropdown.Header>
                                                <span className="font-size-sm">Elige una opción</span>
                                            </Dropdown.Header>
                                            <Dropdown.Item href="#" className="p-0" >{/* onClick={(e) => { e.preventDefault(); changeEstatus('Contratado', lead.id ) }} */}
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-success rounded-0 w-100">CONTRATADO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#" className="p-0" > {/*onClick={(e) => { e.preventDefault(); changeEstatus('Detenido', lead.id ) }} */}
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline bg-light-gray text-gray rounded-0 w-100">DETENIDO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#" className="p-0" >{/* onClick={(e) => { e.preventDefault(); openModalWithInput('Cancelado', lead.id ) }} */}
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-danger rounded-0 w-100">CANCELADO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                                <td className="pr-0 text-right">
                                    <OverlayTrigger overlay={<Tooltip>Ver más</Tooltip>}>
                                        <a href='/leads/crm/info/info' className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-brown">
                                            <i className="flaticon2-plus icon-nm"></i>
                                        </a>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* <div className="d-flex justify-content-end">
                        {
                            this.isActiveButton('prev') ?
                                <span className="btn btn-icon btn-xs btn-light-brown mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                                : ''
                        }
                        {
                            this.isActiveButton('next') ?
                                <span className="btn btn-icon btn-xs btn-light-brown mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                                : ''
                        }
                    </div> */}
            </div>
        )
    }
}

export default LeadNegociacion