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
class Calendario extends Component {
    state = {
        events: [],
        checador: [],
        json: {},
        calendar_mistareas : true,
        calendar_departamentos : false
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getUserChecador()
        this.getCalendarioTareasAxios()
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

    async getCalendarioTareasAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data, calendar_mistareas, calendar_departamentos } = this.state
                const { empleados, empleado } = response.data
                console.log( calendar_mistareas, 'calendar_mistareas')
                console.log(calendar_departamentos, 'calendar_departamentos')

                let aux = []
                if(calendar_mistareas){
                    let mes = ''
                    let dia = ''
                    let año = new Date().getFullYear();
                    empleados.map((empleado, key) => {
                        mes = empleado.rfc.substr(6, 2);
                        dia = empleado.rfc.substr(8, 2);
                        for (let x = -5; x <= 5; x++) {
                            aux.push({
                                title: empleado.nombre,
                                start: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                                end: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                            })
                        }
                        return false
                    })
                }else if(calendar_departamentos){
                    aux.push({
                        title: 'PRUEBA_CALENDAR_DEPTOS',
                        start: '2021-04-10',
                        end: '2021-04-10'
                    })
                }
                this.setState({
                    ...this.state,
                    events: aux,
                    empleado: empleado,
                    data
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
                <div className="bg-primary">
                    <span>{eventInfo.event.title}</span>
                </div>
            </OverlayTrigger>
        )
    }
    openCalendarMisTareas = () => {
        console.log('Mis tareas')
        this.setState({
            ...this.state,
            calendar_mistareas: true,
            calendar_departamentos:false
        })
        this.getCalendarioTareasAxios()
    }
    openCalendarDeptos = () => {
        console.log('Tareas departamentos')
        this.setState({
            ...this.state,
            calendar_departamentos: true,
            calendar_mistareas:false
        })
        this.getCalendarioTareasAxios()
    }
    render() {
        const { events, calendar_mistareas, calendar_departamentos } = this.state
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
                                <button type="button" className={`btn font-weight-bolder ${calendar_mistareas ? 'btn-success' : 'btn-light-success'}`} onClick={this.openCalendarMisTareas}>
                                    <i className="fas fa-tasks"></i> MIS TAREAS
                                </button>
                                <button type="button" className={`btn font-weight-bolder ${calendar_departamentos ? 'btn-primary' : 'btn-light-primary'}`}  onClick={this.openCalendarDeptos}>
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
