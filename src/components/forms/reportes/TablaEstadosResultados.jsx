import React, { Component } from 'react';
import Moment from 'react-moment'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaEstadosResultados extends Component {

    render() {
        const { ventas, ingresos, compras, egresos } = this.props
        
        return (
            <>
                <div className="table-responsive d-flex justify-content-center">
                    <table className="table table-head-custom table-borderless table-vertical-center w-50">
                        <thead className="bg-primary-o-20">
                            <tr>
                                <th style={{ width: "7%" }} className="pl-7 text-center">
                                    <span className="text-dark-75 font-size-lg">ID</span>
                                </th>
                                <th style={{ width: "7%" }} className="text-center">
                                    <span className="text-dark-75 font-size-lg">Fecha</span>
                                </th>
                                <th style={{ width: "4%" }} className="text-right">
                                    <span className="text-dark-75 font-size-lg">Total</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            ventas?                            
                                ventas.map((venta,key)=>{
                                        return(
                                            <tr key={key} className="border-bottom">
                                                <td className="p-2">
                                                    <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{venta.id}</div>
                                                </td>
                                                <td>
                                                    <span className="text-center text-dark-75 d-block font-size-lg"><Moment format="DD/MM/YYYY">{venta.created_at}</Moment></span>
                                                </td>
                                                <td>
                                                    <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(venta.total)}</span>
                                                </td>
                                            </tr>
                                        )  
                                })
                            :''
                        }

                        {
                            ingresos?                            
                                ingresos.map((ingreso,key)=>{
                                        return(
                                            <tr key={key} className="border-bottom">
                                                <td className="p-2">
                                                    <div>
                                                        <div className="text-centertext-dark-75 mb-1 font-size-lg pl-2">{ingreso.id}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-center text-dark-75 d-block font-size-lg"><Moment format="DD/MM/YYYY">{ingreso.created_at}</Moment></span>
                                                </td>
                                                <td>
                                                    <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(ingreso.total)}</span>
                                                </td>
                                            </tr>
                                        )  
                                })
                            :''
                        }

                        {
                            compras?                            
                                compras.map((compra,key)=>{
                                        return(
                                            <tr key={key} className="border-bottom">
                                                <td className="p-2">
                                                    <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{compra.id}</div>
                                                </td>
                                                <td>
                                                    <span className="text-center text-dark-75 d-block font-size-lg"><Moment format="DD/MM/YYYY">{compra.created_at}</Moment></span>
                                                </td>
                                                <td>
                                                    <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(compra.total)}</span>
                                                </td>
                                            </tr>
                                        )  
                                })
                            :''
                        }

                        {
                            egresos?                            
                                egresos.map((egreso,key)=>{
                                        return(
                                            <tr key={key} className="border-bottom">
                                                <td className="p-2">
                                                    <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{egreso.id}</div>
                                                </td>
                                                <td>
                                                    <span className="text-center text-dark-75 d-block font-size-lg"><Moment format="DD/MM/YYYY">{egreso.created_at}</Moment></span>
                                                </td>
                                                <td>
                                                    <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(egreso.total)}</span>
                                                </td>
                                            </tr>
                                        )  
                                })
                            :''
                        }
                        
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
export default TablaEstadosResultados