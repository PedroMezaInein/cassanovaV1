import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { URL_DEV, COLORS, PUSHER_OBJECT } from '../../constants'
import { connect } from 'react-redux'
import { Tags, ListPanel, Task, AddTaskForm, TagColorForm} from '../../components/forms'
import { Modal } from '../../components/singles'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
import { setFormHeader, setSingleHeader } from '../../functions/routers'
import Echo from 'laravel-echo'
class Tareas extends Component {

    state = {
        modal_tarea: false,
        modal_addTag: false,
        form: {
            titulo: '',
            descripcion: '',
            fecha_entrega: null,
            responsables: [],
            tags: [],
            comentario: '',
            tipo: '',
            tipoTarget: {taget: '', value: ''},
            filtrarTarea: 'own',
            filtrarTareaNombre: '',
            color: '',
            mostrarColor: false,
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
            },
            nuevo_tag:''
        },
        options: {
            responsables: [],
            tags: [],
            filtrarTareas: [
                { text: "Tareas personales", value: "own" },
                { text: "Tareas generales", value: "all" },
                { text: "Tareas terminadas", value: "done" },
            ],
        },
        showTask: false,
        showListPanel : true,
        pagination:{
            page: 0,
            limit: 10,
            numTotal: 0,
        },
        tareas: [],
        tarea: '',
        etiquetas: [],
        title: 'AGREGAR NUEVA TAREA',
        formeditado: 1,
        mentions: {
            users: [],
            proyectos: []
        }, data: {
            tags: []
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
        this.getOptionsAxios()
        const { pagination } = this.state
        this.getTasks(pagination)
        if(process.env.NODE_ENV === 'production' || true ){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('responsable-tarea').listen('ResponsableTarea', (data) => {
                const { form, pagination, tarea, tareas, showTask } = this.state
                const { user } = this.props.authUser
                if(data.type ==='delete'){ this.getTasks(pagination) }
                if(data.type ==='terminar'){ this.getTasks(pagination) }
                else{
                    if(form.filtrarTarea === 'own'){
                        let found = tareas.find((elemento) => { return elemento.id === data.tarea })
                        if(found){ this.getTasks(pagination) 
                        }else{
                            found = data.responsables.find((elemento) => { return elemento === user.id })
                            if(found){ this.getTasks(pagination) }
                        }
                    }else{ this.getTasks(pagination) }
                    if(tarea.id === data.tarea && showTask){ this.mostrarTarea({id: data.tarea}) }
                }
                
            })
        }
    }

    mostrarListPanel() {
        this.setState({
            ...this.state,
            showListPanel : true ,
            showTask: false,
            tarea: ''
        })
    }

    nextPage = () => {
        const { pagination } = this.state
        pagination.page = pagination.page+1;
        this.setState({...this.state, pagination})
        this.getTasks(pagination)
    }

    prevPage = () => {
        const { pagination } = this.state
        pagination.page = pagination.page-1;
        this.setState({...this.state, pagination})
        this.getTasks(pagination)
    }

    setProyectoName = nombre => {
        let arreglo = nombre.split(' ')
        let texto = '#'
        arreglo.forEach( (elemento) => {
            if(elemento !== '' && elemento !== '-')
                texto = texto + elemento.charAt(0).toUpperCase() + elemento.slice(1).toLowerCase()
        })
        return texto
    }

