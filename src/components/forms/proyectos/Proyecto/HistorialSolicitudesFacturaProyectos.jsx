import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { setMoneyText } from '../../../../functions/setters'
import { setSingleHeader } from '../../../../functions/routers'
import { printResponseErrorAlert, waitAlert, doneAlert, deleteAlert, errorAlert } from '../../../../functions/alert'
class HistorialSolicitudesFacturaProyectos extends Component {

    state = {
        lead: '',
        solicitudes: []
    }

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
        const { at, proyecto } = this.props
        await axios.delete(`v3/proyectos/proyectos/${proyecto.id}/solicitud-factura/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { getPresupuestos } = this.props
                doneAlert(`Solicitud eliminada con éxito`,  () => { getPresupuestos() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { modal, lead, solicitudes } = this.state
        return (
            <div>

                <div className="table-responsive">
                    <table className="table table-vertical-center table-solicitud-factura">
                        <thead>
                            <tr className="text-center white-space-nowrap">
                                <th></th>
                                <th>Receptor</th>
                                <th>Detalle</th>
                                <th>Datos del pago</th>
                                <th> Cobrado  </th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {
                                solicitudes.length === 0 ?
                                    <tr className="font-weight-light">
                                        <td className='text-center' colSpan='9'>
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
                                                <td className='text-center'>
                                                    {solicitud.detalle}
                                                </td>
                                                <td className='text-center'>
                                                    <div>
                                                        <span className="font-weight-bolder">Monto: </span>{setMoneyText(solicitud.monto)}
                                                        <br />
                                                        <span className="font-weight-bolder white-space-nowrap">Tipo de pago: </span>{solicitud.tipo_pago ? solicitud.tipo_pago.tipo : 'Sin definir'}
                                                        <br />
                                                        <span className="font-weight-bolder white-space-nowrap">Estatus de factura: </span>{solicitud.estatus_factura ? solicitud.estatus_factura.estatus : 'Sin definir'}
                                                    </div>
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
            </div>
        )
    }
}

export default HistorialSolicitudesFacturaProyectos