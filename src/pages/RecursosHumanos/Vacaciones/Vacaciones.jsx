import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';

class Vacaciones extends Component {

    state = {
        events: []
    }

    handleDateClick = (arg) => { // bind with an arrow function
        console.log(arg)
        alert(arg.dateStr)
    }

    render() {
        const { events } = this.state
        return (
            <Layout active='rh'  {...this.props}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)