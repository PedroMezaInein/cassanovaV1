import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { printResponseErrorAlert, errorAlert, createAlert, doneAlert, waitAlert, questionAlert } from '../../../functions/alert'
import { URL_DEV } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { setDateTableLG, setOptions } from '../../../functions/setters'
import { ItemSlider, Modal } from '../../../components/singles'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { AgregarVacacionesForm } from "../../../components/forms"
import { Button, SelectSearch } from '../../../components/form-components'
import readXlsxFile from 'read-excel-file'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Nav } from 'react-bootstrap'
import { /* Parking, ParkingRed, */ PassportTravel, HappyBirthday, Calendar /* , EmptyParkSlot */ } from '../../../components/Lottie'
const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

class Vacaciones extends Component {

    state = {
        formeditado: 0,
        modal: false,
        events: [],
        modal_add_vacaciones: false,
        modal_add_feriados: false,
        modal_cajones: false,
        modal_date: false,
        eventos: '',
        date: '',
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            empleado:'',
            adjuntos:{
                adjuntos:{
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        espera: [],
        options:{
            empleados: []
        },
        disabledDates: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        // const { match: { params: { action } } } = this.props
        // const { history, location: { state } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });

        this.getVacaciones()

    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true
        })
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            modal: false
        })
    }

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    updateEmpleado = value => {
        this.onChange({ target: { value: value, name: 'empleado' } })
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
            // case 'estacionamiento':
            //     nombre = 'ESTACIONAMIENTO'
            //     icon = 'fas fa-car'
            //     break;
            default: 
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

    getHours(dateTimeStart, dateTimeEnd) {
        var fechaStart = new Date(dateTimeStart)
        var horaStart = this.setTimer(fechaStart.getHours()) + ":" + this.setTimer(fechaStart.getMinutes())

        var fechaEnd = new Date(dateTimeEnd)
        var horaEnd = this.setTimer(fechaEnd.getHours()) + ":" + this.setTimer(fechaEnd.getMinutes())

        return horaStart + " - " + horaEnd
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

    printModal = () => {
        const { activeKey } = this.state
        switch (activeKey) {
            case 'eventos': return this.printEventos()
            case 'cumpleaños': return this.printCumpleaños()
            case 'vacaciones': return this.printVacaciones()
            // case 'estacionamiento': return this.prinEstacionamiento()
            default: return <></>
        }
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
        const { eventos, options, form, formeditado } = this.state
        return (
            <>
                {
                    eventos !== '' ?
                        eventos.estacionamiento.length >= 0 && eventos.estacionamiento.length < 2  ?
                            <div className="form-group row form-group-marginless justify-content-center mb-4">
                                <div className="col-md-6">
                                    <SelectSearch options = { options.empleados } placeholder = "SELECCIONA EL EMPLEADO"
                                        name = "empleado" value = { form.empleado } onChange = { this.updateEmpleado }
                                        iconclass = "fas fa-layer-group" formeditado = { formeditado }
                                        messageinc = "Incorrecto. Selecciona el empleado"
                                        />
                                </div>
                                {
                                    form.empleado !== '' ?
                                        <div className = 'col-md-12 text-center mb-3'>
                                            <Button icon = '' className = "btn btn-icon btn-xs w-auto p-3 btn-light-info mr-2 mt-2"
                                                onClick = { (e) => { questionAlert('¿ESTÁS SEGURO?', `ASIGNARÁS EL CAJÓN DE ESTACIONAMIENTO EL DÍA ${this.setDateText()}`, () => this.solicitarCajon() ) }} 
                                                only_icon = "far fa-calendar-check icon-15px mr-2" text = 'SOLICITAR ESPACIO'/>
                                        </div>
                                    : ''
                                }
                            </div>
                        : ''
                    : ''
                }
                {/* <div className='row mx-0 justify-content-center '>
                    {
                        eventos.estacionamiento.length === 0 ?
                            <div className = 'col-md-6'>
                                <EmptyParkSlot />
                            </div>
                        : ''
                    }
                    {
                        eventos.estacionamiento.map((auto, key) => {
                            return (
                                <div key = { key } className={`col-md-${size}`}>
                                    <div className='row mx-0 h-100 justify-content-center border' >
                                        <div className='col-10 border position-relative'>
                                            <div className = 'position-absolute button-up' 
                                                onClick = { (e) => { e.preventDefault(); 
                                                    questionAlert('¿ESTÁS SEGURO?', `${auto.empleado.usuario.name} YA NO TENDRÁ EL CAJÓN PARA EL DÍA ${this.setDateText()}`, () => this.deleteCajon(auto.id) )} }>
                                                <i className="fa fa-times text-danger"></i>
                                            </div>
                                            {
                                                (key + 1) % 2 === 1 ?
                                                    <ParkingRed />
                                                    : <Parking />
                                            }
                                            <div className='text-center mb-3'>
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
                </div> */}
            </>
        )
    }

    async getVacaciones() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/vacaciones', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleados, vacaciones, vacaciones_espera, feriados } = response.data
                const { options } = this.state
                options['empleados'] = setOptions(empleados, 'nombre', 'id')
                let aux2 = []
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
                            // shortName: empleado.nombre.split(" ")[0],
                            start: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                            end: Number(Number(año) + Number(x)) + '-' + mes + '-' + dia,
                            iconClass: 'fas fa-birthday-cake icon-md',
                            containerClass: 'cumpleaños'
                        })
                    }
                    return false
                })
                vacaciones.map((vacacion) => {
                    aux.push({
                        shortName: "Vacaciones",
                        title: vacacion.empleado.nombre,
                        start: vacacion.fecha_inicio,
                        end: vacacion.fecha_fin,
                        iconClass: 'fas fa-umbrella-beach icon-md',
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
                        /* iconClass: 'fas fa-calendar-check icon-md', */
                        iconClass: 'fas fa-calendar-day icon-md',
                        containerClass: 'feriados'
                    })
                    var start = moment(feriado.fecha).toDate();
                    aux2.push(start)
                    return false
                })

                this.setState({
                    ...this.state,
                    events: aux,
                    espera: vacaciones_espera,
                    disabledDates: aux2
                })

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addVacationAxiosAdmin() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'v2/rh/vacaciones/admin', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Vacaciones aceptadas con éxito')
                this.getVacaciones()
                this.handleCloseAddVacaciones()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editVacacionesAxios(vacacion, estatus){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/vacaciones/${vacacion.id}`, {estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                if(estatus === 'Aceptadas')
                    doneAlert('Vacaciones aceptadas con éxito')
                if(estatus === 'Rechazadas')
                    doneAlert('Vacaciones rechazadas con éxito')
                this.getVacaciones();
                this.handleClose();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async sendVacacionesAxios(feriados){
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'vacaciones/feriados', {feriados: feriados}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Días feriados agregados con éxito')
                this.handleCloseAddFeriados()
                this.getVacaciones()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    solicitarCajon = async() => {
        const { access_token } = this.props.authUser
        const { date, form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'vacaciones/cajones', { fecha: date, empleado: form.empleado }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('EL CAJÓN FUE ASIGNADO CON ÉXITO')
                this.getEventsOneDateAxios(date)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteCajon = async(id) => {
        const { access_token } = this.props.authUser
        const { date } = this.state
        waitAlert()
        await axios.delete(URL_DEV + 'vacaciones/cajones/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                this.getEventsOneDateAxios(date)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalAddVacaciones = () => {
        this.setState({
            ...this.state,
            modal_add_vacaciones: true,
            title: 'Agregar vacaciones',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    openModalCajones = () => {
        this.setState({
            ...this.state,
            modal_cajones: true,
            title: 'Agendar cajones de estacionamiento',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    openModalAddFeriados = () => {
        this.setState({
            ...this.state,
            modal_add_feriados: true,
            title: 'Agregar feriados',
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
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    handleCloseAddVacaciones = () => {
        const { modal_add_vacaciones } = this.state
        this.setState({
            ...this.state,
            modal_add_vacaciones: !modal_add_vacaciones,
            title: 'Agregar vacaciones',
            form: this.clearForm()
        })
    }

    handleCloseAddFeriados = () => {
        const { modal_add_feriados } = this.state
        this.setState({
            ...this.state,
            modal_add_feriados: !modal_add_feriados,
            title: 'Agregar vacaciones',
            form: this.clearForm()
        })
    }

    handleCloseCajones = () => {
        const { modal_cajones } = this.state
        this.setState({
            ...this.state,
            modal_cajones: !modal_cajones,
            title: 'Agregar vacaciones',
            form: this.clearForm()
        })
    }

    handleCloseDate = () => {
        this.setState({
            ...this.state,
            modal_date: false,
            date: '',
            activeKey: '',
            eventos: '',
            form: this.clearForm()
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

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    sendVacaciones = () => {
        const { form } = this.state
        let arreglo = []
        readXlsxFile(form.adjuntos.adjuntos.files[0].file).then((rows) => {
            rows.map((row, index)=>{
                if(index > 0)
                    arreglo.push({
                        fecha: row[0],
                        texto: row[1]
                    })
                return false
            })
            this.sendVacacionesAxios(arreglo)
        })
    }

    downloadPlantilla = () => {
        const link = document.createElement('a');
        const url = 'https://admin-proyectos.s3.us-east-2.amazonaws.com/plantillas/plantilla-feriados.xlsx'
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    async getEventsOneDateAxios(date) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                let bandera = 'estacionamiento'
                this.setState({
                    ...this.state,
                    modal_date: true,
                    date: date,
                    eventos: eventos,
                    activeKey: bandera
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { events, espera, modal, form, title, modal_add_vacaciones, formeditado, options, modal_add_feriados, disabledDates, modal_cajones, modal_date, activeKey, date, eventos } = this.state
        return (
            <Layout active='rh'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Vacaciones</h3>
                        </div>
                        <div className="card-toolbar" id="dropdown-calendario">
                            <DropdownButton
                                title={
                                    <i className="ki ki-bold-more-ver p-0"></i>
                                }
                                id={`dropdown-button-drop-left`}
                                drop={'left'}
                            >
                                {
                                    espera.length ?
                                        <Dropdown.Item onClick={this.openModal}>Mostrar solicitudes</Dropdown.Item>
                                        : ''
                                }
                                <Dropdown.Item onClick={this.openModalAddVacaciones}>Agregar vacaciones</Dropdown.Item>
                                <Dropdown.Item onClick={this.openModalAddFeriados}>Agregar feriados</Dropdown.Item>
                                {/* <Dropdown.Item onClick={this.openModalCajones}>Agendar cajones de estacionamiento</Dropdown.Item> */}
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FullCalendar
                            className = "prueba" locale = { esLocale }
                            plugins = { [ dayGridPlugin, interactionPlugin, bootstrapPlugin ] }
                            initialView = "dayGridMonth" weekends = { true } events = { events } firstDay = { 1 }
                            dateClick = { this.handleDateClick } eventContent = { renderEventContent } themeSystem = 'bootstrap'
                        />
                    </Card.Body>
                </Card>
                <Modal size="lg" title="Solicitudes de vacaciones" show={modal} handleClose={this.handleClose} >
                    <div className="table-responsive mt-6">
                        <table className="table table-head-custom table-head-bg table-vertical-center">
                            <thead>
                                <tr className="text-left">
                                    <th style={{ minWidth: "175px" }} className="pl-7">
                                        <span className="text-dark-75 font-size-13px">Empleado</span>
                                    </th>
                                    <th style={{ minWidth: "100px" }} className="text-center">
                                        <span className="text-dark-75 font-size-13px">Fecha de inicio</span>
                                    </th>
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Fecha final</span>
                                    </th>
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Estatus</span>
                                    </th>
                                </tr>
                            </thead>
                            {
                                espera.map((empleado, key) => {
                                    return (
                                        empleado.vacaciones.map((vacacion, key) => {
                                            return (
                                                <tbody key={key}>
                                                    <tr className="font-size-13px">
                                                        <td className="py-8">
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <div className="mb-1">{empleado.nombre}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span>{setDateTableLG(vacacion.fecha_inicio)}</span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span>{setDateTableLG(vacacion.fecha_fin)}</span>
                                                        </td>
                                                        <td className="pr-0 text-center">
                                                            <span className="btn btn-icon btn-light-success btn-sm mr-2 ml-auto" onClick={(e) => {
                                                                e.preventDefault();
                                                                createAlert('¿ESTÁS SEGURO QUE DESEAS ACEPTAR LAS VACACIONES?', '',
                                                                    () => this.editVacacionesAxios(vacacion, 'Aceptadas'))
                                                            }}
                                                            >
                                                                <i className="flaticon2-check-mark icon-sm"></i>
                                                            </span>
                                                            <span className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger" onClick={(e) => {
                                                                e.preventDefault();
                                                                createAlert('¿ESTÁS SEGURO QUE DESEAS RECHAZAR LAS VACACIONES?', '',
                                                                    () => this.editVacacionesAxios(vacacion, 'Rechazadas'))
                                                            }}
                                                            >
                                                                <i className="flaticon2-cross icon-sm"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    )
                                })
                            }
                        </table>
                    </div>
                </Modal>
                <Modal size={"lg"} title={title} show={modal_add_vacaciones} handleClose={this.handleCloseAddVacaciones}>
                    <AgregarVacacionesForm
                        disabledDates = { disabledDates }
                            formeditado={formeditado}
                            form={form}
                            onChange={this.onChange}
                            options = { options }
                            onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addVacationAxiosAdmin() }}
                        />
                </Modal>
                <Modal size = "lg" title = { title } show = { modal_cajones } handleClose = { this.handleCloseCajones } >
                    
                </Modal>
                <Modal size = 'lg' title = { title } show = { modal_add_feriados } handleClose = { this.handleCloseAddFeriados }>
                    <div className="d-flex m-2 justify-content-end">
                        <Button
                            onClick = { () => { this.downloadPlantilla() } }
                            className = "btn btn-icon btn-light-primary btn-sm mr-2 ml-auto"
                            only_icon = "fas fa-file-excel icon-md"
                            tooltip = { { text: 'DESCARGAR PLANTILLA' } }
                            />
                    </div>
                    <div>
                        <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' 
                            multiple = { false } handleChange = { this.handleChange }
                            accept = '.xlsx, .xls, .csv'/>
                    </div>
                    {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="d-flex justify-content-center">
                                <Button icon='' className="btn btn-primary m-2"
                                    onClick = {
                                        (e) => {
                                            e.preventDefault();
                                            waitAlert();
                                            this.sendVacaciones();
                                        }
                                    }
                                    text="ENVIAR" 
                                    />
                            </div>
                        : ''
                    }
                </Modal>
                <Modal size='lg' title = { this.setDateText(date) } show = { modal_date } handleClose = { this.handleCloseDate } >
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
                                            }else return ''
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
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)