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
                this.setState({
                    ... this.state,
                    user: user,
                    users: users
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
                <Col lg="2"> 
                    <Card className="card-custom card-stretch"> 
                        <Card.Body className="px-3">
                        <Nav className="navi navi-hover navi-active navi-link-rounded navi-bold navi-icon-center navi-light-icon">
							<Nav.Item className="navi-item my-2">
								<Nav.Link className="navi-link active pl-2">
									<span className="navi-icon mr-2">
                                        <span className="svg-icon svg-icon-lg">
											<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
												<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<rect x="0" y="0" width="24" height="24"></rect>
													<path d="M6,2 L18,2 C18.5522847,2 19,2.44771525 19,3 L19,13 C19,13.5522847 18.5522847,14 18,14 L6,14 C5.44771525,14 5,13.5522847 5,13 L5,3 C5,2.44771525 5.44771525,2 6,2 Z M13.8,4 C13.1562,4 12.4033,4.72985286 12,5.2 C11.5967,4.72985286 10.8438,4 10.2,4 C9.0604,4 8.4,4.88887193 8.4,6.02016349 C8.4,7.27338783 9.6,8.6 12,10 C14.4,8.6 15.6,7.3 15.6,6.1 C15.6,4.96870845 14.9396,4 13.8,4 Z" fill="#000000" opacity="0.3"></path>
													<path d="M3.79274528,6.57253826 L12,12.5 L20.2072547,6.57253826 C20.4311176,6.4108595 20.7436609,6.46126971 20.9053396,6.68513259 C20.9668779,6.77033951 21,6.87277228 21,6.97787787 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,6.97787787 C3,6.70173549 3.22385763,6.47787787 3.5,6.47787787 C3.60510559,6.47787787 3.70753836,6.51099993 3.79274528,6.57253826 Z" fill="#000000"></path>
												</g>
											</svg>
										</span>
									</span>
									<span className="navi-text font-weight-bolder font-size-lg">ADMINISTRACIÓN</span>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item className="navi-item my-2">
								<Nav.Link className="navi-link pl-2">
									<span className="navi-icon mr-2">
										<span className="svg-icon svg-icon-lg">
											<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
												<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<polygon points="0 0 24 0 24 24 0 24"></polygon>
													<path d="M12,4.25932872 C12.1488635,4.25921584 12.3000368,4.29247316 12.4425657,4.36281539 C12.6397783,4.46014562 12.7994058,4.61977315 12.8967361,4.81698575 L14.9389263,8.95491503 L19.5054023,9.61846284 C20.0519472,9.69788046 20.4306287,10.2053233 20.351211,10.7518682 C20.3195865,10.9695052 20.2170993,11.1706476 20.0596157,11.3241562 L16.7552826,14.545085 L17.5353298,19.0931094 C17.6286908,19.6374458 17.263103,20.1544017 16.7187666,20.2477627 C16.5020089,20.2849396 16.2790408,20.2496249 16.0843804,20.1472858 L12,18 L12,4.25932872 Z" fill="#000000" opacity="0.3"></path>
													<path d="M12,4.25932872 L12,18 L7.91561963,20.1472858 C7.42677504,20.4042866 6.82214789,20.2163401 6.56514708,19.7274955 C6.46280801,19.5328351 6.42749334,19.309867 6.46467018,19.0931094 L7.24471742,14.545085 L3.94038429,11.3241562 C3.54490071,10.938655 3.5368084,10.3055417 3.92230962,9.91005817 C4.07581822,9.75257453 4.27696063,9.65008735 4.49459766,9.61846284 L9.06107374,8.95491503 L11.1032639,4.81698575 C11.277344,4.464261 11.6315987,4.25960807 12,4.25932872 Z" fill="#000000"></path>
												</g>
											</svg>
										</span>
									</span>
									<span className="navi-text font-weight-bolder font-size-lg">CALIDAD</span>
								</Nav.Link>
							</Nav.Item>
							<Nav.Item className="navi-item my-2">
								<Nav.Link className="navi-link pl-2">
									<span className="navi-icon mr-2">
										<span className="svg-icon svg-icon-lg">
											<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
												<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
													<rect x="0" y="0" width="24" height="24"></rect>
													<path d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z" fill="#000000" opacity="0.3"></path>
													<path d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z" fill="#000000"></path>
												</g>
											</svg>
										</span>
									</span>
                                    <span className="navi-text font-weight-bolder font-size-lg">COMPRAS</span> 
								</Nav.Link>
							</Nav.Item>
							<Nav.Item className="navi-item my-2">
								<Nav.Link className="navi-link pl-2">
									<span className="navi-icon mr-2">
										<span className="svg-icon svg-icon-lg">
											<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
												<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                    <rect x="0" y="0" width="24" height="24"></rect>
                                                    <path d="M8,13.1668961 L20.4470385,11.9999863 L8,10.8330764 L8,5.77181995 C8,5.70108058 8.01501031,5.63114635 8.04403925,5.56663761 C8.15735832,5.31481744 8.45336217,5.20254012 8.70518234,5.31585919 L22.545552,11.5440255 C22.6569791,11.5941677 22.7461882,11.6833768 22.7963304,11.794804 C22.9096495,12.0466241 22.7973722,12.342628 22.545552,12.455947 L8.70518234,18.6841134 C8.64067359,18.7131423 8.57073936,18.7281526 8.5,18.7281526 C8.22385763,18.7281526 8,18.504295 8,18.2281526 L8,13.1668961 Z" fill="#000000"></path>
                                                    <path d="M4,16 L5,16 C5.55228475,16 6,16.4477153 6,17 C6,17.5522847 5.55228475,18 5,18 L4,18 C3.44771525,18 3,17.5522847 3,17 C3,16.4477153 3.44771525,16 4,16 Z M1,11 L5,11 C5.55228475,11 6,11.4477153 6,12 C6,12.5522847 5.55228475,13 5,13 L1,13 C0.44771525,13 6.76353751e-17,12.5522847 0,12 C-6.76353751e-17,11.4477153 0.44771525,11 1,11 Z M4,6 L5,6 C5.55228475,6 6,6.44771525 6,7 C6,7.55228475 5.55228475,8 5,8 L4,8 C3.44771525,8 3,7.55228475 3,7 C3,6.44771525 3.44771525,6 4,6 Z" fill="#000000" opacity="0.3"></path>
												</g>
											</svg>
										</span>
									</span>
                                    <span className="navi-text font-weight-bolder font-size-lg">CONTABILIDAD</span>
								</Nav.Link>
							</Nav.Item>
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
								<span className="navi-text font-weight-bolder font-size-lg">MERCADOTECNIA</span>
								</Nav.Link>
							</Nav.Item>
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
                                <div className="row mx-0">
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