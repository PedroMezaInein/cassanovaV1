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
                            <th className="text-center text-muted font-size-sm">ESTATUS</th>
                            {
                                onClick &&
                                    <th className="text-center text-muted font-size-sm">ENVIAR</th>
                            }
                            
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
                                                    <a rel="noopener noreferrer" target="_blank" href={pdf.url} 
                                                        className="text-dark-primary font-weight-bolder text-hover-success mb-1 font-size-lg">
                                                        {pdf.name}
                                                    </a>
                                                    <span className="text-muted font-weight-bold d-block">
                                                        { setDateTableLG(pdf.created_at) }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{pdf.pivot.identificador}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                {
                                                    pdf.pivot.fecha_envio !== null ?
                                                        <span>
                                                            <span className="label label-md label-light-success label-inline font-weight-bold" 
                                                                style={{fontSize: '10.7px'}}>
                                                                Enviada
                                                            </span>
                                                            <span className="text-muted font-weight-bold d-block font-size-sm mt-1">
                                                                {setDateTableLG(pdf.pivot.fecha_envio)}
                                                            </span>
                                                        </span>
                                                    : ''
                                                }
                                            </span>
                                        </td>
                                        {
                                            onClick &&
                                                <td className="text-center">
                                                    <span onClick = { (e) => { e.preventDefault(); onClick(pdf); } } 
                                                        className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Sending-mail.svg')} />
                                                        </span>
                                                    </span>
                                                </td>
                                        }
                                        
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