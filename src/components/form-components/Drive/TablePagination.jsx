import React, { Component } from 'react'
import Pagination from "react-js-pagination";
import { FileItem } from '../../../components/singles'
class TablePagination extends Component {
    state = {
        itemsPerPage: 10,
        activePage: 1
    }    
    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }
    render() {
        const { adjuntos, delete_onclick} = this.props
        const { itemsPerPage, activePage } = this.state
        return (
            <>
            <div className="table-responsive mt-4">
                <table className="table table-vertical-center">
                    <thead className="bg-primary-o-30">
                        <tr className="text-left text-primary">
                            <th className="pl-2" style={{ minWidth: "150px" }}>Adjunto</th>
                            <th style={{ minWidth: "80px" }} className="text-center">Fecha</th>
                            <th className="pr-0 text-right" style={{ minWidth: "70px" }}></th>
                        </tr>
                    </thead>
                    <tbody>{
                            adjuntos.map((adjunto, key) => {
                                let limiteInferior = (activePage - 1) * itemsPerPage
                                let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                if (adjunto.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                    return(<FileItem item={adjunto} onClickDelete={delete_onclick} key={key}/>)
                                return false
                            })
                        }</tbody>
                </table>
            </div >
            {
                adjuntos ?
                adjuntos.length > itemsPerPage ?
                    <div className="col-md-12 d-flex justify-content-center mt-4">
                        <Pagination
                            itemClass="page-item"
                            firstPageText='Primero'
                            lastPageText='Último'
                            activePage={activePage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={adjuntos.length}
                            pageRangeDisplayed={5}
                            onChange={this.onChangePage.bind(this)}
                            itemClassLast="d-none"
                            itemClassFirst="d-none"
                            prevPageText={<i className='ki ki-bold-arrow-back icon-xs' />}
                            nextPageText={<i className='ki ki-bold-arrow-next icon-xs' />}
                            linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                            linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                            linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                            activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                        />
                    </div>
                    : ''
                : ''
            }
        </>
        )
    }
}

export default TablePagination