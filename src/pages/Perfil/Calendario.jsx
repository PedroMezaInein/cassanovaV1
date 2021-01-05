import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Modal } from '../../components/singles'
import { SolicitarVacacionesForm, EstatusForm } from "../../components/forms";
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert, questionAlert } from '../../functions/alert';
import { countDaysWithoutWeekend } from '../../functions/functions';
import { URL_DEV } from '../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { DropdownButton, Dropdown, Card, OverlayTrigger, Tooltip, Nav, Tab } from 'react-bootstrap'
import moment from 'moment'
import AVATAR from '../../assets/images/icons/avatar.png'
import Swal from 'sweetalert2'
import { Parking, ParkingRed, PassportTravel, HappyBirthday, Calendar, EmptyParkSlot } from '../../components/Lottie';
import { Button } from '../../components/form-components'

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']
const $ = require('jquery');
class Calendario extends Component {

    state = {
        disponibles: 0,
        events: [],
        formeditado: 0,
        modal: false,
        empleado: '',
        vacaciones_totales: '',
        modal_status: false,
        modal_date: false,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
        },
        data: {
            usuarios: []
        },
        estatus: [],
        disabledDates: [],
        date: '',
        eventos: '',
        activeKey: ''
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getVacacionesAxios()
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true,
            title: 'Solicitar vacaciones',
            form: this.clearForm(),
            formeditado: 0
        })
    }
    openModalEstatus = () => {
        this.setState({
            ...this.state,
            modal_status: true,
            title: 'Estatus de vacaciones',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    handleClose = () => {
        const { modal, options } = this.state
        this.setState({
            ...this.state,
            modal: !modal,
            options,
            title: 'Solicitar vacaciones',
            form: this.clearForm()
        })
    }
    handleCloseEstatus = () => {
        const { modal_status } = this.state
        this.setState({
            ...this.state,
            modal_status: !modal_status,
            title: 'Estatus de vacaciones',
            form: this.clearForm()
        })
    }

    handleCloseDate = () => {
        this.setState({
            ...this.state,
            modal_date: false,
            date: '',
            activeKey: '',
            eventos: ''
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

    getDiasDisponibles = (empleado, vacaciones_totales) => {
        /* const { empleado, vacaciones_totales } = this.state */
        let contador = 0
        let fecha_inicio_empleado = ''
        if (empleado) {

            fecha_inicio_empleado = new Date(empleado.fecha_inicio)
            fecha_inicio_empleado.setDate(fecha_inicio_empleado.getDate() + 1)

            let mes = fecha_inicio_empleado.getMonth() + 1

            if (mes.toString().length === 1) {
                mes = '0' + mes
            }

            let dia = fecha_inicio_empleado.getDate()
            let now = new Date();
            now.setDate(now.getDate() + 366)
            let año = now.getFullYear();

            let fecha_fin = new Date(mes + '/' + dia + '/' + año)
            let fecha_inicio = new Date(mes + '/' + dia + '/' + (año - 1))

            if (fecha_fin < fecha_inicio_empleado) {
                fecha_fin = new Date(mes + '/' + dia + '/' + (año + 1))
                fecha_inicio = new Date(mes + '/' + dia + '/' + año)
            }

            vacaciones_totales.map((vacacion, key) => {
                if (vacacion.estatus !== 'Rechazadas') {
                    let vacacion_fecha_inicio = new Date(vacacion.fecha_inicio)
                    let vacacion_fecha_fin = new Date(vacacion.fecha_fin)
                    if (vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)
                        contador = contador + countDaysWithoutWeekend(vacacion_fecha_inicio, vacacion_fecha_fin)
                    if (vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && !(vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)) {
                        while (vacacion_fecha_inicio.getTime() >= vacacion_fecha_fin.getTime()) {
                            if (vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin)
                                if (vacacion_fecha_inicio.getDay() !== 6 && vacacion_fecha_inicio.getDay() !== 0)
                                    contador++
                            vacacion_fecha_inicio.setDate(vacacion_fecha_inicio.getDate() + 1);
                        }
                    }
                    if (!(vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin) && (vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)) {
                        while (vacacion_fecha_inicio.getTime() < vacacion_fecha_fin.getTime()) {
                            if (vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin) {
                                if (vacacion_fecha_fin.getDay() !== 6 && vacacion_fecha_fin.getDay() !== 0)
                                    contador++
                            }
                            vacacion_fecha_fin.setDate(vacacion_fecha_fin.getDate() - 1);
                        }
                    }
                }
                return false
            })

            return empleado.vacaciones_disponibles - contador
        }
        else
            return contador
    }

    getVacaciones(empleado, vacaciones_totales) {
        let contador = []
        let fecha_inicio_empleado = ''
        if (empleado) {

            fecha_inicio_empleado = new Date(empleado.fecha_inicio)
            fecha_inicio_empleado.setDate(fecha_inicio_empleado.getDate() + 1)

            let mes = fecha_inicio_empleado.getMonth() + 1

            if (mes.toString().length === 1) {
                mes = '0' + mes
            }

            let dia = fecha_inicio_empleado.getDate()
            let now = new Date();
            now.setDate(now.getDate() + 366)
            let año = now.getFullYear();

            let fecha_fin = new Date(mes + '/' + dia + '/' + año)
            let fecha_inicio = new Date(mes + '/' + dia + '/' + (año - 1))

            if (fecha_fin < fecha_inicio_empleado) {
                fecha_fin = new Date(mes + '/' + dia + '/' + (año + 1))
                fecha_inicio = new Date(mes + '/' + dia + '/' + año)
            }

            vacaciones_totales.map((vacacion, key) => {
                if (vacacion.estatus !== 'Aceptadas') {
                    let vacacion_fecha_inicio = new Date(vacacion.fecha_inicio)
                    let vacacion_fecha_fin = new Date(vacacion.fecha_fin)
                    if (vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)
                        contador.push(vacacion)
                }
                return false
            })

            return contador
        }
        else
            return contador
    }

    async askVacationAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'vacaciones', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert(response.data.message !== undefined ? response.data.message : 'Vacaciones solicitadas con éxito.')
                this.getVacacionesAxios();
                this.handleClose();

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getVacacionesAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { empleados, vacaciones, empleado, user_vacaciones, feriados, eventos, usuarios } = response.data
                data.usuarios = usuarios
                let aux = []
                let aux2 = []
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
                            iconClass: 'fas fa-birthday-cake',
                            containerClass: 'cumpleaños'
                        })
                    }
                    return false
                })
                vacaciones.map((vacacion) => {
                    if (vacacion.estatus === 'Aceptadas')
                        aux.push({
                            title: vacacion.empleado.nombre,
                            start: vacacion.fecha_inicio,
                            end: vacacion.fecha_fin,
                            iconClass: 'fas fa-umbrella-beach',
                            containerClass: 'vacaciones'
                        })
                    return false
                })

                feriados.map((feriado) => {
                    aux.push({
                        shortName: "Feriados",
                        title: feriado.texto,
                        start: feriado.fecha,
                        end: feriado.fecha,
                        iconClass: 'fas fa-calendar-check icon-md',
                        containerClass: 'feriados'
                    })
                    var start = moment(feriado.fecha).toDate();
                    aux2.push(start)
                    return false
                })

                eventos.map((evento) => {
                    aux.push({
                        shortName: 'Eventos',
                        title: evento.googleEvent.summary,
                        start: evento.googleEvent.start.dateTime,
                        end: evento.googleEvent.end.dateTime,
                        iconClass: 'far fa-clock',
                        containerClass: 'eventos',
                        evento: evento
                    })
                    return false
                })

                this.setState({
                    ...this.state,
                    events: aux,
                    empleado: empleado,
                    vacaciones_totales: user_vacaciones,
                    disponibles: this.getDiasDisponibles(empleado, user_vacaciones),
                    estatus: this.getVacaciones(empleado, user_vacaciones),
                    disabledDates: aux2,
                    data
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getEventsOneDateAxios(date) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                const { activeKey } = this.state
                let bandera = false
                Object.keys(eventos).map((evento, key) => {
                    if (eventos[evento].length && bandera === false && evento !== 'feriados')
                        bandera = evento
                })
                if (bandera === false)
                    bandera = 'estacionamiento'
                if (activeKey !== '')
                    bandera = activeKey
                console.log(bandera, 'bandera')
                this.setState({
                    ...this.state,
                    modal_date: true,
                    date: date,
                    eventos: eventos,
                    activeKey: bandera
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    solicitarCajon = async () => {
        const { access_token } = this.props.authUser
        const { date } = this.state
        waitAlert()
        await axios.put(URL_DEV + 'vacaciones/cajones/' + date, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('EL CAJÓN FUE ASIGNADO CON ÉXITO')
                this.getEventsOneDateAxios(date)
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteCajon = async (id) => {
        const { access_token } = this.props.authUser
        const { date } = this.state
        waitAlert()
        await axios.delete(URL_DEV + 'vacaciones/cajones/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                this.getEventsOneDateAxios(date)
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setInvitados = (invitados) => {
        const { data } = this.state
        if (invitados)
            return (
                <div>
                    <div className="d-flex mb-3 flex-wrap  justify-content-center">
                        {
                            invitados.map((invitado, index) => {
                                let aux = false
                                data.usuarios.map((user) => {
                                    if (user.email.toUpperCase() === invitado.email.toUpperCase()) {
                                        aux = user
                                    }
                                    return false
                                })
                                if (aux !== false) {
                                    if (aux.avatar) {
                                        return (
                                            <img className="calendar-avatar mr-3 mb-2" src={aux.avatar} alt='' key={index} />
                                        )
                                    } else {
                                        return (
                                            <img className="calendar-avatar mr-3 mb-2" src={AVATAR} alt='' key={index} />
                                        )
                                    }
                                }
                                return false
                            })
                        }
                    </div>
                    <div className="lista-invitados text-left">
                        {
                            invitados.map((invitado, index) => {
                                let aux = false
                                data.usuarios.map((user) => {
                                    if (user.email.toUpperCase() === invitado.email.toUpperCase()) {
                                        aux = user
                                    }
                                    return false
                                })
                                if (aux === false)
                                    return (
                                        <div className="d-flex align-items-center my-2" key={index}>
                                            <i className={invitado.responseStatus === 'accepted' ? "fas fa-check-circle kt-font-boldest mr-3 icon-green" : 'fas fa-clock kt-font-boldest mr-3 icon-purple'}></i>
                                            <span>{invitado.email}</span>
                                        </div>
                                    )
                                return false
                            })
                        }
                    </div>
                </div>

            )
    }

    setTimer = (time) => {
        switch (time) {
            case 0:
                return '00'
            case 1:
                return '01'
            case 2:
                return '02'
            case 3:
                return '03'
            case 4:
                return '04'
            case 5:
                return '05'
            case 6:
                return '06'
            case 7:
                return '07'
            case 8:
                return '08'
            case 9:
                return '09'
            default:
                return time
        }
    }

    getInvitadosSprits = invitados => {
        if (invitados)
            return (
                <img className="calendar-avatar" src={AVATAR} alt='' />
            )
    }

    renderEventContent = (eventInfo) => {
        if (eventInfo.event._def.extendedProps.evento) {
            let start = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.start.dateTime);
            let end = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.end.dateTime);
            return (
                <OverlayTrigger
                    /* defaultShow = { true } */
                    overlay={
                        <Tooltip className="tool-calendar">
                            <div className="tool-titulo">
                                <b>
                                    {eventInfo.event.title}
                                </b>
                            </div>
                            <div className="p-2">
                                <div className="tool-horario">
                                    <span>
                                        {
                                            this.setTimer(start.getHours()) + ':' + this.setTimer(start.getMinutes())
                                        }
                                            &nbsp; - &nbsp;
                                            {
                                            this.setTimer(end.getHours()) + ':' + this.setTimer(end.getMinutes())
                                        }
                                    </span>
                                </div>
                                <br />
                                {
                                    this.setInvitados(eventInfo.event._def.extendedProps.evento.googleEvent.attendees)
                                }
                            </div>
                        </Tooltip>
                    }
                >
                    <div className={eventInfo.event._def.extendedProps.containerClass + ' evento text-left'}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                                <span>{eventInfo.event.title}</span>
                            </div>
                            <div>
                                {
                                    this.getInvitadosSprits(eventInfo.event._def.extendedProps.evento.googleEvent.attendees)
                                }
                            </div>
                        </div>
                    </div>
                </OverlayTrigger>
            )
        }
        return (
            <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                    <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                    <span>{eventInfo.event.title}</span>
                </div>
            </OverlayTrigger>
        )
    }

    setDateText = date => {

        if (date !== '') {
            let fecha = moment(date)
            return dias[fecha.format('e')] + ' ' + parseInt(fecha.format('DD')) + ' de ' + meses[fecha.format('M') - 1] + ' del ' + fecha.format('YYYY')
        }
        else
            return ''
    }

    setNavTitle = element => {
        let icon = ''
        let nombre = ''
        switch (element) {
            case 'eventos':
                nombre = 'CITAS'
                icon = 'far fa-clock'
                break;
            case 'cumpleaños':
                nombre = 'CUMPLEAÑOS'
                icon = 'fas fa-birthday-cake'
                break;
            case 'vacaciones':
                nombre = 'VACACIONES'
                icon = 'fas fa-umbrella-beach'
                break;
            case 'estacionamiento':
                nombre = 'ESTACIONAMIENTO'
                icon = 'fas fa-car'
                break;
        }
        return (
            <>
                <span className="nav-icon"><i className={icon}></i></span>
                <span className="nav-text font-size-lg">{nombre}</span>
            </>
        )
    }

    changeActiveKey = element => {
        this.setState({
            ...this.state,
            activeKey: element
        })
    }

    printModal = () => {
        const { activeKey } = this.state

        switch (activeKey) {
            case 'eventos':
                return this.printEventos()
                break;
            case 'cumpleaños':
                return this.printCumpleaños()
                break;
            case 'vacaciones':
                return this.printVacaciones()
                break;
            case 'estacionamiento':
                return this.prinEstacionamiento()
                break
            default:
                return <></>
                break;
        }
    }
    getHours(dateTimeStart, dateTimeEnd) {
        var fechaStart = new Date(dateTimeStart)
        var horaStart = this.setTimer(fechaStart.getHours()) + ":" + this.setTimer(fechaStart.getMinutes())

        var fechaEnd = new Date(dateTimeEnd)
        var horaEnd = this.setTimer(fechaEnd.getHours()) + ":" + this.setTimer(fechaEnd.getMinutes())

        return horaStart + " - " + horaEnd
    }
    printEventos = () => {
        const { eventos } = this.state
        return (
            <>

                <Calendar />
                <div className="table-responsive">
                    <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-center text-uppercase">
                                <th style={{ minWidth: "100px" }} className="pl-7">
                                    <span className="text-dark-75">Nombre de la reunión</span>
                                </th>
                                <th style={{ minWidth: "100px" }}>Correo de participantes</th>
                                <th style={{ minWidth: "100px" }}>Hora de la reunión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                eventos.eventos.map((gEvent, key) => {
                                    return (
                                        <tr className="text-center" key={key}>
                                            <td>
                                                <div className="text-dark-75 font-weight-bolder mb-1 font-size-lg">{gEvent.googleEvent.summary}</div>
                                            </td>
                                            <td>
                                                {
                                                    gEvent.googleEvent.attendees.map((participantes, key) => {
                                                        return (
                                                            <span className="font-weight-light d-block text-lowercase" key={key}>{participantes.email}</span>
                                                        )
                                                    })
                                                }
                                            </td>
                                            <td>
                                                <span className="font-weight-light">
                                                    {this.getHours(gEvent.googleEvent.start.dateTime, gEvent.googleEvent.end.dateTime)}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
    printCumpleaños = () => {
        const { eventos } = this.state
        return (
            <>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <div className="text-primary text-center font-weight-bolder font-size-h2">
                            ¡Feliz Cumpleaños!
                        </div>
                        <HappyBirthday />
                    </div>
                    <div className="col-md-12 text-center mt-3">
                        {
                            eventos.cumpleaños.map((cumpleaños, key) => {
                                return (
                                    <div key={key}>
                                        <div className="font-weight-bold text-dark mb-1 font-size-lg">
                                            {cumpleaños.nombre}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
    printVacaciones = () => {
        const { eventos } = this.state
        return (
            <>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-12">
                        <div className="text-primary text-center font-weight-bolder font-size-h2">
                            ¡Felices Vacaciones!
                        </div>
                        <PassportTravel />
                    </div>
                    <div className="col-md-12 text-center mt-3">
                        {
                            eventos.vacaciones.map((vacaciones, key) => {
                                return (
                                    <div key={key}>
                                        <div className="font-weight-bold text-dark mb-1 font-size-lg">
                                            {vacaciones.empleado.nombre}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
    prinEstacionamiento = () => {
        const { eventos } = this.state
        const { user } = this.props.authUser
        let size = 3
        return (
            <>
                {
                    this.isActiveSolicitarButton() ?
                        <div className='d-flex justify-content-end mb-4'>
                            <Button icon='' className="btn btn-icon btn-xs w-auto p-3 btn-light-info mr-2 mt-2"
                                onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', `PEDIRÁS EL CAJÓN DE ESTACIONAMIENTO EL DÍA ${this.setDateText()}`, () => this.solicitarCajon()) }}
                                only_icon="far fa-calendar-check icon-15px mr-2" text='SOLICITAR ESPACIO' />
                        </div>
                        : ''
                }
                <div className='row mx-0 justify-content-center '>
                    {
                        eventos.estacionamiento.length === 0 ?
                            <div className='col-md-6'>
                                <EmptyParkSlot />
                            </div>
                            : ''
                    }
                    {
                        eventos.estacionamiento.map((auto, key) => {
                            return (
                                <div key={key} className={`col-md-${size}`}>
                                    <div className='row mx-0 h-100 justify-content-center border' >
                                        <div className='col-10 border position-relative'>
                                            {
                                                auto ?
                                                    auto.empleado ?
                                                        auto.empleado.usuario ?
                                                            auto.empleado.usuario.id === user.id ?
                                                                <div className='position-absolute button-up'
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        questionAlert('¿ESTÁS SEGURO?', `YA NO TENDRÁS EL CAJÓN PARA EL DÍA ${this.setDateText()}`, () => this.deleteCajon(auto.id))
                                                                    }}>
                                                                    <i className="fa fa-times text-danger"></i>
                                                                </div>
                                                                : ''
                                                            : ''
                                                        : ''
                                                    : ''
                                            }
                                            {
                                                (key + 1) % 2 === 1 ?
                                                    <ParkingRed />
                                                    : <Parking />
                                            }
                                            <div className='text-center mb-3 font-weight-bold text-dark-75'>
                                                {
                                                    auto ?
                                                        auto.empleado ?
                                                            auto.empleado.usuario ?
                                                                auto.empleado.usuario.name
                                                                : ''
                                                            : ''
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }

    isActiveSolicitarButton = () => {
        const { eventos } = this.state
        const { user } = this.props.authUser
        let bandera = false
        if (eventos.estacionamiento)
            if (eventos.estacionamiento.length < 2 && eventos.estacionamiento.length >= 0) {
                eventos.estacionamiento.map((auto) => {
                    if (auto.empleado)
                        if (auto.empleado.usuario)
                            if (auto.empleado.usuario.id.toString() === user.id.toString())
                                bandera = true
                })
            } else
                bandera = true
        if (bandera)
            return false
        return true
    }

    render() {
        const { events, form, title, formeditado, modal, modal_status, estatus, disponibles, disabledDates, modal_date, date, eventos, activeKey } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Tab.Container defaultActiveKey="calendario_citas" className="p-5">
                    <Card className="card-custom">
                        <Card.Header>
                            <div className="d-flex align-items-center">
                                <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded d-inline-flex d-flex justify-content-center navi-info navi-accent">
                                    <Nav.Item className="navi-item mr-3">
                                        <Nav.Link className="navi-link px-2" eventKey="calendario_citas" style={{ display: '-webkit-box' }}>
                                            <span className="navi-icon mx-2">
                                                <i className="far fa-calendar-check"></i>
                                            </span>
                                            <div className="navi-text">
                                                <span className="d-block font-weight-bolder">Citas y cumpleaños</span>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="navi-item mr-3">
                                        <Nav.Link className="navi-link px-2" eventKey="calendario_estacionamiento" style={{ display: '-webkit-box' }}>
                                            <span className="navi-icon mx-2">
                                                <i className="fas fa-car-alt"></i>
                                            </span>
                                            <div className="navi-text">
                                                <span className="d-block font-weight-bolder">Estacionamiento</span>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                            <div className="card-toolbar">
                                {
                                    disponibles > 0 ?
                                        <DropdownButton
                                            title={
                                                <i className="ki ki-bold-more-ver p-0"></i>
                                            }
                                            id={`dropdown-button-drop-left`}
                                            drop={'left'}
                                        >
                                            <Dropdown.Item onClick={this.openModal}>Solicitar vacaciones</Dropdown.Item>
                                            <Dropdown.Item onClick={this.openModalEstatus}>Estatus de vacaciones</Dropdown.Item>
                                        </DropdownButton>
                                        : ''
                                }
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="calendario_citas">
                                    <div className="mb-3">
                                        <i className="fa fa-genderless text-info mr-2"></i>
                                        <span className=" font-weight-bolder font-size-lg">Vacaciones disponibles:</span>
                                        <span className="label label-rounded label-light-info font-weight-bolder ml-2">{disponibles}</span>
                                        <span className=" font-weight-bolder font-size-lg ml-2">días.</span>
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
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="calendario_estacionamiento">
                                    <div className="mb-3">
                                        <i className="fa fa-genderless text-info mr-2"></i>
                                        <span className=" font-weight-bolder font-size-lg">Vacaciones disponibles:</span>
                                        <span className="label label-rounded label-light-info font-weight-bolder ml-2">{disponibles}</span>
                                        <span className=" font-weight-bolder font-size-lg ml-2">días.</span>
                                    </div>
                                    {/* <FullCalendar
                                        locale={esLocale}
                                        plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                        initialView="dayGridMonth"
                                        weekends={true}
                                        events={events}
                                        dateClick={this.handleDateClick}
                                        eventContent={this.renderEventContent}
                                        firstDay={1}
                                        themeSystem='bootstrap'
                                    /> */}
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </Card>
                </Tab.Container>
                <Modal title={title} show={modal} handleClose={this.handleClose} size="lg">
                    <SolicitarVacacionesForm
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChange}
                        disabledDates={disabledDates}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.askVacationAxios() }}
                    />
                </Modal>
                <Modal title={title} show={modal_status} handleClose={this.handleCloseEstatus}>
                    <EstatusForm
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChange}
                        estatus={estatus}
                    />
                </Modal>
                <Modal size='lg' title={this.setDateText(date)} show={modal_date} handleClose={this.handleCloseDate}>
                    {
                        eventos !== '' ?
                            <>
                                {
                                    eventos.feriados.length ?
                                        eventos.feriados.map((feriado, key) => {
                                            return (
                                                <div className='px-3 mx-3 my-2 py-2 feriados text-center' key={key}>
                                                    ¡Feliz {feriado.texto}!
                                                </div>
                                            )
                                        })
                                        : ''
                                }
                                <Nav className='nav nav-pills nav-pills-md nav-light-primary nav-bolder justify-content-center my-4'>
                                    {
                                        Object.keys(eventos).map((element, key) => {
                                            if ((eventos[element].length || element === 'estacionamiento') && element !== 'feriados') {
                                                return (
                                                    <Nav.Item className='nav-item' key={key}>
                                                        <Nav.Link eventKey={element} className={activeKey === element ? "nav-link py-2 px-4 text-primary active" : ' nav-link py-2 px-4'} onClick={(e) => { e.preventDefault(); this.changeActiveKey(element) }} >
                                                            {this.setNavTitle(element)}
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                )
                                            }
                                        })
                                    }
                                </Nav>
                                {this.printModal()}
                            </>
                            : ''
                    }
                </Modal>

            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)