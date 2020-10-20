import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import { setDateTable } from '../../../functions/setters'

class LeadContacto extends Component {

    isActiveButton(direction) {
        const { leads } = this.props
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) {
                    return true;
                }
            } else {
                if (leads.numPage < 10) {
                    if (leads.numPage < leads.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    render() {
        const { leads, onClickNext, onClickPrev } = this.props
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
                            {
                                leads.data.map((lead, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="pl-0 py-8">
                                                <div className="d-flex align-items-center">
                                                    <div className="symbol symbol-45 symbol-light-primary mr-3">
                                                        <span className="symbol-label font-size-h5">
                                                            {lead.nombre.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                                            {lead.nombre}
                                                        </span>
                                                        <span className="text-muted font-weight-bold d-block">
                                                            {lead.prospecto.tipo_proyecto.tipo}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="font-size-lg text-left font-weight-bolder">
                                                <span>Ingreso: </span><span className="text-muted font-weight-bold">{setDateTable(lead.created_at)}</span><br />
                                                <span>Último contacto: </span><span className="text-muted font-weight-bold">
                                                    {
                                                        setDateTable(lead.prospecto.contactos[0].created_at)
                                                    }
                                                </span>
                                            </td>
                                            <td className="d-flex justify-content-center">
                                                <div className="symbol-group symbol-hover">
                                                    {
                                                        lead.prospecto.vendedores.map((vendedor, index) => {
                                                            return (
                                                                <OverlayTrigger key={index} overlay={<Tooltip>{vendedor.name}</Tooltip>}>
                                                                    <div className="symbol symbol-35 symbol-circle">
                                                                        <img alt="Pic" src={vendedor.avatar ? vendedor.avatar : "/100_1.jpg"} />
                                                                    </div>
                                                                </OverlayTrigger>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                {
                                                    lead.origen ?
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-center">
                                                            {lead.origen.origen}
                                                        </span>
                                                        : ''
                                                }

                                            </td>
                                            <td className="text-center">
                                                {console.log(lead)}
                                                {
                                                    lead.prospecto ?
                                                        lead.prospecto.estatus_prospecto ?
                                                            // <DropdownButton
                                                            //     id="dropdown-basic"
                                                            //     variant={"secondary"}
                                                            //     title={lead.prospecto.estatus_prospecto.estatus.toUpperCase()}>
                                                            //     <Dropdown.Header>
                                                            //         <span className="font-size-sm">Elige una opción</span>
                                                            //     </Dropdown.Header>
                                                            //     <Dropdown.Divider />
                                                            //     <Dropdown.Item eventKey="1" className="p-0">
                                                            //         <span className="navi-link w-100">
                                                            //             <span className="navi-text">
                                                            //                 <span className="label label-xl label-inline label-light-success rounded-0 w-100">CONTRATADO</span>
                                                            //             </span>
                                                            //         </span>
                                                            //     </Dropdown.Item>
                                                            //     <Dropdown.Item eventKey="2" className="p-0">
                                                            //         <span className="navi-link w-100">
                                                            //             <span className="navi-text">
                                                            //                 <span className="label label-xl label-inline label-light-danger rounded-0 w-100">DETENIDO</span>
                                                            //             </span>
                                                            //         </span>
                                                            //     </Dropdown.Item>
                                                            // </DropdownButton>
                                                            <Dropdown>
                                                                <Dropdown.Toggle style={{ backgroundColor: lead.prospecto.estatus_prospecto.color_fondo, color: lead.prospecto.estatus_prospecto.color_texto, border: 'transparent', padding: '2.8px 5.6px', width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.863rem', fontWeight: 500 }}
                                                                >
                                                                    {lead.prospecto.estatus_prospecto.estatus.toUpperCase()}
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Header>
                                                                        <span className="font-size-sm">Elige una opción</span>
                                                                    </Dropdown.Header>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item href="#"  className="p-0">
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline label-light-success rounded-0 w-100">CONTRATADO</span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#"  className="p-0">
                                                                        <span className="navi-link w-100">
                                                                            <span className="navi-text">
                                                                                <span className="label label-xl label-inline label-light-danger rounded-0 w-100">DETENIDO</span>
                                                                            </span>
                                                                        </span>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                            : ''
                                                        : ''
                                                }

                                            </td>
                                            <td className="pr-0 text-right">
                                                <OverlayTrigger overlay={<Tooltip>Ver más</Tooltip>}>
                                                    <a href='/leads/crm/info/info' className="btn btn-default btn-icon btn-sm mr-2">
                                                        <i className="flaticon2-plus icon-nm"></i>
                                                    </a>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    {
                        this.isActiveButton('prev') ?
                            <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            : ''
                    }
                    {
                        this.isActiveButton('next') ?
                            <span className="btn btn-icon btn-xs btn-light-primary mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            : ''
                    }
                </div>
            </div>
        )
    }
}

export default LeadContacto