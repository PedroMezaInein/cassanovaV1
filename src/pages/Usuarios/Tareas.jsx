import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal } from '../../components/singles'
import { TareaForm } from '../../components/forms'
import { Button } from '../../components/form-components'
import moment from 'moment'
import { Card, Nav, Tab, Row, Col, Form} from 'react-bootstrap'
import { errorAlert, forbiddenAccessAlert, waitAlert, validateAlert } from '../../functions/alert'
import { CaducadasCard, EnProcesoCard, ProximasCaducarCard } from '../../components/cards'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ItemSlider from '../../components/singles/ItemSlider'
import InputGray from '../../components/form-components/Gray/InputGray'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
const MySwal = withReactContent(Swal)
class Tareas extends Component {

    state = {
        columns: [],
        tableros: [],
        user: '',
        users: '',
        activeKey: '',
        form: {
            titulo: '',
            grupo: '',
            participantes: []
        },
        formeditado: 0,
        participantes: [],
        participantesTask: [],
        tarea: '',
        modal: false,
        comentario: '',
        adjunto: '',
        adjuntoFile: '',
        adjuntoName: '',
        defaultactivekey: "",
        en_proceso: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "en_proceso"
        },
        proximas_caducar: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "proximas_caducar"
        },
        caducadas: {
            data: [],
            numPage: 0,
            total: 0,
            total_paginas: 0,
            value: "caducadas"
        },
        formComentarioAdj: {
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
            }
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!tareas)
            history.push('/')
        this.getTareasAxios()
        this.getEnProceso()
        this.getCaducadas()
        this.getProximasCaducar()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = params.get("depto")
            let tarea = parseInt(params.get("tarea"))
            console.log(tarea, 'tarea')
            if(id)
                this.setState({
                    ...this.state,
                    subActiveKey: id
                })
            if(tarea)
                this.getTareaAxios(tarea)
        }
    }

    diffCommentDate = (comentario) => {
        var now = new Date();
        var then = new Date(comentario.created_at);

        var diff = moment.duration(moment(now).diff(moment(then)));
        var months = parseInt(moment(now).diff(moment(then), 'month'))

        var days = parseInt(diff.asDays());
        var hours = parseInt(diff.asHours());
        var minutes = parseInt(diff.asMinutes());

        if (months) {
            if (months === 1)
                return 'Hace un mes'
            else
                return `Hace ${months} meses`
        }
        else {
            if (days) {
                if (days === 1)
                    return 'Hace un día'
                else
                    return `Hace ${days} días`
            }
            else {
                if (hours) {
                    if (hours === 1)
                        return 'Hace una hora'
                    else
                        return `Hace ${hours} horas`
                }
                else {
                    if (minutes) {
                        if (minutes === 1)
                            return 'Hace un minuto'
                        else
                            return `Hace ${minutes} minutos`
                    }
                    else {
                        return 'Hace un momento'
                    }
                }
            }
        }

    }

    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal: !this.state.modal,
            tarea: '',
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: '',
            formComentarioAdj: this.clearForm()
        })
    }

    handleClickTask = tarea => {

        this.setState({
            ...this.state,
            tarea: tarea,
            modal: true,
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: '',
        })
    }

    setOptions = tarea => {
        const { users } = this.state

        let aux = []
        tarea.participantes.map((participante, key) => {
            aux.push({ name: participante.name, value: participante.email, identificador: participante.id })
            return false
        })

        let _aux = []
        users.map((participante, key) => {
            _aux.push({ name: participante.name, value: participante.email, identificador: participante.id })
            return false
        })

        let _index = []

        _aux.map((element, index) => {
            let validador = false
            aux.map((_element, key) => {
                if (element.identificador === _element.identificador)
                    validador = true
                return false
            })
            if (!validador)
                _index.push(element)
            return false
        })

        this.setState({
            ...this.state,
            participantesTask: aux,
            participantes: _index
        })
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result

        if (!destination)
            return;

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index)
            return;

        const _source = {
            grupo: source.droppableId,
            index: source.index
        }

        const _destination = {
            grupo: destination.droppableId,
            index: destination.index
        }

        const task = draggableId

        this.reordeingTasksAxios(_source, _destination, task)

    }

    handleAccordion = activeKey => {
        const { form } = this.state
        form['titulo'] = '';
        this.setState({
            ...this.state,
            activeKey: activeKey,
            form
        })
    }

    submitAdd = () => {
        this.addTaskAxios();
    }

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeComentario = (e) => {
        const { value, name } = e.target
        if (name === 'adjunto') {
            this.setState({
                ...this.state,
                adjuntoFile: e.target.files[0],
                adjunto: e.target.value,
                adjuntoName: e.target.files[0].name
            })
        } else {
            this.setState({
                ...this.state,
                comentario: value
            })
        }
    }

    onChangeParticipantes = (value) => {
        const { tarea: { id } } = this.state
        this.addParticipanteAxios(id, value.identificador);
    }

    deleteParticipante = value => {
        this.deleteParticipanteAxios(value);
    }

    changeValue = event => {
        const { name, value } = event.target
        const { tarea } = this.state
        tarea[name] = value
        this.setState({
            ...this.state,
            tarea: tarea,
            formeditado: 1
        })
    }

    changeValueSend = event => {
        const { name, value } = event.target
        this.editTaskAxios({ [name]: value })
    }

    deleteAdjunto = () => {
        this.setState({
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        })
    }

    updateActiveTabContainer = active => {
        const { tableros } = this.state
        tableros.map((tablero) => {
            if (tablero.nombre === active) {
                this.setState({
                    subActiveKey: active,
                    columns: tablero.tareas
                })
            }
            return false
        })
    }

    async getTareasAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas', { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, user, users } = response.data
                const { subActiveKey } = this.state
                let auxiliar = null
                if(subActiveKey){
                    tableros.map((tablero, key)=>{
                        if(tablero.nombre === subActiveKey)
                            auxiliar = key
                    })
                }
                this.setState({
                    ...this.state,
                    user: user,
                    users: users,
                    tableros: tableros,
                    defaultactivekey: auxiliar ? tableros[auxiliar].nombre : tableros[0].nombre,
                    subActiveKey: auxiliar ? tableros[auxiliar].nombre : tableros[0].nombre,
                    columns: auxiliar ? tableros[auxiliar].tareas : tableros[0].tareas
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getTareaAxios(tarea) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas/single/' + tarea, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tarea } = response.data
                this.setState({
                    ...this.state,
                    tarea: tarea,
                    modal: true,
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addTaskAxios() {
        const { access_token } = this.props.authUser
        const { form, subActiveKey } = this.state
        waitAlert()
        form.departamento = subActiveKey
        await axios.post(URL_DEV + 'user/tareas', form, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                Swal.close()
                const { data: { user } } = response
                const { form } = this.state
                const { tableros } = response.data

                let auxTareas = []

                tableros.map((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                    return false
                })

                form['titulo'] = ''
                form['grupo'] = ''
                this.setState({
                    user: user,
                    form,
                    activeKey: '',
                    formeditado: 0,
                    tableros: tableros,
                    columns: auxTareas
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addComentario = () => {
        const { comentario } = this.state
        MySwal.fire({
            title: '¡UN MOMENTO!',
            text: 'SE ESTÁ ENVIANDO TU MENSAJE.',
            icon: 'info',
            customClass: {
                actions: 'd-none',
                icon: 'text-lowercase',
            }
        })
        if (comentario !== '')
            this.addComentarioAxios()
    }

    async addComentarioAxios() {
        const { access_token } = this.props.authUser
        const { comentario, tarea, adjuntoFile, adjuntoName, subActiveKey} = this.state
        const data = new FormData();
        data.append('comentario', comentario)
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', tarea.id)
        await axios.post(URL_DEV + 'user/tareas/comentario', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, tarea } = response.data
                let auxTareas = []
                tableros.map((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                    return false
                })
                this.setState({
                    ...this.state,
                    comentario: '',
                    tarea: tarea,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    tableros: tableros,
                    columns: auxTareas
                })
                Swal.close()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editTaskAxios(data) {
        const { access_token } = this.props.authUser
        const { tarea } = this.state
        await axios.put(URL_DEV + 'user/tareas/edit/' + tarea.id, data, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteTarea = (id) => {
        this.deleteTareaAxios(id)
    }

    endTarea = (id) => {
        this.endTareaAxios(id)
    }

    async deleteTareaAxios(id) {
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        await axios.delete(URL_DEV + 'user/tareas/' + id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros } = response.data
                let auxTareas = []
                tableros.map((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                    return false
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                    tableros: tableros,
                    columns: auxTareas
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async endTareaAxios(id) {
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        await axios.put(URL_DEV + 'user/tareas/' + id + '/end', {}, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros } = response.data
                let auxTareas = []
                tableros.map((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                    return false
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                    formeditado: 1,
                    tableros: tableros,
                    columns: auxTareas
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async reordeingTasksAxios(source, destination, task) {
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        await axios.put(URL_DEV + 'user/tareas/order', { source, destination, task }, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros } = response.data
                let auxTareas = []
                tableros.map((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                    return false
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tableros: tableros,
                    columns: auxTareas
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    nextPageEnProceso = (e) => {
        e.preventDefault()
        const { en_proceso } = this.state
        if (en_proceso.numPage < en_proceso.total_paginas - 1) {
            this.setState({
                numPage: en_proceso.numPage++
            })
        }
        this.getEnProceso()
    }
    prevPageEnProceso = (e) => {
        e.preventDefault()
        const { en_proceso } = this.state
        if (en_proceso.numPage > 0) {
            this.setState({
                numPage: en_proceso.numPage--
            })
            this.getEnProceso()
        }
    }
    nextPageProximasCaducar = (e) => {
        e.preventDefault()
        const { proximas_caducar } = this.state
        if (proximas_caducar.numPage < proximas_caducar.total_paginas - 1) {
            this.setState({
                numPage: proximas_caducar.numPage++
            })
            this.getProximasCaducar()
        }
    }
    prevPageProximasCaducar = (e) => {
        e.preventDefault()
        const { proximas_caducar } = this.state
        if (proximas_caducar.numPage > 0) {
            this.setState({
                numPage: proximas_caducar.numPage--
            })
            this.getProximasCaducar()
        }
    }
    nextPageCaducadas = (e) => {
        e.preventDefault()
        const { caducadas } = this.state
        if (caducadas.numPage < caducadas.total_paginas - 1) {
            this.setState({
                numPage: caducadas.numPage++
            })
            this.getCaducadas()
        }
    }
    prevPageCaducadas = (e) => {
        e.preventDefault()
        const { caducadas } = this.state
        if (caducadas.numPage > 0) {
            this.setState({
                numPage: caducadas.numPage--
            })
            this.getCaducadas()
        }
    }
    async getEnProceso() {
        const { access_token } = this.props.authUser
        const { en_proceso } = this.state
        await axios.get(URL_DEV + 'tareas/timeline/en-proceso/' + en_proceso.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tareas, total } = response.data
                const { en_proceso } = this.state
                en_proceso.data = tareas
                en_proceso.total = total
                let total_paginas = Math.ceil(total / 5)
                en_proceso.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    en_proceso
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getProximasCaducar() {
        const { access_token } = this.props.authUser
        const { proximas_caducar } = this.state
        await axios.get(URL_DEV + 'tareas/timeline/proximas-caducar/' + proximas_caducar.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tareas, total } = response.data
                const { proximas_caducar } = this.state
                proximas_caducar.data = tareas
                proximas_caducar.total = total
                let total_paginas = Math.ceil(total / 5)
                proximas_caducar.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    proximas_caducar
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getCaducadas() {
        const { access_token } = this.props.authUser
        const { caducadas } = this.state
        await axios.get(URL_DEV + 'tareas/timeline/caducadas/' + caducadas.numPage, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tareas, total } = response.data
                const { caducadas } = this.state
                let total_paginas = Math.ceil(total / 5)
                caducadas.data = tareas
                caducadas.total = total
                caducadas.total_paginas = total_paginas
                this.setState({
                    ...this.state,
                    caducadas
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    handleChange = (files, item) => {
        const { formComentarioAdj } = this.state
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
        formComentarioAdj['adjuntos'][item].value = files
        formComentarioAdj['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formComentarioAdj
        })
    }
    clearForm = () => {
        const { formComentarioAdj } = this.state
        let aux = Object.keys(formComentarioAdj)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    formComentarioAdj[element] = {
                        adjunto: {
                            files: [],
                            value: '',
                            placeholder: 'Adjunto'
                        }
                    }
                    break;
                default:
                    formComentarioAdj[element] = ''
                    break;
            }
            return false
        })
        return formComentarioAdj;
    }
    render() {

        const { columns, user, form, activeKey, modal, tarea, comentario, adjunto, adjuntoName, participantesTask, participantes, formeditado, tableros, defaultactivekey, subActiveKey,
            en_proceso, proximas_caducar, caducadas, formComentarioAdj } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Row>
                    <Col lg={4}>
                        <EnProcesoCard
                            en_proceso={en_proceso}
                            onClick={this.nextPageEnProceso}
                            onClickPrev={this.prevPageEnProceso}
                        />
                    </Col>
                    <Col lg={4}>
                        <ProximasCaducarCard
                            proximas_caducar={proximas_caducar}
                            onClick={this.nextPageProximasCaducar}
                            onClickPrev={this.prevPageProximasCaducar}
                        />
                    </Col>
                    <Col lg={4}>
                        <CaducadasCard
                            caducadas={caducadas}
                            onClick={this.nextPageCaducadas}
                            onClickPrev={this.prevPageCaducadas}
                        />
                    </Col>
                </Row>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid">
                        <div className="d-flex flex-column flex-grow-1">
                            <Tab.Container
                                id="left-tabs-example"
                                activeKey={subActiveKey ? subActiveKey : defaultactivekey}
                                defaultActiveKey={defaultactivekey}
                                onSelect={(select) => { this.updateActiveTabContainer(select) }}
                            >
                                <Card className="card-custom card-stretch gutter-b py-2">
                                    <Card.Header className="align-items-center border-0 pt-3">
                                        <h3 className="card-title align-items-start flex-column">
                                            <span className="font-weight-bolder text-dark">TABLEROS</span>
                                        </h3>
                                        <div className="card-toolbar">
                                            <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-info d-flex justify-content-center">
                                                {
                                                    tableros.map((tablero, key) => {
                                                        return (
                                                            <Nav.Item className="navi-item" key={key}>
                                                                <Nav.Link style={{ margin: "0 0.9rem" }} eventKey={tablero.nombre}>
                                                                    <span className="navi-text">{tablero.nombre}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    })
                                                }
                                            </Nav>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <div className="card-spacer-x pt-5 pb-4 toggle-off-item">
                                            <div className="mb-1">
                                                <DragDropContext onDragEnd={this.onDragEnd}>
                                                    <div className="row mx-0 justify-content-center">
                                                        {
                                                            columns.map((column) => {
                                                                return (
                                                                    <div key={column.id} className="col-md-6 col-lg-3 px-3">
                                                                        <Column
                                                                            form={form}
                                                                            submit={this.submitAdd}
                                                                            onChange={this.onChange}
                                                                            column={column}
                                                                            clickTask={this.handleClickTask}
                                                                            id={user.id}
                                                                            tareas={column.tareas}
                                                                            activeKey={activeKey}
                                                                            handleAccordion={this.handleAccordion}
                                                                        />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </DragDropContext>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
                <Modal size="xl" title="Tareas" show={modal} handleClose={this.handleCloseModal} >
                    <Tab.Container defaultActiveKey="1">
                        <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-info d-flex justify-content-end mt-3">
                            <Nav.Item>
                                <Nav.Link eventKey="1">
                                    <span className="nav-icon">
                                        <i className="flaticon2-writing"></i>
                                    </span>
                                    <span className="nav-text">INFORMACIÓN DE LA TAREA</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2">
                                    <span className="nav-icon">
                                        <i className="flaticon2-plus"></i>
                                    </span>
                                    <span className="nav-text">AGREGAR COMENTARIO</span>
                                </Nav.Link>
                            </Nav.Item>
                            {
                                tarea?
                                    tarea.comentarios.length>0?
                                        <Nav.Item>
                                            <Nav.Link eventKey="3">
                                                <span className="nav-icon">
                                                    <i className="flaticon2-chat-1"></i>
                                                </span>
                                                <span className="nav-text">MOSTRAR COMENTARIOS</span>
                                                </Nav.Link>
                                        </Nav.Item>
                                    :''
                                :''
                            }
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="1">
                                <TareaForm
                                    participantes={participantes}
                                    user={user}
                                    form={tarea}
                                    update={this.onChangeParticipantes}
                                    participantesTask={participantesTask}
                                    deleteParticipante={this.deleteParticipante}
                                    changeValue={this.changeValue}
                                    changeValueSend={this.changeValueSend}
                                    deleteTarea={this.deleteTarea}
                                    endTarea={(value) => this.endTareaAxios(value)}
                                    formeditado={formeditado}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="2">
                                <Form id="form-comentario-adjunto"
                                    onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(this.addComentario, e, 'form-comentario-adjunto')
                                        }
                                    }
                                    >
                                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                                        <div className="col-md-11 align-self-center">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={0}
                                                requirevalidation={0}
                                                placeholder='COMENTARIO'
                                                value={formComentarioAdj.comentario}
                                                name='comentario'
                                                onChange={this.onChangeComentario}
                                                as="textarea"
                                                rows="3"
                                            />
                                        </div>
                                        <div className="col-md-12 d-flex justify-content-center align-self-center">
                                            <div>
                                                <div className="text-center font-weight-bolder mb-2">
                                                    {formComentarioAdj.adjuntos.adjunto.placeholder}
                                                </div>
                                                <ItemSlider
                                                    multiple={true}
                                                    items={formComentarioAdj.adjuntos.adjunto.files}
                                                    item='adjunto'
                                                    handleChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer py-3 pr-1">
                                        <div className="row">
                                            <div className="col-lg-12 text-right pr-0 pb-0">
                                                <Button
                                                    icon=''
                                                    className="btn btn-light-primary font-weight-bold"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(this.addComentario, e, 'form-comentario-adjunto')
                                                        }
                                                    }
                                                    text="ENVIAR"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </Tab.Pane>
                            <Tab.Pane eventKey="3">
                                {console.log(tarea,'tarea')}
                            {
                                tarea &&
                                    <div className="col-md-12 row d-flex justify-content-center">
                                        <div className="col-md-7 mt-5">
                                            {
                                                tarea.comentarios.length > 0 &&
                                                tarea.comentarios.map((comentario, key) => {
                                                    return (
                                                        <div key={key} className="form-group row form-group-marginless px-3">
                                                            <div className="col-md-12">
                                                                <div className="timeline timeline-3">
                                                                    <div className="timeline-items">
                                                                        <div className="timeline-item">
                                                                            <div className="timeline-media border-0">
                                                                                <img alt="Pic" src={comentario.user.avatar ? comentario.user.avatar : "/default.jpg"}/>
                                                                            </div>
                                                                            <div className="timeline-content">
                                                                                <span className="text-info font-weight-bolder">{comentario.user.name}</span>
                                                                                <span className="text-muted ml-2 font-weight-bold">{this.diffCommentDate(comentario)}</span>
                                                                                <p className={comentario.adjunto===null?"p-0 font-weight-light mb-0":"p-0 font-weight-light"}>{comentario.comentario}</p>
                                                                                {
                                                                                    comentario.adjunto ?
                                                                                        <div className="d-flex justify-content-end">
                                                                                            <a href={comentario.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-info font-weight-bold">
                                                                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                                                                </span>VER ADJUNTO
                                                                                                    </a>
                                                                                        </div>
                                                                                        : ''
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                            }
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Tareas);