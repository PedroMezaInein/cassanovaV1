import React, { Component } from 'react';
import { setMoneyTableSinSmall } from '../../../functions/setters'
import Pagination from "react-js-pagination";
import { dayDMY } from '../../../functions/setters'
class TablaEstadosResultados extends Component {

    state = {
        itemsPerPage: 10,
        activePage:{
            compras: 1,
            egresos: 1,
            ingresos: 1,
            ventas: 1
        }
    }

    onChangePageCompras(pageNumber){
        const { activePage } = this.state
        activePage.compras = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }

    onChangePageEgresos(pageNumber){
        const { activePage } = this.state
        activePage.egresos = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }
    onChangePageIngresos(pageNumber){
        const { activePage } = this.state
        activePage.ingresos = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }

    onChangePageVentas(pageNumber){
        const { activePage } = this.state
        activePage.ventas = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }

    render() {
        const { ventas, ingresos, compras, egresos } = this.props
        const { itemsPerPage, activePage } = this.state 
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
                            ventas ?
                                ventas.length === 0 ?
                                    <tr className="border">
                                        <td colSpan="3" className="p-2">
                                            <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">
                                                No hay ventas
                                            </div>
                                        </td>
                                    </tr>
                                :
                                    ventas.map((venta,key)=>{
                                        let limiteInferior = (activePage.ventas - 1) * itemsPerPage
                                        
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if(ventas.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                            return(
                                                <tr key={key} className="border-bottom">
                                                    <td className="p-2">
                                                        <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{venta.id}</div>
                                                    </td>
                                                    <td>
                                                        <span className="text-center text-dark-75 d-block font-size-lg">{dayDMY(venta.created_at)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(venta.total)}</span>
                                                    </td>
                                                </tr>
                                            )
                                        return false
                                    })
                            :''
                        }

                        {
                            ingresos ?
                                ingresos.length === 0 ?
                                    <tr className="border">
                                        <td colSpan="3" className="p-2">
                                            <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">
                                                No hay ingresos
                                            </div>
                                        </td>
                                    </tr>
                                :
                                    ingresos.map((ingreso,key)=>{
                                        let limiteInferior = (activePage.ingresos - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)

                                        if(ingresos.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                            return(
                                                <tr key={key} className="border-bottom">
                                                    <td className="p-2">
                                                        <div>
                                                            <div className="text-centertext-dark-75 mb-1 font-size-lg pl-2">{ingreso.id}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="text-center text-dark-75 d-block font-size-lg">{dayDMY(ingreso.created_at)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(ingreso.total)}</span>
                                                    </td>
                                                </tr>
                                            )  
                                        return false
                                    })
                            :''
                        }

                        {
                            compras ? 
                                compras.length === 0 ?
                                    <tr className="border">
                                        <td colSpan="3" className="p-2">
                                            <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">
                                                No hay costos de servicio
                                            </div>
                                        </td>
                                    </tr>
                                :
                                    compras.map((compra,key)=>{

                                        let limiteInferior = (activePage.compras - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)

                                        if(compras.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                            return(
                                                <tr key={key} className="border-bottom">
                                                    <td className="p-2">
                                                        <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{compra.id}</div>
                                                    </td>
                                                    <td>
                                                        <span className="text-center text-dark-75 d-block font-size-lg">{dayDMY(compra.created_at)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(compra.total)}</span>
                                                    </td>
                                                </tr>
                                            )  
                                        return false
                                    })
                            :''
                        }

                        {
                            egresos ?
                                egresos.length === 0 ?
                                    <tr className="border">
                                        <td colSpan="3" className="p-2">
                                            <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">
                                                No hay gastos operativos
                                            </div>
                                        </td>
                                    </tr>
                                :
                                    egresos.map((egreso,key)=>{
                                        let limiteInferior = (activePage.egresos - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if(egresos.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                            return(
                                                <tr key={key} className="border-bottom">
                                                    <td className="p-2">
                                                        <div className="text-center text-dark-75 mb-1 font-size-lg pl-2">{egreso.id}</div>
                                                    </td>
                                                    <td>
                                                        <span className="text-center text-dark-75 d-block font-size-lg">{dayDMY(egreso.created_at)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-right text-dark-75 d-block font-size-lg">{setMoneyTableSinSmall(egreso.total)}</span>
                                                    </td>
                                                </tr>
                                            )  
                                        return false
                                    })
                            :''
                        }
                        </tbody>
                    </table>
                </div>
                {
                    egresos ? 
                        egresos.length > itemsPerPage ?
                            <div className="d-flex justify-content-center my-2">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText = 'Primero'
                                    lastPageText = 'Último'
                                    activePage = { activePage.egresos }
                                    itemsCountPerPage = { itemsPerPage }
                                    totalItemsCount = { egresos.length }
                                    pageRangeDisplayed = { 5 }
                                    onChange={this.onChangePageEgresos.bind(this)}
                                    itemClassLast="d-none"
                                    itemClassFirst="d-none"
                                    nextPageText= { '>' }
                                    prevPageText= { '<' }
                                />
                            </div>
                        : ''
                    : ''
                }
                {
                    compras ? 
                        compras.length > itemsPerPage ?
                            <div className="d-flex justify-content-center my-2">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText = 'Primero'
                                    lastPageText = 'Último'
                                    activePage = { activePage.compras }
                                    itemsCountPerPage = { itemsPerPage }
                                    totalItemsCount = {compras.length }
                                    pageRangeDisplayed = { 5 }
                                    onChange={this.onChangePageCompras.bind(this)}
                                    itemClassLast="d-none"
                                    itemClassFirst="d-none"
                                    nextPageText= { '>' }
                                    prevPageText= { '<' }
                                />
                            </div>
                        : ''
                    : ''
                }
                {
                    ingresos ? 
                        ingresos.length > itemsPerPage ?
                            <div className="d-flex justify-content-center my-2">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText = 'Primero'
                                    lastPageText = 'Último'
                                    activePage = { activePage.ingresos }
                                    itemsCountPerPage = { itemsPerPage }
                                    totalItemsCount = {ingresos.length }
                                    pageRangeDisplayed = { 5 }
                                    onChange={this.onChangePageIngresos.bind(this)}
                                    itemClassLast="d-none"
                                    itemClassFirst="d-none"
                                    nextPageText= { '>' }
                                    prevPageText= { '<' }
                                />
                            </div>
                        : ''
                    : ''
                }
                {
                    ventas ? 
                        ventas.length > itemsPerPage ?
                            <div className="d-flex justify-content-center my-2">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    firstPageText = 'Primero'
                                    lastPageText = 'Último'
                                    activePage = { activePage.ventas }
                                    itemsCountPerPage = { itemsPerPage }
                                    totalItemsCount = {ventas.length }
                                    pageRangeDisplayed = { 5 }
                                    onChange={this.onChangePageVentas.bind(this)}
                                    itemClassLast="d-none"
                                    itemClassFirst="d-none"
                                    nextPageText= { '>' }
                                    prevPageText= { '<' }
                                />
                            </div>
                        : ''
                    : ''
                }
                
            </>
        )
    }
}
export default TablaEstadosResultados