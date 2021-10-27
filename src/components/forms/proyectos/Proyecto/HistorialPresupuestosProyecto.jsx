import React, { Component } from 'react'
import { PresupuestoAceptado, TimelinePresupuestos} from '../..'
export default class HistorialPresupuestosProyecto extends Component {
    printActive= (estatus) => {
        const { presupuesto, getPresupuestos, proyecto, at, onClickOrden } = this.props
        switch(estatus){
            case 'Aceptado':
                let aux_aceptado = []
                presupuesto.pdfs.forEach((pdf) => {
                    if (pdf.pivot.url !== null) {
                        aux_aceptado.push(pdf)
                    }
                })
                return(
                    <PresupuestoAceptado
                        at = { at }
                        presupuesto = { presupuesto }
                        proyecto = { proyecto }
                        presupuesto_aceptado = { aux_aceptado }
                        getPresupuestos={getPresupuestos}
                        onClickOrden = { onClickOrden }
                    />
                )
            case 'En espera':
                return(
                    <TimelinePresupuestos presupuesto={presupuesto} onClickOrden = { onClickOrden }  changeStatus = { true }/>
                )
            default:
                return(
                    <></>
                )
        }
    }
    render() {
        const { presupuesto } = this.props
        return (
            <> 
                {this.printActive(presupuesto.estatus.estatus)}
            </>
        );
    }
}