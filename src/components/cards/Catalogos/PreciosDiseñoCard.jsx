import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import NumberFormat from 'react-number-format'

export default class PreciosDiseñoCard extends Component {
    render() {
        const { precio } = this.props
        console.log(precio)
        return (
            <div className="col-md-12 mt-4">
                <Card className="card card-without-box-shadown border-0">
                    <Card.Body className="p-0">
                        <div className="text-justify">
                            <div className="row pb-1">
                                <label className="col-6 font-weight-bolder text-primary">M2:</label>
                                <div className="col-6">
                                    {
                                        precio.m2 ?
                                            <span>{precio.m2}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-6 font-weight-bolder text-primary">PRECIO POR M2:</label>
                                <div className="col-6">
                                    {
                                        precio.precio_m2 ?
                                            <span>
                                                <NumberFormat
                                                    value={precio.precio_m2}
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
                                <label className="col-6 font-weight-bolder text-primary">ESQUEMA 1:</label>
                                <div className="col-6">
                                    {
                                        precio.esquema_1 ?
                                            <span>
                                                <NumberFormat
                                                    value={precio.esquema_1}
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
                                <label className="col-6 font-weight-bolder text-primary">INCREMENTO ESQUEMA 2:</label>
                                <div className="col-6">
                                    {
                                        precio.incremento_esquema_2 ?
                                            <span>{precio.incremento_esquema_2}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-6 font-weight-bolder text-primary">ESQUEMA 2:</label>
                                <div className="col-6">
                                    {
                                        precio.esquema_2 ?
                                            <span>
                                                <NumberFormat
                                                    value={precio.esquema_2}
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
                                <label className="col-6 font-weight-bolder text-primary">INCREMENTO ESQUEMA 3:</label>
                                <div className="col-6">
                                    {
                                        precio.incremento_esquema_3 ?
                                            <span>{precio.incremento_esquema_3}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-6 font-weight-bolder text-primary">ESQUEMA 3:</label>
                                <div className="col-6">
                                    {
                                        precio.esquema_3 ?
                                            <span>
                                                <NumberFormat
                                                    value={precio.esquema_3}
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
                        </div>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}