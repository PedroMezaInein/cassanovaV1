import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Swal from 'sweetalert2'
import Pusher from 'pusher-js'
class Calendario extends Component {
    state = {
        events: [],
        checador: [],
        json: {},
        tipo: 'own'
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getUserChecador()
        this.getCalendarioTareasAxios('own')
        const pusher = new Pusher('112ff49dfbf7dccb6934', {
            cluster: 'us2',
            encrypted: false
        });
        const channel = pusher.subscribe('responsable-tarea');
        channel.bind('App\\Events\\ResponsableTarea', data => {
            const { usuario, tarea } = data
            const { user } = this.props.authUser
            const { tipo } = this.state
            if(user.id === usuario.id)
                this.getCalendarioTareasAxios(tipo)
        });
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

    getUserChecador = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/usuarios/checador`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { usuario } = response.data
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    printChecador = () => {
		const { checador } = this.state
		if(checador.length){
			if(checador[0].fecha_fin === null)
				return(
                    <span className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('salida') } } >
                        <i className="fas fa-sign-in-alt text-primary"></i> CHECAR SALIDA
                    </span>
				)
		}else{
			return(
                <span className="btn btn-sm btn-bg-light btn-icon-success btn-hover-success font-weight-bolder text-success" onClick = { (e) => { e.preventDefault(); this.actualizarChecadorAxios('entrada') } }>
                    <i className="fas fa-sign-in-alt text-success"></i> CHECAR ENTRADA
                </span>
			)
		}
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
        await axios.get(`${URL_DEV}v2/usuarios/calendario-proyectos/${tipo}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { tareas } = response.data
                let aux = []
                tareas.map((tarea, index) => { aux.push( { title: tarea.titulo, start: tarea.fecha_limite, end: tarea.fecha_limite, tarea: tarea } ) })
                this.setState({ ...this.state, events: aux, tipo: tipo })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    renderEventContent = (eventInfo) => {
        const { tarea } = eventInfo.event._def.extendedProps
        console.log('TAREA', tarea)
        return (
            <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                
                <div className="bg-primary d-flex flex-wrap px-1 py-2">
                    <div className="d-flex align-items-center" style = {{ overflowX: 'hidden'}}>
                        {
                            tarea.responsables.map((responsable) => {
                                return(
                                    <div className="symbol symbol-30 symbol-circle mr-1">
                                        <img alt="Pic" src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                    </div>
                                )
                            })
                        }
                        <div> <span className = 'text-white'>{eventInfo.event.title}</span> </div>
                    </div>
                    
                </div>
            </OverlayTrigger>
        )
    }
    
    openCalendarMisTareas = () => { this.getCalendarioTareasAxios('own') }
    
    openCalendarDeptos = () => { this.getCalendarioTareasAxios('all') }
    
    render() {
        const { events, tipo } = this.state
        return (
            <Layout {...this.props}>
                    <Card className="card-custom">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <div className="align-items-start flex-column">
                                    <span className="font-weight-bolder text-dark font-size-h3">Calendario de tareas</span>
                                </div>
                            </div>
                            <div className="card-toolbar">
                                { this.printChecador() }
                            </div>
                        </Card.Header>
                        <Card.Body>
                        <div className="btn-toolbar btn-group justify-content-center">
                            <div className="btn-group btn-group-sm">
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'own' ? 'btn-success' : 'btn-light-success'}`} onClick={this.openCalendarMisTareas}>
                                    <i className="fas fa-tasks"></i> MIS TAREAS
                                </button>
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'all' ? 'btn-primary' : 'btn-light-primary'}`}  onClick={this.openCalendarDeptos}>
                                    <i className="fas fa-list-ol"></i> TAREAS DEPTOS
                                </button>
                            </div>
                        </div>
                            <FullCalendar
                                locale={esLocale}
                                plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                initialView="dayGridMonth"
                                weekends={true}
                                events={events}
                                dateClick={this.handleDateClick}
                                eventContent={this.renderEventContent}
                                firstDay={1}
                                themeSystem='bootstrap'
                                height='1290.37px'
                            />
                        </Card.Body>
                    </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)
