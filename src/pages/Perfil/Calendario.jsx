import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Card } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Modal } from '../../components/singles'
import { SolicitarVacacionesForm } from "../../components/forms";
class Calendario extends Component {

    state = {
        events: [],
        formeditado: 0,
        modal: false,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
        }
    };

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

    render() {
        const { events, form, title, formeditado, modal, key} = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom"> 
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Calendario</h3>
                        </div>
                        <div class="card-toolbar">
                        <OverlayTrigger overlay={<Tooltip>Solicitar vacaciones</Tooltip>}>
                            <a class="btn btn-light-primary font-weight-bold px-2" onClick={this.openModal}>
                                <i class="fas fa-umbrella-beach"></i>
                            </a>
                        </OverlayTrigger>
                        </div>
                    </Card.Header>
                    <Modal title={title} show={modal} handleClose={this.handleClose}>
                        <SolicitarVacacionesForm
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                        />
                    </Modal>
                    <Card.Body>
                        <FullCalendar
                            locale = { esLocale }
                            plugins = {[ dayGridPlugin, interactionPlugin ]}
                            initialView = "dayGridMonth"
                            weekends = { true }
                            events = { events }
                            dateClick = { this.handleDateClick }
                            eventContent = { renderEventContent }
                            firstDay = { 1 }
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
        <div class="event">
            <i className={eventInfo.event._def.extendedProps.iconClass+" kt-font-boldest"}></i> 
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