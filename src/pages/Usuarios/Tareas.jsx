/* eslint-disable no-unused-vars */  
import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, DARK_BLUE, GOLD } from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal } from '../../components/singles'
import swal from 'sweetalert'
import { Subtitle, P, Small, B } from '../../components/texts'
import { TareaForm } from '../../components/forms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faCheck, faPaperclip, faTimes, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import {Input, Button, FileInput}from '../../components/form-components'
import moment from 'moment'
import { Badge, Card } from 'react-bootstrap'
import ReactTooltip from "react-tooltip";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'

class Tareas extends Component{
    constructor(props){
        super(props)
    }

    state = {
        columns:[],
        tableros: [],
        user : '',
        users: '',
        activeKey: '',
        form:{
            titulo: '',
            grupo: '',
            participantes: []
        },
        formeditado:0,
        participantes: [],
        participantesTask: [],
        tarea: '',
        modal: false,
        comentario: '',
        adjunto: '',
        adjuntoFile: '',
        adjuntoName: ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!tareas)
            history.push('/')
        this.getTareasAxios()
    }

    diffCommentDate = ( comentario ) => {
        var now  = new Date();
        var then = new Date(comentario.created_at);

        var diff = moment.duration(moment(now).diff(moment(then)));
        
        /* var months = parseInt(diff.asMonths()); */
        var months = parseInt( moment(now).diff(moment(then), 'month' ) )
        
        var days = parseInt(diff.asDays());
        var hours = parseInt(diff.asHours());
        var minutes = parseInt(diff.asMinutes());
        
        if(months)
        {
            if(months === 1)
                return 'Hace un mes'
            else
                return `Hace ${months} meses`
        }
        else{
            if(days){
                if(days === 1)
                    return 'Hace un día'
                else
                    return `Hace ${days} días`
            }
            else{
                if(hours){
                    if(hours === 1)
                        return 'Hace una hora'
                    else
                        return `Hace ${hours} horas`
                }
                else{
                    if(minutes){
                        if(minutes === 1)
                            return 'Hace un minuto'
                        else
                            return `Hace ${minutes} minutos`
                    }
                    else{
                        return 'Hace un momento'
                    }   
                }
            }
        }
    
    }

    // Modals
    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modal: !this.state.modal,
            tarea: '',
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: ''
        })
    }

    handleClickTask = tarea => {
    
        const { users } = this.state

        let aux = []
        tarea.participantes.map( ( participante, key ) => {
            aux.push( {name: participante.name, value:participante.email, identificador: participante.id} )
        })

        let _aux = []
        users.map( ( participante, key ) => {
            _aux.push( {name: participante.name, value:participante.email, identificador: participante.id} )
        })

        let _index = []
        
        _aux.map((element, index) => {
            let validador = false
            aux.map((_element, key) => {
                if(element.identificador === _element.identificador)
                    validador = true
            })
            if(!validador)
                _index.push(element)
        })

        this.setState({
            ... this.state,
            tarea: tarea,
            modal: true,
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: '',
            participantesTask: aux,
            participantes: _index
        })
    }

    // Sets

    setOptions = tarea => {
        const { users } = this.state

        let aux = []
        tarea.participantes.map( ( participante, key ) => {
            aux.push( {name: participante.name, value:participante.email, identificador: participante.id} )
        })

        let _aux = []
        users.map( ( participante, key ) => {
            _aux.push( {name: participante.name, value:participante.email, identificador: participante.id} )
        })

        let _index = []
        
        _aux.map((element, index) => {
            let validador = false
            aux.map((_element, key) => {
                if(element.identificador === _element.identificador)
                    validador = true
            })
            if(!validador)
                _index.push(element)
        })

        this.setState({
            ... this.state,
            participantesTask: aux,
            participantes: _index
        })
    }

    setTareas = columns => {
        this.setState({
            ... this.state,
            columns
        })
    }

    // Dragable
    onDragEnd = result => {
        const { destination, source, draggableId } = result

        if(!destination)
            return;
        
        if( destination.droppableId === source.droppableId &&
            destination.index === source.index )
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

    // Handle Buttons

    handleAccordion = activeKey => {
        const { form } = this.state
        form['titulo'] = '';
        this.setState({
            ... this.state,
            activeKey: activeKey,
            form
        })
    }

    // Handle add Button
    submitAdd = () => {
        const { form } = this.state
        this.addTaskAxios();
    }

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeComentario = (e) => {
        const { value, name } = e.target
        if( name === 'adjunto'){
            this.setState({
                ... this.state,
                adjuntoFile: e.target.files[0],
                adjunto: e.target.value,
                adjuntoName: e.target.files[0].name
            })
        }else{
            this.setState({
                ... this.state,
                comentario: value
            })
        }
    }

    onChangeParticipantes = (value) => {
        const { tarea: { id: id } } = this.state
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
            ... this.state,
            tarea: tarea,
            formeditado:1
        })
    }

    changeValueSend = event => {
        const { name, value } = event.target
        const { tarea } = this.state
        this.editTaskAxios({[name]: value})
    }

    deleteAdjunto = () => {
        this.setState({
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        })
    }

    // Axios
    async getTareasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas', { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { users : users } } = response
                const { tableros } = response.data
                console.log(tableros, 'tableros')
                this.setState({
                    ... this.state,
                    user: user,
                    users: users,
                    tableros: tableros
                })
                this.setTareas(tableros[0].tareas)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async addTaskAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'user/tareas', form, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { form } = this.state
                form['titulo'] = ''
                form['grupo'] = ''
                this.setState({
                    ... this.state,
                    user: user,
                    form,
                    activeKey: '',
                    formeditado:0
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    addComentario = () => {
        const { comentario } = this.state
        swal({
            title: '¡Un momento!',
            text: 'Se está enviando tu mensaje.',
            buttons: false
        })
        if(comentario !== '')
            this.addComentarioAxios()
    }

    async addComentarioAxios(){
        const { access_token } = this.props.authUser
        const { comentario, tarea, adjuntoFile, adjuntoName } = this.state
        const data = new FormData();
        data.append('comentario', comentario)
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', tarea.id)
        await axios.post(URL_DEV + 'user/tareas/comentario', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { tarea : tarea } } = response
                this.setState({
                    ... this.state,
                    user: user,
                    comentario: '',
                    tarea: tarea,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: ''
                })
                this.setTareas(columns)
                swal.close()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async editTaskAxios(data){
        const { access_token } = this.props.authUser
        const { tarea } = this.state
        await axios.put(URL_DEV + 'user/tareas/edit/'+tarea.id, data, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async deleteParticipanteAxios(id_user){
        const { access_token } = this.props.authUser
        const { tarea: { id: id } } = this.state
        await axios.delete(URL_DEV + `user/tareas/${id}/participante/${id_user}`, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { users : users } } = response
                const { data : { tarea : tarea } } = response
                this.setState({
                    user: user
                })
                this.setTareas(columns)
                this.setOptions(tarea)
                if( user.id === id_user){
                    this.setState({
                        modal: false,
                        tarea: '',
                        adjuntoName: '',
                        adjuntoFile: '',
                        adjunto: ''
                    })
                }
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async addParticipanteAxios(tarea_id, user_id){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + `user/tareas/${tarea_id}/participante/${user_id}`, {}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { users : users } } = response
                const { data : { tarea : tarea } } = response
                this.setState({
                    user: user
                })
                this.setTareas(columns)
                this.setOptions(tarea)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    deleteTarea = (id) => {
        this.deleteTareaAxios(id)
    }

    endTarea = (id) => {
        this.endTareaAxios(id)
    }

    async deleteTareaAxios(id){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'user/tareas/' + id, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                this.setTareas(columns)
                this.setState({
                    ... this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: ''
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }
    async endTareaAxios(id){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'user/tareas/' + id + '/end', {}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                this.setTareas(columns)
                this.setState({
                    ... this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                    formeditado:1
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async reordeingTasksAxios(source, destination, task){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'user/tareas/order', {source, destination, task}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                this.setState({
                    user: user
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    render(){
        const { columns, user, form, activeKey, modal, tarea, comentario, adjunto,adjuntoName, users, participantesTask, participantes, formeditado} = this.state
        return(
            <Layout active={'usuarios'} { ...this.props}> 
            <Row>
                <Col lg="2" className="mb-3"> 
                    <Card className="card-custom card-stretch"> 
                        <Card.Body className="px-3">
                        <Nav className="navi navi-hover navi-active navi-link-rounded navi-bold navi-icon-center navi-light-icon">
                            {
                                this.state.tableros.map( (tablero, key) => {
                                    return(
                                        <div key={key}>
                                            <Nav.Item className="navi-item my-2">
                                                <Nav.Link className="navi-link pl-2">
                                                    <span className="navi-icon mr-2">
                                                        <span className="svg-icon svg-icon-lg">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                                    <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fillRule="nonzero"></path>
                                                                    <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                                                                </g>
                                                            </svg>
                                                        </span>
                                                    </span>
                                                    <span className="navi-text font-weight-bolder font-size-lg" id="tablero">{tablero.nombre}</span>
                                                </Nav.Link>
                                            </Nav.Item> 
                                        </div>
                                    )
                                })
                            }
						</Nav>
                        </Card.Body>
                    </Card> 
                </Col>
                <Col lg="10"> 
                    <Card className="card-custom card-stretch">
                        <Card.Header>
                            <Card.Title>
                                <h3 className="card-label">TAREAS</h3>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <div className="row mx-0 justify-content-center">
                                    {
                                        columns.map((column) => {
                                            return(
                                                <div key={column.id} className="col-md-6 col-lg-3 px-3">
                                                    <Column form={ form } submit = { this.submitAdd } onChange = { this.onChange } column = { column } clickTask = { this.handleClickTask }
                                                        id = { user.id } tareas = { column.tareas } activeKey = {activeKey} handleAccordion = {this.handleAccordion}  />
                                                </div>
                                            )
                                            
                                        })
                                    }
                                </div>
                            </DragDropContext>
                        </Card.Body>
                    </Card> 
                </Col> 
            </Row>   
                <Modal title="Tareas" show = { modal } handleClose = { this.handleCloseModal } >
                    <TareaForm participantes = { participantes } user = { user } form = { tarea } update = { this.onChangeParticipantes } 
                        participantesTask = { participantesTask } deleteParticipante = { this.deleteParticipante } 
                        changeValue = { this.changeValue } changeValueSend = { this.changeValueSend  } 
                        deleteTarea = { this.deleteTarea } endTarea = { (value) => this.endTareaAxios(value)} formeditado={formeditado}
                        />
                    <div className="separator separator-dashed my-4"></div>
                    <div className="form-group row form-group-marginless px-3">
                        <div className="col-md-12">
                            <Input 
                                className="form-control form-control-lg form-control-solid"
                                placeholder = 'Comentario' 
                                value = { comentario } 
                                onChange = {this.onChangeComentario} 
                                name = 'comentario' 
                                as="textarea" 
                                rows="3" 
                                style={{paddingLeft:"10px"}}
                            />
                        </div>
                    </div>   
                    <div className="form-group row form-group-marginless px-3">
                        <div className="col-md-1">
                            <Button text="Enviar" className={"btn btn-light-primary font-weight-bolder mr-3"} onClick = { this.addComentario }/> 
                        </div>  
                        <div className="col-md-10">  
                            <div className="image-upload"> 
                                <input
                                    onChange = {this.onChangeComentario}
                                    value = {adjunto}
                                    name="adjunto" 
                                    type="file" 
                                    id="adjunto"
                                /> 
                                {
                                    adjuntoName &&
                                        <Badge variant="light" className="d-flex px-3 w-fit-content align-items-center" pill>
                                            <FontAwesomeIcon icon={faTimes} onClick={ (e) => { e.preventDefault(); this.deleteAdjunto() } } className=" small-button mr-2" />
                                            {
                                                adjuntoName
                                            }
                                        </Badge>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="separator separator-dashed my-5"></div> 
                    {   tarea && 
                        <div className="">
                            {
                                tarea.comentarios.length > 0 &&
                                    tarea.comentarios.map((comentario, key) => {
                                        return(
                                            <div key={key} className="form-group row form-group-marginless px-3">
                                                <div className="col-md-12">
                                                    <div className="timeline timeline-3">
                                                        <div className="timeline-items">
                                                            <div className="timeline-item">
                                                                <div className="timeline-media bg-light-primary border-0">
                                                                    <span className="symbol-label font-size-h6 text-primary font-weight-bolder">{comentario.user.name.charAt(0)}</span>
                                                                </div>
                                                                <div className="timeline-content">
                                                                    <span className="text-primary font-weight-bold">{this.diffCommentDate(comentario)}</span>
                                                                    <p className="p-0">{comentario.comentario}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div> 

                                                // {
                                                //     comentario.adjunto &&
                                                //         <div className="text-left mb-0">
                                                //             <a href={comentario.adjunto.url} target="_blank">
                                                //                 <Small className="ml-2" color="dark-blue">
                                                //                     <FontAwesomeIcon icon={faFileAlt} color={DARK_BLUE} className="mr-1"/>
                                                //                     {
                                                //                         comentario.adjunto.name
                                                //                     }
                                                //                 </Small>
                                                //             </a>
                                                //         </div>
                                                // }
                                            
                                        )
                                    })
                            }
                        </div>
                    }
                </Modal>
                
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Tareas);