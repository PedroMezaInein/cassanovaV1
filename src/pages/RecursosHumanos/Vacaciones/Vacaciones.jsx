import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import axios from 'axios'
import $ from "jquery";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es'
import { setSingleHeader } from '../../../functions/routers'
import { printResponseErrorAlert, errorAlert,  createAlert,createAlertSA2WithActionOnClose, doneAlert,questionAlertY, waitAlert, questionAlert } from '../../../functions/alert'
import { URL_DEV, PERMISOS_COLUMNS, INCAPACIDAD_COLUMNS } from '../../../constants'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import { Card, OverlayTrigger, Tooltip, Tabs, Tab, } from 'react-bootstrap'
import { setDateTableLG, setOptions } from '../../../functions/setters'
import { ItemSlider, Modal } from '../../../components/singles'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { AgregarVacacionesForm, AgregarPermisosForm } from "../../../components/forms"
import { Button, SelectSearch } from '../../../components/form-components'
import readXlsxFile from 'read-excel-file'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Nav } from 'react-bootstrap'
import {
    setOptionsWithLabel, setTextTable,setArrayTable, setTextTableCenter, setNaviIcon
} from '../../../functions/setters'
import { /* Parking, ParkingRed, */ PassportTravel, HappyBirthday, Calendar /* , EmptyParkSlot */ } from '../../../components/Lottie'
const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
const dias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO',]

class Vacaciones extends Component {

