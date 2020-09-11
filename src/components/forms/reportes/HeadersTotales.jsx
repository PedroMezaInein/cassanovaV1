import React, { Component } from 'react'
import { setMoneyTableSinSmall } from '../../../functions/setters'

class HeadersTotales extends Component {
    render() { 
        const { title, sumaTotal, sumaTotal2 } = this.props
        return (
            <>
                <div className="d-flex justify-content-end">
                    <div className="d-flex flex-column mt-2">
                        <div className="d-flex align-items-center justify-content-between flex-grow-1">
                            <div className="mr-2 mt-2">
                                <div className="font-weight-bolder font-size-lg">{title}</div>
                            </div>
                            <div className="font-weight-bolder font-size-lg text-primary ml-3">{setMoneyTableSinSmall(sumaTotal)}</div>
                            <div className="font-weight-bolder font-size-lg text-info mr-3">{setMoneyTableSinSmall(sumaTotal2)}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default HeadersTotales