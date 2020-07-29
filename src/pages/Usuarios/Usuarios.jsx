import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { Title, Subtitle, P, Small, B } from '../../components/texts'
import { Button } from '../../components/form-components'
import { faUserPlus, faUserEdit, faUserSlash, faKey } from '@fortawesome/free-solid-svg-icons'
import { Card, Modal, ModalDelete } from '../../components/singles'
import { RegisterUserForm, PermisosForm, ClienteUserForm } from '../../components/forms'
import swal from 'sweetalert'
import { setOptions, setSelectOptions } from '../../functions/setters'
import { forbiddenAccessAlert, errorAlert, waitAlert } from '../../functions/alert'
import modal from '../../components/singles/Modal'

class Usuarios extends Component {

    state = {
        users: [],
        user: '',
        modal: {
            form: false,
            delete: false,
            permisos: false
        },
        title: 'Registrar nuevo usuario',
        form: {
            name: '',
            email: '',
            tipo: 0,
            departamentos: [],
            departamento: '',
            proyectos: [],
            proyecto: ''
        },
        options:{
            tipos: [],
            proyectos: [],
            departamentos: []
        },
        data:{
            proyectos: [],
            departamentos: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const usuarios = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        /* if (!usuarios)
            history.push('/') */
        this.getUsers();
    }

    openModal = () => {
        const { modal, data, options } = this.state
        modal.form = true
        options.departamentos = setOptions(data.departamentos, 'nombre', 'id')
        options.proyectos = setOptions(data.proyectos, 'nombre', 'id')

        this.setState({
            ... this.state,
            title: 'Registrar nuevo usuario',
            form: this.clearForm(),
            modal,
            options
        })
    }

    openModalEdit = user => {
        const { modal, form } = this.state
        modal.form = true
        form.name = user.name
        form.email = user.email
        form.tipo = user.tipo
        form.departamentos = setOptions(user.departamentos, 'nombre', 'id')
        form.proyectos = setOptions(user.proyectos, 'nombre', 'id')
        this.setState({
            ... this.state,
            user: user,
            modal,
            form,
            title: 'Editar usuario'
        })
    }

    openModalDelete = (user) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            user: user
        })
    }

    openModalPermisos = user => {
        const { modal } = this.state
        modal.permisos = true
        this.setState({
            ... this.state,
            modal,
            user: user
        })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ... this.state,
            title: 'Registrar nuevo usuario',
            form: this.clearForm(),
            modal,
            user: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            modal,
            user: ''
        })
    }

    handleCloseModalPermisos = () => {
        const { modal } = this.state
        modal.permisos = false
        this.setState({
            ... this.state,
            modal,
            user: ''
        })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipo':
                    form[element] = 0
                    break;
                case 'departamentos':
                case 'proyectos':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { name, value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        /* options[arreglo] = aux */
        form[arreglo] = auxArray
        this.setState({
            ... this.state,
            form,
            options
        })
    }

    deleteOption = (element, array) => {
        let { form } = this.state
        let auxForm = []
        form[array].map( ( elemento, key ) => {
            if(element !== elemento){
                auxForm.push(elemento)
            }
        })
        form[array] = auxForm
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if(title === 'Editar usuario')
            this.updateUserAxios()
        else
            this.addUserAxios()
    }

    async getUsers() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { users, departamentos, proyectos } = response.data
                const { data, options  } = this.state

                data.departamentos = departamentos
                options.departamentos = setOptions( departamentos, 'nombre', 'id')
                
                data.proyectos = proyectos
                options.proyectos = setOptions( proyectos, 'nombre', 'id')

                options.tipos = setSelectOptions( users, 'tipo' )
                
                this.setState({
                    ... this.state,
                    users: users,
                    options,
                    data
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

    async addUserAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        
        await axios.post(URL_DEV + 'user', form, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {

                const { users } = response.data
                const { modal } = this.state
                modal.form = false
                
                this.setState({
                    ... this.state,
                    users: users,
                    modal,
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    async updateUserAxios() {
        const { access_token } = this.props.authUser
        const { form, user } = this.state
        await axios.put(URL_DEV + 'user/' + user.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { users } = response.data
                const { modal } = this.state
                modal.form = false
                
                this.setState({
                    ... this.state,
                    users: users,
                    modal,
                    form: this.clearForm(),
                    user: ''
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    async deleteUserAxios() {
        const { access_token } = this.props.authUser
        const { user } = this.state
        await axios.delete(URL_DEV + 'user/' + user.id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                
                const { users } = response.data
                const { modal } = this.state
                modal.delete = false
                
                this.setState({
                    ... this.state,
                    users: users,
                    modal,
                    form: this.clearForm(),
                    user: ''
                })
                
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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

    render(){
        const { modal, title, users, user, form, options } = this.state
        return (
            <Layout active = { 'usuarios' }  { ...this.props } >
                <div className="d-flex align-items-center mb-2 flex-column flex-md-row justify-content-md-between">
                    <div className="mt-3 mt-md-0 ml-auto">
                        <Button onClick = { this.openModal } text = '' className = "" icon = { faUserPlus }
                            tooltip={{ id: 'add', text: 'Nuevo' }} />
                    </div>
                </div>
            
                {/* Lista de usuarios */}
            
                {
                    users.map((tipo_users, key) => {
                        return (
                            <div key = { key } className="col-md-12">
                                <Subtitle>
                                    { tipo_users.tipo }
                                </Subtitle>
                                <div className = "row py-3 mx-0" >
                                {
                                    tipo_users.usuarios.map( (user, _key) => {
                                        return (
                                            <div className = "col-md-6 col-xl-3 col-12 mb-2 px-0" key = { _key } >
                                                <Card className="mx-3" >
                                                    <Button onClick = { (e) => { this.openModalPermisos(user) }} 
                                                        icon = { faKey } className="mr-2" color="gold-no-bg"
                                                        tooltip={{ id: 'permisos', text: 'Permisos de usuario' }} />
                                                    <div className="text-center">
                                                        <P>
                                                            { user.name }
                                                        </P>
                                                        <Small>
                                                            { user.email }
                                                        </Small>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-3">
                                                        <Button icon = '' 
                                                            onClick = { (e) => { this.openModalEdit(user) }} icon = { faUserEdit } 
                                                            className = "mr-2" color = "blue"
                                                            tooltip={{ id: 'edit', text: 'Editar' }} />
                                                        <Button icon = '' 
                                                            onClick = { (e) => { this.openModalDelete(user) }} icon = { faUserSlash } 
                                                            color="red"
                                                            tooltip={{ id: 'delete', text: 'Eliminar', type: 'error' }} />
                                                    </div>
                                                </Card>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        )
                    })
                }
                {/* Fin de lista de usuarios */}

                <Modal size="xl" title = { title } 
                    show = { modal.form } 
                    handleClose = { this.handleClose } >
                    <RegisterUserForm 
                        className = 'px-3' form = { form } options = { options }
                        onSubmit = { this.onSubmit } onChange = { this.onChange }
                        onChangeOptions =  { this.onChangeOptions }
                        deleteOption = { this.deleteOption }
                        />
                </Modal>
                <ModalDelete 
                    title = { user === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + user.name + " ?"} 
                    show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteUserAxios() }}>
                </ModalDelete>

                <Modal size = "lg" title = "Permisos de usuario" 
                    show = { modal.permisos } 
                    handleClose = { this.handleCloseModalPermisos } >
                    <PermisosForm {... this.props} handleClose={this.handleCloseModalPermisos} user = {user.id} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);