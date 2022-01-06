import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { errorAlert, printResponseErrorAlert, waitAlert, deleteAlert, questionAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Modal } from '../../../components/singles'
import { setSingleHeader } from '../../../functions/routers';
import { FormCalendarioIEquipos, DetailsTickets } from '../../../components/forms';
import { setMoneyTable } from '../../../functions/setters'
import { MANTENIMIENTOS } from '../../../constants'
import { setDateTable, setTextTable } from '../../../functions/setters'
import { NewTable } from '../../../components/NewTables';
import $ from "jquery";
import InputGray from '../../../components/form-components/Gray/InputGray';
import { Button, InputMoneyGray, RadioGroupGray, RangeCalendar } from '../../../components/form-components';
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray';
class CalendarioTicket extends Component {
    state = {
        events: [],
        title:'',
        modal: { details:false, form:false, filtros: false },
        form: {
            proyecto:'',
            equipo:'',
            duracion:'',
            periodo:'',
            fecha: new Date(),
            cantidad: '',
            costo: 0.0,
            cotizacion: { files: [], value: '' },
        },
        filters: {
            proyecto: '',
            equipo: '',
            costo: '',
            fecha: { start: null, end: null },
            tipo: '',
            estatus: '',
        },
        options:{  proyectos:[], equipos:[], estatus: [] },
        instalaciones: [],
        instalacion:[],
        activeKey: 'calendario',
        data: { mantenimientos: [], estatus: [] },
        mantenimientos: [],
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
        this.getCalendarioInstalaciones()
    }

