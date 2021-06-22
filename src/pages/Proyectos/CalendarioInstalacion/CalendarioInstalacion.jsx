import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { PUSHER_OBJECT, URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Swal from 'sweetalert2'
/* import Pusher from 'pusher-js'; */
import { Modal } from '../../../components/singles'
import { setSingleHeader, setFormHeader } from '../../../functions/routers';
import FormCalendarioIEquipos from '../../../components/forms/proyectos/FormCalendarioIEquipos';
import { setOptions } from '../../../functions/setters'
import { SelectSearchGray } from '../../../components/form-components'
import moment from 'moment'

class CalendarioInstalacion extends Component {
    state = {
        events: [],
        tipo: 'own',
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
            fecha: new Date()
        },
        options:{ 
            proyectos:'',
            equipos:''
        },
        tareas: [],
        instalacion:[]
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
        this.getInstalaciones()
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
    async getInstalaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'v1/proyectos/instalacion-equipos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                console.log(response.data)
                const { instalaciones } = response.data
                let aux = []
                instalaciones.forEach((instalacion) => {  
                    aux.push( { 
                        title: instalacion.titulo,
                        start: instalacion.fecha_limite,
                        end: instalacion.fecha_limite,
                        instalacion: instalacion
                    })
                })
                this.setState({ 
                    ...this.state, 
                    events: aux,
                    instalaciones: instalaciones
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    
    renderEventContent = (eventInfo) => {
        return (
            <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
            <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                <span>{eventInfo.event.title}</span>
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
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
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
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmitInstalacion = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        console.log(form)
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        waitAlert()
        await axios.post(`${URL_DEV}v1/proyectos/instalacion-equipos`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Instalación de equipo registrado con éxito.')
                this.getInstalaciones()
                this.handleClose()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    cleanForm = () => {
        const { form } = this.state
        form.equipo = ''
        form.proyecto = ''
        this.setState({
            ...this.state,
            form
        })
    }
    updateProyecto = value => {
        this.onChange({ target: { value: value, name: 'proyecto' } })
    }
    updateEquipo = value => {
        this.onChange({ target: { value: value, name: 'equipo' } })
    }
    filtrarCalendario = () => {
        console.log('filtrar')
    }
    render() {
        const { events, tipo, title, modal, tarea, form, options } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div class="card-title">
                            <span className="font-weight-bolder text-dark font-size-h3">Instalaciones de Equipos</span>
                        </div>
                        <div class="card-toolbar">
                            <a className="btn btn-success font-weight-bold" onClick={this.openModal}>
                                <i className="flaticon-add"></i> AGREGAR
                            </a>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="col-md-12 mx-auto px-0">
                            <div className="form-group row mx-0 form-group-marginless justify-content-center">
                                <div className="col-md-4">
                                    <SelectSearchGray
                                        options={options.proyectos}
                                        placeholder="SELECCIONA EL PROYECTO"
                                        name="proyecto"
                                        value={form.proyecto}
                                        onChange={this.updateProyecto}
                                        iconclass={"far fa-folder-open"}
                                        customdiv = "mb-0"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <SelectSearchGray
                                        options={options.equipos}
                                        placeholder="SELECCIONA EL EQUIPO"
                                        name="equipo"
                                        value={form.equipo}
                                        onChange={this.updateEquipo}
                                        iconclass={"far fa-folder-open"}
                                        customdiv = "mb-0"
                                    />
                                </div>
                                <div className="col-md-2 align-self-center">
                                    <span className="btn btn-sm btn-bg-light btn-hover-light-primary text-dark-50 text-hover-primary font-weight-bolder font-size-13px py-3" onClick={this.filtrarCalendario}>Buscar</span>
                                    <span className="btn btn-sm btn-bg-light btn-hover-light-danger text-dark-50 text-hover-danger font-weight-bolder font-size-13px py-3 ml-2" onClick={this.cleanForm}>Limpiar</span>
                                </div>
                            </div>
                        </div>
                        <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                            initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                            firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                    </Card.Body>
                </Card>
                <Modal size="lg" title={title} show={modal.form} handleClose={this.handleClose} >
                    <FormCalendarioIEquipos form = { form } options = { options } onChange = { this.onChange } onSubmit = { this.onSubmitInstalacion } />
                </Modal>
                {/* <Modal size="lg" title={title} show={modal.details} handleClose={this.handleCloseModalT} >
                        
                </Modal> */}
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioInstalacion)
