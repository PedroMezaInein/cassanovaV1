import React, { Component } from 'react'
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { setMoneyText } from '../../../functions/setters'

class PresupuestoTable extends Component {

    getStatusPdf = ( pdf ) => {
        if(pdf.pivot.enviado === 0)
            return 'Sin enviar'
        if(pdf.pivot.url)
            return 'Aceptado'
        if(pdf.pivot.motivo_cancelacion)
            return 'Rechazado'
        return 'En espera'
    }

    canSend = (pdf) => {
        const { presupuesto, sendDisable } = this.props
        if(sendDisable)
            return false
        if(presupuesto){
            if(presupuesto.estatus){
                if(presupuesto.estatus.estatus === 'Aceptado' || presupuesto.estatus.estatus === 'Rechazado')
                    return false
            }
        }
        if(this.getStatusPdf(pdf) === 'Sin enviar')
            return true
        return false
    }

    render(){
        const { datos, sendClient } = this.props
        return(
            <div className="tab-content mt-9">
                <div className="table-responsive-lg mt-3">
                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                        <thead>
                            <tr>
                                <th> ID </th>
                                <th> Estatus </th>
                                <th> Costo </th>
                                <tr></tr>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                datos.map((adj, index) => {
                                    return(
                                        <tr key = { index }>
                                            <td className = 'text-center w-25'>
                                                <a href = { adj.url } target = '_blank' rel = "noopener noreferrer">
                                                    { adj.pivot.identificador } 
                                                </a>
                                            </td>
                                            <td className = 'text-center w-25'> { this.getStatusPdf(adj) } </td>
                                            <td className = 'text-center w-25'> { setMoneyText(adj.pivot.monto) } </td>
                                            <td>
                                                <div className = 'text-center'>
                                                    <OverlayTrigger rootClose 
                                                        overlay={ <Tooltip> <span className='font-weight-bolder'>Mostrar</span> </Tooltip>}>
                                                        <a className={`btn btn-icon btn-active-light-primary2 w-30px h-30px mr-2`}
                                                            href = { adj.url } target = '_blank' rel = "noopener noreferrer">
                                                            <i className="las la-file-pdf icon-xl"></i>
                                                        </a>
                                                    </OverlayTrigger>
                                                    {
                                                        this.canSend(adj) ?
                                                            <OverlayTrigger rootClose 
                                                                overlay={ <Tooltip> <span className='font-weight-bolder'>Enviar al cliente</span> </Tooltip>}>
                                                                <span className={`btn btn-icon btn-hover-light-info w-30px h-30px mr-2`}
                                                                    onClick = { ( e ) => { e.preventDefault(); sendClient(adj) } } >
                                                                    <i className="las la-envelope-open-text icon-xl" />
                                                                </span>
                                                            </OverlayTrigger>
                                                        : ''
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>    
        )
    }
}

export default PresupuestoTable