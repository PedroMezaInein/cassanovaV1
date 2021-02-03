import { connect } from 'react-redux'
import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { PAGOS_COLUMNS, SOLICITUD_EGRESO_COLUMNS, URL_DEV } from '../../../constants'
import { renderToString } from 'react-dom/server'
import { setArrayTable, setDateTable, setMoneyTable, setTextTable } from '../../../functions/setters'

class Pagos extends Component{

    setPagos = pagos => {
        let aux = []
        let _aux = []
        pagos.map( ( pago ) => {
            _aux = []
            if(pago.presupuestos) {
                pago.presupuestos.map((presupuesto) => {
                    _aux.push({ name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url })
                    return false
                })
            }
            if (pago.pagos) {
                pago.pagos.map((_pago) => {
                    _aux.push({ name: 'Pago', text: _pago.name, url: _pago.url })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions( pago ),
                    identificador: renderToString(setTextTable(pago.id)),
                    fecha: renderToString(setDateTable(pago.created_at)),
                    proveedor: renderToString(pago.proveedor ? setTextTable(pago.proveedor.razon_social) : ''),
                    factura: '',
                    subarea: '',
                    monto: '',
                    comision: '',
                    total: '',
                    cuenta: '',
                    pago: '',
                    impuesto: '',
                    estatus: '',
                    id: pago.id
                }
            )
            return false
        })
        return aux
    }
    
    setActions = () => {
        const { user } = this.props.authUser
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }

    render () {
        return(
            <Layout active = 'mercadotecnia' { ...this.props }>
                <NewTableServerRender columns = { PAGOS_COLUMNS } title = 'Listado de pagos'
                    subtitle = 'Listado de pagos' mostrar_boton = { true } abrir_modal = { false }
                    url = '/mercadotecnia/pagos/add' mostrar_acciones = { true }
                    actions = {
                        {

                        }
                    }
                    cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody'
                    idTable = 'kt_table_pagos' accessToken = { this.props.authUser.access_token }
                    setter = { this.setPagos } urlRender = { `${URL_DEV}mercadotecnia/pagos` } />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Pagos)