import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { LEADS_FRONT } from '../constants'
import { DropdownButton, Dropdown, Card, OverlayTrigger, Tooltip, Nav, Jumbotron, Button,Container,Row,Col,ButtonGroup } from 'react-bootstrap'
import { SolicitarVacacionesForm, EstatusForm, AgendarReunionGoogle } from "./../components/forms"
import { Modal } from './../components/singles'

import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert, questionAlert, deleteAlert } from './../functions/alert'
import { URL_DEV } from './../constants'
import axios from 'axios';
import { apiGet } from './../functions/api'
import moment from 'moment'
import Swal from 'sweetalert2'
import {  setOptions } from './../functions/setters'
import AVATAR from './../assets/images/icons/avatar.png'
import { AgregarPermisosForm } from "./../components/forms"

import CreateSalaJuntas from './RecursosHumanos/Reuniones/SalaJuntas/CreateSalaJuntas'
import EnrollUser from './RecursosHumanos/Reuniones/Cursos/EnrollUser'
import Aplicantes from './RecursosHumanos/Reuniones/Cursos/AplicantesCurso'
import SolicitarVehiculo from './RecursosHumanos/Vehiculos/SolicitarVehiculo'
import EstatusVehiculo from './RecursosHumanos/Vehiculos/EstatusVehiculo'
import SeguimientoViajes from './RecursosHumanos/Vehiculos/SeguimientoViajes'
import ObservacionesVehiculo from './RecursosHumanos/Vehiculos/ObservacionesVehiculo'

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

class Home extends Component{
    
