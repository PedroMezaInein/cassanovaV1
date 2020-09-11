import React, { Component } from 'react'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaReportesDepartamento extends Component {

    sumaEgresosDepartamentos(subareas) {
        let suma = 0
        subareas.map((subarea)=>{
            subarea.egresos.map((egresos) => {
                suma = suma + egresos.total
            })
        })
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
        return (
            <div className="table-responsive w-50">
                <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr>
                            <th style={{ minWidth: "250px" }} className="pl-7">
                                <span className="text-dark-75 font-size-lg">Departamento</span>
                            </th>
                            
                            <th className="text-right">
                                <span className="text-muted font-weight-bold">Egresos</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{setMoneyTableSinSmall(this.sumaTotalEgresosDepartamentos())}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            departamentos.map((departamento,key)=>{
                                    return(
                                        <tr key={key} className="border-bottom">
                                                <td className="p-2">
                                                    <div className="d-flex align-items-start">
                                                        <div>
                                                            <div className="text-dark-75 text-hover-primary mb-1 font-size-lg pl-2">{departamento.nombre}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(this.sumaEgresosDepartamentos(departamento.subareas))}</span>
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