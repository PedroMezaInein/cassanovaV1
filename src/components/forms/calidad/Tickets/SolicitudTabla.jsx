import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
export default class SolicitudesTabla extends Component {
    render() {
        const { type, title, btn_title, openModalAdd, openModalEditar, deleteSolicitud } = this.props
        return (
            <>
                <Card className="card-custom gutter-b card-stretch">
                    <Card.Header className="border-0">
                        <Card.Title className="mb-0 ">
                            <div className="font-weight-bold font-size-h5">{title}</div>
                        </Card.Title>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info text-info font-weight-bolder font-size-13px" onClick = { (e) => { e.preventDefault(); openModalAdd(type); } }>
                                <i className="flaticon2-plus icon-nm mr-2 px-0 text-info"></i>{btn_title}
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-9 pt-0">
                        <div className="table-responsive rounded-top">
                            <table className="table table-vertical-center">
                                <thead>
                                    <tr className="font-weight-bolder text-info text-center white-space-nowrap bg-light-info">
                                        <th>Proveedor</th>
                                        <th>Tipo de pago</th>
                                        <th>Monto</th>
                                        <th>Factura</th>
                                        <th>Fecha</th>
                                        <th>Área</th>
                                        <th>Sub área</th>
                                        <th style={{ minWidth: '195px' }}>Descripción</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td className="text-dark font-weight-light font-size-sm">
                                            ADMINISTRACION DE SERVICIOS CHOPERENA SA DE CV
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            ANTICIPO
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            $1,500.00
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            SIN FACTURA
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            12 JUN 2021
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            FASE 3
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm">
                                            TRAMITES
                                        </td>
                                        <td className="text-dark font-weight-light font-size-sm text-justify">
                                            El punto de usar Lorem Ipsum es que tiene una distribución más o menos normal de las letras, al contrario de usar textos como por ejemplo.
                                        </td>
                                        <td className="white-space-nowrap">
                                            <div className="btn btn-sm btn-clean btn-icon text-hover-info mr-2"
                                            // onClick = { (e) => { e.preventDefault(); openModalEditar(type, id); } }
                                            >
                                                <i className="las la-edit text-muted icon-xl"></i>
                                            </div>
                                            <div className="btn btn-sm btn-clean btn-icon text-hover-info"
                                            // onClick = { (e) => { e.preventDefault(); deleteSolicitud(type, id); } }
                                            >
                                                <i className="las la-trash-alt text-muted icon-xl"></i>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </>
        );
    }
}