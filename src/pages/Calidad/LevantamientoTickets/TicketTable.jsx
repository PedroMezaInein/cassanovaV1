import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, PROYECTOS_TICKETS } from '../../../constants'
import { setTextTable, setLabelTable, setTextTableCenter, setDateTableReactDom } from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { deleteAlert, doneAlert, printResponseErrorAlert, errorAlert, customInputAlert, waitAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import axios from 'axios'
import { printSwalHeader } from '../../../functions/printers'
import { CalendarDaySwal } from '../../../components/form-components'
import { Update } from '../../../components/Lottie'
import moment from 'moment'
import Swal from 'sweetalert2'
import $ from "jquery";
class TicketTable extends Component {
    state = {
        calidad: '',
        form: { fecha: new Date() }
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
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { history } = this.props
                history.push({ pathname: '/calidad/tickets/detalles-ticket', state: { calidad: {id: id} } });
            }
        }
    }

    openModalDelete = calidad => {
        deleteAlert('Borrarrás el ticket de calidad', '¿Deseas continuar?', () => { this.deleteTicketAxios(calidad) })
    }
    
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'fecha':
                form.fecha = new Date(moment(data.created_at))
                break;
            default:
                form[tipo] = data[tipo]
                break;
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className  = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'fecha' &&
                        <CalendarDaySwal value = { form.fecha } onChange = { (e) => {  this.onChangeSwal(e.target.value, 'fecha')} } 
                            name = 'fecha' date = { form.fecha } withformgroup={0} />
                }
            </div>,
            <Update />,
            () => { this.patchTickets(data, tipo) },
            () => { this.setState({...this.state,form: { fecha: new Date() }}); Swal.close(); },
        )
    }

    setCalidad = calidad => {
        let aux = []
        calidad.map((calidad) => {
            aux.push(
                {
                    actions: this.setActions(calidad),
                    identificador: renderToString(setTextTableCenter(calidad.identificador)),
                    estatus: renderToString(setLabelTable(calidad.estatus_ticket)),
                    proyectos: renderToString(setTextTable(calidad.proyecto ? calidad.proyecto.nombre : '', '190px')),
                    cliente: renderToString(setTextTableCenter(calidad.usuario ? calidad.usuario.name : '')),
                    tipo_trabajo: renderToString(setTextTableCenter(calidad.subarea ? calidad.subarea.nombre : '')),
                    fecha: setDateTableReactDom(calidad.created_at, this.doubleClick, calidad, 'fecha', 'text-center'),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    motivo: renderToString(setTextTable(calidad.motivo_cancelacion)),
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
            console.error(error, 'error')
        })
    }

    patchTickets = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/calidad/calidad/${tipo}/${data.id}`, 
            { value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getCalidadAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La empleado fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    changePageSee = calidad => {
        const { history } = this.props
        history.push({
            pathname: '/calidad/tickets/detalles-ticket',
            state: { calidad: calidad },
            formeditado: 1
        });
    }
    render() {
        return (
            <Layout active={'calidad'}  {...this.props}>
                <NewTableServerRender
                    columns={PROYECTOS_TICKETS}
                    title='Tickets'
                    subtitle='Listado de tickets levantados'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/calidad/tickets/nuevo-ticket'
                    mostrar_acciones = { true }
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

export default connect(mapStateToProps, mapDispatchToProps)(TicketTable);