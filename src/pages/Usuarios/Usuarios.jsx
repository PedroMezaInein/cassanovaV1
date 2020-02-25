import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, EMPTY_EMPLEADO} from '../../constants'
import { Title, Subtitle, P, Small } from '../../components/texts'
import { Button } from '../../components/form-components'
import { faUserPlus, faUserEdit, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { Card, Modal } from '../../components/singles'
import { RegisterUserForm, EmpleadoForm } from '../../components/forms'


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
        empleadoForm:{
            EMPTY_EMPLEADO
        },
        options: [],
        empresas_options: [],
        user_to_interact: '',

        // Modal
        modalSafeDeleteActive: false,
        modalActive: false,
        modalUpdateUser: false
    }

    componentDidMount(){
        this.getUsers();
        const { history, authUser } = this.props
        if(authUser){
            const { user: { tipo: { id: tipo_id } } } = authUser
            switch(tipo_id){
                case 1:
                    break;
                case 2: 
                    history.push('/usuarios/tareas')
                    break;
                case 3:
                    history.push('/mi-proyecto')
                    break;
                default:
                    console.log('logout')
                    break;
            }
        }else{
            // Logout
        }
    }

    setUsers = (data) => {
        this.setState({
            users: data
        })
    }

    setUser = (data) => {
        console.log(data, 'setuser')
        const { empleado } = data
        const { empleadoForm } = this.state

        empleadoForm['tipo_empleado'] = empleado.tipo_empleado ? empleado.tipo_empleado : ''
        
        empleadoForm['empresa'] = empleado.empresa.id ? empleado.empresa.id : ''
        
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

    // Handle change on form

    handleChangeInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form }  = this.state
        console.log('handleChangeInput')
        console.log(this.state)
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
        if(modalSafeDeleteActive){
            user_to_interact = {}
        }
        this.setState({
            ... this.state,
            modalSafeDeleteActive: !this.state.modalSafeDeleteActive,
            user_to_interact,
        })
    }

    handleCloseModalUpdateUser = () => {
        this.setState({
            ... this.state,
            modalUpdateUser: !this.state.modalUpdateUser,
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
                
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
                
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    //Delete an user with id
    async deleteUserAxios(user){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'user/' +user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    render(){
        const { users, modalActive, form, options, modalSafeDeleteActive, user_to_interact, modalUpdateUser, form: { tipo : tipo_form }, empleadoForm, empresas_options } = this.state;
        return(
            <Layout { ...this.props}>
                <div className="d-flex align-items-center justify-content-between">
                    <Title>
                        Listado de usuarios registrados
                    </Title>
                    <Button onClick={this.addUser()} text='' icon={faUserPlus} />
                </div>
                {
                    users.map((tipo_users, key) => {
                        return(
                            <div key={key} className="my-5">
                                <Subtitle>
                                    Usuarios {tipo_users.tipo}
                                </Subtitle>
                                <div className="d-flex border py-3">
                                    {
                                        tipo_users.usuarios.map((user, _key) => {
                                            return(
                                                <Card className="mx-3" key={_key}>
                                                    <div className="text-center">
                                                        <P>
                                                            {user.name}
                                                        </P>

                                                        <Small>
                                                            {user.email}
                                                        </Small>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-3">
                                                        <Button onClick={(e) => { this.updateUser(e)(user) }} icon={faUserEdit} className="mr-2" color="green"/>
                                                        <Button onClick={(e) => { this.deleteuser(e)(user) }} icon={faUserSlash} color="red"/>
                                                    </div>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                <Modal show={modalActive} handleClose={this.handleCloseModal}>
                    <RegisterUserForm form={ form } options={options} onSubmit={ this.handleSubmitAddUser} 
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
                    <RegisterUserForm form={ form } options={options} onSubmit={ this.handleSubmitEditUser } 
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
                    <Title>
                        ¿Estás seguro que deseas eliminar a <P color="red">
                            {user_to_interact.name}
                        </P>
                    </Title>
                    <div className="d-flex justify-content-center mt-3">
                        <Button onClick={this.handleCloseSafeModal} text="Cancelar" className="mr-2" color="green"/>
                        <Button onClick={(e) => { this.deleteSafeUser(e)(user_to_interact.id) }} text="Continuar" color="red"/>
                    </div>
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