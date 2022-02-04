import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { URL_DEV } from '../../../constants'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Modal } from '../../../components/singles'
import esLocale from '@fullcalendar/core/locales/es'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import interactionPlugin from '@fullcalendar/interaction'
import { CALENDARIO_PAGOS_ADMIN } from '../../../constants'
import { PaymentFailedError } from '../../../assets/animate'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { CalendarioPagosForm, EgresosCalendarioPagos } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors } from '../../../functions/api'
import FiltersCalendarioPagos  from '../../../components/filters/administracion/FiltersCalendarioPagos'
import { setMoneyTable, setOptionsWithLabel, setDateTable, setTextTableCenter } from '../../../functions/setters'
import { printResponseErrorAlert, doneAlert, deleteAlert, questionAlertWithLottie } from '../../../functions/alert'
import moment from 'moment'
class CalendarioPagos extends Component {
    state = {
        events: null,
        title:'',
        modal: { form:false, filtros: false, details:false },
        filters: {},
        options:{ proveedores:[], areas:[], subareas:[] },
        pago: [],
        activeKey: 'calendario',
        pagos: [],
        pagoInfo:[]
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
        
        const { state } = this.props.location
        if(state){
            if(state.pago){
                if(state.flag){
                    if(state.flag === 'egreso'){
                        this.getPagoInfo(state.pago, 'state')
                    }
                }
            }
        }
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        apiOptions(`v1/administracion/pago`, access_token).then(
            (response) => {
                const { proveedores, areas } = response.data
                const { options } = this.state
                options.proveedores = setOptionsWithLabel(proveedores, 'nombre', 'id')
                options.areas = setOptionsWithLabel(areas, 'nombre', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getCalendarioPagos = async () => {
        const { access_token } = this.props.authUser
        apiGet(`v1/administracion/pago`, access_token).then(
            (response) => {
                const { pagos } = response.data
                const { modal } = this.state
                let { title } = this.state
                let queryString = this.props.history.location.search
                let pago = null
                if (queryString) {
                    let params = new URLSearchParams(queryString)
                    let id = parseInt(params.get("id"))
                    if (id) {
                        modal.details = true
                        pago = pagos.find((element) => {
                            return element.id === id
                        })
                        if(pago){
                            title = `Pago de ${pago.servicio}`
                        }
                    }
                }
                this.setState({ ...this.state, pagos: pagos, title, modal, pagoInfo: pago })
                let date = new Date(), y = date.getFullYear(), m = date.getMonth()
                let firstDay = new Date(y, m, 1);
                let lastDay = new Date(y, m + 1, 0);
                this.getPagosAsEvents(pagos, firstDay, lastDay)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    deletePagoAxios = async (id) => {
        const { access_token } = this.props.authUser
        apiDelete(`v1/administracion/pago/${id}`, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Pago eliminado con éxito.`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    deactivatePaymentAxios = async (id) => {
        let active = 0
        const { access_token } = this.props.authUser
        apiPutForm(`v1/administracion/pago/activar/${id}`, { active: active }, access_token).then(
            (response) => {
                const { filters } = this.state
                doneAlert(`Pago desactivado con éxito.`, () => { this.reloadTable(filters) })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getColors = (elemento, fecha) => {
        let time = new Date(fecha)
        time.setHours(0,0,0,0)
        time = time.getTime()

        let item = null
        if(elemento){
            item = elemento.egresosDate.find((date) => {
                let elementDate = new Date(date)
                elementDate.setHours(0,0,0,0)
                elementDate = elementDate.getTime()
                return elementDate === time
            })
            if(item){
                return 'bg-calendar-2'
            }
        }
        return 'bg-calendar-1'
    }

    getPagosAsEvents = (pagos, fInicio, fFin) => {
        fFin.setDate( fFin.getDate() + 14 )
        fInicio.setDate( fInicio.getDate() - 14 )
        let aux = []
        let fechaAux = null
        let colores = {}
        pagos.forEach((element) => {
            let fechaInicioPago = new Date( moment( element.fecha_inicio ) )

            let conteo = 0;

            if (fechaInicioPago <= fFin) {

                let fecha = fechaInicioPago
                while (fecha <= fFin) {
                    switch (element.periodo) {
                        case 'semanal':
                            fecha.setDate(fecha.getDate() + 7)
                            fechaAux = new Date(
                                fecha.getFullYear(),
                                fecha.getMonth(),
                                fecha.getDate()
                            )
                            if (fecha >= fInicio && fecha <= fFin) {
                                colores = this.getColors(element, fecha)
                                aux.push({
                                    title: element.servicio,
                                    start: fechaAux,
                                    end: fechaAux,
                                    iconClass: 'la la-wallet',
                                    pago: element,
                                    backgroundColor: colores
                                })
                            }
                            break;
                        case 'quincenal':
                            switch (element.dia) {
                                case 1:
                                    if (fecha >= fInicio && fecha <= fFin) {
                                        fechaAux = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth(),
                                            fecha.getDate()
                                        )
                                        colores = this.getColors(element, fecha)
                                        aux.push({
                                            title: element.servicio,
                                            start: fechaAux,
                                            end: fechaAux,
                                            iconClass: 'la la-wallet',
                                            pago: element,
                                            backgroundColor: colores
                                        })
                                    }
                                    if (fecha.getDate() === 1) {
                                        fecha = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth(),
                                            16
                                        )
                                    } else {
                                        fecha = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth() + 1,
                                            1
                                        )
                                    }
                                    break;
                                case 15:
                                    if (fecha >= fInicio && fecha <= fFin) {
                                        fechaAux = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth(),
                                            fecha.getDate()
                                        )
                                        colores = this.getColors(element, fecha)
                                        aux.push({
                                            title: element.servicio,
                                            start: fechaAux,
                                            end: fechaAux,
                                            iconClass: 'la la-wallet',
                                            pago: element,
                                            backgroundColor: colores
                                        })
                                    }
                                    if (fecha.getDate() === 15) {
                                        fecha = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth() + 1,
                                            0
                                        )
                                    } else {
                                        fecha = new Date(
                                            fecha.getFullYear(),
                                            fecha.getMonth() + 1,
                                            15
                                        )
                                    }
                                    break;
                                default:
                                    fecha.setDate(fecha.getDate() + 15)
                                    fechaAux = new Date(
                                        fecha.getFullYear(),
                                        fecha.getMonth(),
                                        fecha.getDate()
                                    )
                                    if (fecha >= fInicio && fecha <= fFin) {
                                        colores = this.getColors(element, fecha)
                                        aux.push({
                                            title: element.servicio,
                                            start: fechaAux,
                                            end: fechaAux,
                                            iconClass: 'la la-wallet',
                                            pago: element,
                                            backgroundColor: colores
                                        })
                                    }
                                    break;
                            }
                            break;
                        case 'mensual':
                            if (conteo === 0)
                                fecha.setMonth(fecha.getMonth() + (conteo++))
                            else
                                fecha.setMonth(fecha.getMonth() + 1)
                            if (fecha >= fInicio && fecha <= fFin) {
                                fechaAux = new Date(
                                    fecha.getFullYear(),
                                    fecha.getMonth(),
                                    fecha.getDate()
                                )
                                colores = this.getColors(element, fecha)
                                aux.push({
                                    title: element.servicio,
                                    start: fechaAux,
                                    end: fechaAux,
                                    iconClass: 'la la-wallet',
                                    pago: element,
                                    backgroundColor: colores,
                                })
                            }
                            break;
                        case 'semestral':
                            if (conteo === 0)
                                fecha.setMonth(fecha.getMonth() + (conteo++ * 6))
                            else
                                fecha.setMonth(fecha.getMonth() + 6)
                            if (fecha >= fInicio && fecha <= fFin) {
                                fechaAux = new Date(
                                    fecha.getFullYear(),
                                    fecha.getMonth(),
                                    fecha.getDate()
                                )
                                colores = this.getColors(element, fecha)
                                aux.push({
                                    title: element.servicio,
                                    start: fechaAux,
                                    end: fechaAux,
                                    iconClass: 'la la-toolbox',
                                    pago: element,
                                    backgroundColor: colores
                                })
                            }
                            break;
                        case 'anual':
                            if (conteo === 0)
                                fecha.setYear(fecha.getFullYear() + (conteo++))
                            else
                                fecha.setYear(fecha.getFullYear() + 1)
                            if (fecha >= fInicio && fecha <= fFin) {
                                fechaAux = new Date(
                                    fecha.getFullYear(),
                                    fecha.getMonth(),
                                    fecha.getDate()
                                )
                                colores = this.getColors(element, fecha)
                                aux.push({
                                    title: element.servicio,
                                    start: fechaAux,
                                    end: fechaAux,
                                    iconClass: 'la la-toolbox',
                                    pago: element,
                                    backgroundColor: colores
                                })
                            }
                            break;
                        default:
                            fecha.setYear(fecha.getFullYear() + 2)
                            break;
                    }
                }
            }
        })
        this.setState({
            ...this.state,
            events: aux
        })
    }

    renderEventContent = (eventInfo) => {
        return (
            <OverlayTrigger rootClose overlay = {
                <Tooltip>
                    <span className='font-weight-bolder'>
                        {eventInfo.event.title} - 
                        {
                            eventInfo.event._def.extendedProps.pago.proveedor ? 
                                eventInfo.event._def.extendedProps.pago.proveedor.razon_social
                            : ''
                        }
                    </span>
                </Tooltip>
            }>
                <div className={`text-hover container p-1 tarea ${eventInfo.backgroundColor} border-0`}
                    onClick = { (e) => { e.preventDefault(); this.getPagoInfo(eventInfo, 'render') } } >
                    <div className="row mx-0 row-paddingless">
                        <div className="col-md-auto mr-1 text-truncate">
                            <i className={`${eventInfo.event._def.extendedProps.iconClass} font-size-17px px-1 text-white`}></i>
                        </div>
                        <div className="col align-self-center text-truncate">
                            <span className="text-white font-weight-bold font-size-12px">
                                {eventInfo.event.title} -
                                {
                                    eventInfo.event._def.extendedProps.pago.proveedor ? 
                                        eventInfo.event._def.extendedProps.pago.proveedor.razon_social
                                    : ''
                                }
                            </span>
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
        modal.details = false
        this.setState({
            modal,
            title: '',
            pagoInfo: '',
            pago:''
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

    openModalDeletePago = pago => {
        deleteAlert('¿DESEAS ELIMINAR EL PAGO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deletePagoAxios(pago.id), 'Eliminar pago')
    }
    openModalDesactivarPago = pago => {
        questionAlertWithLottie(
            `Desactivarás el pago: ${pago.servicio}`,
            '¿Deseas continuar?',
            PaymentFailedError,
            { confirm: 'DESACTIVAR', cancel: 'CANCELAR' },
            {
                cancel: null,
                success: () => this.deactivatePaymentAxios(pago.id)
            },
            'btn-pending-payment-confirm'
        )
    }
    changeActive = value => { 
        this.setState({...this.state, activeKey: value}) 
        if(value === 'tabla'){
            const { filters } = this.state
            this.reloadTable(filters)
        }else{
            this.getCalendarioPagos()
        }
    }

    setListPagos = pagos => {
        let aux = []
        pagos.forEach((pago) => {
            aux.push({
                actions: this.setActionsListPagos(pago),
                proveedor: setTextTableCenter(pago.proveedor ? pago.proveedor.razon_social : '-'),
                nombre: setTextTableCenter(pago.servicio),
                periodo: setTextTableCenter(pago.periodo),
                monto: setMoneyTable(pago.monto),
                fecha: setDateTable(pago.fecha_inicio),
                area: setTextTableCenter(pago.area ? pago.area.nombre : '-'),
                subarea: setTextTableCenter(pago.subarea ? pago.subarea.nombre : '-'),
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
                        <i className='las la-pen' />
                    </button>
                </OverlayTrigger>
                <OverlayTrigger rootClose overlay = { <Tooltip>Eliminar</Tooltip> }  >
                    <button className = {`btn btn-icon btn-actions-table btn-sm ml-2 btn-text-danger btn-hover-danger`} 
                        onClick = { (e) => { e.preventDefault(); this.openModalDeletePago(element) } }>
                        <i className = 'las la-trash' />
                    </button>
                </OverlayTrigger>
                {
                    element.active?
                    <OverlayTrigger rootClose overlay = { <Tooltip>Desactivar pago</Tooltip> }  >
                        <button className = {`btn btn-icon btn-actions-table btn-sm ml-2 btn-text-info btn-hover-info`} 
                            onClick = { (e) => { e.preventDefault(); this.openModalDesactivarPago(element) } }>
                            <i className = 'las la-ban' />
                        </button>
                    </OverlayTrigger>
                    :<></>
                }
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

    changeMonth = async(info) => {
        const { pagos } = this.state
        const { start, end } = info
        let inicio = start
        let fin = end
        /* if( start.getDate() !== 1) {
            inicio = new Date( start.getFullYear(), start.getMonth() + 1, 1 )
        }
        fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0); */
        this.getPagosAsEvents(pagos, inicio, fin)
    }
    getPagoInfo = (eventInfo, type) => {
        let { title, pagoInfo } = this.state
        if(type === 'render'){
            let { pago } = eventInfo.event._def.extendedProps
            let fecha  = eventInfo.event._instance.range.start
            fecha = new Date(moment(fecha).add(1, 'days'))
            Object.assign(pago, { fecha_calendar: fecha });
            title = `Pago de ${pago.servicio}`
            pagoInfo = pago
        }else if(type === 'state'){
            title = `Pago de ${eventInfo.servicio}`
            pagoInfo = eventInfo
        }
        const { modal } = this.state
        modal.details = true
        this.setState({
            modal,
            title,
            pagoInfo
        })
    }
    setOptionsArray = (name, array) => {
        const { options } = this.state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }
    render() {
        const { events, title, modal, options, activeKey, filters, pago, pagoInfo } = this.state
        const { authUser: {access_token}, history } = this.props
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
                                    initialView = "dayGridMonth" 
                                    weekends = { true } events = { events } eventContent = { this.renderEventContent }
                                    firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' datesSet = { this.changeMonth } />
                            </Card.Body>
                        </Card>
                    : 
                        <NewTable tableName = 'calendario-pagos' subtitle = 'Listado de pagos' title = 'Pagos' abrirModal = { true } 
                            onClick = { this.openModal } columns = { CALENDARIO_PAGOS_ADMIN } accessToken = { access_token } setter = { this.setListPagos } 
                            urlRender = {`${URL_DEV}v1/administracion/pago/all/calendario`} filterClick = { this.openModalFiltros } />
                }
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    {
                        modal.form ? 
                            <CalendarioPagosForm title = { title } at = { access_token } refresh = { this.refresh } pago={pago} options = { options } setOptions = {this.setOptionsArray}/> 
                        : <></>
                    }
                </Modal>
                <Modal size = 'lg' title = {title} show = { modal.filtros } handleClose = { this.handleClose } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <FiltersCalendarioPagos  at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options = { options }/>
                </Modal>
                <Modal size="lg" title={<span><i className='las la-wallet icon-lg mr-2 text-primary2'></i>{title}</span>} show={modal.details} handleClose={this.handleClose}>
                    {
                        modal.details ?
                            <EgresosCalendarioPagos at = { access_token } history = { history } pago = { pagoInfo }/>
                        : <></>
                    }
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioPagos)
