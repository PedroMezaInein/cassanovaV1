import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { URL_DEV, SOLICITUD_FACTURA_COLUMNS } from '../../../constants'
import { setMoneyText, setTextTableCenter } from '../../../functions/setters'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { apiDelete, catchErrors } from '../../../functions/api'
import $ from 'jquery'
import { Modal } from '../../../components/singles'
import { FiltersSolicitudFactura } from '../../../components/filters'

class SolicitudFactura extends Component {

    state = {
        modal: { filtros: false },
        filters: {}
    }

    deleteSolicitud = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiDelete(`v1/administracion/solicitud-factura/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Solicitud eliminada con éxito`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    setTable = (datos) => {
        let aux = []
        datos.forEach((dato) => {
            aux.push({
                actions: this.setActions(dato),
                emisor: <div className="font-size-11px">
                        <span className="white-space-nowrap">
                            <b>RFC: </b>{ dato.rfc_emisor }
                        </span>
                        <br />
                        <span>
                            <b>Razón social: </b>{ dato.razon_social_emisor }
                        </span>
                    </div>,
                receptor: <div className="font-size-11px">
                        <span className="white-space-nowrap">
                            <b>RFC: </b>{ dato.rfc_receptor }
                        </span>
                        <br />
                        <span>
                            <b>Razón social: </b>{ dato.razon_social_receptor }
                        </span>
                    </div>,
                detalle: setTextTableCenter(dato.detalle),
                monto:<div className="font-size-11px text-center">{setMoneyText(dato.monto)}</div>,
                tipoPago: setTextTableCenter(dato.tipo_pago ? dato.tipo_pago.tipo : 'Sin definir'),
                formaPago: setTextTableCenter(dato.forma_pago ? dato.forma_pago.nombre : 'Sin definir'),
                metodoPago: setTextTableCenter(dato.metodo_pago ? dato.metodo_pago.nombre : 'Sin definir'),
                estatusFactura: setTextTableCenter(dato.estatus_factura ? dato.estatus_factura.estatus : 'Sin definir'),
                origen: this.printOrigen(dato)
            })
        })
        return aux
    }

    printOrigen = (dato) => {
        if(dato.hasTicket){
            return setTextTableCenter('Fase 3')
        }
        if(dato.hasLead){
            return setTextTableCenter('Fase 1')
        }
        if(dato.hasPresupuesto){
            return setTextTableCenter('Fase 2')
        }
        return setTextTableCenter('Sin definir')
    }

    setActions = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                {
                    element.hasVenta === false ?
                        <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Convertir</span></Tooltip> } >
                            <button className = 'btn btn-icon btn-actions-table btn-sm ml-2 btn-text-success btn-hover-success'
                                onClick = { (e) => { e.preventDefault(); this.changePageSee(element) } }>
                                <i className = 'las la-sync icon-lg' />
                            </button>
                        </OverlayTrigger>
                    : <></>
                }
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Eliminar</span></Tooltip> } >
                    <button className = 'btn btn-icon btn-actions-table btn-sm ml-2 btn-text-danger btn-hover-danger'
                        onClick = { (e) => { 
                            e.preventDefault(); 
                            deleteAlert(
                                `Eliminarás la solicitud de facturación`,
                                `¿Deseas continuar?`,
                                () => { this.deleteSolicitud(element.id) }
                            )
                        } }>
                        <i className = 'las la-trash icon-lg' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }

    reloadTable = (filter) => {
        $(`#solicitud-factura`).DataTable().search(JSON.stringify(filter)).draw();
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({ ...this.state, modal })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({ ...this.state, modal })
    }

    sendFilters = filtro => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({
            ...this.state,
            filters: filtro,
            modal
        })
        this.reloadTable(filtro)
    }

    render(){
        const { authUser: {access_token} } = this.props
        const { modal, filters } = this.state
        return(
            <Layout active = 'administracion' { ...this.props } >
                <NewTable tableName = 'solicitud-factura' subtitle = 'Listado de solicitudes de facturas' title = 'Solicitudes de facturas' 
                    url='' accessToken = { access_token } columns = { SOLICITUD_FACTURA_COLUMNS } setter = { this.setTable } 
                    urlRender = {`${URL_DEV}v1/administracion/solicitud-factura`}  filterClick = { this.openModalFiltros } hideNew = { true }/>
                <Modal size = 'lg' show = { modal.filtros } handleClose = { this.handleClose } title = 'Filtros'>
                    {   
                        modal.filtros ? 
                            <FiltersSolicitudFactura at = { access_token } sendFilters = { this.sendFilters } filters = { filters } /> 
                        : <></> 
                    }
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudFactura);