import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
export default class PartidaCard extends Component {
    render() {
        const { partida } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Card className="card card-without-box-shadown border-0">
                    <Card.Body className="p-0">
                        <div className="text-justify">
                            <div className="row pb-1">
                                <label className="col-4 font-weight-bolder text-primary">ID:</label>
                                <div className="col-8">
                                    {
                                        partida.id ?
                                            <span>{partida.id}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-4 font-weight-bolder text-primary">PARTIDA:</label>
                                <div className="col-8">
                                    {
                                        partida.nombre ?
                                            <span>{partida.nombre}</span>
                                            : <span>-</span>
                                    }
                                </div>
                            </div>
                            <div className="row pb-1">
                                <label className="col-4 font-weight-bolder text-primary align-self-center">SUBPARTIDAS:</label>
                                <div className="col-8">
                                    <ul className="pl-0 ml-4">
                                        {
                                            partida.subpartidas ?
                                                partida.subpartidas.map((subpartida, key) => {
                                                    return (
                                                        <li key={key}>
                                                            <span>{subpartida.nombre}</span>
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