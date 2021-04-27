import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, PROYECTOS_TICKETS } from '../../constants'
import { setTextTable, setDateTable, setLabelTable, setTextTableCenter } from '../../functions/setters'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { deleteAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../functions/alert'
import { setSingleHeader } from '../../functions/routers'
import axios from 'axios'
const $ = require('jquery');
class Calidad extends Component {
    state = {
        calidad: ''
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
    }
    changePageSee = calidad => {
        const { history } = this.props
        history.push({
            pathname: '/calidad/calidad/see',
            state: { calidad: calidad },
            formeditado: 1
        });
    }

    openModalDelete = calidad => {
        deleteAlert('Borrarrás el ticket de calidad', '¿Deseas continuar?', () => { this.deleteTicketAxios(calidad) })
    }

    setCalidad = calidad => {
        let aux = []
        calidad.map((calidad) => {
            aux.push(
                {
                    actions: this.setActions(calidad),
                    estatus: renderToString(setLabelTable(calidad.estatus_ticket)),
                    proyectos: renderToString(setTextTableCenter(calidad.proyecto ? calidad.proyecto.nombre : '', '190px')),
                    cliente: renderToString(setTextTableCenter(calidad.usuario ? calidad.usuario.name : '')),
                    tipo_trabajo: renderToString(setTextTableCenter(calidad.tipo_trabajo ? calidad.tipo_trabajo.tipo : '')),
                    fecha: renderToString(setDateTable(calidad.created_at)),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    motivo: renderToString(setTextTableCenter(calidad.motivo_cancelacion)),
                    id: calidad.id
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
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'success' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
        )
        return aux
    }
    async getCalidadAxios() {
        $('#kt_datatable_calidad').DataTable().ajax.reload();
    }

    deleteTicketAxios = async(ticket) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}calidad/${ticket.id}`, { headers: setSingleHeader(access_token)  }).then(
            (response) => {
                this.getCalidadAxios();
                doneAlert('Ticket eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        return (
            <Layout active={'calidad'}  {...this.props}>
                <NewTableServerRender
                    columns={PROYECTOS_TICKETS}
                    title='Calidad'
                    subtitle='Listado de tickets levantados'
                    mostrar_boton={false}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'see': { function: this.changePageSee },
                        'delete': { function: this.openModalDelete },
                    }}
                    idTable='kt_datatable_calidad'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setCalidad}
                    urlRender={URL_DEV + 'calidad'}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Calidad);