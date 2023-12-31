import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { URL_DEV, SOLICITUD_FACTURA_COLUMNS } from '../../../constants'
import { setMoneyText, setTextTableCenter,setNaviIcon } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { apiDelete, catchErrors } from '../../../functions/api'
import $ from 'jquery'
import { Modal } from '../../../components/singles'
import { FiltersSolicitudFactura } from '../../../components/filters'
import { FormVentasSolicitudFactura } from '../../../components/forms'
import { DropdownButton, Dropdown } from 'react-bootstrap'


class SolicitudFactura extends Component {

    state = {
        modal: { filtros: false, venta: false },
        filters: {},
        solicitud: ''
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
            return <div className="text-center font-size-xs font-weight-bold text-fase3"><img src="/fase3.png" alt="fase3" className="img-responsive mb-1"/><div>FASE 3</div></div>
        }
        if(dato.hasLead){
            return <div className="text-center font-size-xs font-weight-bold text-fase1"><img src="/fase1.png" alt="fase1" className="img-responsive mb-1"/><div>FASE 1</div></div>
        }
        if(dato.hasPresupuesto){
            return <div className="text-center font-size-xs font-weight-bold text-fase2"><img src="/fase2.png" alt="fase2" className="img-responsive mb-1"/><div>FASE 2</div></div>
        }
        return setTextTableCenter('Sin definir')
    }

    setActions = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">  
            <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
               {
                    element.hasVenta === false ?                
                
                    <Dropdown.Item className="text-hover-success dropdown-success" 
                 onClick = { (e) => { e.preventDefault(); this.openModalVenta(element) } } >
                        {setNaviIcon('las la-sync icon-lg', 'convertir')}
                    </Dropdown.Item> : <></>
                }
                    <Dropdown.Item className="text-hover-danger dropdown-danger" 
                      onClick = { (e) => { 
                        e.preventDefault(); 
                        deleteAlert(
                            `Eliminarás la solicitud de facturación`,
                            `¿Deseas continuar?`,
                            () => { this.deleteSolicitud(element.id) }
                        )
                    } }>
                        {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

    reloadTable = (filter) => {
        $(`#solicitud-factura`).DataTable().search(JSON.stringify(filter)).draw();
    }

    openModalVenta = (solicitud) => {
        const { modal } = this.state
        modal.venta = true
        this.setState({ ...this.state, modal, solicitud: solicitud })
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({ ...this.state, modal })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.filtros = false
        modal.venta = false
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

    refresh = () => {
        const { filters, modal } = this.state
        modal.venta = false
        this.setState({ ...this.state, modal })
        this.reloadTable(filters)
    }

    render(){
        const { authUser: {access_token} } = this.props
        const { modal, filters, solicitud } = this.state
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
                <Modal size = 'xl' show = { modal.venta } handleClose = { this.handleClose } title = 'Generar venta'>
                    {
                        modal.venta ? 
                            <FormVentasSolicitudFactura solicitud = { solicitud } at = { access_token } refresh = { this.refresh } /> 
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