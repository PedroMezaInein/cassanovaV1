import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Modal } from '../../components/singles'
import { SolicitarVacacionesForm, EstatusForm} from "../../components/forms";
import { errorAlert, forbiddenAccessAlert, waitAlert, doneAlert } from '../../functions/alert';
import { URL_DEV } from '../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
class Calendario extends Component {

    state = {
        events: [],
        formeditado: 0,
        modal: false,
        modal_status:false,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
        },
        estatus: []
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
    openModalEstatus = () => {
        this.setState({
            ... this.state,
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
            form: this.clearForm()
        })
    }
    handleCloseEstatus = () => {
        const { modal_status } = this.state
        this.setState({
            ... this.state,
            modal_status: !modal_status,
            title: 'Estatus de vacaciones',
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
                const { empleados, vacaciones, user_vacaciones} = response.data
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
                    estatus:user_vacaciones
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
        const { events, form, title, formeditado, modal, key, modal_status, estatus} = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom"> 
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Calendario</h3>
                        </div>
                        <div className="card-toolbar">
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
                    <Modal title={title} show={modal_status} handleClose={this.handleCloseEstatus}>
                        <EstatusForm
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                            estatus={estatus}
                        />
                    </Modal>
                    <Card.Body>
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
        <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
            <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                <span>{eventInfo.event.title}</span>
            </div>
        </OverlayTrigger>
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