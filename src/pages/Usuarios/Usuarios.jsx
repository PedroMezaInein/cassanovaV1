import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, EMPTY_EMPLEADO} from '../../constants'
import { Title, Subtitle, P, Small, B } from '../../components/texts'
import { Button } from '../../components/form-components'
import { faUserPlus, faUserEdit, faUserSlash, faKey } from '@fortawesome/free-solid-svg-icons'
import { Card, Modal } from '../../components/singles'
import { RegisterUserForm, EmpleadoForm, PermisosForm } from '../../components/forms'
import swal from 'sweetalert'

class Usuarios extends Component{
    constructor(props){
        super(props)
        /* this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleChangeEmpleado = this.handleChangeEmpleado.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.addUserAxios = this.addUserAxios.bind(this); */
    }

    state = {
        users: [],
        type_user: '',

        // Form 
        form:{
            name: '',
            email: '',
            tipo:0,
            empleado:false
        },
        empleadoForm:EMPTY_EMPLEADO,
        options: [],
        empresas_options: [],
        user_to_interact: '',

        // Modal
        modalSafeDeleteActive: false,
        modalActive: false,
        modalUpdateUser: false,
        modalPermisos: false
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const usuarios = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!usuarios)
            history.push('/')
        this.getUsers();
    }

    setUsers = (data) => {
        this.setState({
            users: data
        })
    }

    setUser = (data) => {
        
        const { empleado } = data
        const { empleadoForm } = this.state
        
        if(empleado){

            empleadoForm['tipo_empleado'] = empleado.tipo_empleado ? empleado.tipo_empleado : ''
        
            empleadoForm['empresa'] = empleado.empresa ? (empleado.empresa.id ? empleado.empresa.id : '') : ''
            
            empleadoForm['puesto'] = empleado.puesto ? empleado.puesto : ''
            empleadoForm['fecha_inicio'] = empleado.fecha_inicio ? new Date(empleado.fecha_inicio) : ''
            empleadoForm['estatus'] = empleado.estatus ? empleado.estatus : ''
            
            empleadoForm['rfc'] = empleado.rfc ? empleado.rfc : ''
            empleadoForm['nss'] = empleado.nss ? empleado.nss : ''
            empleadoForm['curp'] = empleado.curp ? empleado.curp : ''
            
            empleadoForm['banco'] = empleado.banco_deposito ? empleado.banco_deposito : ''
            empleadoForm['cuenta'] = empleado.cuenta_deposito ? empleado.cuenta_deposito : ''
            empleadoForm['clabe'] = empleado.clabe_deposito ? empleado.clabe_deposito : ''
    
            empleadoForm['nombre_emergencia'] = empleado.nombre_contacto ? empleado.nombre_contacto : ''
            empleadoForm['telefono_emergencia'] = empleado.telefono_contacto ? empleado.telefono_contacto : ''

        }
        

        this.setState({
            ... this.state,
            empleadoForm
        })
    }

    // Functions to add users

    addUser = (value) => (e) => {
        this.setState({
            ... this.state,
            modalActive: true,
            form:{
                name: '',
                email: '',
                tipo: 0
            },
            empleadoForm: EMPTY_EMPLEADO
        })
    }

    // Functions to update users

    updateUser = (e) => (user) => {
        const { name, email, tipo} = user
        let form = {
            name: name,
            email: email,
            tipo: tipo
        }
        this.setState({
            ... this.state,
            modalUpdateUser: true,
            user_to_interact: user,
            form
        })
        this.getOneUser(user.id)
    }

    // Functions for delete user

    deleteuser = (e) => (user) => {
        this.setState({
            ... this.state,
            modalSafeDeleteActive: true,
            user_to_interact: user
        })
    }

    deleteSafeUser = (e) => (user) => {
        this.deleteUserAxios(user);
        this.setState({
            ... this.state,
            modalSafeDeleteActive: false,
            user_to_interact: ''
        })
    }

    // 

    changePermisos = (e) => (user) => {
        this.setState({
            ... this.state,
            modalPermisos: true,
            user_to_interact: user
        })
    }

    // Handle change on form

    handleChangeInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form }  = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    handleChangeEmpleado = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { empleadoForm, form }  = this.state
        empleadoForm[name] = value
        form['empleado'] = true
        this.setState({
            ... this.state,
            empleadoForm,
            form
        })
    }

    handleChangeDate = (date) =>{
        const { empleadoForm, form }  = this.state
        empleadoForm['fecha_inicio'] = date
        form['empleado'] = true
        this.setState({
            ... this.state,
            empleadoForm,
            form
        })
    }

    // Submit forms handlers

    handleSubmitAddUser = (e) => {
        e.preventDefault();
        this.addUserAxios()
    }

    handleSubmitEditUser = (e) => {
        e.preventDefault();
        const { id } = this.state.user_to_interact
        this.updateUserAxios(id)
    }

    // Modal hanlders

    handleCloseModal = () => {
        this.setState({
            ... this.state,
            modalActive: !this.state.modalActive,
        })
    }

    handleCloseSafeModal = () => {
        const { modalSafeDeleteActive, user_to_interact } = this.state
        this.setState({
            ... this.state,
            user_to_interact: modalSafeDeleteActive ? {} : user_to_interact,
            modalSafeDeleteActive: !this.state.modalSafeDeleteActive,
        })
    }

    handleCloseModalUpdateUser = () => {
        this.setState({
            ... this.state,
            modalUpdateUser: !this.state.modalUpdateUser,
        })
    }

    handleCloseModalPermisos = () => {
        const { modalPermisos, user_to_interact } = this.state
        this.setState({
            ... this.state,
            user_to_interact: modalPermisos ? {} : user_to_interact,
            modalPermisos: !this.state.modalPermisos,
        })
    }

    // Axios Functions

    //Add user
    async addUserAxios(){
        const { access_token } = this.props.authUser
        const { form, empleadoForm } = this.state
        form.empleado = empleadoForm
        await axios.post(URL_DEV + 'user', form, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users);
                this.setState({
                    modalActive: false,
                    form:{
                        name: '',
                        email: '',
                        tipo:0
                    },
                })
                swal({
                    title: '¡Listo!',
                    text: 'Agregaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })
    }

    // Update user info
    async updateUserAxios( user ){
        const { access_token } = this.props.authUser
        const { form, empleadoForm } = this.state
        form.empleado = empleadoForm
        await axios.put(URL_DEV + 'user/' + user, form, { headers: {Authorization:`Bearer ${access_token}`} }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users);
                this.setState({
                    modalUpdateUser: false,
                    form:{
                        name: '',
                        email: '',
                        tipo:0,
                    },
                })
                swal({
                    title: '¡Listo!',
                    text: 'Actualizaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })
    }

    //Delete an user with id
    async deleteUserAxios(user){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'user/' +user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
                swal({
                    title: '¡Listo!',
                    text: 'Eliminaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })
    }

    async getOneUser(user){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/user/' + user, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data: {user: user} } = response
                this.setUser(user)
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })
    }

    async getUsers(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
                users.map((user, key) => {
                    const { id, tipo } = user
                    const { options } = this.state
                    options.push({
                        value: id,
                        text: tipo
                    })
                    this.setState({
                        ... this.state,
                        options
                    })
                })
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })

        await axios.get(URL_DEV + 'empresa', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                let empresas_options = []
                empresas.map((empresa, key) => {
                    const { id, name } = empresa
                    
                    empresas_options.push({
                        value: id,
                        text: name
                    })
                    this.setState({
                        ... this.state,
                        empresas_options
                    })
                })
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                        icon: 'error',
                        
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
                icon: 'error',
                
            })
        })
    }

    render(){
        const { users, modalActive, form, options, modalSafeDeleteActive, user_to_interact, modalUpdateUser, form: { tipo : tipo_form }, empleadoForm, empresas_options, modalPermisos } = this.state;
        return(
            <Layout active={'usuarios'}  { ...this.props}>
                <div className="d-flex align-items-center mb-2 flex-column flex-md-row justify-content-md-between">
                    <Title className="text-center">
                        Listado de usuarios registrados
                    </Title>
                    <div className="mt-3 mt-md-0 ml-auto">
                        <Button onClick={this.addUser()} text='' className="" icon={faUserPlus} />
                    </div>
                    
                </div>
                {
                    users.map((tipo_users, key) => {
                        return(
                            <div key={key} className="my-4">
                                <Subtitle>
                                    {tipo_users.tipo}
                                </Subtitle>
                                <div className="row py-3 mx-0">
                                    {
                                        tipo_users.usuarios.map((user, _key) => {
                                            return(
                                                <div className="col-md-4 col-xl-3 col-12 mb-2 px-0" key={_key}>
                                                    <Card className="mx-3" >
                                                        <Button onClick={(e) => { this.changePermisos(e)(user) }} icon={faKey} className="mr-2" color="gold-no-bg"/>
                                                        <div className="text-center">
                                                            <P>
                                                                {user.name}
                                                            </P>

                                                            <Small>
                                                                {user.email}
                                                            </Small>
                                                        </div>
                                                        <div className="d-flex justify-content-between mt-3">
                                                            <Button icon='' onClick={(e) => { this.updateUser(e)(user) }} icon={faUserEdit} className="mr-2" color="blue"/>
                                                            <Button icon='' onClick={(e) => { this.deleteuser(e)(user) }} icon={faUserSlash} color="red"/>
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
                <Modal show={modalActive} handleClose={this.handleCloseModal}>
                    <RegisterUserForm className="px-3" form={ form } options={options} onSubmit={ this.handleSubmitAddUser} 
                        onChange={(e) => {e.preventDefault(); this.handleChangeInput(e)}} title="Registrar usuario">
                        {
                            tipo_form < 3 && tipo_form > 0 &&
                            <EmpleadoForm 
                                form={empleadoForm} 
                                onChange={this.handleChangeEmpleado}
                                options={empresas_options}
                                title="Datos del empleado" 
                                onChangeCalendar={this.handleChangeDate}
                                />
                        }
                    </RegisterUserForm>
                </Modal>
                <Modal show={modalUpdateUser} handleClose={this.handleCloseModalUpdateUser}>
                    <RegisterUserForm form={ form } options={options} className="px-3" onSubmit={ this.handleSubmitEditUser } 
                        onChange={(e) => {e.preventDefault(); this.handleChangeInput(e)}} title="Editar usuario">
                        {
                            tipo_form < 3 && tipo_form > 0 &&
                                <EmpleadoForm 
                                    form={empleadoForm} 
                                    onChange={this.handleChangeEmpleado}
                                    options={empresas_options}
                                    title="Datos del empleado" 
                                    onChangeCalendar={this.handleChangeDate}
                                    />
                        }
                    </RegisterUserForm>
                </Modal>
                <Modal show={modalSafeDeleteActive} handleClose={this.handleCloseSafeModal}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar a <B color="red">{user_to_interact.name}</B>
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseSafeModal} text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick={(e) => { this.deleteSafeUser(e)(user_to_interact.id) }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                <Modal show={modalPermisos} handleClose={this.handleCloseModalPermisos}>
                    <PermisosForm {... this.props} handleClose={this.handleCloseModalPermisos} user={user_to_interact.id}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);