    renderEventContent = (eventInfo) => {
        let { extendedProps } = eventInfo.event._def
        return (
            <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>{eventInfo.event.title}</span> - {eventInfo.event._def.extendedProps.instalacion.identificador}</Tooltip>}>
                <div className="text-hover container p-1 tarea" style={{backgroundColor:eventInfo.backgroundColor, borderColor:eventInfo.borderColor}} onClick={(e) => { e.preventDefault(); this.getInstalacion(extendedProps) }}>
                        <div className="row mx-0 row-paddingless">
                            <div className="col-md-auto mr-1 text-truncate">
                                <i className={`${eventInfo.event._def.extendedProps.iconClass} font-size-17px px-1 text-white`}></i>
                            </div>
                            <div className="col align-self-center text-truncate">
                                <span className="text-white font-weight-bold font-size-12px">{eventInfo.event.title} - {eventInfo.event._def.extendedProps.instalacion.identificador}</span>
                            </div>
                        </div>
                    </div>
            </OverlayTrigger>
        )
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            modal,
            title: 'Agregar nueva instalación',
            form: this.clearForm(),
            formeditado:0
        })
    }
    
    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            modal,
            title: 'Agregar nueva instalación',
            form: this.clearForm()
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
        this.setState({...this.state, modal})
    }

    getInstalacion = (instalacion) => {
        const { modal } = this.state
        modal.details = true
        console.log(instalacion)
        this.setState({
            modal,
            title: `${instalacion.instalacion.identificador} `,
            instalacion:instalacion
        })
    }
    
    handleCloseModalInstalacion= () => {
        const { modal } = this.state
        modal.details = false
        this.setState({ ...this.state, modal, instalacion: '' })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'cotizacion':
                    form[element] = { files: [], value: '' }
                    break;
                case 'costo':
                    form[element] = 0.0
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onChangeFilter = e => {
        const { name, value } = e.target
        const { filters } = this.state
        filters[name] = value
        this.setState({...this.state, filters})
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.options(`${URL_DEV}v1/proyectos/instalacion-equipos/gett`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const {  estatus } = response.data
                const { options, data } = this.state
                data.estatus = estatus
                this.setState({...this.state, options, data})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getCalendarioInstalaciones = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'v1/proyectos/instalacion-equipos/gett', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { instalaciones } = response.data
                let aux = []
                console.log(instalaciones)

                instalaciones.forEach((instalacion) => {
                    aux.push( { 
                        title: instalacion.descripcion_solucion,
                        start: instalacion.fecha_programada,
                        end: instalacion.fecha_programada,
                        instalacion: instalacion,
                        backgroundColor: "#17a2b8",
                        borderColor: "#17a2b8",
                        iconClass: 'la la-toolbox',
                        tipo:'Instalación'
                    })
                   
                })
                this.setState({  ...this.state,  events: aux, instalaciones: instalaciones })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onSubmitFilters = (e) => {
        e.preventDefault()
        const { filters, modal } = this.state
        modal.filtros = false
        this.setState({...this.state, modal})
        $('#mantenimientos').DataTable().search( JSON.stringify(filters) ).draw();
    }

    clearFiltros = (e) => {
        e.preventDefault()
        const { filters, modal } = this.state
        filters.proyecto = ''
        filters.equipo = ''
        filters.costo = ''
        filters.fecha = { start: null, end: null }
        filters.tipo = ''
        filters.estatus = ''
        modal.filtros = false
        this.setState({...this.state, modal, filters})
        $('#mantenimientos').DataTable().search({}).draw();
    }

    changeStatusAxios =  async(status, mante) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/proyectos/instalacion-equipos/mantenimientos/${mante}/status/${status}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                $('#mantenimientos').DataTable().search({}).draw();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    openModalDeleteMantenimiento = mantenimiento => {
        deleteAlert('¿DESEAS ELIMINAR EL MANTENIMIENTO?', '', () => this.deleteMantenimientoAxios(mantenimiento.id))
    }

    changeActive = value => { 
        if(value === 'tabla')
            $('#mantenimientos').DataTable().search({}).draw();
        this.setState({...this.state, activeKey: value}) 
    }

    setMantenimientos = mantenimientos => {
        const { data } = this.state
        let aux = []
        mantenimientos.forEach((mante) => {
            aux.push({
                actions: this.setActionsMantenimientos(mante),
                proyecto: setTextTable(mante.instalacion.proyecto.nombre),
                tipo: <div className = 'd-flex align-items-center justify-content-center'>
                    <i style = { { color: `${mante.tipo === 'correctivo' ? '#2756c3' : '#eea71a'}` } } 
                        className = { `${mante.tipo === 'correctivo' ? 'la la-tools' : 'flaticon-security'} mr-2`} /> {setTextTable(mante.tipo)}
                </div>,
                equipo: setTextTable(mante.instalacion.equipo.equipo),
                estatus: <Dropdown className = 'text-center'>
                    <Dropdown.Toggle 
                        style = { { backgroundColor: mante.status.fondo, color: mante.status.letra, border: 'transparent', padding: '0.3rem 0.6rem',
                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '8.5px',
                                fontWeight: 600 }}>
                        {mante.status.estatus.toUpperCase()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0" >
                        <Dropdown.Header>
                            <span className="font-size-11px">Elige una opción</span>
                        </Dropdown.Header>
                        {
                            data.estatus.map((status, index) => {
                                return(
                                    <Dropdown.Item className = 'p-0' key = { index } 
                                        onClick = { () => { questionAlert(`CAMBIARÁS EL ESTATUS A ${status.estatus.toUpperCase()}`, 
                                            `¿DESEAS CONTINUAR?`, () => { this.changeStatusAxios(status.id, mante.id) } ) }} >
                                        <span className="navi-link w-100">
                                            <span className="navi-text">
                                                <span style = { { backgroundColor: status.fondo, color: status.letra } }
                                                    className="label label-xl label-inline rounded-0 w-100">
                                                    {status.estatus}
                                                </span>
                                            </span>
                                        </span>
                                    </Dropdown.Item>
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>,
                costo: setMoneyTable(mante.costo),
                presupuesto: mante.cotizacion ? <div className = 'text-center'>
                    <a href = { mante.cotizacion } target = '_blank' rel="noreferrer" className="btn btn-icon btn-light btn-hover-primary btn-sm">
                        <i className="la la-file-invoice-dollar text-primary icon-xl"/>
                    </a>
                </div> : '',
                fecha: setDateTable(mante.fecha)
            })
        })
        return aux
    }

    setActionsMantenimientos = (element) => {
        return(
            <div className="w-100 d-flex justify-content-center">
                <OverlayTrigger rootClose overlay = { <Tooltip>Eliminar</Tooltip> }  >
                    <button className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger`} 
                        onClick = { (e) => { e.preventDefault(); this.openModalDeleteMantenimiento(element) } }>
                        <i className = 'flaticon2-rubbish-bin' />
                    </button>
                </OverlayTrigger>
            </div>
        )
    }

    getActiveClass = () => {
        const { instalacion } = this.state
        switch(instalacion.tipo){
            case 'Instalación':
                return 'color-instalacion'
            case 'Mantenimiento preventivo':
                return 'color-mantenimiento-preventivo'
            default:
                return 'color-mantenimiento'
        }
    }

    render() {
        const { events, title, modal, form, options, instalacion, activeKey, filters } = this.state
        const { access_token } = this.props.authUser
        return (
            <Layout active = 'proyectos' {...this.props}>
                <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                    {
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
                                    <span className="font-weight-bolder text-dark font-size-h3">Calendario de ticket</span>
                                </div>
                                {/* <div className="card-toolbar">
                                    <span className="btn btn-success font-weight-bold" onClick={this.openModal}>
                                        <i className="flaticon-add"></i> AGREGAR
                                    </span>
                                </div> */}
                            </Card.Header>
                            <Card.Body>
                                <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                                    initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                                    firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                            </Card.Body>
                        </Card>
                    : 
                        <NewTable tableName = 'mantenimientos' subtitle = 'Listado de Mantenimientos' title = 'Mantenimientos' abrirModal = { true } 
                            onClick = { this.openModal } columns = { MANTENIMIENTOS } accessToken = { access_token } setter = { this.setMantenimientos } 
                            urlRender = {`${URL_DEV}v1/proyectos/instalacion-equipos/`} filterClick = { this.openModalFiltros } />
                }
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    <FormCalendarioIEquipos form = { form } options = { options } onChange = { this.onChange } onSubmit = { this.onSubmitInstalacion } />
                </Modal>
                <Modal size="lg" title={<span><i className={`${instalacion.iconClass} icon-lg mr-2 ${this.getActiveClass()}`}></i>{title}</span>} 
                    show={modal.details} handleClose={this.handleCloseModalInstalacion} classBody="bg-light">
                    <DetailsTickets instalacion={instalacion} deleteInstalacion={this.deleteInstalacionAxios}/>
                </Modal>
                <Modal size = 'lg' title = 'Filtros' show = { modal.filtros } handleClose = { this.handleCloseFiltros } customcontent = { true } 
                    contentcss = "modal modal-sticky modal-sticky-bottom-right d-block modal-sticky-lg modal-dialog modal-dialog-scrollable">
                    <form onSubmit = { this.onSubmitFilters } >
                        <div className="row justify-content-center mx-0">
                            <div className="col-md-6">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'proyecto' placeholder = 'PROYECTO' value = { filters.proyecto } 
                                    onChange = { this.onChangeFilter } />
                            </div>
                            <div className="col-md-6">
                                <InputGray withtaglabel = { 1 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'equipo' placeholder = 'EQUIPO'  value = { filters.equipo } 
                                    onChange = { this.onChangeFilter }/>
                            </div>
                            <div className="col-md-6">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } requirevalidation = { 0 } 
                                    withformgroup = { 0 } name = 'costo' placeholder = 'COSTO' value = { filters.costo } onChange = { this.onChangeFilter } />
                            </div>
                            <div className="col-md-6">
                                <SelectSearchGray options = { options.estatus } placeholder = 'ESTATUS' value = { filters.estatus } 
                                    withtaglabel = { 1 } withtextlabel = { 0 } withicon={0} customdiv = 'mb-0' 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'estatus',value:value}}) } } />
                            </div>
                            <div className="col-md-12 text-center mt-6">
                                <RadioGroupGray placeholder = "¿Qué tipo de mantenimiento es?" name = 'tipo' onChange = { this.onChangeFilter } 
                                    options = { [ { label: 'Preventivo', value: 'preventivo' }, { label: 'Correctivo', value: 'correctivo' } ] } 
                                    customdiv = 'mb-0' value = { filters.tipo }/>
                            </div>
                            <div className="col-md-9 my-6 text-center">
                                <RangeCalendar start = { filters.fecha.start } end = { filters.fecha.end } 
                                    onChange = { (value) => { this.onChangeFilter({target:{name:'fecha',value:{start: value.startDate, end: value.endDate}}}) } } />
                            </div>
                        </div>
                        <div className="mx-0 row justify-content-between border-top pt-4">
                            <Button only_icon='las la-redo-alt icon-lg' className="btn btn-light-danger btn-sm font-weight-bold" type = 'button' text="LIMPIAR" onClick = { this.clearFiltros } />
                            <Button only_icon='las la-filter icon-xl' className="btn btn-light-info btn-sm font-weight-bold" type = 'submit' text="FILTRAR"  />
                        </div>
                    </form>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioTicket)
