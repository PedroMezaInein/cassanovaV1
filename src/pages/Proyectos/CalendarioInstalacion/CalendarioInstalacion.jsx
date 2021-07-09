import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { renderToString } from 'react-dom/server'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Modal } from '../../../components/singles'
import { setFormHeader, setSingleHeader } from '../../../functions/routers';
import { FormCalendarioIEquipos, DetailsInstalacion } from '../../../components/forms';
import { setMoneyTable, setOptions } from '../../../functions/setters'
// import { SelectSearchGray } from '../../../components/form-components'
import moment from 'moment'
import TableForModals from '../../../components/tables/TableForModals'
import { MANTENIMIENTOS } from '../../../constants'
import { setDateTable, setTextTable, setLabelTable, setArrayTable } from '../../../functions/setters'
import { NewTable } from '../../../components/NewTables';
import $ from "jquery";
import InputGray from '../../../components/form-components/Gray/InputGray';
import { Button, InputMoneyGray, RadioGroupGray, RangeCalendar } from '../../../components/form-components';
import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray';

class CalendarioInstalacion extends Component {
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
        data: { mantenimientos: [] },
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
            <OverlayTrigger overlay={<Tooltip><span className='font-weight-bolder'>{eventInfo.event.title}</span> - {eventInfo.event._def.extendedProps.instalacion.proyecto.nombre}</Tooltip>}>
                <div className="text-hover container p-1 tarea" style={{backgroundColor:eventInfo.backgroundColor, borderColor:eventInfo.borderColor}} onClick={(e) => { e.preventDefault(); this.getInstalacion(extendedProps) }}>
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
        this.setState({
            modal,
            title: `${instalacion.tipo} de ${instalacion.instalacion.equipo.equipo}`,
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
        await axios.options(`${URL_DEV}v1/proyectos/instalacion-equipos`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { proyectos, equipos, estatus } = response.data
                const { options } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.equipos = setOptions(equipos, 'texto', 'id')
                options.estatus = setOptions(estatus, 'estatus', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getCalendarioInstalaciones = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'v1/proyectos/instalacion-equipos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { instalaciones } = response.data
                let aux = []
                instalaciones.forEach((instalacion) => {
                    let periodo = instalacion.periodo //meses
                    let duracion = instalacion.duracion //años
                    let meses = duracion === 0 ? periodo : duracion * 12
                    aux.push( { 
                        title: instalacion.equipo.equipo,
                        start: instalacion.fecha,
                        end: instalacion.fecha,
                        instalacion: instalacion,
                        backgroundColor: "#17a2b8",
                        borderColor: "#17a2b8",
                        iconClass: 'la la-toolbox',
                        tipo:'Instalación'
                    })
                    instalacion.mantenimientos.forEach((mantenimiento) => {
                        aux.push({
                            title: instalacion.equipo.equipo,
                            start:mantenimiento.fecha,
                            end:mantenimiento.fecha,
                            instalacion: instalacion,
                            backgroundColor: `${mantenimiento.tipo === 'correctivo' ? '#2756C3' : '#eea71a'}`,
                            borderColor: `${mantenimiento.tipo === 'correctivo' ? '#2756C3' : '#eea71a'}`,
                            iconClass: 'la la-tools',
                            tipo:`Mantenimiento ${mantenimiento.tipo}`
                        })
                    })
                })
                this.setState({  ...this.state,  events: aux, instalaciones: instalaciones })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSubmitInstalacion = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        let data = new FormData()
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'cotizacion':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        form.cotizacion.files.forEach((file) => { data.append(`files[]`, file.file) })
        await axios.post(`${URL_DEV}v1/proyectos/instalacion-equipos`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Instalación de equipo registrado con éxito.')
                this.getCalendarioInstalaciones()
                this.handleClose()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteInstalacionAxios = async(instalacion) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v1/proyectos/instalacion-equipos/${instalacion.id}`, { headers: setSingleHeader(access_token)  }).then(
            (response) => {
                doneAlert('Instalación de equipo eliminado con éxito.')
                this.getCalendarioInstalaciones()
                this.handleCloseModalInstalacion()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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

    deleteMantenimientoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { mantenimiento } = this.state
        await axios.delete(`${URL_DEV}v1/proyectos/instalacion-equipos/${mantenimiento.id}/mantenimiento/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Mantenimiento eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getMantenimientos = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/proyectos/instalacion-equipos/mantenimientos`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { instalaciones } = response.data
                Swal.close()
                this.setState({...this.state, mantenimientos: this.setMantenimientos(instalaciones)})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    openModalDeleteMantenimiento = mantenimiento => {
        deleteAlert('¿DESEAS ELIMINAR EL MANTENIMIENTO?', '', () => this.deleteMantenimientoAxios(mantenimiento.id))
    }

    changeActive = value => { 
        /* if(value === 'tabla')
            this.getMantenimientos() */
        this.setState({...this.state, activeKey: value}) 
    }

    setMantenimientos = mantenimientos => {
        let aux = []
        mantenimientos.forEach((mante) => {
            aux.push({
                actions: this.setActionsMantenimientos(mante),
                proyecto: setTextTable(mante.instalacion.proyecto.nombre),
                tipo: setTextTable(mante.tipo),
                equipo: setTextTable(mante.instalacion.equipo.equipo),
                estatus: setTextTable(mante.status.estatus),
                costo: setMoneyTable(mante.costo),
                presupuesto: mante.cotizacion ? <div className = 'text-center'>
                    <a href = { mante.cotizacion } target = '_blank' className="btn btn-icon btn-light btn-hover-primary btn-sm">
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
                <OverlayTrigger overlay = { <Tooltip>Eliminar</Tooltip> }  >
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
                        activeKey === 'calendario' ?
                            <OverlayTrigger overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR TABLA</span></Tooltip>}>
                                <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.changeActive('tabla') }} >
                                    <span className="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
                                        <i className="la flaticon2-list-2 icon-xl"></i>
                                    </span>
                                </li>
                            </OverlayTrigger>
                        : 
                            <OverlayTrigger overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR CALENDARIO</span></Tooltip>}>
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
                                    <span className="font-weight-bolder text-dark font-size-h3">Mantenimientos</span>
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
                        <NewTable tableName = 'mantenimientos' subtitle = 'Listado de Mantenimientos' title = 'Mantenimientos' abrirModal = { true } onClick={this.openModal} 
                            columns = { MANTENIMIENTOS } accessToken = { access_token } urlRender = {`${URL_DEV}v1/proyectos/instalacion-equipos/mantenimientos`} 
                            setter = { this.setMantenimientos } filterClick = { this.openModalFiltros } />
                }
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    <FormCalendarioIEquipos form = { form } options = { options } onChange = { this.onChange } onSubmit = { this.onSubmitInstalacion } />
                </Modal>
                <Modal size="lg" title={<span><i className={`${instalacion.iconClass} icon-lg mr-2 ${this.getActiveClass()}`}></i>{title}</span>} 
                    show={modal.details} handleClose={this.handleCloseModalInstalacion} classBody="bg-light">
                    <DetailsInstalacion instalacion={instalacion} deleteInstalacion={this.deleteInstalacionAxios}/>
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
                        <div className="mx-0 row justify-content-between">
                            <div className="col-auto">
                                <Button only_icon='fas fa-redo' className="btn btn-danger" type = 'button' text="LIMPIAR" onClick = { this.clearFiltros } />
                            </div>
                            <div className="col-auto text-right">
                                <Button only_icon='fas fa-filter' className="btn btn-info mr-3" type = 'submit' text="FILTRAR"  />
                            </div>
                        </div>
                    </form>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioInstalacion)
