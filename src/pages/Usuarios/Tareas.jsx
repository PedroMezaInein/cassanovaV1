import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS, DARK_BLUE, GOLD } from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal } from '../../components/singles'
import swal from 'sweetalert'
import { Subtitle, P, Small, B } from '../../components/texts'
import { TareaForm } from '../../components/forms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faCheck } from '@fortawesome/free-solid-svg-icons'
import Input from '../../components/form-components/Input'
import moment from 'moment'

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
        participantes: [],
        participantesTask: [],
        tarea: '',
        modal: false,
        comentario: '',
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!tareas)
            history.push('/')
        this.getTareasAxios()
    }

    diffCommentDate = ( comentario ) => {
        var now  = new Date();
        var then = new Date(comentario.created_at);

        var diff = moment.duration(moment(now).diff(moment(then)));
        
        var months = parseInt(diff.asMonths());
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
        hours = hours - days*24;
        minutes = minutes - (days*24*60 + hours*60);
    }

    // Modals
    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modal: !this.state.modal,
            tarea: ''
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
        const { value } = e.target
        this.setState({
            ... this.state,
            comentario: value
        })
    }

    onChangeParticipantes = (value) => {
        const { tarea: { id: id } } = this.state
        this.addParticipanteAxios(id, value.identificador);
    }

    deleteParticipante = value => {
        this.deleteParticipanteAxios(value);
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
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
                    activeKey: ''
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    addComentario = () => {
        const { comentario } = this.state
        if(comentario !== '')
            this.addComentarioAxios()
    }

    async addComentarioAxios(){
        const { access_token } = this.props.authUser
        const { comentario, tarea } = this.state
        await axios.put(URL_DEV + 'user/tareas/'+tarea.id+'/comentario', {comentario: comentario}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { tarea : tarea } } = response
                this.setState({
                    ... this.state,
                    user: user,
                    comentario: '',
                    tarea: tarea
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
                        tarea: ''
                    })
                }
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    render(){
        const { columns, user, form, activeKey, modal, tarea, comentario, users, participantesTask, participantes } = this.state
        return(
            <Layout active={'usuarios'} { ...this.props}>
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
                <Modal show = { modal } handleClose = { this.handleCloseModal } >
                    <TareaForm participantes = { participantes } user = { user } form = { tarea } update = { this.onChangeParticipantes } 
                        participantesTask = { participantesTask } deleteParticipante = { this.deleteParticipante }  />
                    <div className="d-flex align-items-center px-3 py-2 flex-column-reverse flex-md-row ">
                        <FontAwesomeIcon icon = { faComments } color = { GOLD } className = " mr-4 " />
                        <P className="w-100" color="dark-blue">
                            <hr />
                        </P>
                    </div>
                    <div className="d-flex px-3 py-2 no-label flex-column flex-md-row">
                        <div className='mb-2 mb-md-0'>
                            <Small className="mr-2 " color="gold">
                                { user.name }
                            </Small>
                        </div>
                        <div className="mr-2 w-100 d-flex" >
                            <div className="w-100">
                                <Input placeholder = 'Comentario' value = { comentario } onChange = {this.onChangeComentario} name = 'comentario' as="textarea" rows="3" />
                            </div>
                            <FontAwesomeIcon color={GOLD} icon = {faCheck} onClick = { this.addComentario } className ='ml-2'/>
                        </div>
                        
                    </div>
                    {   tarea && 
                        <div className="px-md-5 my-2">
                            {
                                tarea.comentarios.length > 0 &&
                                    tarea.comentarios.map((comentario, key) => {
                                        return(
                                            <div  key={key} className="px-3 py-2 mb-4 background__white-blue">
                                                <B className="mr-2" color="gold">{ comentario.user.name }: </B>
                                                {
                                                    comentario.comentario
                                                }
                                                <br />
                                                <div className="text-right">
                                                    <Small className="ml-2" color="dark-blue">
                                                        {
                                                            this.diffCommentDate(comentario)
                                                        }
                                                    </Small>
                                                </div>
                                                
                                            </div>
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