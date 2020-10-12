import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV} from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal } from '../../components/singles'
import swal from 'sweetalert'
import { TareaForm } from '../../components/forms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes} from '@fortawesome/free-solid-svg-icons'
import {Input, Button}from '../../components/form-components'
import moment from 'moment'
import { Badge, Card, Nav, Tab } from 'react-bootstrap'
import { errorAlert, forbiddenAccessAlert } from '../../functions/alert'

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
        adjuntoName: '',
        defaultactivekey:"",
    }

    componentDidMount(){
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function(element, index) {
            const { modulo: { url } } = element
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

    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal: !this.state.modal,
            tarea: '',
            adjuntoName: '',
            adjuntoFile: '',
            adjunto: ''
        })
    }

    handleClickTask = tarea => {
    
        const { users } = this.state

        let _index = []

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
            ...this.state,
            participantesTask: aux,
            participantes: _index
        })
    }

    setTareas = columns => {
        this.setState({
            ...this.state,
            columns
        })
    }

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
        const { form } = this.state
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
        if( name === 'adjunto'){
            this.setState({
                ...this.state,
                adjuntoFile: e.target.files[0],
                adjunto: e.target.value,
                adjuntoName: e.target.files[0].name
            })
        }else{
            this.setState({
                ...this.state,
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
            ...this.state,
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

    updateActiveTabContainer = active => {
        const { tableros } = this.state
        tableros.map( (tablero) => { 
            if(tablero.nombre === active){
                this.setTareas(tablero.tareas)
                this.setState({ 
                    subActiveKey: active
                })
            }
        })
    }

    async getTareasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas', { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { data : { users : users } } = response
                const { tableros } = response.data
                this.setState({
                    ...this.state,
                    user: user,
                    users: users,
                    tableros: tableros,
                    defaultactivekey:tableros[0].nombre,
                    subActiveKey:tableros[0].nombre
                })
                this.setTareas(tableros[0].tareas)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addTaskAxios(){
        const { access_token } = this.props.authUser
        const { form, subActiveKey} = this.state
        form.departamento = subActiveKey
        await axios.post(URL_DEV + 'user/tareas', form, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                const { form } = this.state
                const { tableros } = response.data

                tableros.map((tablero) => {
                    if(tablero.nombre == subActiveKey){
                        this.setTareas(tablero.tareas)
                    }
                })

                form['titulo'] = ''
                form['grupo'] = ''
                this.setState({
                    user: user,
                    form,
                    activeKey: '',
                    formeditado:0,
                    tableros:tableros
                })
                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
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
        const { comentario, tarea, adjuntoFile, adjuntoName, subActiveKey } = this.state 
        const data = new FormData();
        data.append('comentario', comentario)
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', tarea.id)
        await axios.post(URL_DEV + 'user/tareas/comentario', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, tarea } = response.data
                tableros.map((tablero) => {
                    if(tablero.nombre == subActiveKey){
                        this.setTareas(tablero.tareas)
                    }
                })
                this.setState({
                    ...this.state,
                    comentario: '',
                    tarea: tarea,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    tableros:tableros
                })
                swal.close()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
                    forbiddenAccessAlert()
                }else{
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

    async deleteTareaAxios(id){
        const { access_token } = this.props.authUser
        const { form, subActiveKey} = this.state
        await axios.delete(URL_DEV + 'user/tareas/' + id, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, tarea } = response.data
                tableros.map((tablero) => {
                    if(tablero.nombre == subActiveKey){
                        this.setTareas(tablero.tareas)
                    }
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                    tableros:tableros
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async endTareaAxios(id){
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        await axios.put(URL_DEV + 'user/tareas/' + id + '/end', {}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, tarea } = response.data
                tableros.map((tablero) => {
                    if(tablero.nombre == subActiveKey){
                        this.setTareas(tablero.tareas)
                    }
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tarea: '',
                    adjuntoName: '',
                    adjuntoFile: '',
                    adjunto: '',
                    formeditado:1,
                    tableros:tableros
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async reordeingTasksAxios(source, destination, task){
        const { access_token } = this.props.authUser
        const { subActiveKey } = this.state
        await axios.put(URL_DEV + 'user/tareas/order', {source, destination, task}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { tableros, tarea } = response.data
                tableros.map((tablero) => {
                    if(tablero.nombre == subActiveKey){
                        this.setTareas(tablero.tareas)
                    }
                })
                this.setState({
                    ...this.state,
                    modal: false,
                    tableros:tableros
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    } 
    render(){
        
        const { columns, user, form, activeKey, modal, tarea, comentario, adjunto,adjuntoName, users, participantesTask, participantes, formeditado, tableros, defaultactivekey, subActiveKey} = this.state
        return(
            <Layout active={'usuarios'} { ...this.props}> 
                <div className="d-flex flex-row">
					<div className="flex-row-fluid">
						<div className="d-flex flex-column flex-grow-1">
                        <Tab.Container 
                            id="left-tabs-example" 
                            activeKey = { subActiveKey ? subActiveKey : defaultactivekey }
                            defaultActiveKey={defaultactivekey}
                            onSelect = { (select) => { this.updateActiveTabContainer(select) } }
                            >
							<Card className="card-custom gutter-b">
								<Card.Body className="d-flex align-items-center justify-content-between flex-wrap py-3">
									<div className="d-flex align-items-center mr-2 py-2">
										<h3 className="font-weight-bold mb-0 mr-5">Tableros</h3>
                                    </div>
                                    <div className="d-flex">
										<Nav className="navi navi-hover navi-active navi-link-rounded navi-bold d-flex flex-row">
                                            {	
                                                tableros.map( (tablero, key) => {
                                                    return( 
                                                        <Nav.Item className="navi-item mr-2 " key={key}>
                                                            <Nav.Link className="navi-link border border-light border-2" eventKey = {tablero.nombre }>
                                                                <span className="navi-text">{tablero.nombre}</span>
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
									</div>
								</Card.Body>
							</Card> 
                            <Card className="card-custom card-stretch">
                                <Card.Body className="p-0"> 
                                    <div className="card-spacer-x pt-5 pb-4 toggle-off-item">
                                        <div className="mb-1">
                                            <DragDropContext onDragEnd={this.onDragEnd}>
                                                <div className="row mx-0 justify-content-center">
                                                    {
                                                        columns.map((column) => {
                                                            return(
                                                                <div key={column.id} className="col-md-6 col-lg-3 px-3">
                                                                    <Column 
                                                                        form={ form }
                                                                        submit = { this.submitAdd }
                                                                        onChange = { this.onChange }
                                                                        column = { column }
                                                                        clickTask = { this.handleClickTask }
                                                                        id = { user.id }
                                                                        tareas = { column.tareas }
                                                                        activeKey = {activeKey}
                                                                        handleAccordion = {this.handleAccordion}
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
                <Modal size="xl" title="Tareas" show = { modal } handleClose = { this.handleCloseModal } >
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
                            <Button text="ENVIAR" className={"btn btn-light-primary font-weight-bolder mr-3"} onClick = { this.addComentario }/> 
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
                                                                    <span className="text-muted ml-2">{comentario.user.name}</span>
                                                                    <p className="p-0">{comentario.comentario}</p>
                                                                    {
                                                                        comentario.adjunto ?
                                                                            <div className="d-flex justify-content-end">
                                                                                <a href = { comentario.adjunto.url } target = '_blank' >
                                                                                    { comentario.adjunto.name }
                                                                                </a>
                                                                            </div>    
                                                                        :  ''
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