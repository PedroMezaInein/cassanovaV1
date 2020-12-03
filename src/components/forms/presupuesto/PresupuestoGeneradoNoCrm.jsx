import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { setDateTableLG } from '../../../functions/setters';
class PresupuestoGenerado extends Component {
    render() {
        const { pdfs, onClick } = this.props
        return (
            <div className="table-responsive mt-4">
                <table className="table  table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr className="text-left">
                            <th className="pl-7">
                                <span className="text-center text-muted font-size-sm">Adjunto</span>
                            </th>
                            <th className="text-center text-muted font-size-sm">IDENTIFICADOR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pdfs.map((pdf, index) => {
                                return(
                                    <tr key = { index } >
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <a target="_blank" href={pdf.url} className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg">{pdf.name}</a>
                                                    <span className="text-muted font-weight-bold d-block">
                                                        {
                                                            setDateTableLG(pdf.created_at)
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{pdf.pivot.identificador}</span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PresupuestoGenerado