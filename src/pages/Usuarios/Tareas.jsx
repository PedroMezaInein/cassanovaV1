import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../constants'
import { connect } from 'react-redux'
import { Tags, ListPanel, Task, AddTaskForm} from '../../components/forms'
import { Modal } from '../../components/singles'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
import { setSingleHeader } from '../../functions/routers'
class Tareas extends Component {

    state = {
        modal_tarea: false,
        form: {
            titulo: '',
            descripcion: '',
            fecha_entrega: null,
            responsables: [],
            comentario: '',
            tipo: '',
            tipoTarget: {taget: '', value: ''},
            filtrarTarea: 'own',
            color: '',
            mostrarColor: false
        },
        options: {
            responsables: [],
            tipos: [],
            filtrarTareas: [
                { text: "Tareas personales", value: "own" },
                { text: "Tareas generales", value: "all" },
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
    }
    mostrarTarea() {
        this.setState({
            ...this.state,
            showTask: true,
            showListPanel : false
        })
    }
    mostrarListPanel() {
        this.setState({
            ...this.state,
            showListPanel : true ,
            showTask: false
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

    onSubmit = async(e) =>  {
        e.preventDefault();
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/usuarios/tareas`, form, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { pagination } = this.state
                this.setState({
                    ...this.state,
                    modal_tarea: false,
                    form: this.clearForm(),
                })
                doneAlert('Tarea generada con éxito')
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getTasks = async(pagination) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/tareas?page=${pagination.page}&limit=${pagination.limit}&type=${form.filtrarTarea}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { tareas, num } = response.data
                pagination.numTotal = num
                this.setState({ ...this.state, tareas, pagination })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateFavAxios = async(tarea) => {
        const { access_token, user } = this.props.authUser
        waitAlert()
        let tipo = tarea.prioritario === 0 ? 'si' : 'no'
        await axios.put(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/importancia`, {prioritario: tipo}, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
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
        await axios.get(`${URL_DEV}v2/usuarios/tareas/tareas/options`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { usuarios } = response.data
                const { options } = this.state
                options.responsables = []
                usuarios.forEach( ( element ) => {
                    options.responsables.push({
                        name: element.name,
                        value: element.id.toString(),
                        label: element.name
                    })
                });
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModal = () => {
        this.setState({
            ...this.state,
            modal_tarea: true,
            form: this.clearForm(),
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
                    form[element] = [];
                    break;
                case 'fecha_entrega':
                    form[element] = null
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

    render() {
        const { modal_tarea, form, options, showListPanel, showTask, tareas, pagination } = this.state
        const { user } = this.props.authUser
        return (
            <Layout active='usuarios' {...this.props}>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid ">
                        <div className="d-flex flex-column flex-grow-1 ">
                            <Tags />
                            <div className="row">
                                <ListPanel openModal = { this.openModal } options = { options } onChange = { this.onChange } form = { form }
                                    mostrarTarea = { () => { this.mostrarTarea() } } showListPanel = { showListPanel } tareas = { tareas } 
                                    user = { user } updateFav = { this.updateFavAxios } pagination = { pagination } prev = { this.prevPage }
                                    next = { this.nextPage } />
                                <Task showTask={showTask}  mostrarListPanel = { () => { this.mostrarListPanel() } } form={form} onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="xl" title='Agregar nueva tarea' show={modal_tarea} handleClose={this.handleCloseModal}>
                    <AddTaskForm onSubmit = { this.onSubmit } form = { form } options = { options } onChange = { this.onChange }
                        handleChangeCreate = { this.handleChangeCreate } handleCreateOption = { this.handleCreateOption } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Tareas);