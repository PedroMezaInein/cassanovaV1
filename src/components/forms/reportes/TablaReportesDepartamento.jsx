import React, { Component } from 'react'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaReportesDepartamento extends Component {

    state = {
        active: ''
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

    sumaEgresosSubarea = egresos => {
        let suma = 0
        egresos.map((egreso)=>{
            suma = suma + egreso.total
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

    setDeptos = depto =>{
        let { active } = this.state
        if(active === depto.id){
            active = ''
        }else{
            active = depto.id
        }
        this.setState({
            ...this.state,
            active
        })
    }


    render() {
        const { departamentos } = this.props
        const { active } = this.state
        return (
            <div className="table-responsive w-75 mt-5 table-hover">
                <table className="table table-head-custom table-head-bg table-vertical-center">
                    <thead>
                        <tr>
                            <th className="pl-7 rounded-0">
                                <span className="text-dark-75 font-size-lg">Departamento</span>
                            </th>
                            <th className="text-right rounded-0">
                                <span className="text-muted font-weight-bold">Egresos</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{setMoneyTableSinSmall(this.sumaTotalEgresosDepartamentos())}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            departamentos.map((departamento,key)=>{
                                return(
                                    <>
                                        <tr key={key} className="border-bottom" onClick = { (e) => { e.preventDefault(); this.setDeptos(departamento) } }>
                                            <td className="p-2">
                                                <div className="d-flex align-items-start">
                                                    <div>
                                                        <div className="text-dark-75 mb-1 font-size-lg pl-2">{departamento.nombre}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(this.sumaEgresosDepartamentos(departamento.subareas))}</span>
                                            </td>
                                        </tr>
                                        {
                                            active === departamento.id ?
                                                departamento.subareas.map((subarea, index)=>{
                                                    return(
                                                        <tr key={index} className="border-bottom" >
                                                            <td className="p-2">
                                                                <div className="d-flex align-items-start">
                                                                    <div className="pl-4">
                                                                        <div className="text-dark-75 mb-1 font-size-md font-weight-bolder">&bull;&nbsp;{subarea.nombre}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="pr-4">
                                                                <span className="text-right text-dark-75 d-block font-size-md">{setMoneyTableSinSmall(this.sumaEgresosSubarea(subarea.egresos))}</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            : <tr></tr>
                                        }
                                    </>
                                )  
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TablaReportesDepartamento