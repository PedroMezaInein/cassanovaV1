import React, { Component } from 'react'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaReportes extends Component {

    sumaVentasProyectos(ventas) {
        let suma = 0
        ventas.map((venta) => {
            suma = suma + venta.total
            return false
        })
        return suma
    }

    sumaComprasProyectos(compras) {
        let suma = 0
        compras.map((compra) => {
            suma = suma + compra.total
            return false
        })
        return suma
    }
    sumaTotalVentasProyectos(){
        const { proyectos } = this.props
        let suma = 0
        proyectos.map((proyecto) => {
            proyecto.ventas.map((venta)=>{
                suma = suma + venta.total
                return false
            })
            return false
        })
        return suma
    }
    sumaTotalComprasProyectos(){
        const { proyectos } = this.props
        let suma = 0
        proyectos.map((proyecto) => {
            proyecto.compras.map((compra)=>{
                suma = suma + compra.total
                return false
            })
            return false
        })
        return suma
    }

    render() {
        const { proyectos } = this.props
        return (
            <div className="table-responsive table-hover">
                <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr>
                            <th className="pl-7 text-left w-auto rounded-0">
                                <span className="text-dark-75 font-size-lg">Proyecto</span>
                            </th>
                            
                            <th className="text-right rounded-0">
                                <span className="text-muted font-weight-bold">Ventas</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaTotalVentasProyectos())}</span>
                            </th>
                            
                            <th className="text-right rounded-0">
                                <span className="text-muted font-weight-bold">Compras</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaTotalComprasProyectos())}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proyectos.map((proyecto,key)=>{
                                    return(
                                        <tr className="text-right border-bottom" key={key}>
                                                <td className="p-2">
                                                    <div className="d-flex align-items-start">
                                                        <div className="text-dark-75 mb-1 font-size-sm pl-2 text-justify">{proyecto.nombre}</div>
                                                    </div>
                                                </td>           
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaVentasProyectos(proyecto.ventas))}</span>
                                                </td>
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaComprasProyectos(proyecto.compras))}</span>
                                                </td>
                                        </tr>
                                    )  
                                }                                                         
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TablaReportes