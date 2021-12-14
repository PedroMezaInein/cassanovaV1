import React, { Component } from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import SVG from 'react-inlinesvg'
import { dayDMY } from '../../../functions/setters'
import { toAbsoluteUrl } from '../../../functions/routers'
import { Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { apiPutForm, apiGet, catchErrors } from '../../../functions/api'
import { SelectHorario, TagInputGray, Button } from '../../form-components'
import { validateAlert, questionAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'

class AddEvent extends Component {
    state = {
        form: {
            hora_inicio: 0,
            minuto_inicio: 0,
            hora_final: 0,
            minuto_final: 0,
            correos: []
        },
        edit:false
    }
    tagInputChange = (nuevosCorreos) => {
        const { form } = this.state 
        let emailValid = true
        var regex =/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i;
        for (var i = 0; i < nuevosCorreos.length; i++) {
            if(!regex.test(nuevosCorreos[i])){
                emailValid = false
            }
        }
        if(emailValid){
            let unico = {};
            nuevosCorreos.forEach(function (i) {
                if (!unico[i]) { unico[i] = true }
            })
            form.correos = nuevosCorreos ? Object.keys(unico) : [];
        } else { 
            Swal.fire({
                title: '¡LO SENTIMOS!',
                text: 'La dirección de correo es incorrecta.',
                icon: 'warning',
                customClass: { actions: 'd-none' },
                timer: 2500
            })
        }
        this.setState({ ...this.state, form })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    generateEvent = async() => {
        const { ticket, at, refresh } = this.props
        const { form } = this.state
        waitAlert()
        apiPutForm(`v3/calidad/tickets/${ticket.id}/evento`, form, at).then(
            (response) => {
                doneAlert( `Evento generado con éxito`, () => refresh(ticket.id))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    updateEvent = async() => {
        const { ticket, at, refresh } = this.props
        const { form } = this.state
        waitAlert()
        apiPutForm(`v3/calidad/tickets/${ticket.id}/update-evento`, form, at).then(
            (response) => {
                doneAlert( `Evento editado con éxito`, () => refresh(ticket.id))
                form.correos=[]
                this.setState({ ...this.state, form, edit:false })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    onSubmit = () => {
        const { edit } = this.state
        waitAlert()
        if(!edit){
            this.generateEvent()
        }else{
            this.updateEvent()
        }
    }
    printHour(start, end){
        let hora_inicio= moment(start).format("LT")
        let hora_final= moment(end).format("LT")
        return `${hora_inicio} a ${hora_final}`
    }
    statusType(status, type){
        switch (status) {
            case 'needsAction':
                switch (type) {
                    case 'tooltip':
                        return 'tooltip-warning'
                    case 'text':
                        return 'Pendiente'
                    case 'svg':
                        return 'svg-icon-warning'
                    case 'icon':
                        return (
                            <SVG src={toAbsoluteUrl('/images/svg/Warning-1-circle.svg')} />
                        )
                    default: break;
                }
            case 'declined':
                switch (type) {
                    case 'tooltip':
                        return 'tooltip-danger'
                    case 'text':
                        return 'No asistirá'
                    case 'svg':
                        return 'svg-icon-danger'
                    case 'icon':
                        return (
                            <SVG src={toAbsoluteUrl('/images/svg/Error-circle.svg')} />
                        )
                    default: break;
                }
            case 'tentative':
                switch (type) {
                    case 'tooltip':
                        return 'tooltip-info'
                    case 'text':
                        return 'Quizá asistirá'
                    case 'svg':
                        return 'svg-icon-info'
                    case 'icon':
                        return (
                            <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                        )
                    default: break;
                }
            case 'accepted':
                switch (type) {
                    case 'tooltip':
                        return 'tooltip-success2'
                    case 'text':
                        return 'Asistirá'
                    case 'svg':
                        return 'svg-icon-success2'
                    case 'icon':
                        return (
                            <SVG src={toAbsoluteUrl('/images/svg/Done-circle.svg')} />
                        )
                    default: break;
                }
            default: break;
        }
    }
    printAttendees = (event) => {
        if (event.attendees.length) {
            return (
                <div>
                    <div className="p-3 text-center"><span className="bg-light rounded px-2 py-1 font-weight-bolder">Correo de los asistentes</span></div>
                    <div className="my-5 w-max-content mx-auto">
                        {
                            event.attendees.map((attend, key) => {
                                return (
                                    <div key={key} className="d-flex justify-content-between mb-1">
                                        <div className="text-dark-75 font-weight-normal text-no-transform ">• {attend.email}</div>
                                        <div className="ml-10 mb-3">
                                            <OverlayTrigger rootClose placement="right" overlay={<Tooltip className={this.statusType(attend.responseStatus, 'tooltip')}>{this.statusType(attend.responseStatus, 'text')}</Tooltip>}>
                                                <span className={`svg-icon svg-icon-md ${this.statusType(attend.responseStatus, 'svg')}`}>
                                                    {this.statusType(attend.responseStatus, 'icon')}
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <>Sin correos de clientes</>
            )
        }
    }
    printSchedule = () => {
        const { form, edit } = this.state
        const { ticket } = this.props
        if(ticket){
            if(ticket.fecha_programada){
                if(ticket.event){
                    if(ticket.event.googleEvent){
                        if(!edit){
                            return(
                                <>
                                    <div>
                                        <div className="icons-cuadro d-flex justify-content-center">
                                            <div className="icon-div">
                                                <i className="flaticon-clock-1"></i>
                                            </div>
                                        </div>
                                        <div className="mb-4 text-center mt-1">
                                            <div className="text-dark-75 font-weight-light">Horario de la visita</div>
                                            <div className="text-dark font-weight-bolder font-size-h3 mb-0">{this.printHour(ticket.event.googleEvent.start.dateTime, ticket.event.googleEvent.end.dateTime)}</div>
                                        </div>
                                    </div>
                                    {this.printAttendees(ticket.event.googleEvent)}
                                    <div className="card-footer pt-6 pb-0 px-0 text-center">
                                        <Button text='Modificar hora de visita' type='submit' className="btn btn-sm btn-light-info font-weight-bold"
                                            icon='' onClick={ () => { this.editTime(true) } }
                                        />
                                    </div>
                                </>
                            )
                        }else{
                            return(
                                <>
                                    <Form id="form-editar-horarios">
                                        <div className="row mx-0">
                                            <div className="col-md-12 col-xxl-6 text-center">
                                                <label className="col-form-label font-weight-bolder text-dark-60">Hora de inicio</label>
                                                <div className="mb-3 row d-flex justify-content-center">
                                                    <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_inicio, name: 'minuto_inicio' }}
                                                        hora={{ value: form.hora_inicio, name: 'hora_inicio' }} allhours={true} width='w-60' />
                                                </div>
                                                {
                                                    form.hora_inicio !== 0 && form.minuto_inicio !== 0 ?
                                                        <></>
                                                        : <span className="form-text text-danger is-invalid">Hora de incio</span>
                                                }
                                            </div>
                                            <div className="col-md-12 d-block d-xxl-none my-5">
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="col-md-12 col-xxl-6 text-center">
                                                <label className="col-form-label font-weight-bolder text-dark-60">Hora final</label>
                                                <div className="mb-3 row d-flex justify-content-center">
                                                    <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_final, name: 'minuto_final' }}
                                                        hora={{ value: form.hora_final, name: 'hora_final' }} allhours={true} width='w-60' />
                                                </div>
                                                {
                                                    form.hora_final !== 0 && form.minuto_final !== 0 ?
                                                        <></>
                                                        : <span className="form-text text-danger is-invalid">Hora de termino</span>
                                                }
                                            </div>
                                            <div className="col-md-12 my-5">
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="w-80 mt-5 mx-auto card card-custom bg-diagonal shadow-sm gutter-b">
                                                <div className="card-body p-2">
                                                    <div className="p-4">
                                                        <div className="d-flex flex-column justify-content-center flex-row-fluid pr-11 mb-5">
                                                            <div className="d-flex font-size-lg font-weight-bold align-items-center mb-3">
                                                                <div className="bullet bg-primary me-3"></div>
                                                                <div className="text-gray-400">Active</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column text-center">
                                                            <div className="font-size-h6 font-weight-bolder text-primary mb-3">Correos de los asistentes</div>
                                                                {
                                                                    ticket.event.googleEvent?
                                                                    ticket.event.googleEvent.attendees.map((email, key) => {
                                                                            return (
                                                                                <div className="text-dark-50 font-weight-light text-lowercase" key={key}>
                                                                                    {email.email}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    :""
                                                                }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 d-block d-xxl-none my-5">
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="col-md-12">
                                                <TagInputGray
                                                    tags={form.correos}
                                                    onChange={this.tagInputChange}
                                                    placeholder="CORREOS DE LOS ASISTENTES"
                                                    iconclass="fas fa-envelope"
                                                    uppercase={false}
                                                    requirevalidation={0}
                                                    messageinc="PRESIONA ENTER PARA AGREGAR EL CORREO."
                                                />
                                            </div>
                                        </div>
                                        <div className="card-footer mt-8 px-0 pb-0 pt-4 text-center">
                                            <Button icon='' className="btn btn-light-info btn-sm font-weight-bolder letter-spacing-0-3"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(this.onSubmit, e, 'form-editar-horarios')
                                                    }
                                                }
                                                text="Editar horarios"
                                            />
                                        </div>
                                    </Form>
                                </>
                            )
                        }
                    }
                } else {
                    return (
                        <Form id="form-agendar-tickets">
                            <div className="row mx-0">
                                <div className="col-md-12 col-xxl-6 text-center">
                                    <label className="col-form-label font-weight-bolder text-dark-60">Hora de inicio</label>
                                    <div className="mb-3 row d-flex justify-content-center">
                                        <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_inicio, name: 'minuto_inicio' }}
                                            hora={{ value: form.hora_inicio, name: 'hora_inicio' }} allhours={true} width='w-60' />
                                    </div>
                                    {
                                        form.hora_inicio !== 0 && form.minuto_inicio !== 0 ?
                                            <></>
                                            : <span className="form-text text-danger is-invalid">Hora de incio</span>
                                    }
                                </div>
                                <div className="col-md-12 d-block d-xxl-none my-5">
                                    <div className="separator separator-dashed"></div>
                                </div>
                                <div className="col-md-12 col-xxl-6 text-center">
                                    <label className="col-form-label font-weight-bolder text-dark-60">Hora final</label>
                                    <div className="mb-3 row d-flex justify-content-center">
                                        <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_final, name: 'minuto_final' }}
                                            hora={{ value: form.hora_final, name: 'hora_final' }} allhours={true} width='w-60' />
                                    </div>
                                    {
                                        form.hora_final !== 0 && form.minuto_final !== 0 ?
                                            <></>
                                            : <span className="form-text text-danger is-invalid">Hora de termino</span>
                                    }
                                </div>
                                <div className="col-md-12 my-5">
                                    <div className="separator separator-dashed"></div>
                                </div>
                                <div className="col-md-12">
                                    <TagInputGray
                                        tags={form.correos}
                                        onChange={this.tagInputChange}
                                        placeholder="CORREOS DE LOS ASISTENTES"
                                        iconclass="fas fa-envelope"
                                        uppercase={false}
                                        requirevalidation={1}
                                        messageinc="PRESIONA ENTER PARA AGREGAR EL CORREO."
                                    />
                                </div>
                            </div>
                            <div className="card-footer mt-8 px-0 pb-0 pt-4 text-center">
                                <Button icon='' className="btn btn-light-info btn-sm font-weight-bolder letter-spacing-0-3"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(this.onSubmit, e, 'form-agendar-tickets')
                                        }
                                    }
                                    text="Agendar horario"
                                />
                            </div>
                        </Form>
                    )
                }
            }
        }
        return <></>
    }
    showTitleEvent = () => {
        const { ticket } = this.props
        const { edit } = this.state
        if( ticket ){
            if(ticket.fecha_programada){
                if(ticket.event){
                    if(!edit){
                        return <span>Horarios de trabajos del día: <span className="font-weight-bold text-info"><u>{dayDMY(ticket.fecha_programada)}</u></span></span>
                    }else{
                        return <span>Editar horarios trabajo del día: <span className="font-weight-bold text-info"><u>{dayDMY(ticket.fecha_programada)}</u></span></span>
                    }
                }else{
                    return <span>Agendar horarios de trabajos del día: <span className="font-weight-bold text-info"><u>{dayDMY(ticket.fecha_programada)}</u></span></span>
                }
            }
        }
    }
    editTime = (action) => {
        const { form } = this.state
        const { start, end } = this.props.ticket.event.googleEvent
        if(action){
            let fechaInicio = new Date(moment(start.dateTime))
            let fechaFin = new Date(moment(end.dateTime))
            form.hora_inicio = this.setTimer(fechaInicio.getHours());
            form.minuto_final = this.setTimer(fechaFin.getMinutes());
            form.hora_final = this.setTimer(fechaFin.getHours());
            form.minuto_inicio = this.setTimer(fechaInicio.getMinutes());
        }
        this.setState({
            ...this.state,
            edit:action,
            form
        })
    }
    setTimer = (time) => {
        if(time < 10)
            return '0'.time
        return time
    }
    render() {
        const { ticket } = this.props
        const { edit } = this.state
        return (
            <>
                <Card className="card-custom gutter-b mb-8">
                    <Card.Header className="pt-8 pt-md-0 border-top-4px-info border-bottom-0 row mx-0">
                        <Card.Title className="mb-0 col px-0">
                            <div className="font-weight-bold font-size-h5">{this.showTitleEvent()}</div>
                        </Card.Title>
                        {
                            edit?
                                <div className="card-toolbar">
                                    <OverlayTrigger rootClose placement="top" overlay={<Tooltip><span className="font-weight-bold">Regresar</span></Tooltip>}>
                                        <span className="btn btn-light btn-hover-secondary font-weight-bold p-3" onClick={ () => { this.editTime(false) } }>
                                            <i className="fas fa-arrow-left icon-md p-0"></i>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            :<></>
                        }
                    </Card.Header>
                    <Card.Body className={`pt-4 ${ticket.estatus_ticket.estatus === 'Terminado' ? 'd-flex align-items-center justify-content-center' : ''}`}>
                        { this.printSchedule()}
                    </Card.Body>
                </Card>
                
            </>
        )
    }
}

export default AddEvent