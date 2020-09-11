import React, { Component } from 'react';
import Moment from 'react-moment'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class TablaEstadosResultados extends Component {

    render() {
        const { ventas } = this.props
        return (
            <>
                <div className="d-flex justify-content-center">
                    <table className="table table-responsive table-head-custom table-borderless table-vertical-center">
                        <thead className="bg-primary-o-20">
                            <tr className="">
                                <th className="pl-7 text-center">
                                    <span className="text-dark-75 font-size-lg">ID</span>
                                </th>
                                <th className="text-center">
                                    <span className="text-dark-75 font-size-lg">Fecha</span>
                                </th>
                                <th className="text-right">
                                    <span className="text-dark-75 font-size-lg">Total</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            ventas?                            
                                ventas.map((venta,key)=>{
                                        return(
                                            <tr key={key}>
                                                <td className="p-2">
                                                    <div className="text-center">
                                                        <div>
                                                            <div className="text-dark-75 mb-1 font-size-lg pl-2">{venta.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="text-dark-75 d-block font-size-lg"><Moment format="DD/MM/YYYY">{venta.created_at}</Moment></span>
                                                </td>
                                                <td className="text-right">
                                                    <span className="text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(venta.total)}</span>
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