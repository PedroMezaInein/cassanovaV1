import React, { Component } from 'react'
import Swal from 'sweetalert2'
import SVG from "react-inlinesvg"
import { Card } from 'react-bootstrap'
import Modal from '../../modals/Modal'
import { setOptions, setMoneyText } from '../../../functions/setters'
import { toAbsoluteUrl } from "../../../functions/routers"
import { apiGet, catchErrors, apiOptions, apiDelete } from '../../../functions/api'
import { printResponseErrorAlert, waitAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import { FormSolicitudFactura } from '..'
class HistorialSolicitudes extends Component {

    state = {
        lead:'',
        solicitudes:[],
        modal:{
            factura:false
        },
        options:{
            clientes:[],
            estatusFactura:[],
            formasPago:[],
            metodosPago:[],
            tiposPago:[],
        },
    }
    
    componentDidMount = () => {
        const { lead } = this.props
        this.getLead(lead)
    }
    
    getLead = async ( lead )  => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${lead.id}/presupuesto/aceptado`, at).then((response) => {
            const { lead } = response.data
            this.getSolicitudes(lead)
            this.setState({ ...this.state, lead: lead })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }
    
    getSolicitudes = async ( lead )  => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${lead.id}/solicitud-factura`, at).then((response) => {
            const { solicitudes } = response.data
            this.setState({ ...this.state, solicitudes: solicitudes })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }
    
    async getOptionsAxios() {
        const { lead } = this.state
        const { at } = this.props
        waitAlert()
        apiOptions(`v3/leads/crm/${lead.id}/solicitud-factura`, at).then(
            (response) => {
                const { options } = this.state
                const { clientes, formasPago, metodosPago, estatusFactura, tiposPago } = response.data
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.estatusFactura = setOptions(estatusFactura, 'estatus', 'id')
                options.formasPago = setOptions(formasPago, 'nombre', 'id')
                options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                options.tiposPago = setOptions(tiposPago, 'tipo', 'id')
                Swal.close()
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    openModal = () => {
        this.getOptionsAxios()
        const { modal } = this.state
        modal.factura = true
        this.setState({ ...this.state, modal })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.factura = false
        this.setState({ ...this.state, modal  })
    }

    refresh = () => {
        const { lead } = this.props
        this.handleClose()
        this.getSolicitudes(lead)
    }

    deleteSolicitudAxios = async(id) => {
        waitAlert()
        const { at } = this.props
        const { lead } = this.state
        apiDelete(`v3/leads/crm/${lead.id}/solicitud-factura/${id}`, at).then(
            (response) => {
                doneAlert('Solicitud eliminada con éxito', () => { this.getSolicitudes(lead) } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    render() {
        const { modal, options, lead, solicitudes } = this.state
        const { at } = this.props
        return (
            <div>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">SOLICITUDES DE FACTURACIÓN</div>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-flex btn-light-info font-weight-bolder align-items-center px-2 py-1" onClick={() => { this.openModal() }} >
                                <span className="svg-icon svg-icon-md"><SVG src={toAbsoluteUrl('/images/svg/File.svg')} /></span><div>SOLICITAR FACTURA</div>
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className='pt-0'>
                        <div className="table-responsive">
                            <table className="table table-vertical-center table-solicitud-factura">
                                <thead>
                                    <tr className="text-center white-space-nowrap">
                                        <th></th>
                                        <th className="min-w-lg-225px">Emisor</th>
                                        <th className="min-w-lg-225px">Receptor</th>
                                        <th className="min-w-lg-200px">Detalle</th>
                                        <th className="min-w-lg-100px">Monto</th>
                                        <th>Tipo de pago</th>
                                        <th>Forma de pago</th>
                                        <th>Método de pago</th>
                                        <th className="min-w-xxl-100px">Estatus</th>
                                        <th> Cobrado  </th>
                                    </tr>
                                </thead>
                                <tbody className="table-tbody">
                                    {
                                        solicitudes.length === 0 ?
                                            <tr className="font-weight-light">
                                                <td className = 'text-center' colSpan = '9'>
                                                    No hay solicitudes de facturación
                                                </td>
                                            </tr>
                                        :
                                        solicitudes.map((solicitud, index) => {
                                            return(
                                                <tr className="font-weight-light" key = { index }>
                                                    <td className='text-center'>
                                                        <div className="btn btn-icon btn-sm btn-bg-white btn-text-info btn-hover-light-danger btn-circle"
                                                            onClick = { (e) => { e.preventDefault();
                                                                deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR LA SOLICITUD DE FACTURA?', 
                                                                    '¡NO PODRÁS REVERTIR ESTO!', 
                                                                    () => this.deleteSolicitudAxios(solicitud.id))
                                                                }} >
                                                            <i className="las la-trash-alt icon-xl " />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <span className="font-weight-bolder">RFC: </span> 
                                                            { solicitud.rfc_emisor }
                                                            <br />
                                                            <span className="font-weight-bolder white-space-nowrap">RAZÓN SOCIAL: </span> 
                                                            { solicitud.razon_social_emisor }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <span className="font-weight-bolder">RFC: </span> 
                                                            { solicitud.rfc_receptor }
                                                            <br />
                                                            <span className="font-weight-bolder white-space-nowrap">RAZÓN SOCIAL: </span> 
                                                            { solicitud.razon_social_receptor }
                                                        </div>
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.detalle }
                                                    </td>
                                                    <td className='text-center'>
                                                        { setMoneyText(solicitud.monto) }
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.tipo_pago ? solicitud.tipo_pago.tipo : 'Sin definir' }
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.forma_pago ? solicitud.forma_pago.nombre : 'Sin definir' }
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.metodo_pago ? solicitud.metodo_pago.nombre : 'Sin definir' }
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.estatus_factura ? solicitud.estatus_factura.estatus : 'Sin definir' }
                                                    </td>
                                                    <td className='text-center'>
                                                        { solicitud.hasVenta ? 'Cobrado' : 'Sin cobrar' }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' show = { modal.factura } title = 'Nueva solicitud de factura' handleClose = { this.handleClose } >
                    {
                        modal.factura ?
                            <FormSolicitudFactura options = { options } lead = { lead } at = { at } refresh = { this.refresh } />
                        : <></>
                    }
                </Modal>
            </div>
        )
    }
}

export default HistorialSolicitudes