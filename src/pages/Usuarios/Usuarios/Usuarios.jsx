import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, USUARIOS, CLIENTES } from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import { RegisterUserForm, PermisosForm } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions, setSelectOptions, setTextTableReactDom, setTagLabelReactDom } from '../../../functions/setters'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert, customInputAlert, questionAlertWithLottie } from '../../../functions/alert'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import FloatButtons from '../../../components/singles/FloatButtons'
import { setTextTableCenter } from '../../../functions/setters'
import { Tabs, Tab } from 'react-bootstrap' 
import { UsuarioCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { InputGray } from '../../../components/form-components'
import { setSingleHeader } from '../../../functions/routers'
import $ from "jquery";
import { Lock } from '../../../assets/animate'

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
            inhabilitados: false,
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
        },
        detenidos: [],
        departamentos_disponibles:[],
        proyectos_disponibles:[],
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

    getUsuariosAxios = () => {
        const { key } = this.state
        if(key === 'administrador')
            this.getAdministradorAxios()
        if(key === 'empleados')
            this.getEmpleadosAxios()
        if(key === 'clientes')
            this.getClientesAxios()
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

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users/options', { responseType: 'json', headers: setSingleHeader(access_token) }).then(
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                            name: setTextTableReactDom(user.name, this.doubleClick, user, 'name', 'text-center'),
                            email: setTextTableReactDom(user.email, this.doubleClick, user, 'email', 'text-center'),
                            departamento: user.departamentos.length === 0 ? 
                                setTextTableCenter("Sin definir") 
                                : setTagLabelReactDom(user, user.departamentos, 'departamento', this.deleteElementAxios, ''),
                            id: user.id
                        }
                    )
                }
                else {
                    aux.push(
                        {
                            actions: this.setActions(user),
                            name: setTextTableReactDom(user.name, this.doubleClick, user, 'name', 'text-center'),
                            email: setTextTableReactDom(user.email, this.doubleClick, user, 'email', 'text-center'),
                            proyecto: user.proyectos.length === 0 ?  
                                setTextTableCenter("Sin definir") 
                                : setTagLabelReactDom(user, user.proyectos, 'proyecto', this.deleteElementAxios, ''),
                            id: user.id
                        }
                    )
                }
                return false
            })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        if(tipo){
            form[tipo] = data[tipo]
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { this.setSwalHeader(tipo) } </h2>
                {
                    (tipo === 'name') || (tipo === 'email') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchUsuario(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Adjuntos',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }

    deleteElementAxios = async(user, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/usuarios/usuarios/${user.id}/${tipo}/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if(key === 'administrador')
                    this.getAdministradorAxios()
                if(key === 'empleados')
                    this.getEmpleadosAxios()
                if(key === 'clientes')
                    this.getClientesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchUsuario = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/usuarios/update/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: setSingleHeader(access_token)  }).then(
            (response) => {
                const { key } = this.state
                if(key === 'administrador')
                    this.getAdministradorAxios()
                if(key === 'empleados')
                    this.getEmpleadosAxios()
                if(key === 'clientes')
                    this.getClientesAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    setSwalHeader = (tipo) => {
        switch(tipo){
            case 'name':
                return 'EDITAR EL USUARIO'
            case 'email':
                return 'EDITAR EL CORREO ELECTRÓNICO'
            case 'departamentos':
                return 'EDITAR EL DEPARTAMENTO'
            case 'proyectos':
                return 'EDITAR EL PROYECTO'
            default:
                return ''
        }
    }
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'departamentos':
                return options.departamentos
            case 'proyectos':
                return options.proyectos
            default: return []
        }
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
                },
                {
                    text: 'Inhabilitar&nbsp;usuario',
                    btnclass: 'dark',
                    iconclass: 'fas fa-user-lock',
                    action: 'inhabilitar',
                    tooltip: { id: 'inhabilitar', text: 'Inhabilitar usuario', type: 'info' },
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
    inhabilitar = (user) => {
        questionAlertWithLottie(
            `Inhabilitarás al usuario ${user.name}`,
            `¿DESEAS CONTINUAR?`,
            Lock,
            { confirm: 'SI', cancel: 'NO' },
            {
                cancel: null,
                success: () => this.inhabilitarUsuario(user, true)
            }
        )
    }

    async inhabilitarUsuario(user, estatus) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { key } = this.state
        let tipo = 0;
        switch(key){
            case 'administrador':
                tipo = 1;
                break;
            case 'empleados':
                tipo = 2;
                break;
            case 'clientes':
                tipo = 3;
                break;
            default: break;
        }
        await axios.put(`${URL_DEV}user/bloquear/${user.id}`, { detenido: estatus, tipo: tipo }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key, modal } = this.state
                
                modal.inhabilitar = false
                modal.inhabilitados = false

                if(key === 'administrador')
                    this.getAdministradorAxios()
                if(key === 'empleados')
                    this.getEmpleadosAxios()
                if(key === 'clientes')
                    this.getClientesAxios()
                if (estatus)
                    doneAlert('El usuario fue inhabilitado con éxito.')
                else
                    doneAlert('El usuario fue habilitado con éxito.')
                this.setState({...this.state,modal})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    habilitar = (user) => {
        questionAlertWithLottie(
            `Habilitarás al usuario ${user.name}`,
            `¿DESEAS CONTINUAR?`,
            Lock,
            { confirm: 'SI', cancel: 'NO' },
            {
                cancel: null,
                success: () => this.inhabilitarUsuario(user, false)
            }
        )
    }
    openModalHabilitar = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { key } = this.state
        let tipo = 0;
        switch(key){
            case 'administrador':
                tipo = 1;
                break;
            case 'empleados':
                tipo = 2;
                break;
            case 'clientes':
                tipo = 3;
                break;
            default: break;
        }
        await axios.get(`${URL_DEV}user/bloqueados/${tipo}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                const { users } = response.data

                modal.inhabilitados=true
                Swal.close();

                this.setState({
                    ...this.state,
                    modal,
                    title: 'Usuarios inhabilitados',
                    detenidos: users
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    handleCloseInhabilitados = () => {
        const { modal } = this.state
        modal.inhabilitados = false
        this.setState({
            ...this.state,
            modal
        })
    }
    render(){
        const { modal, title, user, form, options, key, detenidos } = this.state
        const { formulario } = this.props
        return (
            <Layout active = { 'usuarios' }  { ...this.props } >
                <Tabs id = "tabsUsuarios" defaultActiveKey="administrador" activeKey={key} onSelect = { (value) =>  { this.controlledTab(value)} }>
                    <Tab eventKey="administrador" title="Administrador">
                        <NewTableServerRender
                            columns={USUARIOS}
                            title='Administradores'
                            subtitle='Listado de administradores'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/usuarios/usuarios/add'
                            mostrar_acciones={true}
                            habilitar={true}
                            text_habilitar="HABILITAR ADMINISTRADOR"
                            icon_habilitar="fa-unlock-alt"
                            onClickHabilitar={this.openModalHabilitar}
                            actions={
                                {
                                    'edit': { function:this.changePageEdit},
                                    'delete': { function: this.openModalDelete },
                                    'permisos': { function: this.openModalPermisos},
                                    'see': { function: this.openModalSee },
                                    'inhabilitar': { function: this.inhabilitar }
                                }
                            }
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            /* urlRender={URL_DEV + 'user/users/admin'} */
                            urlRender = { `${URL_DEV}v2/usuarios/usuarios/table/admin` }
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
                            habilitar={true}
                            text_habilitar="HABILITAR EMPLEADO"
                            icon_habilitar="fa-unlock-alt"
                            onClickHabilitar={this.openModalHabilitar}
                            actions={{
                                'edit': { function:this.changePageEdit},
                                'delete': { function: this.openModalDelete },
                                'permisos': { function: this.openModalPermisos},
                                'see': { function: this.openModalSee },
                                'inhabilitar': { function: this.inhabilitar }
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            urlRender = { `${URL_DEV}v2/usuarios/usuarios/table/empleados` }
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
                            habilitar={true}
                            text_habilitar="HABILITAR CLIENTE"
                            icon_habilitar="fa-unlock-alt"
                            onClickHabilitar={this.openModalHabilitar}
                            actions={{
                                'edit': { function:this.changePageEdit},
                                'delete': { function: this.openModalDelete },
                                'permisos': { function: this.openModalPermisos},
                                'see': { function: this.openModalSee },
                                'inhabilitar': { function: this.inhabilitar }
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setUsers}
                            urlRender = { `${URL_DEV}v2/usuarios/usuarios/table/clientes` }
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
                <Modal title="Habilitar por empresa" show={modal.inhabilitados} handleClose={this.handleCloseInhabilitados} >
                    <div className="table-responsive mt-4">
                        <table className="table table-head-bg table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="w-auto">
                                        <div className="text-left text-muted font-size-sm d-flex justify-content-start">USUARIO</div>
                                    </th>
                                    <th className="text-muted font-size-sm">
                                        <div className=" text-muted font-size-sm d-flex justify-content-center">HABILITAR</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detenidos.length > 0 ?
                                        detenidos.map((detenido, key) => {
                                            return (
                                                <tr key={key} >
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                            {detenido.name}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-icon btn-light btn-text-primary btn-hover-text-dark font-weight-bold btn-sm mr-2"
                                                            onClick={(e) => { e.preventDefault(); this.habilitar(detenido) }} >
                                                            <i className="fas fa-unlock-alt text-dark-50"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td className='text-center' colSpan="2">
                                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                    NO HAY USUARIOS INHABILITADOS
                                                </span>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
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