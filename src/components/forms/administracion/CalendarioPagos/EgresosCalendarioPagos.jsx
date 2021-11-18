import React, { Component } from 'react'
import Swal from 'sweetalert2'
import Pagination from 'react-js-pagination'
import { apiGet, catchErrors } from '../../../../functions/api'
import { printResponseErrorAlert, waitAlert } from '../../../../functions/alert'
import { setMoneyText, setDateText } from '../../../../functions/setters'
import { Button } from '../../../form-components'
class EgresosCalendarioPagos extends Component {
    state = {
        egresos: [],
        activePage: 1,
        itemsPerPage: 5,
        order: {
            direction: null,
            column: null
        }
    }
    componentDidMount = () => {
        this.getInfoPrestacion()
    }
    getInfoPrestacion = () => {
        const { pago, at } = this.props
        const { order } = this.state
        waitAlert()
        apiGet(`v1/administracion/pago/${pago.id}/egresos`, at).then(
            (response) => {
                let { egresos } = response.data
                if(order.direction !== null && order.column !== null){
                    egresos.sort(function (a, b) {
                        if (a[order.column] > b[order.column]) {
                            if(order.direction === 'asc')
                                return 1;
                            else 
                                return -1;
                        }
                        if (a[order.column] < b[order.column]) {
                            if(order.direction === 'asc')
                                return -1;
                            else 
                                return 1;
                        }
                        return 0;
                    });   
                }
                Swal.close()
                this.setState({ 
                    ...this.state,
                    egresos: egresos
                })
            }, (error) => { printResponseErrorAlert(error)  }
        ).catch((error) => { catchErrors(error) })
    }

    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }

    onSubmit = () => {
        const { history, pago } = this.props
        history.push({
            pathname: '/administracion/egresos/add',
            state: { pago: pago }
        });
    }

    resort = columna => {
        const { order } = this.state
        let { egresos } = this.state
        if(order.column === columna){
            order.direction = order.direction === 'asc' ? 'desc' : 'asc'
        }else{
            order.column = columna
            order.direction = 'asc'
        }
        egresos.sort(function (a, b) {
            if (a[order.column] > b[order.column]) {
                if(order.direction === 'asc')
                    return 1;
                else 
                    return -1;
            }
            if (a[order.column] < b[order.column]) {
                if(order.direction === 'asc')
                    return -1;
                else 
                    return 1;
            }
            return 0;
        })
        this.setState({
            ...this.state,
            order,
            egresos: egresos
        })
    }

    printSortIcon = columna => {
        const { order } = this.state
        if(order.direction === null && order.column === null){
            return <i className = 'flaticon2-up text-primary2 icon-sm' onClick = { () => this.resort(columna) } />
        }else{
            if(order.column === columna){
                if(order.direction === 'asc'){
                    return <i className = 'flaticon2-up text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />
                }else{
                    return <i className = 'flaticon2-down text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />    
                }
            }else{
                return <i className = 'flaticon2-up text-primary2 icon-sm'  onClick = { () => this.resort(columna) } />
            }
        }
    }

    render() {
        const { egresos, activePage, itemsPerPage } = this.state
        return (
            <div className="container">
                <div className='d-flex justify-content-end my-8 w-80 mx-auto'>
                    <Button icon='' onClick={this.onSubmit} className="btn btn-light btn-hover-primary2 font-weight-bolder" text='GENERAR EGRESO'/>
                </div> 
                <div>
                <div className="table-responsive-lg">
                    <table className="table table-vertical-center w-80 mx-auto" >
                        <thead className="bg-light-primary2 text-primary2">
                            <tr>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            IDENTIFICADOR
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('id') }
                                        </span>
                                    </div>
                                </td>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            MONTO
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('total') }
                                        </span>
                                    </div>
                                </td>
                                <td className="w-30">
                                    <div className = 'd-flex justify-content-around'>
                                        <span>
                                            FECHA
                                        </span>
                                        <span className = 'text-hover'>
                                            { this.printSortIcon('created_at') }
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody className = 'text-center font-weight-light'>
                            { 
                                egresos.length  ?
                                    egresos.map((egreso, key) => {
                                        let limiteInferior = (activePage - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if (egresos.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior)){
                                            return(
                                                <tr key = {egreso.id}>
                                                    <td>
                                                        <a href = {`/administracion/egresos?id=${egreso.id}`} className="font-weight-bold text-primary2">
                                                            {egreso.id}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        { setMoneyText(egreso.total) }
                                                    </td>
                                                    <td>
                                                        { setDateText(egreso.created_at) }
                                                    </td>
                                                </tr>
                                            )
                                        }else{
                                            return false
                                        }
                                    })
                                :
                                    <tr>
                                        <td colSpan = '3' >
                                            Sin egresos
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    egresos.length > itemsPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                innerClass="pagination mb-0"
                                itemClass="page-item"
                                firstPageText='Primero'
                                lastPageText='Último'
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={egresos.length}
                                pageRangeDisplayed={5}
                                onChange={this.onChangePage.bind(this)}
                                itemClassLast="d-none"
                                itemClassFirst="d-none"
                                prevPageText={<i className='ki ki-bold-arrow-back icon-xs text-primary2' />}
                                nextPageText={<i className='ki ki-bold-arrow-next icon-xs text-primary2' />}
                                linkClassPrev="btn btn-icon btn-sm btn-light-primary2 mr-2 my-1 pagination"
                                linkClassNext="btn btn-icon btn-sm btn-light-primary2 mr-2 my-1 pagination"
                                linkClass="btn btn-icon btn-sm border-0 btn-hover-primary2 mr-2 my-1 pagination"
                                activeLinkClass="btn btn-icon btn-sm border-0 btn-primary2 btn-hover-primary2 mr-2 my-1 pagination"
                            />
                        </div>
                        : ''
                }
            </div>
            </div>
        )
    }
}

export default EgresosCalendarioPagos