    completarTareaAxios = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/completar`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                this.setState({ ...this.state, showTask: false, showListPanel: true, tarea: '' })
                doneAlert('Tarea completada con éxito')
                const { pagination } = this.state
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    mostrarTarea = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/tareas/${tarea.id}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { tarea } = response.data
                this.setState({ ...this.state, showTask: true, showListPanel: false, tarea: tarea })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
        
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'EDITAR NUEVA TAREA')
            this.editTask()
        else
            this.addTask()
    }

    addTask = async(e) =>  {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/usuarios/tareas`, form, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                this.setState({
                    ...this.state,
                    modal_tarea: false,
                    form: this.clearForm(),
                })
                doneAlert('Tarea generada con éxito')
                const { pagination } = this.state
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    editTask = async(e) =>  {
        const { access_token } = this.props.authUser
        const { tarea, form} = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v3/usuarios/tareas/${tarea.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tarea } = response.data
                this.setState({ ...this.state, form: this.clearForm(), modal_tarea: false, tarea: tarea })
                doneAlert('Fue editado con éxito');
                const { pagination } = this.state
                this.getTasks(pagination)
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getTasks = async(pagination) => {
        const { access_token } = this.props.authUser
        const { form, etiquetas } = this.state
        waitAlert()
        let aux = ''
        etiquetas.forEach((element, index) => {
            aux = aux + '&etiquetas[]='+element.id
        })
        await axios.get(`${URL_DEV}v3/usuarios/tareas?nombre=${form.filtrarTareaNombre}&page=${pagination.page}&limit=${pagination.limit}${aux}&type=${form.filtrarTarea}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { tareas, num } = response.data
                pagination.numTotal = num
                if(pagination.page >= parseInt(num/pagination.limit))
                    pagination.page = parseInt(num/pagination.limit) - 1
                this.setState({ ...this.state, tareas, pagination })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateFavAxios = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        let tipo = tarea.prioritario === 0 ? 'si' : 'no'
        await axios.put(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/importancia`, {prioritario: tipo}, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { tarea } = response.data
                Swal.close()
                this.setState({...this.state, tarea: tarea})
                const { pagination } = this.state
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.options(`${URL_DEV}v3/usuarios/tareas`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { usuarios, etiquetas, proyectos } = response.data
                const { options, mentions, data } = this.state
                options.responsables = []
                mentions.users = []
                mentions.proyectos = []
                options.tags = [ { label: ' + Nueva etiqueta', value: 'nueva_etiqueta', name: 'Nueva etiqueta'} ]
                usuarios.forEach( ( element ) => {
                    options.responsables.push({
                        name: element.name,
                        value: element.id.toString(),
                        label: element.name
                    })
                    mentions.users.push({ id: element.id, display: element.name })
                });
                etiquetas.forEach( (element) => {
                    options.tags.push({
                        name: element.titulo,
                        value: element.id.toString(),
                        label: element.titulo,
                        color:element.color
                    })
                    data.tags.push(element)
                })
                proyectos.forEach((element) => { mentions.proyectos.push({ id: element.id, display: this.setProyectoName(element.nombre), name: element.nombre }) })
                this.setState({...this.state, options, mentions, data})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendTagAxios = async(e) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/usuarios/tareas/etiquetas`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { etiquetas, etiqueta } = response.data
                const { options, form, data } = this.state
                options.tags = [ { label: ' + Nueva etiqueta', value: 'nueva_etiqueta', name: 'Nueva etiqueta'} ]
                etiquetas.forEach( (element) => {
                    options.tags.push({
                        name: element.titulo,
                        value: element.id.toString(),
                        label: element.titulo,
                        color:element.color
                    })
                    data.tags.push(element)
                })
                form.nuevo_tag = ''
                form.color = ''
                if(etiqueta)
                    form.tags.push({value: etiqueta.id.toString(), name: etiqueta.titulo, label: etiqueta.titulo})
                this.setState({...this.state, data, options, form, modal_addTag: false})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendComentario = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tarea } = this.state
        const data = new FormData();
        data.append(`comentario`, form.comentario)
        if(form.adjuntos.adjunto_comentario.value)
            form.adjuntos.adjunto_comentario.files.forEach((file) => {
                data.append(`files[]`, file.file)
            })
        
        await axios.post(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/comentario`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { tarea } = response.data
                this.setState({...this.state, tarea: tarea, form: this.clearForm()})
                doneAlert('Comentario agregao con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateTagInTask = async(tag, tarea, type) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/tags?type=${type}`, { tag: tag.value }, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { showTask } = this.state
                const { tarea } = response.data
                if(showTask){
                    this.setState({...this.state, tarea: tarea})
                }
                Swal.close();
                doneAlert('Comentario agregao con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addLabel = async(etiqueta) => {
        const { etiquetas, pagination } = this.state
        let flag = true
        etiquetas.forEach((elemento) => {
            if(elemento.id === etiqueta.id)
                flag = false
        })
        if(flag){
            etiquetas.push(etiqueta)
            this.setState({...this.state, etiquetas})
            this.getTasks(pagination)
        }
    }

    removeTag = async(etiqueta) => {
        let { etiquetas, pagination } = this.state
        let aux = []
        etiquetas.forEach((element) => {
            if(element.id !== etiqueta.id)
                aux.push(element)
        })
        etiquetas = aux
        this.setState({...this.state, etiquetas})
        waitAlert()
        setTimeout(
            () => {
                this.getTasks(pagination)        
            }, 100
        )
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal_tarea: true,
            form: this.clearForm(),
            title: 'AGREGAR NUEVA TAREA'
        })
    }
    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal_tarea: false
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case ' mostrarColor':
                    form[element] = false;
                    break;
                case 'rolTarget':
                    form[element] = { target: '', value: ''}
                    break;
                case 'responsables':
                case 'tags':
                    form[element] = [];
                    break;
                case 'fecha_entrega':
                    form[element] = null
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        }
                    }
                    break;
                case 'filtrarTarea':
                    break;
                default:
                    form[element] = '';
                    break;
            }
            return ''
        })
        return form
    }
    onChange = e => {
        const { name, value } = e.target
        const { form,pagination } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
        if(name === 'filtrarTarea')
            this.getTasks(pagination)
    }
    handleChangeCreate = newValue => {
        const { form } = this.state
        if(newValue == null){
            newValue = { "label":"","value":"" }
        }
        let nuevoValue = {
            "label":newValue.label,
            "value":newValue.value,
            "color":""
        }
        form.tipo = newValue.value
        form.tipoTarget = nuevoValue
        this.setState({
            ...this.state,
            form
        })
    }
    handleCreateOption = inputValue => {
        let { options, form } = this.state
        let newOption = {
            'label': inputValue,
            'value': inputValue,
            'text': inputValue,
        }
        options.tipos.push(newOption)
        form.tipoTarget = newOption
        form.tipo = inputValue
        form.mostrarColor = true
        this.setState({
            ...this.state,
            form,
            options
        });
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    openModalEdit = tarea => {
        const { form } = this.state
        form.titulo = tarea.titulo
        let auxResponsables = []
        let auxrTag = []
        if (tarea.responsables) {
            tarea.responsables.forEach(responsable => {
                auxResponsables.push({
                    value: responsable.id.toString(),
                    name: responsable.name,
                    label: responsable.name
                })
            });
            form.responsables = auxResponsables
        }
        form.descripcion = tarea.descripcion
        if (tarea.etiquetas) {
            tarea.etiquetas.forEach(tag => {
                auxrTag.push({
                    value: tag.id.toString(),
                    name: tag.titulo,
                    label: tag.titulo
                })
            });
            form.tags = auxrTag
        }
        form.fecha_entrega = new Date(moment(tarea.fecha_limite))
        this.setState({
            ...this.state,
            tarea: tarea,
            form,
            formeditado: 1,
            modal_tarea: true,
            title: 'EDITAR NUEVA TAREA'
        })
    }
    handleCloseModalEdit = () => {
        this.setState({
            ...this.state,
            modal_tarea: false,
        })
    }
    openModalAddTag = () => {
        this.setState({
            ...this.state,
            modal_addTag: true,
            form: this.clearForm(),
            title: 'AGREGAR NUEVO TAG'
        })
    }
    handleCloseModalAddTag = () => {
        this.setState({
            ...this.state,
            modal_addTag: false,
        })
    }
    tagShow = tag => {
        const { name } = tag
        const { data } = this.state
        if (name === 'Nueva etiqueta') {
            this.openModalAddTag()
        }else{
            let etiqueta = data.tags.find( function(elemento){
                return elemento.id.toString() === tag.value
            })
            this.addLabel(etiqueta)
        }
    }

    deleteTask = async(tarea) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v3/usuarios/tareas/${tarea.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Tarea eliminada con éxito.')
                this.setState({...this.state, showTask: false, showListPanel: true, tarea: ''})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modal_tarea, form, options, showListPanel, showTask, tareas, pagination, tarea, title, etiquetas, modal_addTag, formeditado, mentions } = this.state
        const { user } = this.props.authUser
        return (
            <Layout active='usuarios' {...this.props}>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid ">
                        <div className="d-flex flex-column flex-grow-1 ">
                            <Tags etiquetas = { etiquetas } removeTag = { this.removeTag } options = { options } tagShow={this.tagShow}/>
                            <div className="row">
                                <ListPanel openModal = { this.openModal } options = { options } onChange = { this.onChange } form = { form }
                                    mostrarTarea = { this.mostrarTarea } showListPanel = { showListPanel } tareas = { tareas } 
                                    user = { user } updateFav = { this.updateFavAxios } pagination = { pagination } prev = { this.prevPage }
                                    next = { this.nextPage } addLabel = { this.addLabel } filterByName = { (e) => { this.getTasks(pagination)}} 
                                    updateTagInTask={this.updateTagInTask}/>
                                {
                                    tarea  && 
                                        <Task showTask={showTask} tarea = { tarea } mostrarListPanel = { () => { this.mostrarListPanel() } } options = { options } 
                                            completarTarea = { this.completarTareaAxios } updateFav = { this.updateFavAxios } form = { form } user = { user }
                                            onChange = { this.onChange } clearFiles={this.clearFiles} mentions = { mentions } onSubmit = { this.sendComentario }
                                            openModalEdit = { this.openModalEdit} updateTagInTask={this.updateTagInTask} 
                                            deleteTask = { () => { deleteAlert( '¿ESTÁS SEGURO?', `Eliminarás la tarea ${tarea.titulo}`, 
                                            (e) => { this.deleteTask(tarea)} ) } }/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="xl" title={title} show={modal_tarea} handleClose={this.handleCloseModal}>
                    <AddTaskForm onSubmit = { this.onSubmit } form = { form } options = { options } onChange = { this.onChange }
                        handleChangeCreate = { this.handleChangeCreate } handleCreateOption = { this.handleCreateOption } sendTag = { this.sendTagAxios } />
                </Modal>
                <Modal title={title} show={modal_addTag} handleClose={this.handleCloseModalAddTag}>
                    <TagColorForm
                        form = { form }
                        onChange ={ this.onChange }
                        formeditado = { formeditado }
                        sendTag = { this.sendTagAxios }
                        colors={ COLORS }
                        customclass='bg-gray-100'
                        btnCloseCard = {false}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Tareas);