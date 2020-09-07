import React, { Component } from 'react'
import { validateAlert } from '../../../functions/alert'
import { Form } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters';
class EstatusForm extends Component {

    render() {
        const { onSubmit, estatus } = this.props
        return (
            <Form id="form-estatus"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-estatus')
                    }
                }
            >
                <div className="table-responsive mt-4">
                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-center">
                                <th style={{ minWidth: "100px" }}>
                                    <span className="text-dark-75">Fecha de inicio</span>
                                </th>
                                <th style={{ minWidth: "100px" }}>
                                    <span className="text-dark-75">Fecha final</span>
                                </th>
                                <th style={{ minWidth: "100px" }}>
                                    <span className="text-dark-75">Estatus</span>
                                </th>
                            </tr>
                        </thead>
                        {
                            estatus.map((estatus, key) => {
                                return (
                                    <tbody key={key}>
                                        <tr className="text-center">
                                            <td>
                                                <span className="font-size-lg">{setDateTableLG(estatus.fecha_inicio)}</span>
                                            </td>
                                            <td>
                                                <span className="font-size-lg">{setDateTableLG(estatus.fecha_fin)}</span>
                                            </td>
                                            <td className="pr-0">
                                                {
                                                    (estatus.estatus === "Aceptadas") ?
                                                        <span className="label label-lg label-light-primary label-inline font-weight-bold">Aceptadas</span>
                                                        :
                                                        (estatus.estatus === "Rechazadas") ?
                                                            <span className="label label-lg label-light-danger label-inline font-weight-bold">Rechazadas</span>
                                                            :
                                                            <span className="label label-lg label-light-warning label-inline font-weight-bold">En espera</span>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                    </table>
                </div>
            </Form>
        )
    }
}

export default EstatusForm