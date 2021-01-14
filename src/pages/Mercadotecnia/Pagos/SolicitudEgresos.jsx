import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, SOLICITUD_EGRESO_COLUMNS } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ModalDelete } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
const $ = require('jquery');
class SolicitudEgresos extends Component {
    state = {
        modalDelete: false,
        title: 'Nueva solicitud de egreso',
        solicitud: '',
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const solicitud = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!solicitud)
            history.push('/')
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {

                this.setState({
                    ...this.state,
                })
                this.getSolicitudEgresoAxios(id)
            }
        }
    }
    openModalDelete = solicitud => {
        this.setState({
            ...this.state,
            modalDelete: true,
            title: 'Nueva solicitud de egreso',
            solicitud: solicitud
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            solicitud: '',
        })
    }
    setSolicitudes = solicitudes => {
        let aux = []
        solicitudes.map((solicitud) => {
            aux.push(
                {
                    actions: this.setActions(solicitud),
                    empresa: renderToString(setTextTable(solicitud.empresa ? solicitud.empresa.name : '')),
                    proveedor: renderToString(setTextTable(solicitud.proveedor ? solicitud.proveedor.razon_social : '')),
                    factura: renderToString(setTextTable(solicitud.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(solicitud.monto)),
                    tipoPago: renderToString(setTextTable(solicitud.tipo_pago ? solicitud.tipo_pago.tipo : '')),
                    subarea: renderToString(setTextTable(solicitud.subarea ? solicitud.subarea.nombre : '')),
                    fecha: renderToString(setDateTable(solicitud.created_at)),
                    adjunto: solicitud.adjunto ? renderToString(setArrayTable([{ text: solicitud.adjunto.name, url: solicitud.adjunto.url }])) : renderToString(setTextTable('Sin adjuntos')),
                    descripcion: renderToString(setTextTable(solicitud.descripcion)),
                    id: solicitud.id
                }
            )
            return false
        })
        return aux
    }
    setActions = () => {
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
            }
        )
        return aux
    }
    changePageEdit = solicitud => {
        const { history } = this.props
        history.push({
            pathname: '/mercadotecnia/pagos/edit',
            state: { solicitud: solicitud }
        });
    }
    async getSolicitudesEgresoAxios() {
        $('#kt_datatable_solicitudes_egresos').DataTable().ajax.reload();
    }
    async getSolicitudEgresoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/single/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { solicitud } = response.data
                this.setState({
                    ...this.state,
                    solicitud: solicitud
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteSolicitudAxios() {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        await axios.delete(URL_DEV + 'solicitud_egresos/' + solicitud.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.')

                this.getSolicitudesEgresoAxios()

                this.setState({
                    ...this.state,
                    modalDelete: false,
                    title: 'Nueva solicitud de egreso',
                    solicitud: ''
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }    
    render() {
        const { modalDelete } = this.state
        return (
            <Layout active={'mercadotecnia'}  {...this.props}>
                <NewTableServerRender 
                    columns = { SOLICITUD_EGRESO_COLUMNS } 
                    title = 'Solicitudes de egreso' 
                    subtitle = 'Listado de solicitudes de egresos'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/mercadotecnia/pagos/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete }
                        }
                    }
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable = 'kt_datatable_solicitudes_egresos'
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setSolicitudes }
                    urlRender = { URL_DEV + 'mercadotecnia/pagos' }
                />
                <ModalDelete title={"¿Quieres eliminar la solicitud de egreso?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteSolicitudAxios() }}>
                </ModalDelete>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudEgresos);