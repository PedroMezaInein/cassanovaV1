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
import Echo from 'laravel-echo';
import { Modal } from '../../../components/singles'
import FormCalendarioTareas from '../../../components/forms/usuarios/FormCalendarioTareas'

class Calendario extends Component {
    state = {
        events: [],
        checador: [],
        json: {},
        tipo: 'own',
        title:'',
        modal: {
            tareas:false
        },
        form: {
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            },
            comentario: ''
        },
        options:{ users: [] },
        tareas: []
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getCalendarioTareasAxios('own')
        if(process.env.NODE_ENV === 'production'){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('responsable-tarea').listen('ResponsableTarea', (data) => {
                const { tipo, tareas, tarea } = this.state
                const { user } = this.props.authUser
                if(data.type ==='delete'){ this.getCalendarioTareasAxios(tipo) }
                else{
                    if(tarea)
                        if(tarea.id === data.tarea)
                            this.getTareas({id: data.tarea})
                    if(tipo === 'own'){
                        let found = tareas.find((elemento) => { return elemento.id === data.tarea })
                        if(found){ this.getCalendarioTareasAxios(tipo) }
                        else{
                            found = data.responsables.find((elemento) => { return elemento === user.id })
                            if(found){ this.getCalendarioTareasAxios(tipo) }
                        }
                    }else{ this.getCalendarioTareasAxios(tipo) }
                }
            })
        }
    }

    actualizarChecadorAxios = async(tipo) => {
        const { access_token } = this.props.authUser
        const { json } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/usuarios/checador/${tipo}`, {ip: json}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => { 
                const { usuario } = response.data
                if(tipo === 'entrada')
                    doneAlert('Entrada checada con éxito')
                else
                    doneAlert('Salida checada con éxito')
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    async getEventsOneDateAxios(date) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                this.setState({
                    ...this.state,    
                    eventos: eventos
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

    async getCalendarioTareasAxios(tipo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v3/usuarios/calendario-tareas/${tipo}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { tareas } = response.data
                let aux = []
                tareas.forEach((tarea) => {  aux.push( { title: tarea.titulo, start: tarea.fecha_limite, end: tarea.fecha_limite, tarea: tarea } )  })
                this.setState({ ...this.state, events: aux, tipo: tipo, tareas: tareas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setProyectoName = nombre => {
        let arreglo = nombre.split(' ')
        let texto = '#'
        arreglo.forEach( (elemento) => {
            if(elemento !== '' && elemento !== '-')
                texto = texto + elemento.charAt(0).toUpperCase() + elemento.slice(1).toLowerCase()
        })
        return texto
    }

    getTareas = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/calendario-tareas/options/${tarea.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tarea, usuarios, proyectos } = response.data
                const { modal, options } = this.state
                modal.tareas = true
                options.users = []
                options.proyectos = []
                usuarios.forEach((element) => { options.users.push({ id: element.id, display: element.name }) })
                proyectos.forEach((element) => { options.proyectos.push({ id: element.id, display: this.setProyectoName(element.nombre), name: element.nombre }) })
                Swal.close()
                this.setState({ ...this.state, modal, tarea: tarea, title: tarea.titulo, form: this.clearForm(), options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    handleCloseModalT = () => {
        const { modal } = this.state
        modal.tareas = false
        this.setState({ ...this.state, modal, tarea: '' })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    renderEventContent = (eventInfo) => {
        const { tarea } = eventInfo.event._def.extendedProps
        return (
            <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                <div className="text-hover container p-1 bg-info rounded-xl" onClick={(e) => { e.preventDefault(); this.getTareas(tarea) }}>
                    <div className="row mx-0 row-paddingless">
                        <div className="col-md-auto mr-2 text-truncate">
                            {
                                <div className="symbol-group symbol-hover justify-content-center">
                                    {
                                        tarea.responsables.map((responsable, key) => {
                                            return(
                                                <div className="symbol symbol-25 symbol-circle border-1" key={key}>
                                                    <img alt = 'user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                        <div className="col align-self-center text-truncate">
                            <span className="text-white font-weight-bold">{eventInfo.event.title}</span>
                        </div>
                    </div>
                </div>
            </OverlayTrigger>
        )
    }
    
    openCalendarMisTareas = () => { this.getCalendarioTareasAxios('own') }
    
    openCalendarDeptos = () => { this.getCalendarioTareasAxios('all') }

    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tarea } = this.state
        const data = new FormData();
        form.adjuntos.adjunto_comentario.files.forEach(( adjunto) => {
            data.append(`files[]`, adjunto.file)
        })
        data.append(`comentario`, form.comentario)
        await axios.post(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/comentario`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { tarea } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({ ...this.state, form, tarea: tarea })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
    handleChangeComentario = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    hasIcon = () => {
        const { tarea } = this.state
        if(tarea)
            if(tarea.prioritario)
                return 'flaticon-star text-warning mx-2'
        return null
    }

    render() {
        const { events, tipo, title, modal, tarea, form, options } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <div className="align-items-start flex-column">
                                <span className="font-weight-bolder text-dark font-size-h3">Calendario de tareas</span>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="btn-toolbar btn-group justify-content-center mb-7">
                            <div className="btn-group btn-group-sm">
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'own' ? 'btn-success' : 'btn-light-success'}`} onClick={this.openCalendarMisTareas}>
                                    <i className="fas fa-tasks"></i> MIS TAREAS
                                </button>
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'all' ? 'btn-primary' : 'btn-light-primary'}`}  onClick={this.openCalendarDeptos}>
                                    <i className="fas fa-list-ol"></i> TAREAS DEPTOS
                                </button>
                            </div>
                        </div>
                        <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                            initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                            firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                    </Card.Body>
                </Card>
                <Modal size="lg" title={title} show={modal.tareas} handleClose={this.handleCloseModalT} icon = { this.hasIcon() } >
                    <FormCalendarioTareas tarea = { tarea } addComentario = { this.addComentarioAxios } form = { form } proyectos = { options.proyectos }
                        onChange = { this.onChange } handleChange = { this.handleChangeComentario } users = { options.users } />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)
