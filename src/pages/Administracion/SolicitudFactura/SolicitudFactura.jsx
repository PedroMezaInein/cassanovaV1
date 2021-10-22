import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { URL_DEV, SOLICITUD_FACTURA_COLUMNS } from '../../../constants'
import { setMoneyText, setTextTableCenter } from '../../../functions/setters'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class SolicitudFactura extends Component {

    setTable = (datos) => {
        let aux = []
        datos.forEach((dato) => {
            aux.push({
                actions: this.setActions(dato),
                emisor: <div>
                        <span>
                            <b>RFC: </b>{ dato.rfc_emisor }
                        </span>
                        <br />
                        <span>
                            <b>Razón social: </b>{ dato.razon_social_emisor }
                        </span>
                    </div>,
                receptor: <div>
                        <span>
                            <b>RFC: </b>{ dato.rfc_receptor }
                        </span>
                        <br />
                        <span>
                            <b>Razón social: </b>{ dato.razon_social_receptor }
                        </span>
                    </div>,
                detalle: setTextTableCenter(dato.detalle),
                monto: setMoneyText(dato.monto),
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
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Ver proyecto</span></Tooltip> } >
                    <button className = 'btn btn-icon btn-actions-table btn-xs ml-2 btn-text-primary btn-hover-primary'
                        onClick = { (e) => { e.preventDefault(); this.changePageSee(element) } }>
                        <i className = 'far fa-eye' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }

    render(){
        const { authUser: {access_token} } = this.props
        return(
            <Layout active = 'administracion' { ...this.props } >
                <NewTable tableName = 'solicitud-factura' subtitle = 'Listado de solicitudes de facturas' title = 'Solicitudes de facturas' 
                    url='' accessToken = { access_token } columns = { SOLICITUD_FACTURA_COLUMNS } setter = { this.setTable } 
                    urlRender = {`${URL_DEV}v1/administracion/solicitud-factura`}  filterClick = { this.openModalFiltros } />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudFactura);