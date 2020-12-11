import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import { RegisterUserForm, PermisosForm } from '../../../components/forms'
import Swal from 'sweetalert2'
import swal from 'sweetalert'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { USUARIOS, CLIENTES } from '../../../constants'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import FloatButtons from '../../../components/singles/FloatButtons'
import { setTextTable,setListTable } from '../../../functions/setters'
import { renderToString } from 'react-dom/server'
import { Tabs, Tab } from 'react-bootstrap' 
import { UsuarioCard } from '../../../components/cards'

const $ = require('jquery');

class Usuarios extends Component {

    state = {
        key: 'administrador',
        users: [],
        user: '',
        modal: {
            form: false,
            delete: false,
            permisos: false,
            see: false,
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
            departamentos: [],
            users:[],
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const usuarios = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!usuarios)
            history.push('/')
        this.getOptionsAxios();
    }

    changePageEdit = user => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/usuarios/edit',
            state: { user: user}
        });
    }

    openModalDelete = user => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            user: user
        })
    }

    openModalPermisos = user => {
        const { modal } = this.state
        modal.permisos = true
        this.setState({
            ...this.state,
            modal,
            user: user
        })
    }

    openModalSee = user => {
        const { modal} = this.state
        modal.see =true
        this.setState({
            ...this.state,
            modal,
            user: user
        })
    }

    handleCloseSee = () => {
        const { modal} = this.state
        modal.see =false
        this.setState({
            ...this.state,
            modal,
            user: ''
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close() 
                const { tipos, departamentos, proyectos } = response.data
                const { options } = this.state

                options['departamentos'] = setOptions(departamentos, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tipos'] = setSelectOptions(tipos,'tipo' )
                
                this.setState({
                    ...this.state,
                    options
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
        const { deleteForm } = this.props
        const { form } = this.state
        
        await axios.post(URL_DEV + 'user', form, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {

                deleteForm()

                const { modal, key} = this.state
                modal.form = false
                if(key === 'administrador'){
                    this.getAdministradorAxios()
                }
                if(key === 'empleados'){
                    this.getEmpleadosAxios()
                }
                if(key === 'clientes'){
                    this.getClientesAxios()
                }
                
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    modal
                    
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.')

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
        const { deleteForm } = this.props
        const { form, user } = this.state
        await axios.put(URL_DEV + 'user/' + user.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                deleteForm()

                // const { users } = response.data
                const { modal, key } = this.state

                if(key === 'administrador'){
                    this.getAdministradorAxios()
                }
                if(key === 'empleados'){
                    this.getEmpleadosAxios()
                }
                if(key === 'clientes'){
                    this.getClientesAxios()
                }

                modal.form = false
                
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    user: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito al usuario.')

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
                
                // const { users } = response.data
                const { modal, key } = this.state

                if(key === 'administrador'){
                    this.getAdministradorAxios()
                }
                if(key === 'empleados'){
                    this.getEmpleadosAxios()
                }
                if(key === 'clientes'){
                    this.getClientesAxios()
                }

                modal.delete = false
                
                this.setState({
                    ...this.state,
                    modal,
                    form: this.clearForm(),
                    user: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al usuario.')
                
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

    handleClose = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            user: ''
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            user: ''
        })
    }

    handleCloseModalPermisos = () => {
        const { modal } = this.state
        modal.permisos = false
        this.setState({
            ...this.state,
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
            return false
        })
        return form;
    }

    setUsers = users => {
        let aux = []
        if (users)
            users.map((user) => {
                if ((user.tipo === 1 || user.tipo === 2)) {
                    aux.push(
                        {
                            actions: this.setActions(user),
                            name: renderToString(setTextTable(user.name)),
                            email: renderToString(setTextTable(user.email)),
                            departamento: renderToString(user.departamentos.length === 0 ? setTextTable("Sin definir"): setListTable(user.departamentos, "nombre")),
                            id: user.id
                        }
                    )
                }
                else {
                    aux.push(
                        {
                            actions: this.setActions(user),
                            name: renderToString(setTextTable(user.name)),
                            email: renderToString(setTextTable(user.email)),
                            proyecto: renderToString(user.proyectos.length === 0 ? setTextTable("Sin definir") : setListTable(user.proyectos, "nombre")),                            
                            id: user.id
                        }
                    )
                }
                return false
            })
        return aux
    }

    setActions= () => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                },
                {
                    text: 'Mostrar&nbsp;información',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-magnifier-tool',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'info'},
                },
                {
                    text: 'Permisos',
                    btnclass: 'info',
                    iconclass: 'flaticon2-accept',
                    action: 'permisos',
                    tooltip: { id: 'permisos', text: 'Permisos' }
                }
        ) 
        return aux 
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
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

    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
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
            return false
        })
        form[array] = auxForm
        this.setState({
            ...this.state,
            form
        })
    }

    async getAdministradorAxios() {
        $('#admin_table').DataTable().ajax.reload();
    }

    async getEmpleadosAxios() {
        $('#empleados_table').DataTable().ajax.reload();
    }

    async getClientesAxios() {
        $('#clientes_table').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if(value === 'administrador'){
            this.getAdministradorAxios()
        }
        if(value === 'empleados'){
            this.getEmpleadosAxios()
        }
        if(value === 'clientes'){
            this.getClientesAxios()
        }
        this.setState({
            ...this.state,
            key: value,
            form
        })
    }

    save = () => {
        const { form } = this.state
        const { save } = this.props
        let auxObject = {}
        let aux = Object.keys(form)
        aux.map((element) => {
            auxObject[element] = form[element]
            return false
        })
        save({
            form: auxObject,
            page: 'usuarios/usuarios'
        })
    }

    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ...this.state,
            form: formulario.form
        })
        deleteForm()
    }

    render(){
        const { modal, title, user, form, options, key} = this.state
        const { formulario } = this.props
        return (
            <Layout active = { 'usuarios' }  { ...this.props } >
                <Tabs defaultActiveKey="administrador" activeKey={key} onSelect = { (value) =>  { this.controlledTab(value)} }>
                    <Tab eventKey="administrador" title="Administrador">
                        <NewTableServerRender
                            columns={USUARIOS}
                            title='Administradores'
                            subtitle='Listado de administradores'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/usuarios/usuarios/add'
                            mostrar_acciones={true}
                            actions={
                                {
                                    'edit': { function:this.changePageEdit},
                                    'delete': { function: this.openModalDelete },
                                    'permisos': { function: this.openModalPermisos},
                                    'see': { function: this.openModalSee },
                                }
                            }
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            urlRender={URL_DEV + 'user/users/admin'}
                            idTable='admin_table'
                            cardTable='cardTable_admin'
                            cardTableHeader='cardTableHeader_admin'
                            cardBody='cardBody_admin'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="empleados" title="Empleados">
                        <NewTableServerRender
                            columns={USUARIOS}
                            title='Empleados'
                            subtitle='Listado de empleados'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/usuarios/usuarios/add'
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function:this.changePageEdit},
                                'delete': { function: this.openModalDelete },
                                'permisos': { function: this.openModalPermisos},
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            urlRender={URL_DEV + 'user/users/empleados'}
                            idTable='empleados_table'
                            cardTable='cardTable_empleados'
                            cardTableHeader='cardTableHeader_empleados'
                            cardBody='cardBody_empleados'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="clientes" title="Clientes">
                        <NewTableServerRender
                            columns={CLIENTES}
                            title='Clientes'
                            subtitle='Listado de clientes'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/usuarios/usuarios/add'
                            onClick={this.openModal}
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function:this.changePageEdit},
                                'delete': { function: this.openModalDelete },
                                'permisos': { function: this.openModalPermisos},
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            urlRender={URL_DEV + 'user/users/clientes'}
                            idTable='clientes_table'
                            cardTable='cardTable_clientes'
                            cardTableHeader='cardTableHeader_clientes'
                            cardBody='cardBody_clientes'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>

                <Modal size="xl" title = { title } 
                    show = { modal.form } 
                    handleClose = { this.handleClose } >
                    <div className="position-relative">
                        <div>
                            <FloatButtons save = { this.save } recover =  { this.recover } formulario = { formulario } url = { 'usuarios/usuarios' } />
                        </div>
                        <RegisterUserForm 
                            className = 'px-3' form = { form } options = { options }
                            onSubmit = { this.onSubmit } onChange = { this.onChange }
                            onChangeOptions =  { this.onChangeOptions }
                            deleteOption = { this.deleteOption }
                            />
                    </div>
                </Modal>
                <ModalDelete 
                    title = { user === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + user.name + " ?"} 
                    show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteUserAxios() }}>
                </ModalDelete>

                <Modal size = "lg" title = "Permisos de usuario" 
                    show = { modal.permisos } 
                    handleClose = { this.handleCloseModalPermisos } >
                    <PermisosForm {...this.props} handleClose={this.handleCloseModalPermisos} user = {user.id} />
                </Modal>
                <Modal size="lg" title="Empleado" show = { modal.see } handleClose = { this.handleCloseSee } >
                    <UsuarioCard user={user}/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}

const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);