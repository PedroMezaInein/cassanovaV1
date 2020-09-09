import React, { Component } from 'react'

class TablaReportes extends Component {

    render() {
        const { } = this.props
        return (
            <>
                <div className="table-responsive">
                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-left text-uppercase">
                                <th style={{ minWidth: "250px" }} className="pl-7">
                                    <span className="text-dark-75">Proyecto</span>
                                </th>
                                <th style={{ minWidth: "100px" }}>Ventas</th>
                                <th style={{ minWidth: "100px" }}>Compras</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="pl-0 py-8">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg pl-2">Proyecto 1</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">$8,000,000</span>
                                </td>
                                <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">$520</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default TablaReportes