    state = {
        disponibles: 0,
        events: [],
        formeditado: 0,
        inicio: new Date(),
        final: new Date(),
        modal: {
            solicitar_vacaciones: false,
            status_vacaciones: false,
            date: false,
            estacionamiento: false,
            form_event: false,
            modal_permisos: false,
            modal_incapacidad: false,
            modal_ver_permiso:false,
            modal_ver_incapacidad: false,
            modal_solicitar_sala: false,
            modal_inscripcion_curso: false,
            modal_aplicantes: false,
            modal_solicitar_vehiculo: false,
            modal_estatus_vehiculo: false,
            modal_seguimiento_viajes: false,
            modal_observaciones_vehiculo: false,
        },
        permisosM:[],
        incapacidadesM:[],
        empleado: '',
        vacaciones_totales: '',
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            fechas: { start: null, end: null },
            // nombre: this.props.authUser.user.name,
            idEmpleado: this.props.authUser.user.name,
            nombre: '',
            descripcion: '',
            tipo: '',
            empleado: this.props.authUser.user.empleado_id,
            date_entrada: new Date('2022-01-01T09:00:00'),
            date_salida: new Date('2022-01-01T18:00:00'),
            hora_salida: 0,
            hora_entrada: 0,
            minuto_entrada: 0,
            minuto_salida: 0,
            lider: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                },
            }
        },
        formEvento: {
            fecha: new Date(),
            hora: "08",
            minuto: "00",
            hora_final: "08",
            minuto_final: "00",
            correos: []
        },
        data: {
            usuarios: []
        },
        estatus: [],
        disabledDates: [],
        date: '',
        eventos: '',
        activeKey: '',
        activeKeyTab: 'citas',
        tab: [
            {
                nombre: 'Citas y cumpleaños',
                icono: 'far fa-calendar-check',
                active: 'citas'
            },
            {
                nombre: 'Estacionamiento',
                icono: 'fas fa-car-alt',
                active: 'estacionamiento'
            }
        ],
        title: '',
        options: {
            empleados: [],
            lider: []
        },
        enrollUser:[],
        viajesActivos: false,
    };

    componentDidMount(){
        const { user } = this.props.authUser 
        const { history } = this.props
        this.getViajes()
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getVacacionesAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = params.get("id")
            if (id)
                this.getEventAxios(id)
        }
        // this.addIncapacidadAxiosAdmin()
        this.setOptionsModal()
        this.getEnrollUser()
        if(!user.permisos){
            history.push('/login');
            window.location.reload();
        }
        else {
            let perm = null   
             const { access_token } = this.props.authUser.access_token
            let arreglo = ['calendario-tareas', 'crm', 'tareas', 'mi-proyecto','incidencias','directorio','comunicados', 'reporte','autorizar']
            arreglo.forEach( (elemento) => {
                if(!perm){
                    perm = user.permisos.find((permiso) => {
                        return permiso.modulo.slug === elemento
                    })
                }
            })
            if(perm){
                if(perm.modulo.slug === 'crm'){
                    window.location.href = `${LEADS_FRONT}/leads/crm?tag=${access_token}`
                }
                if(perm.modulo.slug === 'incidencias'){
                    window.location.href = `${LEADS_FRONT}/rh/incidencias?tag=${access_token}`
                }
                if(perm.modulo.slug === 'mi-proyecto'){
                    window.location.href = `${LEADS_FRONT}/mi-proyecto?tag=${access_token}`
                }
                if(perm.modulo.slug === 'directorio'){
                    window.location.href = `${LEADS_FRONT}/rh/directorio?tag=${access_token}`
                }
                if(perm.modulo.slug === 'comunicados'){
                    window.location.href = `${LEADS_FRONT}/rh/comunicados?tag=${access_token}`
                }
                if (perm.modulo.slug === 'reporte') {
                    window.location.href = `${LEADS_FRONT}/leads/reporte?tag=${access_token}`
                }
                if (perm.modulo.slug === 'autorizar') {
                    window.location.href = `${LEADS_FRONT}/rh/vacaciones-permisos?tag=${access_token}`
                }
            }else{
                history.push(user.permisos[0].modulo.url)
            }}

    }
   
    getViajes = () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        apiGet('vehiculos/usuario', access_token)
        .then(res => {
            if(res.data.solicitudes.length > 0){
                this.setState({
                    ...this.State,
                    viajesActivos: true
                })
            }
        }).catch(res=> {
        })
    }

    getEnrollUser = async () => { 
        const { access_token } = this.props.authUser
        const { data } = await axios.get(`${URL_DEV}salas/autoriza`, { headers: { Authorization: `Bearer ${access_token}` } })
        this.setState({ ...this.state, enrollUser: data })
    }

    getEventAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}vacaciones/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { evento } = response.data
                const { formEvento, modal } = this.state
                if (evento.googleEvent) {
                    const { start, end } = evento.googleEvent
                    let fecha = new Date(moment(start.dateTime))
                    let fechaFin = new Date(moment(end.dateTime))
                    formEvento.hora_final = this.setTimer(fechaFin.getHours());
                    formEvento.hora = this.setTimer(fecha.getHours());
                    formEvento.minuto_final = this.setTimer(fechaFin.getMinutes());
                    formEvento.minuto = this.setTimer(fecha.getMinutes());
                    formEvento.fecha = fecha
                }
                modal.form_event = true
                this.setState({ ...this.state, formEvento, modal, evento: evento, title: 'Información el evento' })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    openModalSolicitarVacaciones = () => {
        const { modal } = this.state
        modal.solicitar_vacaciones = true
        this.setState({
            ...this.state,
            modal,
            title: 'Solicitar vacaciones',
            form: this.clearForm(),
            formeditado: 0,
        })
    }

    openModalSolicitarPermiso = () => {
        const { modal } = this.state
        modal.modal_permisos = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalSalaJuntas = () => {
        const { modal } = this.state
        modal.solicitar_sala = true
        this.setState({
            ...this.state,
            modal,
        })
    }
    
    openModalEnrollUser = () => {
        const { modal } = this.state
        modal.modal_inscripcion_curso = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalAplicantes = () => {
        const { modal } = this.state
        modal.modal_aplicantes = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalVehiculo = () => {
        const { modal } = this.state
        modal.modal_solicitar_vehiculo = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalEstatusVehiculo = () => {
        const { modal } = this.state
        modal.modal_estatus_vehiculo = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalSeguimientoViajes = () => {
        const { modal } = this.state
        modal.modal_seguimiento_viajes = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalObservacionesVehiculo = () => {
        const { modal } = this.state
        modal.modal_observaciones_vehiculo = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalSalaJuntas = () => {
        const { modal } = this.state
        modal.solicitar_sala = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalEnrollUser = () => {
        const { modal } = this.state
        modal.modal_inscripcion_curso = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalAplicantes = () => {
        const { modal } = this.state
        modal.modal_aplicantes = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalVehiculo = () => {
        const { modal } = this.state
        modal.modal_solicitar_vehiculo = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalEstatusVehiculo = () => {
        const { modal } = this.state
        modal.modal_estatus_vehiculo = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalSeguimientoViajes = () => {
        const { modal } = this.state
        modal.modal_seguimiento_viajes = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    closeModalObservacionesVehiculo = () => {
        const { modal } = this.state
        modal.modal_observaciones_vehiculo = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    clearModals = () => {
        const { form } = this.state
        form.fechaInicio= new Date()
        form.fechaFin= new Date()
        form.descripcion = ''
        form.tipo= ''
        form.hora_salida= 0
        form.hora_entrada= 0
        form.minuto_entrada= 0
        form.minuto_salida= 0 
        form.lider= ''
        form.adjuntos= {
            adjuntos: {
                files: [],
                value: '',
                placeholder: 'Adjuntos'
            }
        }
        this.setState({
            ...this.state,
            form,
        })
    }

    openModalSolicitarIncapacidad = () => {
        const { modal } = this.state
        modal.modal_incapacidad = true
        this.setState({
            ...this.state,
            modal,
        })
    }
    openModalTablaIncapacidad = () => {
        const { modal } = this.state
        modal.modal_ver_incapacidad = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalTablaPermiso = () => {
        const { modal } = this.state
        modal.modal_ver_permiso = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    openModalEstatusVacaciones = () => {
        const { modal } = this.state
        modal.status_vacaciones = true
        this.setState({
            ...this.state,
            modal,
            title: 'Estatus de vacaciones',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    openModalEstacionamiento = () => {
        const { modal } = this.state
        modal.estacionamiento = true
        this.setState({
            ...this.state,
            modal,
            title: 'Solicitud de espacio de estacionamiento',
            form: this.clearForm(),
        })
    }

    handleCloseEvent = () => {
        const { modal, formEvento } = this.state
        formEvento.correos = []
        modal.form_event = false
        this.setState({ ...this.state, modal, formEvento })
    }

    handleCloseModalJuntas = () => {
        const { modal } = this.state
        modal.solicitar_sala = false
        this.setState({ ...this.state, modal })
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
            return false
        })
        return form;
    }

    handleClose = () => {
        const { modal, options } = this.state
        modal.solicitar_vacaciones = false
        this.setState({ ...this.state, modal, options, title: 'Solicitar vacaciones', form: this.clearForm() })
    }

    handleCloseEstatus = () => {
        const { modal } = this.state
        modal.status_vacaciones = false
        this.setState({ ...this.state, modal, title: 'Estatus de vacaciones', form: this.clearForm() })
    }

    handleCloseDate = () => {
        const { modal } = this.state
        modal.date = false
        this.setState({ ...this.state, modal, date: '', activeKey: '', eventos: '' })
    }

    handleCloseEstacionamiento = () => {
        const { modal, options } = this.state
        modal.estacionamiento = false
        this.setState({ ...this.state, modal, options, title: 'Solicitud de espacio de estacionamiento', })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onChangeMessage = (value, tipo) => { 
        console.log(value)
        const { form } = this.state
        form[tipo] = value
        this.setState({ ...this.state, form })
    }

    onChangeHora = (value, tipo) => { 
        console.log(value.getHours())
        console.log(value.getMinutes())
        const { form } = this.state
        if (tipo === 'hora_entrada') { 
            form.date_entrada = value
            form.hora_entrada = value.getHours()
            form.minuto_entrada = value.getMinutes()
            this.setState({ ...this.state, form })
        }
        if (tipo === 'hora_salida') {
            form.date_salida = value
            form.hora_salida = value.getHours()
            form.minuto_salida = value.getMinutes()
            this.setState({ ...this.state, form })
        }
    }

    onChangeEvento = e => {
        const { name, value } = e.target
        const { formEvento } = this.state
        formEvento[name] = value
        this.setState({ ...this.state, formEvento })
    }
   async setOptionsModal(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'permiso/permiso',{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                options.lider = setOptions(response.data.direcciones, 'nombre', 'id')
                this.setState({
                    ...this.state,
                    options
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

    async getPermisosModal() {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'permiso/usuario',access_token, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                let aux = []
                response.data.permisos.map((permiso)=>{         
                            aux.push({
                            shortName: "Tipo",
                            tipo: permiso.tipo_permiso,  
                            name: permiso.empleado.nombre, 
                            estatus:permiso.estatus,
                            id:permiso.id,
                            mRechazo: permiso.motivo_rechazo,
                            comentarios: permiso.comentarios,
                        })
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

    async getIncapacidadModal() {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'permiso/usuario',access_token,{ headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let aux = []
                response.data.incapacidad.map((permiso)=>{         
                            aux.push({
                            shortName: "Tipo",
                            tipo: permiso.tipo_permiso,  
                            name: permiso.empleado.nombre, 
                            estatus:permiso.estatus,
                            id:permiso.id,
                            mRechazo: permiso.motivo_rechazo,
                            comentarios: permiso.comentarios,
                        })
                        return aux
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

    getDiasDisponibles = (empleado, vacaciones_totales) => {
        /* const { empleado, vacaciones_totales } = this.state */
        this.getPermisosModal()
        this.getIncapacidadModal()
        let contador = empleado.vacaciones_disponibles
        let fecha_inicio_empleado = ''
        let final = ''
        let inicio = ''
        if (empleado) {
            fecha_inicio_empleado = new Date(moment(empleado.fecha_inicio))
            let mes = fecha_inicio_empleado.getMonth() + 1
            if (mes.toString().length === 1)
                mes = '0' + mes
            let dia = fecha_inicio_empleado.getDate()
            let now = new Date();
            let año = new Date().getFullYear();
            let verificador = new Date(mes + '/' + dia + '/' + año)
            if (now > verificador) {
                inicio = verificador
                final = new Date(mes + '/' + dia + '/' + (año + 1))
            }
            else {
                final = verificador
                inicio = new Date(mes + '/' + dia + '/' + (año - 1))
            }
            empleado.vacaciones.forEach((vacacion) => {
                if (vacacion.estatus === 'En espera') {
                    let dias = moment(vacacion.fecha_fin).diff(moment(vacacion.fecha_inicio), 'days') + 1
                    for (let i = 0; i < dias; i++) {
                        let date = new Date(moment(vacacion.fecha_inicio).add(i, 'days'))
                        if (date.getDay() > 0 && date.getDay() < 6)
                            if (date >= inicio && date < final)
                                contador--
                    }
                }
            })
        }
        if (contador < 0)
            contador = 0
        return { contador: contador, inicio: inicio, final: final }
    }

    getVacaciones(empleado, vacaciones_totales) {
        let contador = []
        let fecha_inicio_empleado = ''
        if (empleado) {

            fecha_inicio_empleado = new Date(empleado.fecha_inicio)
            fecha_inicio_empleado.setDate(fecha_inicio_empleado.getDate() + 1)

            let mes = fecha_inicio_empleado.getMonth() + 1

            if (mes.toString().length === 1) {
                mes = '0' + mes
            }

            let dia = fecha_inicio_empleado.getDate()
            let now = new Date();
            now.setDate(now.getDate() + 366)
            let año = now.getFullYear();

            let fecha_fin = new Date(mes + '/' + dia + '/' + año)
            let fecha_inicio = new Date(mes + '/' + dia + '/' + (año - 1))

            if (fecha_fin < fecha_inicio_empleado) {
                fecha_fin = new Date(mes + '/' + dia + '/' + (año + 1))
                fecha_inicio = new Date(mes + '/' + dia + '/' + año)
            }

            vacaciones_totales.map((vacacion, key) => {
                if (vacacion.estatus !== 'Aceptadas') {
                    let vacacion_fecha_inicio = new Date(vacacion.fecha_inicio)
                    let vacacion_fecha_fin = new Date(vacacion.fecha_fin)
                    if (vacacion_fecha_inicio >= fecha_inicio && vacacion_fecha_inicio < fecha_fin && vacacion_fecha_fin >= fecha_inicio && vacacion_fecha_fin < fecha_fin)
                        contador.push(vacacion)
                }
                return false
            })

            return contador
        }
        else
            return contador
    }

    deleteEventoAxios = async (gEvent) => {
        const { access_token } = this.props.authUser
        const { id } = gEvent.googleEvent
        await axios.delete(`${URL_DEV}vacaciones/google-calendar/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Vacaciones solicitadas con éxito.')
                this.getVacacionesAxios()
                this.handleCloseDate()
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
        let fechaInicioA = form.fechaInicio
        let fechaInicioAString = fechaInicioA.toISOString();
        data.append('fechaInicio', fechaInicioAString)
        let fechaFinA = form.fechaFin
        let fechaFinAString = fechaFinA.toISOString();
        data.append('fechaFin', fechaFinAString)
        // let empleadoA = form.empleado
        data.append('empleado', this.props.authUser.user.empleado_id)
        data.append('empleado_id', this.props.authUser.user.empleado_id)
        // data.append('lider_id', liderA)
        data.append('tipo_permiso', 'permiso')
        let minutoSalidaA = Math.floor(form.minuto_salida );
        // let horaSalidaA = Math.floor((form.hora_salida * 10000) + minutoSalidaA);
        let horaSalidaA = Math.floor((form.hora_salida));
        data.append('hora_salida', horaSalidaA)
        data.append('minuto_salida', minutoSalidaA)
        let minutoEntradaA = Math.floor(form.minuto_entrada );
        let horaEntradaA = Math.floor((form.hora_entrada ) );
        data.append('hora_entrada', horaEntradaA)
        data.append('minuto_entrada', minutoEntradaA)
        let comentarioA = form.descripcion
        data.append('descripcion', comentarioA)
        // let horaEntradaA = Math.floor((form.hora_entrada * 10000) + minutoEntradaA);
        
            await axios.post(URL_DEV + 'permiso', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
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
        // let empleadoA = form.empleado
        data.append('empleado', this.props.authUser.user.empleado_id)
        data.append('empleado_id', this.props.authUser.user.empleado_id)
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
            await axios.post(URL_DEV + 'permiso', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Incapacidad enviada con éxito')
                this.handleClosePermisos()
            },
            (error) => {
            // printResponseErrorAlert(error)
            console.log(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async askVacationAxios() {
        const { access_token } = this.props.authUser
        const { form, disponibles, inicio, final } = this.state
        let contador = disponibles
        let dias = moment(form.fechaFin).diff(moment(form.fechaInicio), 'days') + 1
        for (let i = 0; i < dias; i++) {
            let date = new Date(moment(form.fechaInicio).add(i, 'days'))
            if (date.getDay() > 0 && date.getDay() < 6)
                if (date >= inicio && date < final)
                    contador = contador - 1
        }
        if (contador < 0) {
            errorAlert('Días disponibles insuficientes')
        } else {
            waitAlert();
            await axios.post(URL_DEV + 'vacaciones', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Vacaciones solicitadas con éxito.')
                    this.getVacacionesAxios();
                    this.handleClose();
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }

    async getVacacionesAxios() {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}vacaciones`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { user } = this.props.authUser
                const { empleados, vacaciones, empleado, user_vacaciones, feriados, eventos, usuarios, disponibles } = response.data
                data.usuarios = usuarios
                let aux2 = []
                let aux = []
                let mes = ''
                let dia = ''
                let año = new Date().getFullYear();
                empleados.map((empleado) => {
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
                    if (vacacion.estatus === 'Aceptadas')
                        aux.push({
                            title: vacacion.empleado.nombre,
                            start: vacacion.fecha_inicio,
                            end: vacacion.fecha_fin,
                            iconClass: 'fas fa-umbrella-beach',
                            containerClass: 'vacaciones'
                        })
                    if (vacacion.estatus !== 'Rechazadas') {

                        if (vacacion.empleado)
                            if (vacacion.empleado.usuario) {
                                if (vacacion.empleado.usuario.id === user.id) {
                                    let dias = moment(vacacion.fecha_fin).diff(moment(vacacion.fecha_inicio), 'days') + 1
                                    for (let i = 0; i < dias; i++)
                                        aux2.push(moment(vacacion.fecha_inicio).add(i, 'days').toDate())
                                }

                            }

                    }
                    return false
                })

                feriados.map((feriado) => {
                    aux.push({
                        shortName: "Feriados",
                        title: feriado.texto,
                        start: feriado.fecha,
                        end: feriado.fecha,
                        iconClass: 'fas fa-calendar-check icon-md',
                        containerClass: 'feriados'
                    })
                    var start = moment(feriado.fecha).toDate();
                    aux2.push(start)
                    return false
                })
                var now = moment();
                var dias = moment().add(2, 'w').add(2, 'days');;

                const start = moment(now, 'YYYY-MM-DD');
                const end = moment(dias, 'YYYY-MM-DD');

                const current = start.clone();
                const result = [];

                while (current.isBefore(end)) {
                    result.push(moment(current).toDate());
                    current.add(1, "day");
                }
                // const timeStamp = new Date().getTime();
                // const yesterdayTimeStamp = timeStamp - 2*24*60*60*1000;
                // const yesterdayDate = new Date(yesterdayTimeStamp);
                let arr3 = [...aux2, ...result]

                eventos.map((evento) => {
                    aux.push({
                        shortName: 'Eventos',
                        title: evento.googleEvent.summary,
                        start: evento.googleEvent.start.dateTime,
                        end: evento.googleEvent.end.dateTime,
                        iconClass: 'far fa-clock',
                        containerClass: 'eventos',
                        evento: evento,
                        identificador: evento.id
                    })
                    return false
                })
                // console.log(yesterdayDate)

                let diasDisponibles = this.getDiasDisponibles(empleado, user_vacaciones)
                this.setState({
                    ...this.state,
                    events: aux,
                    empleado: empleado,
                    vacaciones_totales: user_vacaciones,
                    inicio: diasDisponibles.inicio,
                    final: diasDisponibles.final,
                    estatus: this.getVacaciones(empleado, user_vacaciones),
                    disabledDates: arr3,
                    data,
                    disponibles: disponibles
                })
               
            }, (error) => { printResponseErrorAlert(error) }
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
                const { activeKey, modal } = this.state
                modal.date = true

                let bandera = false
                Object.keys(eventos).map((evento, key) => {
                    if (eventos[evento].length && bandera === false && evento !== 'feriados')
                        bandera = evento
                    return ''
                })
                if (bandera === false)
                    bandera = 'estacionamiento'
                if (activeKey !== '')
                    bandera = activeKey
                this.setState({
                    ...this.state,
                    modal,
                    date: date,
                    eventos: eventos,
                    activeKey: bandera
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    solicitarCajon = async () => {
        const { access_token } = this.props.authUser
        const { date } = this.state
        waitAlert()
        await axios.put(URL_DEV + 'vacaciones/cajones/' + date, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
            console.error(error, 'error')
        })
    }

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

    onSubmitFormEvent = async () => {
        const { evento, formEvento } = this.state
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.put(`${URL_DEV}vacaciones/google-calendar/${evento.googleEvent.id}`, formEvento, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form_event = false
                doneAlert('Evento editado con éxito')
                this.setState({ ...this.state, modal, evento: '' })
                this.getVacacionesAxios()
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteEvent = async () => {
        const { evento } = this.state
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}vacaciones/google-calendar/${evento.googleEvent.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.form_event = false
                doneAlert('Evento eliminado con éxito')
                this.setState({ ...this.state, modal, evento: '' })
                this.getVacacionesAxios()
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setInvitados = (invitados) => {
        const { data } = this.state
        if (invitados)
            return (
                <div>
                    <div className="d-flex mb-3 flex-wrap  justify-content-center">
                        {
                            invitados.map((invitado, index) => {
                                let aux = false
                                data.usuarios.map((user) => {
                                    if (user.email.toUpperCase() === invitado.email.toUpperCase())
                                        aux = user
                                    return false
                                })
                                if (aux !== false) {
                                    if (aux.avatar)
                                        return (<img className="calendar-avatar mr-3 mb-2" src={aux.avatar} alt='' key={index} />)
                                    else
                                        return (<img className="calendar-avatar mr-3 mb-2" src={AVATAR} alt='' key={index} />)
                                }
                                return false
                            })
                        }
                    </div>
                    <div className="lista-invitados text-left">
                        {
                            invitados.map((invitado, index) => {
                                let aux = false
                                data.usuarios.map((user) => {
                                    if (user.email.toUpperCase() === invitado.email.toUpperCase())
                                        aux = user
                                    return false
                                })
                                if (aux === false)
                                    return (
                                        <div className="d-flex align-items-center my-2" key={index}>
                                            <i className={invitado.responseStatus === 'accepted' ? "fas fa-check-circle kt-font-boldest mr-3 icon-green" : 'fas fa-clock kt-font-boldest mr-3 icon-purple'}></i>
                                            <span>{invitado.email}</span>
                                        </div>
                                    )
                                return false
                            })
                        }
                    </div>
                </div>

            )
    }

    setTimer = (time) => {
        if (time < 10)
            return '0'.time
        return time
    }

    getInvitadosSprits = invitados => {
        if (invitados)
            return (
                <img className="calendar-avatar" src={AVATAR} alt='' />
            )
    }

    renderEventContent = (eventInfo) => {
        if (eventInfo.event._def.extendedProps.evento) {
            let start = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.start.dateTime);
            let end = new Date(eventInfo.event._def.extendedProps.evento.googleEvent.end.dateTime);
            return (
                <OverlayTrigger rootClose
                    /* defaultShow = { true } */
                    overlay={
                        <Tooltip className="tool-calendar">
                            <div className="tool-titulo">
                                <b>
                                    {eventInfo.event.title}
                                </b>
                            </div>
                            <div className="p-2">
                                <div className="tool-horario">
                                    <span>
                                        {
                                            this.setTimer(start.getHours()) + ':' + this.setTimer(start.getMinutes())
                                        }
                                        &nbsp; - &nbsp;
                                        {
                                            this.setTimer(end.getHours()) + ':' + this.setTimer(end.getMinutes())
                                        }
                                    </span>
                                </div>
                                <br />
                                {
                                    this.setInvitados(eventInfo.event._def.extendedProps.evento.googleEvent.attendees)
                                }
                            </div>
                        </Tooltip>
                    }
                >
                    <div className={eventInfo.event._def.extendedProps.containerClass + ' evento text-left text-hover'} onClick={(e) => { e.preventDefault(); this.getEventAxios(eventInfo.event._def.extendedProps.evento.googleEvent.id) }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                                <span>{eventInfo.event.title}</span>
                            </div>
                            <div>
                                {
                                    this.getInvitadosSprits(eventInfo.event._def.extendedProps.evento.googleEvent.attendees)
                                }
                            </div>
                        </div>
                    </div>
                </OverlayTrigger>
            )
        }
        return (
            <OverlayTrigger rootClose overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                <div className={eventInfo.event._def.extendedProps.containerClass + ' evento'}>
                    <i className={eventInfo.event._def.extendedProps.iconClass + " kt-font-boldest mr-3"}></i>
                    <span>{eventInfo.event.title}</span>
                </div>
            </OverlayTrigger>
        )
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
            default: break;
            // case 'estacionamiento':
            //     nombre = 'ESTACIONAMIENTO'
            //     icon = 'fas fa-car'
            //     break;
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
    changeActiveKeyTab = tab => {
        this.setState({
            ...this.state,
            activeKeyTab: tab
        })
    }
    printModal = () => {
        const { activeKey } = this.state

        switch (activeKey) {
            case 'eventos':
                return this.printEventos()
            case 'cumpleaños':
                return this.printCumpleaños()
            case 'vacaciones':
                return this.printVacaciones()
            // case 'estacionamiento':
            //     return this.prinEstacionamiento()
            //     break
            default:
                return <></>
        }
    }
    getHours(dateTimeStart, dateTimeEnd) {
        var fechaStart = new Date(dateTimeStart)
        var horaStart = this.setTimer(fechaStart.getHours()) + ":" + this.setTimer(fechaStart.getMinutes())

        var fechaEnd = new Date(dateTimeEnd)
        var horaEnd = this.setTimer(fechaEnd.getHours()) + ":" + this.setTimer(fechaEnd.getMinutes())

        return horaStart + " - " + horaEnd
    }

    tagInputChange = (nuevoTipos) => {
        const uppercased = nuevoTipos
        const { formEvento } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formEvento.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            formEvento
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
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

    handleClosePermisos = () => {
        const { modal } = this.state
        modal.modal_permisos = false
        modal.modal_incapacidad = false
        modal.modal_ver_incapacidad =false
        modal.modal_ver_permiso =false
        this.setState({
            ...this.state,
            modal
        })
        this.clearModals()

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
            return false
        })
        return form;
    }

    render(){
        const { permisosM, incapacidadesM, events, options, form, title, formeditado, modal, estatus, disponibles, disabledDates, date, eventos, activeKey, formEvento, evento, enrollUser, viajesActivos } = this.state

        return(
            <Layout { ...this.props}>
                <div >
                <Container  >
                    <h1  style={{ textAlign:'center' }}> > Mi dashboard</h1>
                <Row xs={1} md={2} className="g-4">
                        <Col key={1}>
                        <Card style={{ textAlign:'center' }}>
                                <Card.Body style={{ textAlign:'center' }}>
                                <Card.Title>VACACIONES</Card.Title>
                                <Card.Img  style={{ width: '8rem'  }}  variant="top" src="https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/images/vacaciones.png" />

                                <Card.Text >
                                <div className="mb-4">
                                    <i className="fa fa-genderless text-info mr-2"></i>
                                    <span className=" font-weight-bolder font-size-lg">Vacaciones disponibles:</span>
                                    <span className="label label-rounded label-light-info font-weight-bolder ml-2">{disponibles}</span>
                                    <span className=" font-weight-bolder font-size-lg ml-2">días.</span>
                                </div>
                                {
                                    disponibles > 0 ?
                                        <DropdownButton
                                            title="solicitar vacaciones"
                                            id={`dropdown-button-drop-center`}
                                            drop={'center'}
                                            data-bs-theme="light"
                                            variant="secondary"
                                        >
                                            <Dropdown.Item onClick={this.openModalSolicitarVacaciones}>Solicitar vacaciones</Dropdown.Item>
                                            <Dropdown.Item onClick={this.openModalEstatusVacaciones}>Estatus de vacaciones</Dropdown.Item>
                                        </DropdownButton>
                                        : ''
                                    }
                                </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col key={1}>
                        <Card  style={{ textAlign:'center' }}>
                            <Card.Body style={{ textAlign:'center' }}>
                            <Card.Title>PERMISOS</Card.Title>
                            <Card.Img style={{ width: '8rem'}} variant="top" src="https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/images/permisos.png" />
                            <Card.Text>
                            <br />
                            <br />
                                {
                                    <DropdownButton 
                                        title="solicitar Permiso"
                                        id={`dropdown-button-drop-left`}
                                        drop={'left'}
                                        data-bs-theme="light"
                                        variant="secondary"
                                    >
                                        <Dropdown.Item onClick={this.openModalSolicitarPermiso}>Solicitar permisos</Dropdown.Item>
                                        <Dropdown.Item onClick={this.openModalTablaPermiso}>Estatus de permisos</Dropdown.Item>
                                    </DropdownButton>
                                }
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                     <br />
                    <Row xs={1} md={2} className="g-4">
                        <Col key={1}>
                        <Card style={{ textAlign:'center' }}>
                            <Card.Body style={{ textAlign:'center' }}>
                            <Card.Title>SALAS</Card.Title>
                            <Card.Img style={{ width: '12rem' , marginLeft:'30px' }} variant="top" src="https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/images/juntas.png" />

                            <Card.Text>
                            {
                                    <DropdownButton 
                                        title="Reservar sala"
                                        id={`dropdown-button-drop-left`}
                                        drop={'left'}
                                        data-bs-theme="light"
                                        variant="secondary"

                                    >
                                        {enrollUser.aprovacion && enrollUser.aprovacion[0] !== null && enrollUser.aprovacion[0].length !== 0 ?
                                        <Dropdown.Item onClick={this.openModalAplicantes}>Aprobar cursos</Dropdown.Item> : null}
                                        <Dropdown.Item onClick={this.openModalSalaJuntas}>Reservar Sala de Juntas</Dropdown.Item>
                                        <Dropdown.Item onClick={this.openModalEnrollUser}>Solicitar Curso</Dropdown.Item>
                                    </DropdownButton>
                                }
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                        {/* <Col key={1}>
                        <Card style={{ textAlign:'center' }}>
                            <Card.Body style={{ textAlign:'center' }}>
                            <Card.Title>VEHÍCULOS</Card.Title>
                            <Card.Img style={{ width: '8rem' }} variant="top" src="https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/images/camioneta.png" />

                            <Card.Text>
                            {
                                    <DropdownButton 
                                        title="Solicitar Vehículo"
                                        id={`dropdown-button-drop-left`}
                                        drop={'left'}
                                        data-bs-theme="light"
                                        variant="secondary"
                                    >
                                        <Dropdown.Item onClick={this.openModalVehiculo}>Solicitar Vehículo</Dropdown.Item>
                                        <Dropdown.Item onClick={this.openModalEstatusVehiculo}>Estatus de solicitud</Dropdown.Item>
                                        {
                                            viajesActivos ? 
                                            <>
                                                <Dropdown.Item onClick={this.openModalSeguimientoViajes}>Seguimiento de viajes</Dropdown.Item>
                                                <Dropdown.Item onClick={this.openModalObservacionesVehiculo}>Observaciones</Dropdown.Item>
                                            </>
                                            : null
                                        }
                                       
                                    </DropdownButton>
                                }
                              
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col> */}
                    </Row>
                   
                </Container>
</div>
                <Modal size={"lg"} title='solicitud de permiso' show={modal.modal_permisos} handleClose={this.handleClosePermisos} at={this.props}>
                    <AgregarPermisosForm
                        // disabledDates={disabledDates}
                        formeditado={formeditado}
                        deleteAdjunto={this.clearFiles}
                        form={form}
                        onChange={this.onChange}
                        onChangeAdjunto={this.onChangeAdjunto}
                        options={options}
                        empleadoId={form.idEmpleado}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addPermisoAxiosAdmin();this.getPermisosModal() }}
                        tipoDeFormulario='permiso'
                        onChangeHora={this.onChangeHora}
                        onChangeMessage={this.onChangeMessage}
                    />
                </Modal>                        
                <Modal size={"lg"} title='solicitud de incapacidad' show={modal.modal_incapacidad} handleClose={this.handleClosePermisos}>
                        <AgregarPermisosForm
                        // disabledDates={disabledDates}
                        formeditado={formeditado}
                        deleteAdjunto={this.clearFiles}
                        form={form}
                        onChange={this.onChange}
                        onChangeAdjunto={this.onChangeAdjunto}
                        options={options}
                        empleadoId={form.idEmpleado}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addIncapacidadAxiosAdmin();this.getIncapacidadModal() }}
                        tipoDeFormulario='incapacidad'
                    />
                        </Modal>
                <Modal size="lg" title={title} show={modal.solicitar_vacaciones} handleClose={this.handleClose}>
                    <SolicitarVacacionesForm
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChange}
                        disabledDates={disabledDates}
                        onSubmit={(e) => { e.preventDefault(); this.askVacationAxios() }}
                    />
                </Modal>
                <Modal title={title} show={modal.status_vacaciones} handleClose={this.handleCloseEstatus}>
                    <EstatusForm
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChange}
                        estatus={estatus}
                    />
                </Modal>

                <Modal className='max-height' size={"lg"} title='estatus de permisos' show={modal.modal_ver_permiso} handleClose={this.handleClosePermisos}>
                <div className="table-responsive mt-6 ">
                        <table className="table table-head-custom table-head-bg table-vertical-center">
                            <thead>
                                <tr className="text-left">
                                    <th style={{ minWidth: "150px" }} className="pl-7">
                                        <span className="text-dark-75 font-size-13px">Empleado</span>
                                    </th>
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Detalles</span>
                                    </th>
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Estatus</span>
                                    </th>
                                    <th className="text-center">
                                        <span className="text-dark-75 font-size-13px">Motivo de rechazo</span>
                                    </th>
                                </tr>
                            </thead>
                            {
                                permisosM.map((empleado, key) => {
                                    //  console.log(empleado.estatus)
                                    return (
                                                <tbody key={key}>
                                                    <tr className="font-size-13px">
                                                    <td className="text-center">
                                                            <span>{empleado.name}</span>
                                                        </td>
                                                        <td className="text-center">
                                                    <span>{(empleado.comentarios)}</span>
                                                </td>
                                                        <td className="text-center">
                                                            <span>{(empleado.estatus)}</span>
                                                        </td>
                                                        <td className="text-center">
                                                            <span>{(empleado.mRechazo)}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>
                </Modal>
              

                <Modal size="sm" title="Reservar sala de Juntas" show={modal.solicitar_sala} handleClose={this.closeModalSalaJuntas}>
                    <CreateSalaJuntas closeModal={this.closeModalSalaJuntas} rh={ false} />
                </Modal>
                <Modal size="lg" title="Inscribirse a un curso" show={modal.modal_inscripcion_curso} handleClose={this.closeModalEnrollUser}>
                    <EnrollUser close={this.closeModalEnrollUser} />
                </Modal>

                <Modal size="xl" title="AprobaciÓn de cursos" show={modal.modal_aplicantes} handleClose={this.closeModalAplicantes}>
                    <Aplicantes data={enrollUser} getEnrollUsers={this.getEnrollUser} />
                </Modal>

                <Modal size="md" title="Solicitar Vehículo" show={modal.modal_solicitar_vehiculo} handleClose={this.closeModalVehiculo}>
                    <SolicitarVehiculo closeModal={this.closeModalVehiculo} rh={false} />
                </Modal> 

                <Modal size="lg" title="Estatus de solicitud del Vehículo" show={modal.modal_estatus_vehiculo} handleClose={this.closeModalEstatusVehiculo}>
                    <EstatusVehiculo closeModal={this.closeModalEstatusVehiculo} rh={false} />
                </Modal> 

                <Modal size="xl" title="Seguimiento de viajes" show={modal.modal_seguimiento_viajes} handleClose={this.closeModalSeguimientoViajes}>
                    <SeguimientoViajes closeModal={this.closeModalSeguimientoViajes} rh={false} />
                </Modal> 

                <Modal size="lg" title="Observaciones sobre el vehículo" show={modal.modal_observaciones_vehiculo} handleClose={this.closeModalObservacionesVehiculo}>
                    <ObservacionesVehiculo closeModal={this.closeModalObservacionesVehiculo} rh={false} />
                </Modal> 

            </Layout>
        )
    }
}

const mapStateToProps = state => { return{ authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Home)