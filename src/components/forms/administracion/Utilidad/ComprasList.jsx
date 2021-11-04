import React, { Component } from 'react'
import { setMoneyText  } from '../../../../functions/setters'
import Pagination from "react-js-pagination"
class ComprasList extends Component {
    state = {
        activePage: 1,
        itemsPerPage: 5
    }
    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({ ...this.state, activePage })
    }
    changePageCompra = venta => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/compras',
            state: { id: venta.id }
        });
    }
    render() {
        const { compras, title } = this.props
        const { activePage, itemsPerPage } = this.state
        return (
            <>
                <div className="font-size-lg mt-2 mb-5 text-center font-weight-normal">{title}</div>
                <div className="table-responsive d-flex justify-content-center col-md-10 mx-auto">
                    <table className="table-layout-fixed table-vertical-center w-100">
                        <thead className="bg-light-primary2">
                            <tr className="text-center">
                                <th>
                                    <span className="text-primary2 font-size-lg">IDENTIFICADOR</span>
                                </th>
                                <th>
                                    <span className="text-primary2 font-size-lg">TOTAL</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                compras ?
                                    compras.map((venta, key) => {
                                        let limiteInferior = (activePage - 1) * itemsPerPage
                                        let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                        if (compras.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                            return (
                                                <tr key={key} className="border-bottom text-center text-dark-75 font-size-lg font-weight-light h-30px">
                                                    <td className="font-weight-bold">
                                                        <a onClick = { (e) => { e.preventDefault(); this.changePageCompra(venta) } } >{venta.id}</a>  
                                                    </td>
                                                    <td>
                                                        {setMoneyText(venta.total)}
                                                    </td>
                                                </tr>
                                            )
                                        return false
                                    })
                                    : <></>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    compras.length > itemsPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                innerClass="pagination mb-0"
                                itemClass="page-item"
                                linkClass="page-link"
                                firstPageText='Primero'
                                lastPageText='Último'
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={compras.length}
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
            </>
        )
    }
}

export default ComprasList