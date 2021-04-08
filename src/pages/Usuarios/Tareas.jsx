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
import { Card, Nav, Tab, Row, Col, Form} from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert, validateAlert, commentAlert, doneAlert } from '../../functions/alert'
import { CaducadasCard, EnProcesoCard, ProximasCaducarCard } from '../../components/cards'
import Swal from 'sweetalert2'
import ItemSlider from '../../components/singles/ItemSlider'
import InputGray from '../../components/form-components/Gray/InputGray'
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../functions/routers"
import { diffCommentDate } from '../../functions/functions'
import moment from 'moment'
class Tareas extends Component {

    state = {
        activePane: '1',
        columns: [],
        tableros: [],
        user: '',
        users: '',
        activeKey: '',
        form: {
            titulo: '',
            descripcion: '',
            fecha_limite: null,
            responsables: [],
            comentario: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
        options: { responsables: [] },
        formeditado: 0,
        tarea: '',
        modal: false,
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
            if(id)
                this.setState({
                    ...this.state,
                    subActiveKey: id
                })
            if(tarea)
                this.getTareaAxios(tarea)
        }
    }

    handleCloseModal = () => {
        const { form } = this.state
        form.comentario = ''
        form.adjuntos.adjunto = { value: '', files: [] }
        this.getTareasAxios()
        this.setState({
            ...this.state,
            modal: !this.state.modal,
            tarea: '',
            form
        })
    }

