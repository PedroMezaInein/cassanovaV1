import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import { Modal } from '../../singles';

export default class SolicitudFacturacionTabla extends Component{

    state = {
        modal: false
    }

    openModal = e => {
        this.setState({ ...this.state, modal: true })
    }

    handleClose = () => {
        this.setState({ ...this.state, modal: false })
    }

    render(){
        const { modal } = this.state
        return(
            <div>
                <Card className="card-custom gutter-b card-stretch">
                    <Card.Header className = 'border-0 pt-8 pt-md-0'>
                        <Card.Title className = 'm-0'>
                            <div className="font-weight-bold font-size-h5">
                                Listado de solicitudes de facturación
                            </div>
                        </Card.Title>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info text-info font-weight-bolder font-size-13px" 
                                onClick = { this.openModal }>
                                <i className="flaticon2-plus icon-nm mr-2 px-0 text-info" /> SOLICITAR FACTURA
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className = 'p-9 pt-0'>
                        <div className="table-responsive rounded-top">
                            <table className="table table-vertical-center">
                                <thead>
                                    <tr className="font-weight-bolder text-info text-center white-space-nowrap bg-light-info">
                                        <th>Emisor</th>
                                        <th>Receptor</th>
                                        <th>Concepto</th>
                                        <th>Monto</th>
                                        <th>Forma de<br /> pago</th>
                                        <th>Método de<br /> pago</th>
                                        <th>Estatus de<br /> facturación</th>
                                    </tr>
                                </thead>
                                
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size = 'lg' show = { modal } title = 'Nueva solicitud de factura' handleClose = { this.handleClose } >

                </Modal>
            </div>
        );
    }
}