import React, { Component } from 'react';

class TablaEstadosResultados extends Component {

    render() {
        return (
            <>
                <div className="table-responsive d-flex justify-content-center">
                    <table className="table table-head-custom table-borderless table-vertical-center col-md-10">
                        <thead className="bg-primary-o-20">
                            <tr className="text-left text-uppercase">
                                <th style={{ minWidth: "250px" }} className="pl-7">
                                    <span className="text-dark-75 font-size-lg">Proyectos</span>
                                </th>
                                <th className="text-center" style={{ minWidth: "100px" }}>
                                    <span className="text-muted font-weight-bold">Total</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="p-2">
                                    <div className="d-flex align-items-start">
                                        <div>
                                            <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg pl-2">Proyecto 1</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">$8,000,000</span>
                                </td>
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr className="text-right">
                                <th className="pl-7">
                                    <span className="text-dark-75 font-size-lg">Proyectos</span>
                                </th>
                                <th className="text-center">
                                    <span className="text-muted font-weight-bold">Total</span>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </>
        )
    }
}
export default TablaEstadosResultados