    state = {
        key: 'vacaciones',
        formeditado: 0,
        modal: false,
        events: [],
        permisosM: [],
        incapacidadesM: [],
        modal_add_vacaciones: false,
        modal_add_feriados: false,
        modal_cajones: false,
        modal_date: false,
        filters_permisos: false,
        modal_incapacidad: false,
        modal_permisos: false,
        modal_mostrar_permisos: false,
        modal_mostrar_incapacidades: false,
        modal_adjuntos_permisos: false,
        modal_motivo_rechazo_I:false,
        modal_motivo_rechazo_P: false,
        eventos: '',
        date: '',
        permiso: '',
        motivo_rechazo:'',
        id_rechazo:'',
        form: {
            fechas: { start: null, end: null },
            idSelectEmpleado:'',
            nombre: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            descripcion: '',
            tipo: '',
            hora_salida: 0,
            hora_entrada: 0,
            minuto_entrada: 0,
            minuto_salida: 0,
            motivo_rechazo:'',
            lider: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                },
                documento: {
                    value: '',
                    placeholder: 'Documentación',
                    files: []
                },
                permisos: {
                    value: '',
                    placeholder: 'Permiso',
                    files: []
                },
            }
        },
        espera: [],
        options: {
            empleados: [],
            lider: []
        },
        data: {
            // permiso: [],
        },
        disabledDates: [],
        adjuntoArray: [],
    }



    setOptionsArray = (name, array) => {
        const { options } = this.state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getVacaciones()
    }
    controlledTab = value => {
        const { form } = this.state
        if (value === 'vacaciones')
            this.getVacaciones()
        if (value === 'permisos') {
            this.setPermisoEstatus()
            this.getPermisosModal()
            // this.setPermisos()
        }
        if (value === 'incapacidades') {
            this.setIncapacidades()
            this.setIncapacidadEstatus()
            this.getIncapacidadesModal()

        }
        this.setState({ ...this.state, key: value, form })
    }
 
    async setPermisoEstatus() {
        $('#Permisos').DataTable().ajax.reload();
    }
    async setIncapacidadEstatus() {
        $('#incapacidades').DataTable().ajax.reload();
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }
    onChangeAdjunto = e => {
        const { value, files } = e.target
        const { form } = this.state
        form.adjuntos.adjuntos.value = value
        form.adjuntos.adjuntos.files = []
        files.forEach((file, index) => {
            form.adjuntos.adjuntos.files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        this.setState({ ...this.state, form })
    }

    onChangeAdjuntoP = e => {
        const { value, files } = e.target
        const { form } = this.state
        form.adjuntos.value = value
        form.adjuntos.files = []
        files.forEach((file, index) => {
            form.adjuntos.files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        this.setState({ ...this.state, form })
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true
        })
    }

    setId = (id) => {
        let { id_rechazo } = this.state
        id_rechazo = id
        this.setState({...this.state, id_rechazo})
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

    openModalAddIncapacidad = () => {
        this.setState({
            ...this.state,
            modal_incapacidad: true,
        })
    }

    openModalAddPermisos = () => {
        this.setState({
            ...this.state,
            modal_permisos: true,
        })
    }
    openModalRechazarI = () => {
        this.setState({
            ...this.state,
            modal_motivo_rechazo_I: true,
        })
    }

    openModalRechazarP = () => {
        this.setState({
            ...this.state,
            modal_motivo_rechazo_P: true,
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

    handleClose = () => {
        this.setState({
            ...this.state,
            modal: false
        })
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

    handleCloseIncapacidad = () => {
        this.setState({
            ...this.state,
            modal_incapacidad: false,
            modal_adjuntos_permisos: false,
        })
    }

        handleCloseRechazo = () => {
        this.setState({
            ...this.state,
            modal_motivo_rechazo_I:false,
            modal_motivo_rechazo_P: false,
        })
    }

    handleOpenAdjuntos = () => {
        this.setState({
            ...this.state,
            modal_adjuntos_permisos: true,
        })
    }

    handleCloseEstatusPermisos = () => {
        this.setState({
            ...this.state,
            modal_mostrar_permisos: false,
            modal_mostrar_incapacidades: false,
        })
        this.setPermisoEstatus()
        this.getPermisosModal()
        this.getIncapacidadesModal()
    }

    openEstatusPermisos = () => {
        this.setState({
            ...this.state,
            modal_mostrar_permisos: true,
        })
    }

    openEstatusIncapacidades = () => {
        this.setState({
            ...this.state,
            modal_mostrar_incapacidades: true,
        })
    }
    handleClosePermisos = () => {
        this.setState({
            ...this.state,
            modal_permisos: false,
            modal_incapacidad: false,
            form: this.clearForm()
        })
        this.setPermisoEstatus()
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

    clearFiles = (name, key) => {
        const { form } = this.state
        if (name === 'adjuntoPermiso') {
            form.adjuntos.adjuntos.files.splice(key, 1)
            if (form.adjuntos.adjuntos.files.length === 0) {
                form.adjuntos.adjuntos.value = ''
            }
        }
        this.setState({ ...this.state, form })
    }

    setOptions = (name, array) => {
        const { options } = this.state
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
                        eventos.estacionamiento.length >= 0 && eventos.estacionamiento.length < 2 ?
                            <div className="form-group row form-group-marginless justify-content-center mb-4">
                                <div className="col-md-6">
                                    <SelectSearch options={options.empleados} placeholder="SELECCIONA EL EMPLEADO"
                                        name="empleado" value={form.empleado} onChange={this.updateEmpleado}
                                        iconclass="fas fa-layer-group" formeditado={formeditado}
                                        messageinc="Incorrecto. Selecciona el empleado"
                                    />
                                </div>
                                {
                                    form.empleado !== '' ?
                                        <div className='col-md-12 text-center mb-3'>
                                            <Button icon='' className="btn btn-icon btn-xs w-auto p-3 btn-light-info mr-2 mt-2"
                                                onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', `ASIGNARÁS EL CAJÓN DE ESTACIONAMIENTO EL DÍA ${this.setDateText()}`, () => this.solicitarCajon()) }}
                                                only_icon="far fa-calendar-check icon-15px mr-2" text='SOLICITAR ESPACIO' />
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

    async getPermisosModal() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'permiso/permiso', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let aux = []
                const { options } = this.state
                options.lider = setOptions(response.data.direcciones, 'nombre', 'id')

                response.data.data.map((permiso) => {

                    permiso.permiso.forEach((tipo) => {
                        aux.push({
                            shortName: "Tipo",
                            tipo: tipo.tipo_permiso,
                            name: permiso.nombre,
                            id: tipo.id,
                        })
                    })
                    return false
                })
                this.setState({
                    ...this.state,
                    permisosM: aux,
                })

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }


    async getIncapacidadesModal() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'permiso/incapacidad', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let aux = []
                const { options } = this.state
                options.lider = setOptions(response.data.direcciones, 'nombre', 'id')

                response.data.data.map((permiso) => {

                    permiso.permiso.forEach((tipo) => {
                        aux.push({
                            shortName: "Tipo",
                            tipo: tipo.tipo_permiso,
                            name: permiso.nombre,
                            id: tipo.id,
                        })
                    })
                    return false
                })
                this.setState({
                    ...this.state,
                    incapacidadesM: aux,
                })

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
                empleados.map((empleado, key) => {
                    mes = empleado.rfc.substr(6, 2);
                    dia = empleado.rfc.substr(8, 2);
                    for (let x = -5; x <= 5; x++) {
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
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }

    async addPermisoAxiosAdmin() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let aux = Object.keys(form)
        const data = new FormData();
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos.adjuntos.value !== '') {
                form.adjuntos.adjuntos.files.forEach((file) => {
                    data.append(`files_name_permiso[]`, file.name)
                    data.append(`files_permiso[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        // form.tipo = 'permiso';
        let fechaInicioA = form.fechaInicio
        let fechaInicioAString = fechaInicioA.toISOString();
        data.append('fecha_inicio', fechaInicioAString)
        let fechaFinA = form.fechaFin
        let fechaFinAString = fechaFinA.toISOString();
        data.append('fecha_fin', fechaFinAString)
        let empleadoA = form.empleado
        data.append('empleado', empleadoA)
        data.append('empleado_id',empleadoA )
        let liderA = form.lider
        data.append('lider', liderA)
        // data.append('lider_id', liderA)
        data.append('tipo_permiso', 'permiso')
        let minutoSalidaA = Math.floor(form.minuto_salida * 100);
        let horaSalidaA = Math.floor((form.hora_salida * 10000) + minutoSalidaA);
        data.append('hora_salida', horaSalidaA)
        let comentarioA = form.descripcion
        data.append('descripcion', comentarioA)
        let minutoEntradaA = Math.floor(form.minuto_entrada * 100);
        let horaEntradaA = Math.floor((form.hora_entrada * 10000) + minutoEntradaA);
        data.append('hora_entrada', horaEntradaA)
        await axios.post(URL_DEV + 'v2/rh/vacaciones/adminPermiso', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                console.log(response)
                doneAlert('Permiso enviado con éxito')
                this.handleClosePermisos()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async addIncapacidadAxiosAdmin() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let aux = Object.keys(form)
        const data = new FormData();
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos.adjuntos.value !== '') {
                form.adjuntos.adjuntos.files.forEach((file) => {
                    data.append(`files_name_permiso[]`, file.name)
                    data.append(`files_permiso[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        let fechaInicioA = form.fechaInicio
        let fechaInicioAString = fechaInicioA.toISOString();
        data.append('fechaInicio', fechaInicioAString)
        let fechaFinA = form.fechaFin
        let fechaFinAString = fechaFinA.toISOString();
        data.append('fechaFin', fechaFinAString)
        let empleadoA = form.idSelectEmpleado
        data.append('empleado',empleadoA )
        data.append('empleado_id',empleadoA )
        let liderA = form.lider
        data.append('lider', liderA)
        // data.append('lider_id', liderA)
        data.append('tipo_permiso', 'incapacidad')
        data.append('hora_salida', 0)
        data.append('minuto_salida', 0)
        data.append('hora_entrada', 0)
        data.append('minuto_entrada', 0)
        let comentarioA = form.descripcion
        data.append('descripcion', comentarioA)
        await axios.post(URL_DEV + 'v2/rh/vacaciones/adminPermiso', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Incapacidad enviada con éxito')
                this.handleClosePermisos()
                // this.getIncapacidadModal()
                this.setIncapacidadEstatus()
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editEstatusPermisos(permiso, estatus,motivo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/vacaciones/permiso/${permiso}`, {   estatus: estatus, 
            motivo_rechazo:motivo, }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                if (estatus === 'Aceptadas')
                    doneAlert('Permiso aceptado con éxito')
                if (estatus === 'Rechazadas')
                    {doneAlert('Permiso rechazado con éxito')}
                this.setPermisoEstatus()
                this.handleCloseEstatusPermisos();
                this.handleCloseRechazo();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }


    async editEstatusIncapacidad(permiso, estatus, motivo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/vacaciones/incapacidad/${permiso}`, {
             estatus: estatus, 
             motivo_rechazo:motivo,
            }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                if (estatus === 'Aceptadas')
                    doneAlert('Permiso aceptado con éxito')
                if (estatus === 'Rechazadas')
                   { doneAlert('Permiso rechazado con éxito')}
                this.setIncapacidadEstatus()
                this.handleCloseEstatusPermisos();
                this.handleCloseRechazo();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editVacacionesAxios(vacacion, estatus) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/vacaciones/${vacacion.id}`, { estatus: estatus }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                if (estatus === 'Aceptadas')
                    doneAlert('Vacaciones aceptadas con éxito')
                if (estatus === 'Rechazadas')
                    doneAlert('Vacaciones rechazadas con éxito')
                this.getVacaciones();
                this.handleClose();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async sendVacacionesAxios(feriados) {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'vacaciones/feriados', { feriados: feriados }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
            console.error(error, 'error')
        })
    }

    // solicitarCajon = async () => {
    //     const { access_token } = this.props.authUser
    //     const { date, form } = this.state
    //     waitAlert()
    //     await axios.post(URL_DEV + 'vacaciones/cajones', { fecha: date, empleado: form.empleado }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             Swal.close()
    //             doneAlert('EL CAJÓN FUE ASIGNADO CON ÉXITO')
    //             this.getEventsOneDateAxios(date)
    //         },
    //         (error) => {
    //             printResponseErrorAlert(error)
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.error(error, 'error')
    //     })
    // }

    deleteCajon = async (id) => {
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
            console.error(error, 'error')
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

    sendVacaciones = () => {
        const { form } = this.state
        let arreglo = []
        readXlsxFile(form.adjuntos.adjuntos.files[0].file).then((rows) => {
            rows.map((row, index) => {
                if (index > 0)
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
        const url = 'https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/plantillas/plantilla-feriados.xlsx'
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters_permisos = true
        this.setState({ ...this.state, modal })
    }

    // async getIncapacidadModal() {
    //     const { access_token } = this.props.authUser
    //     await axios.get(URL_DEV + 'permiso/incapacidad', { headers: { Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             // let aux = []
    //             // const { options } = this.state
    //             // options.lider = setOptions(response.data.direcciones, 'nombre', 'id')
    //             // this.setState({
    //             //     ...this.state,
    //             //     options
    //             // })
    //             // response.data.data.map((permiso)=>{
    //             //     permiso.permiso.forEach((tipo)=>{
    //             //         aux.push({
    //             //             shortName: "Tipo",
    //             //             tipo: tipo.tipo_permiso,  
    //             //             name: permiso.nombre, 
    //             //             estatus:tipo.estatus,
    //             //             id:tipo.id,
    //             //             mRechazo: tipo.motivo_rechazo,
    //             //             comentarios: tipo.comentarios,
    //             //         })
    //             //     })
    //             //     return false
    //             // })
    //             // this.setState({
    //             //     ...this.state,
    //             //     incapacidadesM: aux,
    //             // })
    //         },
    //         (error) => {
    //             printResponseErrorAlert(error)
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.error(error, 'error')
    //     })
    // }

    async getAdjuntosPermisos(data) {
        const { access_token } = this.props.authUser
        let { adjuntoArray } = this.state
        await axios.get(URL_DEV + 'permiso/adjuntos/' + data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                adjuntoArray = response.data.modulo.adjuntos
                this.setState({
                    ...this.state,
                    adjuntoArray
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
            console.error(error, 'error')
        })
    }
    exportAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/vacaciones', { responseType: 'blob', headers: setSingleHeader(access_token) }).then(
            (response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                //  link.setAttribute('download', `${quincena}Q-${mes_number}-${año}.xlsx`);
                link.setAttribute('download', `vacaciones.xlsx`);

                document.body.appendChild(link);
                link.click();
                //  doneAlert(`Horarios de ${quincena}Q de ${mes} del ${año} fue exportado con éxito`)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El documento fue generado con éxito.')

            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setActionsPermisoIncapacidad = permiso => {
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => {
                        e.preventDefault();
                        this.getAdjuntosPermisos(permiso.id.toString()); waitAlert(); this.handleOpenAdjuntos()
                    }}>
                        {setNaviIcon('flaticon-attachment', 'Adjuntos')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

  setPermisos = (datos) => {
         const { data ,options } = this.state
        let aux = []
        this.setState({
            data
        })

console.log(datos, 'permisos')
//   if(permisos)
datos.forEach((permiso) => {
                aux.push(
                    {
                        actions: this.setActionsPermisoIncapacidad(permiso),
                        identificador: setTextTableCenter(permiso.id),
                        horas: setArrayTable(
                            [
                                { name: 'Hora entrada', text: permiso.hora_entrada ? permiso.hora_entrada : '' },
                                { name: 'Hora salida', text: permiso.hora_salida ? permiso.hora_salida : '' },
                            ], '250px'
                        ),
                        fechas: setArrayTable(
                            [
                                { name: 'Fecha inicio', text: permiso.fecha_inicio ? permiso.fecha_inicio : '' },
                                { name: 'Fecha fin', text: permiso.fecha_fin ? permiso.fecha_fin : '' },
                            ], '250px'
                        ),
                        // nombre: setTextTable(permiso.empleado ? permiso.empleado.nombre : ''),
                        // nombre: setTextTable(permiso.empleado ? console.log(permiso.empleado.nombre) : ''),

                        lider: setTextTable(permiso.lider_id ?
                            options.lider.map((empleado) => {
                                if (permiso.lider_id.toString() === empleado.value) {
                                    return (empleado.name)
                                }
                                return false
                            })
                            : ''),
                            nombre: setTextTable(permiso.empleado_id ?
                                options.empleados.map((empleado) => {
                                    if (permiso.empleado_id.toString() === empleado.value) {
                                        return (empleado.name)
                                    }
                                    return false
                                })
                                : ''),
                        estatus: setTextTable(permiso.estatus ? permiso.estatus : ''),
                        descripcion: setTextTable(permiso.comentarios ? permiso.comentarios : ''),
                        rechazo: setTextTable(permiso.motivo_rechazo ? permiso.motivo_rechazo : ''),
                        // adjuntos: setArrayTable(_aux),
                        id: permiso.id,
                        objeto: permiso,
                    }
                )
                return aux;
            })
       
        return aux;
    }

    setIncapacidades = (incapacidades) => {
        const { data, options } = this.state
        let aux = []
        this.setState({
            data
        })
        if (incapacidades)
            incapacidades.map((incapacidad) => {
                aux.push(
                    {
                        actions: this.setActionsPermisoIncapacidad(incapacidad),
                        identificador: setTextTableCenter(incapacidad.id),
                        horas: setArrayTable(
                            [
                                { name: 'Hora entrada', text: incapacidad.hora_entrada ? incapacidad.hora_entrada : '' },
                                { name: 'Hora salida', text: incapacidad.hora_salida ? incapacidad.hora_salida : '' },
                            ], '250px'
                        ),
                        fechas: setArrayTable(
                            [
                                { name: 'Fecha inicio', text: incapacidad.fecha_inicio ? incapacidad.fecha_inicio : '' },
                                { name: 'Fecha fin', text: incapacidad.fecha_fin ? incapacidad.fecha_fin : '' },
                            ], '250px'
                        ),
                        nombre: setTextTable(incapacidad.empleado ? incapacidad.empleado.nombre : ''),
                        lider: setTextTable(incapacidad.lider_id ?
                            options.empleados.map((empleado) => {
                                if (incapacidad.lider_id.toString() === empleado.value) {
                                    return (empleado.name)
                                }
                                return false
                            })
                            : ''),
                        estatus: setTextTable(incapacidad.estatus ? incapacidad.estatus : ''),
                        descripcion: setTextTable(incapacidad.comentarios ? incapacidad.comentarios : ''),
                        rechazo: setTextTable(incapacidad.motivo_rechazo ? incapacidad.motivo_rechazo : ''),
                        // adjuntos: setArrayTable(_aux),
                        id: incapacidad.id,
                        // objeto: incapacidad.
                    }
                )
                return aux;
            })
        return aux;
    }

    render() {
        const {modal_motivo_rechazo_I,modal_motivo_rechazo_P, id_rechazo,modal_adjuntos_permisos, modal_mostrar_incapacidades, incapacidadesM, events, espera, modal, key, permisosM, form, title, modal_add_vacaciones, formeditado, options, modal_add_feriados, modal_permisos, disabledDates, modal_incapacidad, modal_cajones, modal_date, activeKey, date, eventos, modal_mostrar_permisos, adjuntoArray } = this.state
        const { authUser: { access_token } } = this.props
        // const { user } = this.props

        return (
            <Layout active='rh'  {...this.props}>
                <Tabs mountOnEnter={true} unmountOnExit={true} defaultActiveKey="vacaciones" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="vacaciones" title="Vacaciones" >
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
                                    <div className="col-md-auto mr-4 mb-4 mb-md-0">
                                        <span className="btn btn-light-info font-weight-bold"
                                            onClick={(e) => { e.preventDefault(); this.exportAxios() }}
                                        >
                                            <i className="far fa-file-excel" /> EXPORTAR
                                        </span>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body >
                                <FullCalendar
                                    locale={esLocale}
                                    plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                    initialView="dayGridMonth" weekends={true} events={events} firstDay={1}
                                    dateClick={this.handleDateClick} eventContent={renderEventContent} themeSystem='bootstrap'
                                />
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey="permisos" title="Permisos">
                        <NewTable
                            tableName='Permisos'
                            subtitle='Listado de Permisos'
                            title='Permisos'
                            exportar_boton={false}
                            mostrar_boton={true}
                            abrir_modal={true}
                            ocultar_filtrar={true}
                            revisar_elementos={true}
                            addClick={this.openModalAddPermisos}
                            columns={PERMISOS_COLUMNS}
                            accessToken={access_token}
                            setter={this.setPermisos}
                            mostarPermisos={this.openEstatusPermisos}
                            mostarPalabra={'PERMISOS'}
                            urlRender={`${URL_DEV}permiso`}
                            type='tab'
                        />
                    </Tab>
                    <Tab eventKey="incapacidades" title="Incapacidades">
                        <NewTable
                            tableName='incapacidades'
                            subtitle='Lista de incapacidades'
                            title='Incapacidades'
                            exportar_boton={false}
                            ocultar_filtrar={true}
                            revisar_elementos={true}
                            mostrar_boton={true}
                            abrir_modal={true}
                            accessToken={access_token}
                            columns={INCAPACIDAD_COLUMNS}
                            setter={this.setIncapacidades}
                            addClick={this.openModalAddIncapacidad}
                            urlRender={`${URL_DEV}permiso/getall`}
                            mostarPermisos={this.openEstatusIncapacidades}
                            mostarPalabra={'INCAPACIDADES'}
                        />
                        <Modal size={"lg"} show={modal_incapacidad} handleClose={this.handleCloseIncapacidad} title="Agregar incapacidad" >
                            <AgregarPermisosForm
                                tipoDeFormulario='incapacidadAdmin'
                                disabledDates={disabledDates}
                                formeditado={formeditado}
                                deleteAdjunto={this.clearFiles}
                                form={form}
                                onChange={this.onChange}
                                onChangeAdjunto={this.onChangeAdjunto}
                                options={options}
                                // empleadoId={form.idEmpleado}
                                onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addIncapacidadAxiosAdmin() }}
                            />
                        </Modal>
                    </Tab>
                </Tabs>
                <Modal size={"lg"} show={modal_motivo_rechazo_I} handleClose={this.handleCloseRechazo} title="Motivo de rechazo" >
                            <AgregarPermisosForm
                                tipoDeFormulario='rechazarElemento'
                                disabledDates={disabledDates}
                                formeditado={formeditado}
                                deleteAdjunto={this.clearFiles}
                                form={form}
                                onChange={this.onChange}
                                onChangeAdjunto={this.onChangeAdjunto}
                                options={options}
                                // empleadoId={form.idEmpleado}
                                onSubmit={(e) => { e.preventDefault(); waitAlert(); this.editEstatusIncapacidad(id_rechazo, 'Rechazado',form.motivo_rechazo); this.clearForm(); }}
                            />
                        </Modal>
                        <Modal size={"lg"} show={modal_motivo_rechazo_P} handleClose={this.handleCloseRechazo} title="Motivo de rechazo" >
                            <AgregarPermisosForm
                                tipoDeFormulario='rechazarElemento'
                                disabledDates={disabledDates}
                                formeditado={formeditado}
                                deleteAdjunto={this.clearFiles}
                                form={form}
                                onChange={this.onChange}
                                onChangeAdjunto={this.onChangeAdjunto}
                                options={options}
                                // empleadoId={form.idEmpleado}
                                onSubmit={(e) => { e.preventDefault(); waitAlert(); this.editEstatusPermisos(id_rechazo, 'Rechazado',form.motivo_rechazo); this.clearForm(); }}
                            />
                        </Modal>
                <Modal size={"lg"} title="adjuntos" show={modal_adjuntos_permisos} handleClose={this.handleCloseIncapacidad}>
                            <div className="col-md-12 px-2 text-center align-self-center">
                                <ItemSlider
                                    items={adjuntoArray} />
                            </div>
                        </Modal>
                <Modal size="lg" title="Solicitudes de permiso" show={modal_mostrar_permisos} handleClose={this.handleCloseEstatusPermisos} >
                    <div className="table-responsive mt-6">
                        <table className="table table-head-custom table-head-bg table-vertical-center">
                            <thead>
                                <tr className="text-left">
                                    <th style={{ minWidth: "175px" }} className="pl-7">
                                        <span className="text-dark-75 font-size-13px">Empleado</span>
                                    </th>
                                    <th style={{ minWidth: "200px" }} className="text-center">
                                        <span className="text-dark-75 font-size-13px">Tipo de permiso</span>
                                    </th>
                                    {/* <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Fecha final</span>
                                    </th> */}
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Estatus</span>
                                    </th>
                                </tr>
                            </thead>
                            {
                                permisosM.map((empleado, key) => {
                                    return (
                                        <tbody key={key}>
                                            <tr className="font-size-13px">
                                                <td className="py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <div className="mb-1">{empleado.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span>{(empleado.tipo)}</span>
                                                </td>
                                                {/* <td className="text-center">
                                                            <span>{setDateTableLG(vacacion.fecha_fin)}</span>
                                                        </td>*/}
                                                <td className="pr-0 text-center">
                                                    <span className="btn btn-icon btn-light-success btn-sm mr-2 ml-auto" onClick={(e) => {
                                                        e.preventDefault();
                                                        createAlert('¿ESTÁS SEGURO QUE DESEAS ACEPTAR EL PERMISO?', '',
                                                        () => this.editEstatusIncapacidad(empleado.id, 'Aceptado','No rechazado')
                                                        )
                                                    }}
                                                    >
                                                        <i className="flaticon2-check-mark icon-sm"></i>
                                                    </span>
                                                    <span className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger" onClick={(e) => {
                                                        e.preventDefault();
                                                        this.openModalRechazarP()
                                                        createAlertSA2WithActionOnClose('¿ESTÁS SEGURO QUE DESEAS RECHAZAR EL PERMISO?', '',
                                                        ()=> {this.setId(empleado.id)},
                                                        ()=>{this.handleCloseRechazo()}
                                                        )
                                                    }}
                                                    >
                                                        <i className="flaticon2-cross icon-sm"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>
                </Modal>
                <Modal size="lg" title="Solicitudes de incapacidades" show={modal_mostrar_incapacidades} handleClose={this.handleCloseEstatusPermisos} >
                    <div className="table-responsive mt-6">
                        <table className="table table-head-custom table-head-bg table-vertical-center">
                            <thead>
                                <tr className="text-left">
                                    <th style={{ minWidth: "175px" }} className="pl-7">
                                        <span className="text-dark-75 font-size-13px">Empleado</span>
                                    </th>
                                    <th style={{ minWidth: "200px" }} className="text-center">
                                        <span className="text-dark-75 font-size-13px">Tipo de permiso</span>
                                    </th>
                                    {/* <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Fecha final</span>
                                    </th> */}
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Estatus</span>
                                    </th>
                                </tr>
                            </thead>
                            {
                                incapacidadesM.map((empleado, key) => {
                                    return (
                                        <tbody key={key}>
                                            <tr className="font-size-13px">
                                                <td className="py-8">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <div className="mb-1">{empleado.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <span>{(empleado.tipo)}</span>
                                                </td>
                                                {/* <td className="text-center">
                                                            <span>{setDateTableLG(vacacion.fecha_fin)}</span>
                                                        </td>*/}
                                                <td className="pr-0 text-center">
                                                    <span className="btn btn-icon btn-light-success btn-sm mr-2 ml-auto" onClick={(e) => {
                                                        e.preventDefault();
                                                        createAlert('¿ESTÁS SEGURO QUE DESEAS ACEPTAR LA INCAPACIDAD?', '',
                                                            () => this.editEstatusIncapacidad(empleado.id, 'Aceptado','No rechazado')
                                                        )
                                                    }}
                                                    >
                                                        <i className="flaticon2-check-mark icon-sm"></i>
                                                    </span>
                                                    <span className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger" onClick={(e) => {
                                                        e.preventDefault();
                                                        this.openModalRechazarI();  
                                                        createAlertSA2WithActionOnClose('¿ESTÁS SEGURO QUE DESEAS RECHAZAR LA INCAPACIDAD?', '',
                                                        ()=> {this.setId(empleado.id)},
                                                        ()=>{this.handleCloseRechazo()})
                                                    }}
                                                    >
                                                        <i className="flaticon2-cross icon-sm"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>
                </Modal>
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
                        disabledDates={disabledDates}
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChange}
                        options={options}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addVacationAxiosAdmin() }}
                    />
                </Modal>
                <Modal size={"lg"} title='nuevo permiso' show={modal_permisos} handleClose={this.handleClosePermisos} at={this.props}>
                    <AgregarPermisosForm
                        tipoDeFormulario='permisoAdmin'
                        disabledDates={disabledDates}
                        formeditado={formeditado}
                        deleteAdjunto={this.clearFiles}
                        form={form}
                        onChange={this.onChange}
                        onChangeAdjunto={this.onChangeAdjunto}
                        options={options}
                        // empleadoId={form.idEmpleado}
                        onSubmit={(e) => { console.log(form)
                            e.preventDefault(); waitAlert(); this.addPermisoAxiosAdmin()
                         }}
                    />
                </Modal>
                <Modal size="lg" title={title} show={modal_cajones} handleClose={this.handleCloseCajones} >
                </Modal>
                <Modal size='lg' title={title} show={modal_add_feriados} handleClose={this.handleCloseAddFeriados}>
                    <div className="d-flex m-2 justify-content-end">
                        <Button
                            onClick={() => { this.downloadPlantilla() }}
                            className="btn btn-icon btn-light-primary btn-sm mr-2 ml-auto"
                            only_icon="fas fa-file-excel icon-md"
                            tooltip={{ text: 'DESCARGAR PLANTILLA' }}
                        />
                    </div>
                    <div>
                        <ItemSlider items={form.adjuntos.adjuntos.files} item='adjuntos'
                            multiple={false} handleChange={this.handleChange}
                            accept='.xlsx, .xls, .csv' />
                    </div>
                    {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="d-flex justify-content-center">
                                <Button icon='' className="btn btn-primary m-2"
                                    onClick={
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
                <Modal size='lg' title={this.setDateText(date)} show={modal_date} handleClose={this.handleCloseDate} >
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
                                            } else return ''
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
        <OverlayTrigger rootClose overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
            <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                <span>{eventInfo.event.title}</span>
            </div>
        </OverlayTrigger>
    )
}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Vacaciones)