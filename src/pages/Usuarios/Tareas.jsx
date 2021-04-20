import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../constants'
import { connect } from 'react-redux'
import { Tags, ListPanel, Task, AddTaskForm} from '../../components/forms'
import { Modal } from '../../components/singles'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
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
            filtrarTarea:''
        },
        options: {
            responsables: [],
            tipos: [],
            filtrarTareas: [
                { text: "Tareas personales", value: "Tareas personales" },
                { text: "Tareas generales", value: "Tareas generales" },
            ],
        },
        showTask: false,
        showListPanel : true,
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
    }
    mostrarTarea() {
        console.log('showTask')
        this.setState({
            ...this.state,
            showTask: true,
            showListPanel : false
        })
    }
    mostrarListPanel() {
        console.log('showListPanel ')
        const { showListPanel  } = this.state
        this.setState({
            ...this.state,
            showListPanel : !showListPanel ,
            showTask: false
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
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    handleChangeCreate = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = { "label":"","value":"" }
        }
        let nuevoValue = {
            "label":newValue.label,
            "value":newValue.value
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
        this.setState({
            ...this.state,
            form,
            options
        });
    }
    render() {
        const { modal_tarea, form, options, showListPanel, showTask } = this.state
        return (
            <Layout active='usuarios' {...this.props}>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid ">
                        <div className="d-flex flex-column flex-grow-1 ">
                            <Tags />
                            <div className="row">
                                <ListPanel openModal = { this.openModal } options={options} onChange={this.onChange} form={form}
                                    mostrarTarea={() => { this.mostrarTarea() }} showListPanel={showListPanel}
                                
                                />
                                <Task showTask={showTask}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="xl" title='Agregar nueva tarea' show={modal_tarea} handleClose={this.handleCloseModal}>
                    <AddTaskForm
                        form={form}
                        options={options}
                        onChange={this.onChange}
                        handleChangeCreate={this.handleChangeCreate}
                        handleCreateOption={this.handleCreateOption} 
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Tareas);