import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { URL_DEV } from '../../../constants'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Modal } from '../../../components/singles'
import { CALENDARIO_PAGOS_ADMIN } from '../../../constants'
import esLocale from '@fullcalendar/core/locales/es'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import interactionPlugin from '@fullcalendar/interaction'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { CalendarioPagosForm } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, catchErrors } from '../../../functions/api'
import FiltersCalendarioPagos  from '../../../components/filters/administracion/FiltersCalendarioPagos'
import { setMoneyTable, setOptionsWithLabel, setDateTable, setTextTable } from '../../../functions/setters'
import { printResponseErrorAlert, doneAlert, deleteAlert } from '../../../functions/alert'
class CalendarioPagos extends Component {
    state = {
        events: [],
        title:'',
        modal: { form:false, filtros: false },
        filters: {},
        options:{ proveedores:[] },
        pago: [],
        activeKey: 'calendario'
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const calendario = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!calendario)
            history.push('/')
        this.getOptionsAxios()
        this.getCalendarioPagos()
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        apiOptions(`v1/proyectos/instalacion-equipos`, access_token).then(
            (response) => {
                const { proyectos } = response.data
                const { options } = this.state
                options.proveedores = setOptionsWithLabel(proyectos, 'nombre', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getCalendarioPagos = async () => {
        const { access_token } = this.props.authUser
        apiGet(`v1/proyectos/instalacion-equipos`, access_token).then(
            (response) => {
                const { instalaciones } = response.data
                let aux = []
                instalaciones.forEach((instalacion) => {
                    aux.push({
                        title: instalacion.equipo.equipo,
                        start: instalacion.fecha,
                        end: instalacion.fecha,
                        instalacion: instalacion,
                        iconClass: 'la la-toolbox'
                    })
                })
                this.setState({ ...this.state, events: aux })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    renderEventContent = (eventInfo) => {
        return (
            <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>{eventInfo.event.title}</span> - {eventInfo.event._def.extendedProps.instalacion.proyecto.nombre}</Tooltip>}>
                <div className="text-hover container p-1 tarea bg-calendar-3">
                        <div className="row mx-0 row-paddingless">
                            <div className="col-md-auto mr-1 text-truncate">
                                <i className={`${eventInfo.event._def.extendedProps.iconClass} font-size-17px px-1 text-white`}></i>
                            </div>
                            <div className="col align-self-center text-truncate">
                                <span className="text-white font-weight-bold font-size-12px">{eventInfo.event.title} - {eventInfo.event._def.extendedProps.instalacion.proyecto.nombre}</span>
                            </div>
                        </div>
                    </div>
            </OverlayTrigger>
        )
    }

    openModal = (element, type) => {
        const { modal } = this.state
        let { title } = this.state
        modal.form = true
        if(type === 'edit'){
            title= 'Editar registro de pago'
        } else {
            title= 'Agregar nuevo pago'
        }
        this.setState({
            modal,
            title,
            formeditado: 0,
            pago:element
        })
    }
    
    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        modal.filtros = false
        this.setState({
            modal,
            title: ''
        })
    }

    openModalFiltros = () => {
        const { modal } = this.state
        modal.filtros = true
        this.setState({
            ...this.state,
            modal,
            title:'Filtros'
        })
    }

    deletePagoAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiDelete(`v1/proyectos/instalacion-equipos/mantenimientos/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Pago eliminado con éxito.`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    openModalDeletePago = pago => {
        deleteAlert('¿DESEAS ELIMINAR EL PAGO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deletePagoAxios(pago.id), 'Eliminar pago')
    }

    changeActive = value => { 
        if(value === 'tabla'){
            const { filters } = this.state
            this.reloadTable(filters)
        }
        this.setState({...this.state, activeKey: value}) 
    }

    setListPagos = pagos => {
        let aux = []
        pagos.forEach((pago) => {
            aux.push({
                actions: this.setActionsListPagos(pago),
                proveedor: setTextTable(pago.instalacion.proyecto.nombre),
                nombre: setTextTable(pago.instalacion.equipo.equipo),
                periodo: setTextTable(pago.instalacion.equipo.equipo),
                monto: setMoneyTable(pago.costo),
                fecha: setDateTable(pago.fecha)
            })
        })
        return aux
    }

    setActionsListPagos = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                <OverlayTrigger rootClose overlay={<Tooltip><span className="font-weight-bold">Editar</span></Tooltip>} >
                    <button className='btn btn-icon btn-actions-table btn-sm ml-2 btn-text-success btn-hover-success'
                        onClick={(e) => { e.preventDefault(); this.openModal(element, 'edit') }}>
                        <i className='las la-pen icon-lg' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay = { <Tooltip>Eliminar</Tooltip> }  >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger`} 
                        onClick = { (e) => { e.preventDefault(); this.openModalDeletePago(element) } }>
                        <i className = 'flaticon2-rubbish-bin' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }

    reloadTable = (filter) => {
        $(`#calendario-pagos`).DataTable().search(JSON.stringify(filter)).draw();
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
        modal.form = false
        this.setState({ ...this.state, modal })
        this.reloadTable(filters)
    }

    render() {
        const { events, title, modal, options, activeKey, filters, pago } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'administracion' {...this.props}>
                <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                    {
                        activeKey === 'calendario' ?
                            <OverlayTrigger rootClose overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR TABLA</span></Tooltip>}>
                                <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.changeActive('tabla') }} >
                                    <span className="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
                                        <i className="la flaticon2-list-2 icon-xl"></i>
                                    </span>
                                </li>
                            </OverlayTrigger>
                        : 
                            <OverlayTrigger rootClose overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR CALENDARIO</span></Tooltip>}>
                                <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.changeActive('calendario') }}>
                                    <span className="btn btn-sm btn-icon btn-bg-light btn-text-info btn-hover-info" >
                                        <i className="la flaticon2-calendar-8 icon-xl"></i>
                                    </span>
                                </li>
                            </OverlayTrigger>
                    }            
                </ul>
                {
                    activeKey === 'calendario' ?
                        <Card className="card-custom">
                            <Card.Header>
                                <div className="card-title">
                                    <span className="font-weight-bolder text-dark font-size-h3">Calendario de pagos</span>
                                </div>
                                <div className="card-toolbar">
                                    <span className="btn btn-success font-weight-bold" onClick={this.openModal}>
                                        <i className="flaticon-add"></i> AGREGAR
                                    </span>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                                    initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                                    firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                            </Card.Body>
                        </Card>
                    : 
                        <NewTable tableName = 'calendario-pagos' subtitle = 'Listado de pagos' title = 'Pagos' abrirModal = { true } 
                            onClick = { this.openModal } columns = { CALENDARIO_PAGOS_ADMIN } accessToken = { access_token } setter = { this.setListPagos } 
                            urlRender = {`${URL_DEV}v1/proyectos/instalacion-equipos/mantenimientos`} filterClick = { this.openModalFiltros } />
                }
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    {
                        modal.form ? 
                            <CalendarioPagosForm title = { title } at = { access_token } refresh = { this.refresh } pago={pago} options = { options }/> 
                        : <></>
                    }
                </Modal>
                <Modal size = 'lg' title = {title} show = { modal.filtros } handleClose = { this.handleClose } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <FiltersCalendarioPagos  at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options = { options }/>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioPagos)