    handleClickTask = (tarea) => {
        this.getTareaAxios(tarea.id)
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

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    changeValue = (event, flag) => {
        const { name, value } = event.target
        const { form } = this.state
        switch(name){
            case 'responsables':
                form.responsables = []
                if(value !== null)
                    value.forEach( (element) => {
                        form.responsables.push(element)
                    })
                break;
            default: 
                form[name] = value
                break;
        }
        this.setState({ ...this.state, form })
        if(flag)
            this.editTaskAxios( name, value )
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
        await axios.get(`${URL_DEV}v2/usuarios/tareas`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, user, users } = response.data
                const { subActiveKey } = this.state
                let auxiliar = null
                if(subActiveKey){
                    tableros.map((tablero, key)=>{
                        if(tablero.nombre === subActiveKey)
                            auxiliar = key
                        return ''
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
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getTareaAxios(tarea) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/tareas/${tarea}`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                Swal.close()
                const { tarea, usuarios } = response.data
                const { form, options } = this.state
                form.descripcion = tarea.descripcion
                form.titulo = tarea.titulo
                form.fecha_limite = tarea.fecha_limite ? new Date( moment( tarea.fecha_limite ) ) : null
                form.responsables = []
                options.responsables = []
                tarea.responsables.forEach( ( element ) => {
                    form.responsables.push(
                        {
                            name: element.name,
                            value: element.id.toString(),
                            label: element.name
                        }
                    )
                });
                usuarios.forEach( ( element ) => {
                    options.responsables.push({
                        name: element.name,
                        value: element.id.toString(),
                        label: element.name
                    })
                });
                this.setState({ ...this.state, tarea: tarea, modal: true,  options, activePane: '1'})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addTaskAxios = async () => {
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

            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addComentario = () => {
        const { form } = this.state
        if (form.comentario !== ''){
            commentAlert()
            this.addComentarioAxios()
        }
    }

    async addComentarioAxios() {
        const { access_token } = this.props.authUser
        const { tarea, form } = this.state
        const data = new FormData();
        if (form.adjuntos.adjunto.value !== '')
            form.adjuntos.adjunto.files.forEach( (file) => { data.append(`files_adjunto[]`, file.file) })
        data.append('id', tarea.id)
        data.append('comentario', form.comentario)
        await axios.post(`${URL_DEV}v2/usuarios/tareas/${tarea.id}/comentario`, data, 
            { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito')
                const { tarea } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto = { value: '', files: [] }
                this.setState({...this.state, tarea: tarea, activePane: '3'})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    editTaskAxios = async(name, value) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { tarea } = this.state
        await axios.put(`${URL_DEV}v2/usuarios/tareas/${tarea.id}`, { name: name, value: value }, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                Swal.close()
                const { tarea, usuarios } = response.data
                const { form, options } = this.state
                if(name !== 'descripcion'){
                    this.getEnProceso()
                    this.getCaducadas()
                    this.getProximasCaducar()
                }
                switch(name){
                    case 'fecha_limite':
                        form.fecha_limite = tarea.fecha_limite ? new Date( moment( tarea.fecha_limite ) ) : null
                        break;
                    case 'responsables':
                        form.responsables = []
                        options.responsables = []
                        tarea.responsables.forEach( ( element ) => {
                            form.responsables.push(
                                {
                                    name: element.name,
                                    value: element.id.toString(),
                                    label: element.name
                                }
                            )
                        });
                        usuarios.forEach( ( element ) => {
                            options.responsables.push({
                                name: element.name,
                                value: element.id.toString(),
                                label: element.name
                            })
                        });
                        break;
                    default:
                        form[name] = tarea[name]
                        break;
                }
                this.setState({ ...this.state, tarea: tarea, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteTarea = async(id) => {
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v2/usuarios/tareas/${id}`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert('Tarea eliminada con éxito')
                this.getEnProceso()
                this.getCaducadas()
                this.getProximasCaducar()
                this.handleCloseModal()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    endTarea = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/tareas/${id}/end`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert('Tarea terminada con éxito')
                this.getEnProceso()
                this.getCaducadas()
                this.getProximasCaducar()
                this.handleCloseModal()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async reordeingTasksAxios(source, destination, task) {
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        waitAlert()
        await axios.put(URL_DEV + 'user/tareas/order', { source, destination, task }, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros } = response.data
                if(source.grupo !== destination.grupo){
                    this.getCaducadas()
                    this.getEnProceso()
                    this.getProximasCaducar()
                }
                let auxTareas = []
                tableros.forEach((tablero) => {
                    if (tablero.nombre === subActiveKey) 
                        auxTareas = tablero.tareas
                })
                Swal.close()
                this.setState({ ...this.state, modal: false, tableros: tableros, columns: auxTareas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    nextPageEnProceso = (e) => {
        e.preventDefault()
        const { en_proceso } = this.state
        if (en_proceso.numPage < en_proceso.total_paginas - 1) { this.setState({ numPage: en_proceso.numPage++ }) }
        this.getEnProceso()
    }
    prevPageEnProceso = (e) => {
        e.preventDefault()
        const { en_proceso } = this.state
        if (en_proceso.numPage > 0) {
            this.setState({ numPage: en_proceso.numPage-- })
            this.getEnProceso()
        }
    }
    nextPageProximasCaducar = (e) => {
        e.preventDefault()
        const { proximas_caducar } = this.state
        if (proximas_caducar.numPage < proximas_caducar.total_paginas - 1) {
            this.setState({ numPage: proximas_caducar.numPage++ })
            this.getProximasCaducar()
        }
    }
    prevPageProximasCaducar = (e) => {
        e.preventDefault()
        const { proximas_caducar } = this.state
        if (proximas_caducar.numPage > 0) {
            this.setState({ numPage: proximas_caducar.numPage-- })
            this.getProximasCaducar()
        }
    }
    nextPageCaducadas = (e) => {
        e.preventDefault()
        const { caducadas } = this.state
        if (caducadas.numPage < caducadas.total_paginas - 1) {
            this.setState({ numPage: caducadas.numPage++ })
            this.getCaducadas()
        }
    }
    prevPageCaducadas = (e) => {
        e.preventDefault()
        const { caducadas } = this.state
        if (caducadas.numPage > 0) {
            this.setState({ numPage: caducadas.numPage-- })
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
                this.setState({ ...this.state, en_proceso })
            }, (error) => { printResponseErrorAlert(error) }
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
                this.setState({ ...this.state, proximas_caducar })
            }, (error) => { printResponseErrorAlert(error) }
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
                this.setState({ ...this.state, caducadas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        files.forEach((file) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file)
            })
        })
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
    }

    onClickCard = (tarea) => {
        this.getTareaAxios(tarea.id)
    }

    hasComentario = tarea => {
        if(tarea)
            if(tarea.comentarios)
                if(tarea.comentarios.length)
                    return true
        return false
    }

    updateTabContainer = value => { this.setState({ ...this.state, activePane: value }) }

    render() {

        const { columns, user, form, activeKey, modal, tarea, formeditado, tableros, defaultactivekey, subActiveKey,
            en_proceso, proximas_caducar, caducadas, options, activePane } = this.state
        return (
            <Layout active = 'usuarios' {...this.props}>
                <Row>
                    <Col lg={4}>
                        <EnProcesoCard en_proceso = { en_proceso } onClick = { this.nextPageEnProceso }
                            onClickPrev = { this.prevPageEnProceso } onClickCard = { this.onClickCard }/>
                    </Col>
                    <Col lg={4}>
                        <ProximasCaducarCard proximas_caducar = { proximas_caducar } onClick = { this.nextPageProximasCaducar }
                            onClickPrev = { this.prevPageProximasCaducar } onClickCard = { this.onClickCard }/>
                    </Col>
                    <Col lg={4}>
                        <CaducadasCard caducadas = { caducadas } onClick = { this.nextPageCaducadas }
                            onClickPrev = { this.prevPageCaducadas } onClickCard = { this.onClickCard }/>
                    </Col>
                </Row>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid">
                        <div className="d-flex flex-column flex-grow-1">
                            <Tab.Container id = "left-tabs-example" activeKey = { subActiveKey ? subActiveKey : defaultactivekey }
                                defaultActiveKey = { defaultactivekey }
                                onSelect={(select) => { this.updateActiveTabContainer(select) }} >
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
                                                                            submit={this.addTaskAxios}
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
                    <Tab.Container defaultActiveKey="1" activeKey = { activePane }
                        onSelect = { (select) => { this.updateTabContainer(select) } } >
                        <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0 nav-tabs-line-info mt-3 d-flex justify-content-end" id="nav-tareas">
                            <Nav.Item>
                                <Nav.Link eventKey="1">
                                    <span className="nav-icon"> <i className="flaticon2-writing"></i> </span>
                                    <span className="nav-text">INFORMACIÓN DE LA TAREA</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2">
                                    <span className="nav-icon"> <i className="flaticon2-plus"></i> </span>
                                    <span className="nav-text">AGREGAR COMENTARIO</span>
                                </Nav.Link>
                            </Nav.Item>
                            {
                                this.hasComentario(tarea) && 
                                    <Nav.Item>
                                        <Nav.Link eventKey="3">
                                            <span className="nav-icon"> <i className="flaticon2-chat-1"></i> </span>
                                            <span className="nav-text">MOSTRAR COMENTARIOS</span>
                                        </Nav.Link>
                                    </Nav.Item>
                            }
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="1">
                                <TareaForm form = { form } tarea = { tarea } options = { options } onChange = { this.changeValue } 
                                    endTarea = { (value) => this.endTarea(value) } deleteTarea = { this.deleteTarea } formeditado={formeditado}  />
                            </Tab.Pane>
                            <Tab.Pane eventKey="2">
                                <Form id = "form-comentario-adjunto"
                                    onSubmit = { (e) => { e.preventDefault(); validateAlert(this.addComentario, e, 'form-comentario-adjunto') } } >
                                    <div className="form-group row form-group-marginless mt-3 d-flex justify-content-center">
                                        <div className="col-md-11 align-self-center">
                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                                withicon = { 0 } requirevalidation = { 0 } withformgroup = { 1 }
                                                placeholder = 'COMENTARIO' value = { form.comentario } name = 'comentario'
                                                onChange = { (e) => { e.preventDefault(); this.changeValue(e, false) } } as = "textarea" rows = "3"
                                                letterCase = { false } spellCheck = { false } />
                                        </div>
                                        <div className="col-md-8 col-12">
                                            <div className = 'w-100'>
                                                <div className="text-center font-weight-bolder mb-2">
                                                    {form.adjuntos.adjunto.placeholder}
                                                </div>
                                                <ItemSlider multiple = { true } items = { form.adjuntos.adjunto.files}
                                                    item = 'adjunto' handleChange = { this.handleChange } />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer py-3 pr-1 text-center">
                                        <Button icon = '' className = "btn btn-light-primary font-weight-bold"
                                            onClick = { (e) => { e.preventDefault(); validateAlert(this.addComentario, e, 'form-comentario-adjunto') } }
                                            text = "ENVIAR" />
                                    </div>
                                </Form>
                            </Tab.Pane>
                            <Tab.Pane eventKey="3">
                            {
                                tarea &&
                                    <div className="col-md-12 row d-flex justify-content-center">
                                        <div className="col-md-7 mt-5">
                                            {
                                                this.hasComentario(tarea) &&
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
                                                                                <span className="text-muted ml-2 font-weight-bold">
                                                                                    { diffCommentDate(comentario) }
                                                                                </span>
                                                                                <p className = {comentario.adjunto === null ? "p-0 font-weight-light mb-0" : "p-0 font-weight-light" } >
                                                                                    {comentario.comentario}
                                                                                </p>
                                                                                {
                                                                                    comentario.adjunto &&
                                                                                        <div className="d-flex justify-content-end">
                                                                                            <a href={comentario.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-info font-weight-bold">
                                                                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                                                                </span>VER ADJUNTO
                                                                                            </a>
                                                                                        </div>
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

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Tareas);