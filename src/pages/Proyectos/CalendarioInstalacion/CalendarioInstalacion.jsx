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
import { setOptions } from '../../../functions/setters'
// import { SelectSearchGray } from '../../../components/form-components'
import moment from 'moment'
import TableForModals from '../../../components/tables/TableForModals'
import { MANTENIMIENTOS } from '../../../constants'
import { setDateTable, setTextTable, setLabelTable, setArrayTable } from '../../../functions/setters'
class CalendarioInstalacion extends Component {
    state = {
        events: [],
        title:'',
        modal: {
            details:false,
            form:false
        },
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
        options:{ 
            proyectos:'',
            equipos:''
        },
        instalaciones: [],
        instalacion:[],
        showTable: true,
        showCalendario: false,
        data: {
            mantenimientos: []
        },
        mantenimientos: []
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

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.options(`${URL_DEV}v1/proyectos/instalacion-equipos`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { proyectos, equipos } = response.data
                const { options } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.equipos = setOptions(equipos, 'texto', 'id')
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getCalendarioInstalaciones() {
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
                    let contadorPeriodo = 0;
                    for(let x=1; x <= meses; x++){
                        if(x % periodo === 0){
                            contadorPeriodo++;
                            let fecha_instalacion = moment(instalacion.fecha);
                            let fecha_mantenimiento = fecha_instalacion.add(x, 'M');
                            if(fecha_mantenimiento.day() === 0){
                                fecha_mantenimiento.add(1, 'd')
                            }
                            if(fecha_mantenimiento.day() === 6){
                                fecha_mantenimiento.add(2, 'd')
                            }
                            let fecha_mantenimiento_format= fecha_mantenimiento.format("YYYY-MM-DD")
                            aux.push({
                                title: instalacion.equipo.equipo,
                                start:fecha_mantenimiento_format,
                                end:fecha_mantenimiento_format,
                                instalacion: instalacion,
                                backgroundColor: "#2756C3",
                                borderColor: "#2756C3",
                                iconClass: 'la la-tools',
                                tipo:'Mantenimiento',
                                contadorPeriodo:contadorPeriodo
                            })
                        }
                    }
                    return false
                })
                this.setState({  ...this.state,  events: aux, instalaciones: instalaciones })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
        form.cotizacion.files.forEach((file) => {
            data.append(`files[]`, file.file)
        })
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

    showMantenimentos() {
        this.setState({
            ...this.state,
            showCalendario: true,
            showTable: false
        })
    }
    showTable() {
        this.setState({
            ...this.state,
            showTable: true,
            showCalendario: false
        })
    }
    openModalDeleteMantenimiento = mantenimiento => {
        deleteAlert('¿DESEAS ELIMINAR EL MANTENIMIENTO?', '', () => this.deleteMantenimientoAxios(mantenimiento.id))
    }
    async deleteMantenimientoAxios(id) {
        const { access_token } = this.props.authUser
        const { mantenimiento } = this.state
        await axios.delete(`${URL_DEV}v1/proyectos/instalacion-equipos/${mantenimiento.id}/mantenimiento/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { mantenimientos } = response.data
                const { data } = this.state
                data.mantenimientos = mantenimiento.estados
                this.setState({
                    ...this.state,
                    data,
                    mantenimientos: this.setMantenimientos(mantenimientos)
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Mantenimiento eliminado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    setMantenimientos = mantenimientos => {
        let aux = []
        mantenimientos.map((mantenimiento) => {
            aux.push({
                actions: this.setActionsMantenimientos(mantenimiento),
                proyecto: renderToString(setTextTable('')),
                tipo: renderToString(setTextTable('')),
                equipo: renderToString(setTextTable('')),
                estatus: renderToString(setLabelTable(mantenimiento.estatus)),
                costo: renderToString(setTextTable('')),
                presupuesto: renderToString(setArrayTable([{ url: mantenimiento.adjunto.url, text: mantenimiento.adjunto.name }])),
                fecha: renderToString(setDateTable(mantenimiento.created_at)),
                id: mantenimiento.id
            })
            return false
        })
        return aux
    }
    setActionsMantenimientos = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAction',
                tooltip: { id: 'deleteEstado', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    render() {
        const { events, title, modal, form, options, instalacion, showCalendario, showTable, data, mantenimientos } = this.state
        return (
            <Layout active = 'proyectos' {...this.props}>
                <ul className="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-2 mt-4">
                    <OverlayTrigger overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR CALENDARIO</span></Tooltip>}>
                        <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.showMantenimentos() }}>
                            <span className="btn btn-sm btn-icon btn-bg-light btn-text-info btn-hover-info" >
                                <i className="la flaticon2-calendar-8 icon-xl"></i>
                            </span>
                        </li>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip><span className="text-dark-50 font-weight-bold">MOSTRAR TABLA</span></Tooltip>}>
                        <li className="nav-item mb-2" onClick={(e) => { e.preventDefault(); this.showTable() }} >
                            <span className="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
                                <i className="la flaticon2-list-2 icon-xl"></i>
                            </span>
                        </li>
                    </OverlayTrigger>
                </ul>
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
                        {
                            <div className={`${showCalendario ? '' : 'd-none'}`}>
                                <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                                initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                                firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                            </div>
                        }
                        {
                            <div className={`${showTable ? '' : 'd-none'}`}>
                                <TableForModals
                                columns={MANTENIMIENTOS}
                                data={mantenimientos}
                                mostrar_acciones={true}
                                actions={
                                    {
                                        'deleteAction': { function: this.openModalDeleteEstado }
                                    }
                                }
                                elements={data.mantenimientos}
                                idTable='kt_datatable_estado'
                            />
                            </div>
                        }
                    </Card.Body>
                </Card>
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    <FormCalendarioIEquipos form = { form } options = { options } onChange = { this.onChange } onSubmit = { this.onSubmitInstalacion } />
                </Modal>
                <Modal size="lg" title={<span><i className={`${instalacion.iconClass} icon-lg mr-2 ${instalacion.tipo==='Instalación'?'color-instalacion':'color-mantenimiento'}`}></i>{title}</span>} show={modal.details} handleClose={this.handleCloseModalInstalacion} classBody="bg-light">
                    <DetailsInstalacion instalacion={instalacion} deleteInstalacion={this.deleteInstalacionAxios}/>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioInstalacion)
