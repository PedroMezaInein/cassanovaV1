import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { forbiddenAccessAlert, errorAlert } from '../../../functions/alert';
import { URL_DEV } from '../../../constants';
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setTextTable, setDateTable } from '../../../functions/setters';
import { Button } from '../../../components/form-components';
import { faTrashAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../../../components/singles'
import { Calendar } from '@fullcalendar/core';
// import googleCalendarPlugin from '@fullcalendar/google-calendar';
class Vacaciones extends Component {

    state = {
        modal: false,
        events: [
            {
                shortName:"Evento 1",
                title: 'Evento 1',
                start: '2020-08-05',
                end: '2020-08-05',
                iconClass: 'fas fa-user-tie'
            }
        ],
        espera: []
    }
    
    componentDidMount(){
        // if(document.body.classList.contains('fc'))
        // {           
            // document.body.classList.remove('fc-media-screen');   
            // document.body.classList.remove('fc-direction-ltr'); 
            // document.body.classList.remove('fc-theme-standard');   
            // document.body.classList.add('fc-ltr');
            // document.body.classList.add('fc-unthemed');
        // }
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
            modal: true
        })
    }

    handleClose = () => {
        this.setState({
            ... this.state,
            modal: false
        })
    }

    async getVacaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, vacaciones, vacaciones_espera } = response.data
                let aux = []
                let mes = ''
                let dia = ''
                let año = new Date().getFullYear();
                empleados.map( (empleado, key) => {
                    
                    console.log(empleado)
                    mes = empleado.rfc.substr(6,2);
                    dia = empleado.rfc.substr(8,2);
                    for(let x = -5; x <= 5; x++){
                        aux.push({
                            title: empleado.nombre,
                            shortName: empleado.nombre.split(" ")[0],
                            start: Number(Number(año) + Number(x))+'-'+mes+'-'+dia,
                            end: Number(Number(año) + Number(x))+'-'+mes+'-'+dia,
                            iconClass: 'fas fa-birthday-cake icon-md',
                            containerClass: 'cumpleaños'
                        })
                    }
                })
                vacaciones.map( (vacacion) => {
                    aux.push({
                        shortName:"Vacaciones",
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
                    espera: vacaciones_espera
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
        const { events, espera, modal } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom"> 
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Vacaciones</h3>
                        </div>
                        <div className="card-toolbar">
                            <OverlayTrigger overlay={<Tooltip>Mostrar solicitudes</Tooltip>}>
                                <a className="btn btn-light-primary font-weight-bold px-2" onClick={this.openModal}>
                                    <i className="fas fa-umbrella-beach"></i>
                                </a>
                            </OverlayTrigger>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FullCalendar 
                            className={"prueba"}
                            locale = { esLocale }
                            plugins = {[ dayGridPlugin, interactionPlugin, 
                                            bootstrapPlugin 
                                        ]}
                            initialView = "dayGridMonth"
                            weekends = { true }
                            events = { events }
                            dateClick = { this.handleDateClick }
                            eventContent = { renderEventContent }
                            firstDay = { 1 }
                            headerToolbar=  {{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth' 
                                
                            }}
                            themeSystem ='bootstrap'
                            />
                    </Card.Body>
				</Card>
                <Modal title = "Solicitudes de vacaciones" show = { modal } handleClose = { this.handleClose } >
                    {
                        espera.map( ( empleado, key) => {
                            return(
                                <Card className="card-custom" key = { key } >
                                    <Card.Header>
                                        <div className="card-title">
                                            { empleado.nombre }
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {
                                            empleado.vacaciones.map( (vacacion, key) => {
                                                return(
                                                    <div className="row mx-0">
                                                        <div className="col-md-4">
                                                            <div className="d-flex align-items-center h-100">
                                                                {
                                                                    setDateTable(vacacion.fecha_inicio)
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="d-flex align-items-center h-100">
                                                                {
                                                                    setDateTable(vacacion.fecha_fin)
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <Button icon={faCalendarCheck} 
                                                                pulse={"pulse-ring"} 
                                                                className={"btn btn-icon btn-light-primary pulse pulse-primary mr-2 ml-auto"}
                                                                onClick = { (e) =>  { e.preventDefault(); alert('Aceptar vacaciones')} }/>
                                                            <Button icon={faTrashAlt} 
                                                                pulse={"pulse-ring"} 
                                                                className={"btn btn-icon btn-light-danger pulse pulse-danger"}
                                                                onClick = { (e) =>  { e.preventDefault(); alert('Rechazar vacaciones')} }/>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </Modal>
            </Layout>
        );
    }
}

function renderEventContent(eventInfo) {
    console.log(eventInfo)
    return (
        <OverlayTrigger overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
            <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
            <i className={eventInfo.event._def.extendedProps.iconClass+" kt-font-boldest mr-3"}></i> 
            <span>{eventInfo.event._def.extendedProps.shortName}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)