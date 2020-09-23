import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
export default class ProveedorCard extends Component {
    render() {
        const { proveedor } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Card className="card card-without-box-shadown border-0">
                    <Card.Body className="p-0">
                        <div className="text-justify">
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary align-self-center">NOMBRE DE CONTACTO:</label>
                                <div className="col-7">
                                    {
                                        proveedor.nombre ?
                                            <span>{proveedor.nombre}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary align-self-center">RAZÓN SOCIAL:</label>
                                <div className="col-7">
                                    {
                                        proveedor.razon_social ?
                                            <span>{proveedor.razon_social}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">RFC:</label>
                                <div className="col-7">
                                    {
                                        proveedor.rfc ?
                                            <span>{proveedor.rfc}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">CORREO ELECTRÓNICO:</label>
                                <div className="col-7">
                                    {
                                        proveedor.email ?
                                            <span>{proveedor.email}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">TELÉFONO:</label>
                                <div className="col-7">
                                    {
                                        proveedor.telefono ?
                                            <span>{proveedor.telefono}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">NÚMERO DE CUENTA:</label>
                                <div className="col-7">
                                    {
                                        proveedor.numero_cuenta ?
                                            <span>{proveedor.numero_cuenta}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">TIPO DE CUENTA:</label>
                                <div className="col-7">
                                    {
                                        proveedor.tipo_cuenta ?
                                            <span>{proveedor.tipo_cuenta.tipo}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">BANCO:</label>
                                <div className="col-7">
                                    {
                                        proveedor.banco ?
                                            <span>{proveedor.banco.nombre}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">ÁREA:</label>
                                <div className="col-7">
                                    {
                                        proveedor.subarea ?
                                            proveedor.subarea.area ?
                                                <span>{proveedor.subarea.area.nombre}</span>
                                                : <span>-</span>
                                            : ''
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-5 font-weight-bolder text-primary">SUBÁREA:</label>
                                <div className="col-7">
                                    {
                                        proveedor.subarea ?
                                            <span>{proveedor.subarea.nombre}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}