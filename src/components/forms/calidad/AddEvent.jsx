import React, { Component } from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import SVG from 'react-inlinesvg'
import { connect } from 'react-redux'

import { dayDMY } from '../../../functions/setters'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiPutForm, apiPostFormData,catchErrors } from '../../../functions/api'
import { Form, Card, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap'
import { SelectHorario, TagInputGray, Button, InputGray } from '../../form-components'
import { validateAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import Pagination from "react-js-pagination"

class AddEvent extends Component {
    state = {
        form: {
            hora_inicio: 0,
            minuto_inicio: 0,
            hora_final: 0,
            minuto_final: 0,
            correos: [],
            motivo_cancelacion_event:''
        },
        edit:false,
        modal:{
            cancelEvent: false,
            historialEvent : false
        },
        activePage: 1,
        itemsPerPage: 5,
        modalAbonos: false,

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
  
    onChangePage(pageNumber) {
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }
    generateEvent = async() => {
        const { ticket, at, refresh } = this.props
        const { form } = this.state
        console.log(form, 'form add')

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
        console.log(form, 'form update')
        console.log(ticket)

        waitAlert()
        apiPutForm(`v3/calidad/tickets/${ticket.id}/update-evento`, form, at).then(
            (response) => {
                doneAlert( `Evento editado con éxito`, () => refresh(ticket.id))
                form.correos=[]
                this.setState({ ...this.state, form, edit:false })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    onSubmitCancelEvent = async() => {
        const { ticket, refresh } = this.props
        const { form ,modal} = this.state
        const { access_token } = this.props.authUser
        modal.cancelEvent = false

        const data = new FormData();
        data.append('descripcion', form.motivo_cancelacion_event)
        data.append('event_id', ticket.event_id)

        console.log(ticket)
        waitAlert()
        apiPostFormData(`v2/calidad/tickets/eliminarEvent/${ticket.id}`,data ,access_token).then(
            (response) => {
                doneAlert( `Evento eliminado con éxito`, () => refresh(ticket.id))
                form.motivo_cancelacion_event = ''

                this.setState({ ...this.state, form, })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    openModalAbonos = ticket => {
        this.setState({
            ...this.state,
            modalAbonos: true,
            ticket: ticket
        })
    }

    handleCloseAbonos = () => {
        this.setState({
            ...this.state,
            modalAbonos: false,
            active: 'listado'
        })
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
                break;
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
                break;
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
                break;
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
                break;
            default: break;
        }
    }
    printAttendees = (event) => {
     if (event){
       if (event.attendees){
        if (event.attendees.length > 0) {
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
      }
    }
    printAttendeesEmail = (ticket) => {
        return (
            <>
                <div className="col-md-12 my-5">
                    <div className="separator separator-dashed"></div>
                </div>
                <div className="w-80 mt-5 mx-auto card card-custom bg-diagonal shadow-sm gutter-b">
                    <div className="card-body p-2">
                        <div className="p-4">
                            <div className="d-flex flex-column text-center">
                                <div className="font-size-h6 font-weight-bolder text-info mb-3">Correos de los asistentes</div>
                                {
                                    ticket.event.googleEvent ?     
                                    ticket.event.googleEvent.attendees ?                               
                                    ticket.event.googleEvent.attendees.length > 0 ? 
                                        ticket.event.googleEvent.attendees.map((email, key) => {
                                            return (
                                                <div className="text-dark-50 font-weight-light text-lowercase" key={key}>
                                                    {email.email}
                                                </div>
                                            )
                                        })
                                        : ""
                                        : ""
                                        : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    printInputsHours(form){
        return(
            <>
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
                <div className="col-md-12 d-block d-xxl-none my-5">
                    <div className="separator separator-dashed"></div>
                </div>
            </>
        )
    }
    printInpustEmail(form) {
        const { edit } = this.state
        if (edit){
            return (
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
            )
        }else{
        return (
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
        )
        }
    }
    printHistory(form){
        const { ticket } = this.props
        console.log(ticket.historico_tickets)
        
        return(
            <>
              <table className="table table-bordered">  
            <tr>  
                <th>Descripción</th>  
                <th>Fecha de cancelación</th>  
            </tr>  
    
            {ticket.historico_tickets.map((student, index) => (  
              <tr data-index={index}>  
                <td>{student.descripcion}</td>  
                <td>{student.fecha_eliminacion}</td>  
              </tr>  
                   ))}      
              </table>  
            </>
        )
    }
    
    printSchedule = () => {
        const { form, edit } = this.state
        const { ticket } = this.props
        if(ticket){
            if(ticket.fecha_programada){
                if(ticket.event){
                    if(ticket.event.googleEvent){
                        if(ticket.event.googleEvent.status === 'cancelled'){
                            return(
                                <>
                                    <Form id="form-agregar-evento">
                                        <div className="row mx-0">
                                            {this.printInputsHours(form)}
                                            {this.printInpustEmail(form)}
                                        </div>
                                        <div className="card-footer mt-8 px-0 pb-0 pt-4 text-center">
                                            <Button icon='' className="btn btn-light-info btn-sm font-weight-bolder letter-spacing-0-3"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        validateAlert(this.onSubmit, e, 'form-agregar-evento')
                                                    }
                                                }
                                                text="Agendar horario"
                                            />
                                        </div>
                                    </Form>
                                </>
                            )
                        }else{
                            if(!edit){
                                return(
                                    <>
                                        {/* Vista del listado de asistentes y estatus*/}
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
                                        <div className="card-footer pt-6 pb-0 px-0 text-center d-flex justify-content-between">
                                            <Button text='Cancelar evento' type='submit' className="btn btn-sm btn-light-danger font-weight-bold" icon='' onClick={() => { this.openModalCancelEvent() }}/>

                                            <Button text='Modificar evento' type='submit' className="btn btn-sm btn-light-info font-weight-bold" icon='' onClick={ () => { this.editTime(true) } } />

                                            <Button text='Historial de Cancelaciones' type='submit' className="btn btn-sm btn-light-info font-weight-bold" icon='' onClick={ () => { this.openModalAbonos(true) } } />

                                        </div>
                                    </>
                                )
                            }else{
                                return(
                                    <>
                                        {/* Formulario para editar evento */}
                                        <Form id="form-editar-horarios">
                                            <div className="row mx-0">
                                                {this.printInputsHours(form)}
                                                {this.printAttendeesEmail(ticket)}
                                                {this.printInpustEmail(form)}
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
                    }
                } else {
                    return (
                        <Form id="form-agregar-evento">
                            <div className="row mx-0">
                                {this.printInputsHours(form)}
                                {this.printInpustEmail(form)}
                            </div>
                            <div className="card-footer mt-8 px-0 pb-0 pt-4 text-center">
                                <Button icon='' className="btn btn-light-info btn-sm font-weight-bolder letter-spacing-0-3"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(this.onSubmit, e, 'form-agregar-evento')
                                        }
                                    }
                                    text="Agendar horario"
                                />
                            </div>
                        </Form>
                    )
                }
            }
            if(ticket.historico_tickets){
                return (
                    <Form id="form-historial">
                        <div className="row mx-0">
                           {this.printHistory(form)}

                        </div>
                        <div className="card-footer mt-8 px-0 pb-0 pt-4 text-center">
                           
                        </div>
                    </Form>
                )
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
    openModalCancelEvent = () => {
        const { modal } = this.state
        modal.cancelEvent = true
        this.setState({ ...this.state, modal })
    }
    handleCloseModalOrden = () => {
        const { modal } = this.state
        modal.cancelEvent = false
        this.setState({...this.state, modal })
    }
    openModalHistorialEvent = () => {
        const { modal } = this.state
        modal.historialEvent = true
        this.setState({ ...this.state, modal })
    }
    handleCloseModalHistorialEvent = () => {
        const { modal } = this.state
        modal.historialEvent = false
        this.setState({...this.state, modal })
    }
    render() {
        const { ticket } = this.props
        const { edit, modal, form , modalAbonos,  activePage, itemsPerPage} = this.state
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
                {/* <Card className="card-custom gutter-b mb-8">
                    <Card.Header className="pt-8 pt-md-0 border-top-4px-info border-bottom-0 row mx-0">
                        <Card.Title className="mb-0 col px-0">
                            <div className="font-weight-bold font-size-h5">Historial de eventos cancelados</div>
                        </Card.Title>
                      
                    </Card.Header>
                    <Card.Body className="d-flex align-items-center justify-content-center">
                        { this.printHistory()}
                    </Card.Body>
                </Card> */}

                <Modal size='lg' title='' show={modalAbonos} centered handleClose={this.handleCloseAbonos}>
                    <Modal.Body className = "p-0 mt-12">
                        <div className="mb-12 text-center font-size-h6 font-weight-bold">Historial de eventos cancelados <span className="font-weight-bolder"></span></div>
                            <div className='row mx-0 justify-content-center px-2'>
                                <div className="col-md-12 mx-auto">
                                    <Card.Body className="d-flex align-items-center justify-content-center">
                                    
                        <div className="table-responsive d-flex justify-content-center">
                                <table className="table table-head-custom table-borderless table-vertical-center w-100 my-3">
                                    <thead className="bg-primary-o-20">
                                        <tr>
                                            <th className="text-center">
                                                <span className="text-dark-75 font-size-lg">Motivo cancelación</span>
                                            </th>
                                            <th className="text-right">
                                                <span className="text-dark-75 font-size-lg">Fecha cancelación</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ticket ?
                                            ticket.historico_tickets.length === 0 ?
                                                    <tr className="border-bottom" >
                                                        <td colSpan="3" className="text-center">
                                                            <span className="text-center text-dark-75 d-block font-size-lg">
                                                                Aún no hay cancelaciones registradas.
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    : <></>
                                                : <></>
                                        }
                                        {
                                            ticket ?
                                            ticket.historico_tickets.map((abono, key) => {
                                                    let limiteInferior = (activePage - 1) * itemsPerPage
                                                    let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                    if (ticket.historico_tickets.length < itemsPerPage || (key >= limiteInferior && key <= limiteSuperior))
                                                        return (
                                                            <tr key={key} className="border-bottom" >
                                                                
                                                                <td>{abono.descripcion}</td>  
                                                                 <td className="text-center">{abono.fecha_eliminacion}</td>
                                                            </tr>
                                                        )
                                                    return false
                                                })
                                                :  <></>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            </Card.Body>
                            {
                                ticket ?
                                ticket.historico_tickets ?
                                ticket.historico_tickets.length > itemsPerPage ?
                                            <div className="d-flex justify-content-center my-2">
                                                <Pagination
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    firstPageText='Primero'
                                                    lastPageText='Último'
                                                    activePage={activePage}
                                                    itemsCountPerPage={itemsPerPage}
                                                    totalItemsCount={ticket.historico_tickets.length}
                                                    pageRangeDisplayed={2}
                                                    onChange={this.onChangePage.bind(this)}
                                                    itemClassLast="d-none"
                                                    itemClassFirst="d-none"
                                                    nextPageText={'>'}
                                                    prevPageText={'<'}
                                                />
                                            </div>
                                            : ''
                                        : ''
                                    : ''
                            }
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer className="mb-2 mt-5 p-0 border-0 justify-content-center">
                        <button type="button" className="btn btn-sm btn-light-danger font-weight-bold" onClick = { this.handleCloseAbonos }>CERRAR</button>
                    </Modal.Footer>
                    </Modal>
                    
                <Modal  size="lg" show = { modal.cancelEvent } onHide = { this.handleCloseModalOrden } centered contentClassName = 'd-flex' >
                    <Modal.Body className = "p-0 mt-12">
                        <div className="mb-12 text-center font-size-h6 font-weight-bold">¿Deseas cancelar el evento del día <span className="font-weight-bolder"><u>{dayDMY(ticket.fecha_programada)}</u></span>?</div>
                            <div className='row mx-0 justify-content-center px-2'>
                                <div className="col-md-12 mx-auto">
                                    <Card.Body className="d-flex align-items-center justify-content-center">
                                    <Form id="form-cancel-event" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmitCancelEvent, e, 'form-cancel-event') } }>
                                        <div className='row mx-0 justify-content-center px-2'>
                                            <div className="col-md-12 mx-auto">
                                                <div className="form-group row form-group-marginless mb-1">
                                                    <div className="col-md-12 text-justify">
                                                        <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0} iconclass='las la-hashtag icon-xl'
                                                            requirevalidation={1} value={form.motivo_cancelacion_event} name='motivo_cancelacion_event' customclass="px-30"
                                                            onChange={this.onChange} swal={true} placeholder='MOTIVO DE CANCELACIÓN' rows="5" as="textarea"
                                                            messageinc="Ingresa el motivo de cancelación."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                    </Card.Body>
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer className="mb-2 mt-5 p-0 border-0 justify-content-center">
                        <button type="button" className="swal2-cancel btn-cancel-alert swal2-styled" onClick = { this.handleCloseModalOrden }>CANCELAR</button>
                        <button type="button" className="swal2-confirm delete-confirm btn_custom-alert swal2-styled" onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitCancelEvent, e, 'form-cancel-event') } } >SI, CANCELAR</button>
                    
                    </Modal.Footer>
                </Modal>

                {/* <Modal show = { modal.cancelEvent } onHide = { this.handleCloseModalOrden } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Body className = "p-0 mt-5">
                        <div className="mb-7 text-center font-size-h6 font-weight-bold">¿Deseas cancelar el evento del día <span className="font-weight-bolder"><u>{dayDMY(ticket.fecha_programada)}</u></span>?</div>
                        <Form id="form-cancel-event" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmitCancelEvent, e, 'form-cancel-event') } }>
                            <div className='row mx-0 justify-content-center px-2'>
                                <div className="col-md-12 mx-auto">
                                    <div className="form-group row form-group-marginless mb-1">
                                        <div className="col-md-12 text-justify">
                                            <InputGray withtaglabel={0} withtextlabel={0} withplaceholder={1} withicon={0} iconclass='las la-hashtag icon-xl'
                                                requirevalidation={1} value={form.motivo_cancelacion_event} name='motivo_cancelacion_event' customclass="px-2"
                                                onChange={this.onChange} swal={true} placeholder='MOTIVO DE CANCELACIÓN' rows="3" as="textarea"
                                                messageinc="Ingresa el motivo de cancelación."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className="mb-2 mt-5 p-0 border-0 justify-content-center">
                        <button type="button" className="swal2-cancel btn-cancel-alert swal2-styled" onClick = { this.handleCloseModalOrden }>CANCELAR</button>
                        <button type="button" className="swal2-confirm delete-confirm btn_custom-alert swal2-styled" onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitCancelEvent, e, 'form-cancel-event') } } >SI, CANCELAR</button>
                    </Modal.Footer>
                </Modal> */}

                <Modal  size="lg"  show = { modal.historialEvent } onHide = { this.handleCloseModalHistorialEvent } centered contentClassName = 'd-flex' >
                    <Modal.Body className = "p-0 mt-12">
                        <div className="mb-12 text-center font-size-h6 font-weight-bold">Historial de eventos cancelados <span className="font-weight-bolder"></span></div>
                            <div className='row mx-0 justify-content-center px-2'>
                                <div className="col-md-12 mx-auto">
                                    <Card.Body className="d-flex align-items-center justify-content-center">
                                        { this.printHistory()}
                                    </Card.Body>
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer className="mb-2 mt-5 p-0 border-0 justify-content-center">
                        <button type="button" className="btn btn-sm btn-light-danger font-weight-bold" onClick = { this.handleCloseModalHistorialEvent }>CERRAR</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);
