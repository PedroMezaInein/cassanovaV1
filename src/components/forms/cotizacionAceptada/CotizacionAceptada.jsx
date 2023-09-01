import React, { Component } from 'react'
import { Row } from 'react-bootstrap'
import ModificarOrdenCompra from './ModificarOrdenCompra'
import InfoCotizacionAceptada from './InfoCotizacionAceptada'
class CotizacionAceptada extends Component {
    render() {
        const { lead, at } = this.props
        return (
            <Row className="mx-0">
                <div className="col-md-12 col-xxl-6">
                    <InfoCotizacionAceptada lead={lead} at={at}/>
                </div>
                <div className="col-md-12 col-xxl-6">
                    <ModificarOrdenCompra lead={lead} at={at}/>
                </div> 
            </Row>
        )
    }
}

export default CotizacionAceptada