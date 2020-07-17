/* eslint-disable no-unused-vars */  
import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, EMPTY_EMPLEADO} from '../../constants'
import { Title, Subtitle, P, Small, B } from '../../components/texts'
import { Button } from '../../components/form-components'
import { faUserPlus, faUserEdit, faUserSlash, faKey } from '@fortawesome/free-solid-svg-icons'
import { Card, Modal, ModalDelete } from '../../components/singles'
import { RegisterUserForm, EmpleadoForm, PermisosForm, ClienteUserForm } from '../../components/forms'
import swal from 'sweetalert'
import { setOptions } from '../../functions/setters'
import { forbiddenAccessAlert, errorAlert } from '../../functions/alert'
class Usuarios extends Component{
    constructor(props){
        super(props)
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
            tipo_empleado: 0,
            empresa:0,
            puesto:'',
            fecha_inicio: new Date,
            estatus: '',
            rfc: '',
            nss: '',
            curp: '',
            banco: '',
            cuenta: '',
            clabe: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            departamentos: [],
            departamento: ''
        },
        clienteForm:{
            proyectos: [],
            proyecto: ''
        },
        proyectos: [],
        departamentos: [],
        options: [],
        data:{
            proyectos: []
        },
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
            return pathname === url
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
            empleadoForm: this.clearEmpleadoForm()
        })
    }

    clearEmpleadoForm = () => {
        const { empleadoForm } = this.state
        let aux = Object.keys(empleadoForm)
        aux.map( (element) => {
            switch(element){
                case 'fecha_inicio':
                    empleadoForm[element] = new Date()
                    break;
                case 'departamentos':
                    empleadoForm[element] = []
                    break;
                case 'tipo_empleado':
                case 'empresa':
                    empleadoForm[element] = 0
                    break;
                default:
                    empleadoForm[element] = ''
                    break;
            }
        })
        return empleadoForm;
    }

    // Functions to update users

    updateUser = (e) => (user) => {
        const { name, email, tipo, departamentos  } = user
        let form = {
            name: name,
            email: email,
            tipo: tipo
        }
        if(departamentos.length){
            const { empleadoForm } = this.state
            empleadoForm.departamentos = setOptions(departamentos, 'nombre', 'id')
            this.setState({
                ... this.state,
                modalUpdateUser: true,
                user_to_interact: user,
                form,
                empleadoForm
            })
        }else{
            this.setState({
                ... this.state,
                modalUpdateUser: true,
                user_to_interact: user,
                form
            })
        }
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
        /* e.preventDefault(); */
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

    onChangeCliente = (e) => {
        const { name, value } = e.target
        const { clienteForm, form }  = this.state
        clienteForm[name] = value
        this.setState({
            ... this.state,
            clienteForm,
            form
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { name, value } = e.target
        const { clienteForm } = this.state
        let { proyectos } = this.state
        let auxArray = clienteForm[arreglo]
        let aux = []
        proyectos.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        proyectos = aux
        clienteForm[arreglo] = auxArray
        this.setState({
            ... this.state,
            clienteForm,
            proyectos
        })
    }

    onChangeOptionsEmpleado = (e, arreglo) => {
        const { name, value } = e.target
        const { empleadoForm } = this.state
        let { departamentos } = this.state
        let auxArray = empleadoForm[arreglo]
        let aux = []
        departamentos.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        departamentos = aux
        empleadoForm[arreglo] = auxArray
        this.setState({
            ... this.state,
            empleadoForm,
            departamentos
        })
    }

    deleteOption = (element, array, tipo) => {
        if(tipo === 'empleado'){
            const { empleadoForm } = this.state
            let _array = []
            let auxiliar = ''
            empleadoForm[array].find( function(aux, key){
                if(aux.value === element.value){
                    if(auxiliar === '')
                    auxiliar = key
                }
            })
            empleadoForm[array].map((elemento, key) => {
                if(auxiliar !== key){
                    _array.push(elemento)
                }
            })
            empleadoForm[array] = _array
            this.setState({
                ... this.state,
                empleadoForm
            })
        }
        if(tipo === 'cliente'){

        }
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
            empleadoForm: this.clearEmpleadoForm()
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
            empleadoForm: this.clearEmpleadoForm()
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
        const { form, empleadoForm, clienteForm } = this.state
        form.empleado = empleadoForm
        form.proyectos = clienteForm.proyectos
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
                    clienteForm:{
                        proyecto: '',
                        proyectos: []
                    },
                    empleadoForm: this.clearEmpleadoForm()
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
                    empleadoForm: this.clearEmpleadoForm()
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

    //Delete an user with id
    async deleteUserAxios(user){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'user/' +user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    empleadoForm: this.clearEmpleadoForm()
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

    async getUsers(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { users, proyectos, departamentos } = response.data
                const { data } = this.state
                data.proyectos = proyectos
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
                this.setState({
                    ... this.state,
                    proyectos: setOptions(proyectos, 'nombre', 'id'),
                    departamentos: setOptions(departamentos, 'nombre', 'id'),
                    data
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
        const { users, modalActive, form, options, modalSafeDeleteActive, user_to_interact, modalUpdateUser, form: { tipo : tipo_form }, empleadoForm, clienteForm, proyectos, empresas_options, modalPermisos, departamentos } = this.state;
        return(
            <>
                <Layout active={'usuarios'}  { ...this.props}>
                    {/* <NewTable  columns={EMPRESA_COLUMNS} data = { empresas } 
                        title = 'LISTADO DE USUARIOS REGISTRADOS' subtitle = 'Listado de administradores, empleados y clientes'
                        mostrar_boton={true}
                        abrir_modal={true}
                        onClick={this.addUser()}
                        mostrar_acciones={true} 
                            actions = {{
                                'edit': {},
                                'delete': {},
                                'permisos':{}
                            }}
                        elements = { data.empresas }
                        idTable = 'kt_datatable_usuarios'
                    /> */}

                    <div className="d-flex align-items-center mb-2 flex-column flex-md-row justify-content-md-between">
                        <Title className="text-center">
                            Listado de usuarios registrados
                        </Title>
                        <div className="mt-3 mt-md-0 ml-auto">
                            <Button onClick={this.addUser()} text='' className="" icon={faUserPlus}
                                tooltip={{id:'add', text:'Nuevo'}} />
                        </div>
                        
                    </div>
                    {
                        users.map((tipo_users, key) => {
                            return(
                                <div key={key} className="col-md-12">
                                    <Subtitle>
                                        {tipo_users.tipo}
                                    </Subtitle>
                                    <div className="row py-3 mx-0">
                                        {
                                            tipo_users.usuarios.map((user, _key) => {
                                                return(
                                                    <div className="col-md-6 col-xl-3 col-12 mb-2 px-0" key={_key}>
                                                        <Card className="mx-3" >
                                                            <Button onClick={(e) => { this.changePermisos(e)(user) }} icon={faKey} className="mr-2" color="gold-no-bg"
                                                                tooltip={{id:'permisos', text:'Permisos de usuario'}} />
                                                            <div className="text-center">
                                                                <P>
                                                                    {user.name}
                                                                </P>

                                                                <Small>
                                                                    {user.email}
                                                                </Small>
                                                            </div>
                                                            <div className="d-flex justify-content-between mt-3">
                                                                <Button icon='' onClick={(e) => { this.updateUser(e)(user) }} icon={faUserEdit} className="mr-2" color="blue"
                                                                    tooltip={{id:'edit', text:'Editar'}} />
                                                                <Button icon='' onClick={(e) => { this.deleteuser(e)(user) }} icon={faUserSlash} color="red"
                                                                    tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
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
                    <Modal size="xl" title="Registrar usuario" show={modalActive} handleClose={this.handleCloseModal}>
                        <RegisterUserForm className="px-3" form={ form } options={options} onSubmit={ this.handleSubmitAddUser} 
                            onChange={(e) => {e.preventDefault(); this.handleChangeInput(e)}}>
                            {
                                tipo_form < 3 && tipo_form > 0 &&
                                <EmpleadoForm 
                                    form={empleadoForm} 
                                    onChange={this.handleChangeEmpleado}
                                    options = { {empresas: empresas_options, departamentos: departamentos} }
                                    title="Datos del empleado" 
                                    onChangeCalendar={this.handleChangeDate}
                                    onChangeOptions = { this.onChangeOptionsEmpleado }
                                    deleteOption = { this.deleteOption }
                                    />
                            }
                            {
                                tipo_form === '3' ?
                                    <ClienteUserForm
                                        form = { clienteForm }
                                        options = { {proyectos: proyectos} }
                                        title = 'Datos del cliente'
                                        onChange = { this.onChangeCliente }
                                        onChangeOptions = { this.onChangeOptions }
                                        />
                                : ''
                            }
                        </RegisterUserForm>
                    </Modal>
                    <Modal title="Editar usuario" size="xl" show={modalUpdateUser} handleClose={this.handleCloseModalUpdateUser}>
                        <RegisterUserForm form={ form } options={options} className="px-3" onSubmit={ this.handleSubmitEditUser } 
                            onChange={(e) => {e.preventDefault(); this.handleChangeInput(e)}}>
                            {
                                tipo_form < 3 && tipo_form > 0 &&
                                <EmpleadoForm 
                                    form={empleadoForm} 
                                    onChange={this.handleChangeEmpleado}
                                    options = { {empresas: empresas_options, departamentos: departamentos} }
                                    title="Datos del empleado" 
                                    onChangeCalendar={this.handleChangeDate}
                                    onChangeOptions = { this.onChangeOptionsEmpleado }
                                    deleteOption = { this.deleteOption }
                                    />
                            }
                            {
                                tipo_form === '3' ?
                                    <ClienteUserForm
                                        form = { clienteForm }
                                        options = { {proyectos: proyectos} }
                                        title = 'Datos del cliente'
                                        onChange = { this.onChangeCliente }
                                        onChangeOptions = { this.onChangeOptions }
                                        />
                                : ''
                            }
                        </RegisterUserForm>
                    </Modal>
                    <ModalDelete title= {user_to_interact === null ? "¿Estás seguro que deseas eliminar a ": "¿Estás seguro que deseas eliminar a "+user_to_interact.name +" ?"}  show={modalSafeDeleteActive} handleClose={this.handleCloseSafeModal} onClick={(e) => { this.deleteSafeUser(e)(user_to_interact.id) }}>
                    </ModalDelete>
                    <Modal size="lg" title="Permisos de usuario"  show={modalPermisos} handleClose={this.handleCloseModalPermisos}>
                        <PermisosForm {... this.props} handleClose={this.handleCloseModalPermisos} user={user_to_interact.id}/>
                    </Modal>
                </Layout>
            </>
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