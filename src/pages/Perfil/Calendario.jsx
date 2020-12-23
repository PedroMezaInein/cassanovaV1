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
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert } from '../../functions/alert';
import { countDaysWithoutWeekend } from '../../functions/functions';
import { URL_DEV } from '../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import {DropdownButton, Dropdown,Card, OverlayTrigger, Tooltip, Nav} from 'react-bootstrap'
import moment from 'moment'
import AVATAR from '../../assets/images/icons/avatar.png'
import Swal from 'sweetalert2'
import { Parking } from '../../components/Lottie';

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
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
        data:{
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

                eventos.map((evento)=>{
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

    async getEventsOneDateAxios(date){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                let bandera = false
                Object.keys(eventos).map((evento, key) => {
                    if(eventos[evento].length && bandera === false && evento !== 'feriados')
                        bandera = evento
                })
                if(bandera === false)
                    bandera = 'estacionamiento'
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

    setInvitados = (invitados) => {
        const { data } = this.state
        if(invitados)
            return(
                <div>
                    <div className="d-flex mb-3 flex-wrap  justify-content-center">
                        {
                            invitados.map((invitado, index)=>{
                                let aux = false
                                data.usuarios.map((user)=>{
                                    if(user.email.toUpperCase() === invitado.email.toUpperCase()){
                                        aux = user
                                    }
                                    return false
                                })
                                if(aux !== false)
                                {
                                    if(aux.avatar){
                                        return(
                                            <img className = "calendar-avatar mr-3 mb-2" src = {aux.avatar} alt = '' />
                                        )
                                    }else{
                                        return(
                                            <img className = "calendar-avatar mr-3 mb-2" src = {AVATAR} alt = '' />
                                        )   
                                    }
                                }
                                return false
                            })
                        }
                    </div>
                    <div className="lista-invitados text-left">
                        {
                            invitados.map((invitado)=>{
                                let aux = false
                                data.usuarios.map((user)=>{
                                    if(user.email.toUpperCase() === invitado.email.toUpperCase()){
                                        aux = user
                                    }
                                    return false
                                })
                                if(aux === false)
                                return(
                                    <div className="d-flex align-items-center my-2">
                                        <i className={ invitado.responseStatus === 'accepted' ? "fas fa-check-circle kt-font-boldest mr-3 icon-green" : 'fas fa-clock kt-font-boldest mr-3 icon-purple'}></i>
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
        switch(time){
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
        if(invitados)
            return(
                <img className = "calendar-avatar" src = {AVATAR}  alt = ''/>
            )
    }

    renderEventContent = (eventInfo) => {
        if(eventInfo.event._def.extendedProps.evento){
            let start = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.start.dateTime);
            let end = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.end.dateTime);
            return(
                    <OverlayTrigger 
                        /* defaultShow = { true } */
                        overlay = {
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
        if(date !== ''){
            let fecha = moment(date)
            return fecha.format('DD') + ' de ' + meses[fecha.format('M') - 1] + ' del ' + fecha.format('YYYY')
        }
        else
            return ''
    }

    setNavTitle = element => {
        let icon = ''
        let nombre = ''
        let active = ''
        const { activeKey } = this.state
        if(activeKey === element)
            active = ' text-primary '
        switch(element){
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
        return(
            <>
                <i className= { icon + ' icon-15px mr-2 ' + active}></i>
                {nombre}
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
        switch(activeKey){
            case 'eventos':
            case 'cumpleaños':
            case 'vacaciones': 
                break;
            case 'estacionamiento':
                return this.prinEstacionamiento()
                break
        }
    }

    prinEstacionamiento = () => {
        const { eventos } = this.state
        let size = eventos.estacionamiento.length > 4 ? 3 : 12/eventos.estacionamiento.length
        return (
            <>
                <div className = 'row mx-0 justify-content-center '>
                    {
                        eventos.estacionamiento.map((auto, key) => {
                            return(
                                <div className = { `col-md-${size}` }>
                                    <div className = 'text-center my-2'>
                                        {auto}
                                    </div>
                                    <div className = 'row justity-content-center' >
                                        <div className = 'col-6'>
                                            <Parking />
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

    render() {
        const { events, form, title, formeditado, modal, modal_status, estatus, disponibles, disabledDates, modal_date, date, eventos, activeKey } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Calendario</h3>
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
                                :''
                            }
                            
                        </div>
                    </Card.Header>
                    <Modal title={title} show={modal} handleClose={this.handleClose} size = "lg">
                        <SolicitarVacacionesForm
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                            disabledDates = { disabledDates }
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

                    <Modal size = 'lg' title = { this.setDateText(date) } show = { modal_date } handleClose = { this.handleCloseDate }>
                        {

                            eventos !== '' ?
                                <Card className="card-custom shadow-none" >
                                    {
                                        eventos.feriados.length ?
                                            eventos.feriados.map((feriado, key) => {
                                                return(
                                                    <div className = 'px-3 mx-3 my-2 py-2 feriados text-center'>
                                                        ¡Feliz {feriado.texto}!
                                                    </div>        
                                                )
                                            })                                        
                                        : ''
                                    }
                                    <Card.Header>
                                        
                                        <div className = 'card-toolbar'>
                                            <Nav className = 'nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder'>
                                                {
                                                    Object.keys(eventos).map((element, key) => {
                                                        if((eventos[element].length || element === 'estacionamiento') && element !== 'feriados'){
                                                            return(
                                                                <Nav.Item key={key}>
                                                                    <Nav.Link eventKey={element} className={ activeKey === element ? "py-2 px-4 text-primary" : 'py-2 px-4'} onClick={(e) => { e.preventDefault(); this.changeActiveKey(element) }} >
                                                                        {this.setNavTitle(element)}
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Nav>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {this.printModal()}
                                    </Card.Body>
                                </Card>
                            : ''
                        }
                        
                    </Modal>

                    <Card.Body> 
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
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Calendario)