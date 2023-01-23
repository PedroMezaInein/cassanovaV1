import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import SVG from 'react-inlinesvg'
import Modal from '../../../singles/Modal'
import { FormSolicitudFactura } from '../..'
import { URL_DEV } from '../../../../constants'
import { apiDelete, catchErrors } from '../../../../functions/api'
import { setMoneyText, setOptions } from '../../../../functions/setters'
import { setSingleHeader, toAbsoluteUrl } from '../../../../functions/routers'
import { printResponseErrorAlert, waitAlert, doneAlert, deleteAlert, errorAlert } from '../../../../functions/alert'
class HistorialSolicitudesFacturaProyectos extends Component {

    state = {
        solicitudes: [],
        modal: {
            factura: false
        },
        options: {
            clientes: [],
            estatusFactura: [],
            formasPago: [],
            metodosPago: [],
            tiposPago: [],
        },
        pdf_solicitud: []
    }
    // GET SOLICITUDES
    componentDidMount = () => {
        const { proyecto, presupuesto } = this.props
        this.getSolicitudes(proyecto, presupuesto)
    }

    getSolicitudes = async (proyecto, presupuesto) => {
        const { at } = this.props
        await axios.get(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/solicitud-factura/${presupuesto.id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { solicitudes } = response.data
                this.setState({ ...this.state, solicitudes: solicitudes })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteSolicitudAxios = async (id) => {
        waitAlert()
        const { at, proyecto, getPresupuestos, presupuesto } = this.props
        apiDelete(`v3/proyectos/proyectos/${proyecto.id}/solicitud-factura/${id}`, at).then(
            (response) => {
                doneAlert('Solicitud eliminada con éxito', () => { getPresupuestos() } )
                this.getSolicitudes(proyecto, presupuesto)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    // MODAL SOLICITUD DE FACTURAS

    async getOptionsAxios() {
        const { proyecto, at } = this.props
        waitAlert()
        await axios.options(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/solicitud-factura`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { options } = this.state
                const { clientes, formasPago, metodosPago, estatusFactura, tiposPago } = response.data
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.estatusFactura = setOptions(estatusFactura, 'estatus', 'id')
                options.formasPago = setOptions(formasPago, 'nombre', 'id')
                options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                options.tiposPago = setOptions(tiposPago, 'tipo', 'id')
                Swal.close()
                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openModal = (pdf) => {
        this.getOptionsAxios()
        const { modal } = this.state
        modal.factura = true
        this.setState({ ...this.state, modal, pdf_solicitud: pdf })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.factura = false
        this.setState({ ...this.state, modal })
    }
    refresh = () => {
        const { getPresupuestos, proyecto, presupuesto } = this.props
        this.handleClose()
        getPresupuestos()
        this.getSolicitudes(proyecto, presupuesto)
    }
    render() {
        const { solicitudes, modal, options, pdf_solicitud } = this.state
        const { presupuesto_aceptado, proyecto, presupuesto, at } = this.props
        return (
            <>
                <div className="d-flex justify-content-end mb-8">
                    <span className="d-flex align-items-center bg-light-success rounded p-1 cursor-pointer" onClick={() => { this.openModal(presupuesto_aceptado[0]) }}>
                        <span className="svg-icon svg-icon-success mr-1">
                            <span className="svg-icon svg-icon-md">
                                <SVG src={toAbsoluteUrl('/images/svg/Plus.svg')} />
                            </span>
                        </span>
                        <div className="d-flex font-weight-bolder text-success font-size-sm">
                            AGREGAR SOLICITUD DE FACTURA
                        </div>
                    </span>
                </div>
                <div className="table-responsive">
                    <table className='table table-vertical-center table-layout-fixed'>
                        <thead>
                            <tr>
                                <th className="w-8"></th>
                                <th className="text-align-last-left">Receptor</th>
                                <th className="text-align-last-left">Datos del pago</th>
                                <th>Detalle</th>
                                <th className="w-12">Cobrado</th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {
                                solicitudes.length === 0 ?
                                    <tr className="font-weight-light">
                                        <td className='text-center' colSpan='5'>
                                            No hay solicitudes de facturación
                                        </td>
                                    </tr>
                                    :
                                    solicitudes.map((solicitud, index) => {
                                        return (
                                            <tr className="font-weight-light" key={index}>
                                                <td className='text-center'>
                                                    <div className="btn btn-icon btn-sm btn-bg-white btn-text-info btn-hover-light-danger btn-circle"
                                                        onClick={(e) => {
                                                            e.preventDefault();
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
                                                        {solicitud.rfc_receptor}
                                                        <br />
                                                        <span className="font-weight-bolder white-space-nowrap">RAZÓN SOCIAL: </span>
                                                        {solicitud.razon_social_receptor}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="font-weight-bolder">Monto: </span>{setMoneyText(solicitud.monto)}
                                                        <br />
                                                        <span className="font-weight-bolder white-space-nowrap">Tipo de pago: </span>{solicitud.tipo_pago ? solicitud.tipo_pago.tipo : 'Sin definir'}
                                                        <br />
                                                        <span className="font-weight-bolder white-space-nowrap">Estatus de factura: </span>{solicitud.estatus_factura ? solicitud.estatus_factura.estatus : 'Sin definir'}
                                                    </div>
                                                </td>
                                                <td className='text-center'>
                                                    {solicitud.detalle}
                                                </td>
                                                <td className='text-center'>
                                                    {solicitud.hasVenta ? 'Cobrado' : 'Sin cobrar'}
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </table>
                </div>
                <Modal size='xl' show={modal.factura} title='1' handleClose={this.handleClose} >
                    {
                        modal.factura ?
                            <FormSolicitudFactura options={options} presupuesto={presupuesto} at={at} refresh={this.refresh} pdf_solicitud={pdf_solicitud} proyecto={proyecto} handleClose={this.handleClose} />
                            : <></>
                    }
                </Modal>
            </>
        )
    }
}

export default HistorialSolicitudesFacturaProyectos