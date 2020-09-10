import React, { Component } from 'react'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaReportesDepartamento extends Component {

    sumaVentasProyectos(ingresos) {
        let suma = 0
        // ingresos.map((venta) => {
        //     suma = suma + venta.total
        // })
        return suma
    }

    sumaEgresosDepartamentos(subareas) {
        let suma = 0
        subareas.map((subarea)=>{
            subarea.egresos.map((egresos) => {
                suma = suma + egresos.total
            })
        })
        return suma
    }
    sumaTotalVentasProyectos(){
        const { departamentos } = this.props
        let suma = 0
        // departamentos.map((departamento) => {
        //     departamento.ingresos.map((venta)=>{
        //         suma = suma + venta.total
        //     })            
        // })
        
        return suma
    }
    sumaTotalEgresosDepartamentos(){
        const { departamentos } = this.props
        let suma = 0
        departamentos.map((departamento) => {
            departamento.subareas.map((subarea)=>{
                subarea.egresos.map((egresos) => {
                    suma = suma + egresos.total
                })
            })          
        })

        
        return suma
    }


    render() {
        const { departamentos } = this.props
        // console.log(departamentos)
        return (
            <div className="table-responsive">
                <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "250px" }} className="pl-7 text-left ">
                                <span className="text-dark-75 font-size-lg">Departamento</span>
                            </th>
                            
                            <th className="text-right">
                                <span className="text-muted font-weight-bold">Ingresos</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaTotalVentasProyectos())}</span>
                            </th>
                            
                            <th className="text-right"  >
                                <span className="text-muted font-weight-bold">Egresos</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaTotalEgresosDepartamentos())}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            departamentos.map((departamento,key)=>{
                                    return(
                                        <tr className="text-right" key={key}>
                                                <td className="p-2">
                                                    <div className="d-flex align-items-start">
                                                        <div>
                                                            <div className="text-dark-75 text-hover-primary mb-1 font-size-sm pl-2">{departamento.nombre}</div>
                                                        </div>
                                                    </div>
                                                </td>           
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-sm">
                                                        {/* {setMoneyTableSinSmall(this.sumaVentasProyectos(departamento.ingresos))} */}
                                                        $0.00
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-dark-75 font-weight-bolder d-block font-size-sm">{setMoneyTableSinSmall(this.sumaEgresosDepartamentos(departamento.subareas))}</span>
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

export default TablaReportesDepartamento