import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { URL_DEV, PROYECTOS_TICKETS } from '../../../constants'
import { setTextTable, setLabelTable, setTextTableCenter, setMoneyTable, setDateTable, setOptions } from '../../../functions/setters'
import { deleteAlert, doneAlert, printResponseErrorAlert, errorAlert, waitAlert, pendingPaymentAlert } from '../../../functions/alert'
import { setSingleHeader } from '../../../functions/routers'
import axios from 'axios'
import $ from "jquery";
import Swal from 'sweetalert2'
import { NewTable } from '../../../components/NewTables';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Modal } from '../../../components/singles'
import { TickesFilter } from '../../../components/filters'
class TicketTable extends Component {
    state = {
        calidad: '',
        form: { fecha: new Date() },
        modal: { filtros: false },
        filters: {
            id: '',
            proyecto: '',
            estatus: '',
            fecha_solicitud: { start: null, end: null },
            fecha_termino: { start: null, end: null },
            tipo_trabajo: '',
            descripcion: '',
            estatus_pago: '',
            filtrado_fecha: '',
            solicito: '',
            por_pagar: false,
            pagado: false,
            check_solicitud: false,
            check_termino: false
        },
        options:{
            estatus: [],
            tiposTrabajo: [],
        }
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
            this.getOptionsAxios()
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
    getOptionsAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { estatus, tiposTrabajo } = response.data
                const { options, formularios, data} = this.state
                options.estatus = setOptions(estatus, 'estatus', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'nombre', 'id')
                this.setState({ ...this.state, options, data, formularios })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openModalDeleteTicket = calidad => {
        deleteAlert('¡BORRARÁS EL TICKET!', '¿DESEAS ELIMINARLO?', () => { this.deleteTicketAxios(calidad) })
    }
    
    setCalidad = calidad => {
        let aux = []
        calidad.map((calidad) => {
            aux.push(
                {
                    actions: this.setActionsMantenimientos(calidad),
                    identificador: renderToString(setTextTableCenter(calidad.identificador)),
                    estatus: renderToString(setLabelTable(calidad.estatus)),
                    proyectos: renderToString(setTextTable(calidad.proyecto ? calidad.proyecto.nombre : '', '190px')),
                    solicito: renderToString(setTextTableCenter(calidad.solicito)),
                    tipo_trabajo: renderToString(setTextTableCenter(calidad.tipo ? calidad.tipo.nombre : '')),
                    fecha: renderToString(setDateTable(calidad.created_at)),
                    fecha_termino:  renderToString(setDateTable(calidad.fecha_programada)),
                    costo_presupuesto:  renderToString( calidad.presupuesto_preeliminar ? setMoneyTable(calidad.presupuesto_preeliminar.totalPresupuesto) : setTextTableCenter('-')),
                    monto_pagado:  renderToString(setMoneyTable(calidad.totalVentas)),
                    descripcion: renderToString(setTextTable(calidad.descripcion)),
                    motivo: renderToString(setTextTable(calidad.motivo_cancelacion)),
                    id: calidad.id
                }
            )
            return false
        })
        return aux
    }
    setActionsMantenimientos = (calidad) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Ver ticket</span></Tooltip> } >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-primary btn-hover-primary`} 
                        onClick = { (e) => { e.preventDefault(); this.changePageSee(calidad) } }>
                        <i className = 'fas flaticon2-magnifier-tool' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay = { <Tooltip><span className="font-weight-bold">Eliminar</span></Tooltip> } >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger`} 
                        onClick = { (e) => { e.preventDefault(); this.openModalDeleteTicket(calidad) } }>
                        <i className = 'flaticon2-rubbish-bin' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }
    async getCalidadAxios() {
        $('#tickets').DataTable().search({}).draw();
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
    changePageSee = calidad => {
        const { history } = this.props
        history.push({
            pathname: '/calidad/tickets/detalles-ticket',
            state: { calidad: calidad },
            formeditado: 1
        });
    }

    async exportTicketsAxios(){
        const { access_token } = this.props.authUser
        const { filters } = this.state
        let filtros = JSON.stringify(filters)
        await axios.post(`${URL_DEV}v2/exportar/calidad/calidad`, { 'search': filtros }, { responseType:'blob', headers: setSingleHeader(access_token)}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'tickets.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Tickets exportados con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({...this.state, modal})
    }

    handleCloseFiltros = () => {
        const { modal } = this.state
        modal.filtros = false
        this.setState({...this.state, modal, filters : this.clearFilters()})
    }
    clearFiltros = (e) => {
        e.preventDefault()
        const { modal } = this.state
        modal.filtros = false
        this.setState({...this.state, modal, filters : this.clearFilters()})
        this.getCalidadAxios();
    }

    clearFilters = () => {
        const { filters } = this.state
        let aux = Object.keys(filters)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha_solicitud':
                case 'fecha_termino':
                    filters[element] =  { start: null, end: null }
                    break;
                case 'por_pagar':
                case 'pagado':
                case 'check_solicitud':
                case 'check_termino':
                    filters[element] = false
                    break;
                case 'estatus':
                case 'tipo_trabajo':
                    filters[element] = []
                    break;
                default:
                    filters[element] = ''
                    break;
            }
        })
        return filters;
    }
    onSubmitFilters = (e) => {
        e.preventDefault()
        const { filters, modal } = this.state
        modal.filtros = false
        this.setState({...this.state, modal})
        $('#tickets').DataTable().search( JSON.stringify(filters) ).draw();
    }
    onChangeFilter = e => {
        const { name, value, type, checked } = e.target
        const { filters } = this.state
        filters[name] = value
        if (type === 'checkbox'){
            switch(name){
                case 'pagado':
                    filters.pagado = checked
                    filters.por_pagar = false
                    filters.estatus_pago = 'Pagado'
                    break;
                case 'por_pagar':
                    filters.pagado = false
                    filters.por_pagar = checked
                    filters.estatus_pago = 'Por pagar'
                    break;
                case 'check_solicitud':
                    filters.check_solicitud = checked
                    filters.check_termino = false
                    filters.fecha_termino = { start: null, end: null }
                    break;
                case 'check_termino':
                    filters.check_termino = checked
                    filters.check_solicitud = false
                    filters.fecha_solicitud = { start: null, end: null }
                    break;
                default:
                    break;
            }
            if( filters.pagado === false &&  filters.por_pagar === false){
                filters.estatus_pago = ''
            }
        }
        this.setState({...this.state, filters})
    }
    pendingPaymentClick = () => {
        let pendiente_pago = 1234
        pendingPaymentAlert('PENDIENTE DE PAGO', pendiente_pago)
    }
    render() {
        const { modal, filters, options } = this.state
        return (
            <Layout active={'calidad'}  {...this.props}>
                <NewTable tableName = 'tickets' subtitle = 'Listado de tickets' title = 'Tickets' mostrar_boton = { true } abrir_modal = { false }
                    url = '/calidad/tickets/nuevo-ticket' columns = { PROYECTOS_TICKETS } accessToken = { this.props.authUser.access_token } 
                    setter = { this.setCalidad } urlRender={`${URL_DEV}v3/calidad/tickets`} filterClick = { this.openModalFiltros } exportar_boton = { true } 
                    onClickExport = { () => this.exportTicketsAxios() } pendingPaymentClick = { this.pendingPaymentClick}
                />
                <Modal size = 'lg' title = 'Filtros' show = { modal.filtros } handleClose = { this.handleCloseFiltros }>
                    <TickesFilter filters = { filters } clearFiltros = { this.clearFiltros } onSubmitFilters = { this.onSubmitFilters } onChangeFilter={ this.onChangeFilter } options={options}/>
                </Modal>
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