import React, { Component } from 'react'
import { Card } from 'react-bootstrap'

export default class EmpleadosCard extends Component {
    render() {
        const { area } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Card className="card card-without-box-shadown border-0">
                    <Card.Body className="p-0">
                        <div className="text-justify">
                            <div className="row pb-1">
                                <label className="col-4 font-weight-bolder text-primary">ÁREA:</label>
                                <div className="col-8">
                                    {
                                        area.nombre ?
                                            <span>{area.nombre}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-4 font-weight-bolder text-primary align-self-center">SUBÁREA:</label>
                                <div className="col-8">
                                    <ul className="pl-0 ml-4">
                                        {
                                            area.subareas ?
                                                area.subareas.map((subarea, key) => {
                                                    return (
                                                        <li key={key}>
                                                            <span>{subarea.nombre}</span>
                                                        </li>
                                                    )
                                                })
                                                : <span>-</span>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}