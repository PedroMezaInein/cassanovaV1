import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Card } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Modal } from '../../components/singles'
import { SolicitarVacacionesForm } from "../../components/forms";
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert } from '../../functions/alert';
import { countDaysWithoutWeekend } from '../../functions/functions';
import { URL_DEV } from '../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { string } from 'prop-types';
class Calendario extends Component {

    state = {
        disponibles: 1,
        events: [],
        formeditado: 0,
        modal: false,
        empleado: '',
        vacaciones_totales: '',
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
        }
    };

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        this.getVacaciones()
    }

    handleDateClick = (arg) => { // bind with an arrow function
        console.log(arg)
        alert(arg.dateStr)
    }
    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Solicitar vacaciones',
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
        })
        return form;
    }
    handleClose = () => {
        const { modal, options } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            options,
            title: 'Solicitar vacaciones',
            concepto: '',
            form: this.clearForm()
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    getDiasDisponibles = (empleado, vacaciones_totales) => {
        /* const { empleado, vacaciones_totales } = this.state */
        /* console.log(empleado, 'empleado') */
        let contador =  0
        let fecha_inicio_empleado = ''
        if(empleado){

            fecha_inicio_empleado = new Date(empleado.fecha_inicio)
            fecha_inicio_empleado.setDate(fecha_inicio_empleado.getDate() + 1)
            
            let mes = fecha_inicio_empleado.getMonth() + 1
            
            if(mes.toString().length === 1){
                mes = '0'+mes
            }
            
            let dia = fecha_inicio_empleado.getDate()
            let now = new Date();
            now.setDate(now.getDate() + 366)
            let año = now.getFullYear();

            let fecha_fin = new Date(mes+'/'+dia+'/'+año)
            let fecha_inicio = new Date(mes+'/'+dia+'/'+(año-1))

            if(fecha_fin < fecha_inicio_empleado){
                fecha_fin = new Date(mes+'/'+dia+'/'+(año+1))
                fecha_inicio = new Date(mes+'/'+dia+'/'+año)
            }

            vacaciones_totales.map( (vacacion, key) => {
                if(vacacion.estatus !== 'Rechazadas'){
                    let vacacion_fecha_inicio = new Date(vacacion.fecha_inicio)
                    let vacacion_fecha_fin = new Date(vacacion.fecha_fin)
                    if(vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)
                        contador = contador + countDaysWithoutWeekend(vacacion_fecha_inicio, vacacion_fecha_fin)
                    if(vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && !(vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin))
                    {
                        while(vacacion_fecha_inicio.getTime() >= vacacion_fecha_fin.getTime()){
                            if(vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin)
                                if(vacacion_fecha_inicio.getDay() !== 6 && vacacion_fecha_inicio.getDay() !== 0)
                                    contador ++
                            vacacion_fecha_inicio.setDate(vacacion_fecha_inicio.getDate() + 1);
                        }
                    }
                    if(!(vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin) && (vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin))
                    {
                        while(vacacion_fecha_inicio.getTime() < vacacion_fecha_fin.getTime()){
                            if(vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin){
                                if(vacacion_fecha_fin.getDay() !== 6 && vacacion_fecha_fin.getDay() !== 0)
                                    contador ++
                            }
                            vacacion_fecha_fin.setDate(vacacion_fecha_fin.getDate() - 1);
                        }
                    }
                }
            })

            return empleado.vacaciones_disponibles - contador
        }
        else
            return contador
    }

    async askVacationAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'vacaciones', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Vacaciones solicitadas con éxito.')
                this.setState({
                    ... this.state,
                    modal: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getVacaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, vacaciones, empleado, user_vacaciones } = response.data
                let aux = []
                let mes = ''
                let dia = ''
                let año = new Date().getFullYear();
                empleados.map( (empleado, key) => {
                    mes = empleado.rfc.substr(6,2);
                    dia = empleado.rfc.substr(8,2);
                    for(let x = -5; x <= 5; x++){
                        aux.push({
                            title: empleado.nombre,
                            start: Number(Number(año) + Number(x))+'-'+mes+'-'+dia,
                            end: Number(Number(año) + Number(x))+'-'+mes+'-'+dia,
                            iconClass: 'fas fa-birthday-cake',
                            containerClass: 'cumpleaños'
                        })
                    }
                })
                vacaciones.map( (vacacion) => {
                    if(vacacion.estatus === 'Aceptadas')
                        aux.push({
                            title: vacacion.empleado.nombre,
                            start: vacacion.fecha_inicio,
                            end: vacacion.fecha_fin,
                            iconClass: 'fas fa-umbrella-beach',
                            containerClass: 'vacaciones'
                        })
                })

                this.setState({
                    ... this.state,
                    events: aux,
                    empleado: empleado,
                    vacaciones_totales: user_vacaciones,
                    disponibles: this.getDiasDisponibles(empleado, user_vacaciones)
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { events, form, title, formeditado, modal, key, disponibles } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom"> 
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Calendario</h3>
                        </div>
                        <div className="card-toolbar">
                        <OverlayTrigger overlay={<Tooltip>Solicitar vacaciones</Tooltip>}>
                            <a className="btn btn-light-primary font-weight-bold px-2" onClick={this.openModal}>
                                <i className="fas fa-umbrella-beach"></i>
                            </a>
                        </OverlayTrigger>
                        </div>
                    </Card.Header>
                    <Modal title={title} show={modal} handleClose={this.handleClose}>
                        <SolicitarVacacionesForm
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                            onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.askVacationAxios()}}
                        />
                    </Modal>
                    <Card.Body>
                        <div className="mx-0 py-2">
                            <b>Vacaciones disponibles: </b>{ disponibles }
                        </div>
                        <FullCalendar
                            locale = { esLocale }
                            plugins = {[ dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                            initialView = "dayGridMonth"
                            weekends = { true }
                            events = { events }
                            dateClick = { this.handleDateClick }
                            eventContent = { renderEventContent }
                            firstDay = { 1 }
                            themeSystem='bootstrap'
                            />
                    </Card.Body>
				</Card>
            </Layout>
        );
    }
}

function renderEventContent(eventInfo) {
    return (
        <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
            <i className={eventInfo.event._def.extendedProps.iconClass+" kt-font-boldest mr-3"}></i> 
            <span>{eventInfo.event.title}</span>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Calendario)