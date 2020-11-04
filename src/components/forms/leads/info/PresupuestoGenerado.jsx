import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
class PresupuestoGenerado extends Component {
    render() {
        const { } = this.props
        return (
            <div className="table-responsive mt-4">
                <table className="table  table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr className="text-left">
                            <th className="pl-7">
                                <span className="text-center text-muted font-size-sm">Adjunto</span>
                            </th>
                            <th className="text-center text-muted font-size-sm">IDENTIFICADOR</th>
                            <th className="text-center text-muted font-size-sm">ENVIAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <a href="#" className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg">INEIN-100.PDF</a>
                                        <span className="text-muted font-weight-bold d-block">Fecha</span>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center">
                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">100</span>
                            </td>
                            <td className="text-center">
                                <a className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                    <span className="svg-icon svg-icon-md">
                                        <SVG src={toAbsoluteUrl('/images/svg/Sending-mail.svg')} />
                                    </span>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PresupuestoGenerado