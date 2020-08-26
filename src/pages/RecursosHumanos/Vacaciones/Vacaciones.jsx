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
import { Card } from 'react-bootstrap' 

// import bootstrapPlugin from '@fullcalendar/bootstrap'
const $ = require('jquery');

class Vacaciones extends Component {

    state = {
        events: [
            {
                title: 'Evento 1',
                start: '2020-08-05',
                end: '2020-08-05',
                iconClass: 'fas fa-user-tie'
            }
        ]
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

    async getVacaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, vacaciones } = response.data
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
                            iconClass: 'fas fa-birthday-cake icon-md',
                            containerClass: 'cumpleaños'
                        })
                    }
                })
                vacaciones.map( (vacacion) => {
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
                    events: aux
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
        const { events } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom"> 
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Vacaciones</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FullCalendar
                            locale = { esLocale }
                            plugins = {[ dayGridPlugin, interactionPlugin, 
                                            // bootstrapPlugin 
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
            </Layout>
        );
    }
}

function renderEventContent(eventInfo) {
    console.log(eventInfo)
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

export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)