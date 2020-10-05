import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { RegisterUserForm } from '../../../components/forms'
import swal from 'sweetalert'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { Card } from 'react-bootstrap'

const $ = require('jquery');

class UsuariosForm extends Component {

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
            proyecto: '',
            empleado: ''
        },
        options:{
            tipos: [],
            proyectos: [],
            departamentos: [],
            empleados: []
        },
        data:{
            proyectos: [],
            departamentos: [],
            users:[],
        },
        formeditado: 0,
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const usuarios = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Registrar nuevo usuario',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.user)
                    {
                        const { form, options } = this.state
                        const { user } = state
                        
                        form.name = user.name
                        form.email = user.email
                        form.tipo = user.tipo
                        if((user.tipo===1||user.tipo===2)){
                            let aux = []
                            user.departamentos.map( (depto) => {
                                aux.push({
                                    value: depto.id.toString(),
                                    name: depto.nombre
                                })
                            })
                            form.departamentos = aux
                            if(user.empleado){
                                form.empleado = user.empleado.id.toString()
                            }
                            this.setState({
                                ... this.state,
                                form,
                                options,
                                user: user,
                                title: 'Editar usuario',
                                formeditado:1
                            })
                        }
                        else    
                        {  
                            let aux = []
                            user.proyectos.map( (proyecto) => {
                                aux.push({
                                    value: proyecto.id.toString(),
                                    name: proyecto.nombre
                                })
                            })
                            form.proyectos = aux
                            this.setState({
                                ... this.state,
                                form,
                                options,
                                user: user,
                                title: 'Editar usuario',
                                formeditado:1
                            })
                        }
                    }
                    else
                        history.push('/usuarios/usuarios')
                }else
                    history.push('/usuarios/usuarios')
                break;
            default:
                break;
        }
        if (!usuarios)
            history.push('/')
        this.getOptionsAxios();
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close() 
                const { tipos, departamentos, proyectos, empleados } = response.data
                const { options } = this.state

                options['departamentos'] = setOptions(departamentos, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tipos'] = setSelectOptions(tipos,'tipo' )
                options['empleados'] = setOptions(empleados, 'nombre', 'id')
                
                this.setState({
                    ... this.state,
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

                const { users } = response.data
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
                    ... this.state,
                    form: this.clearForm(),
                    users: users,
                    modal
                    
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.')

                const { history } = this.props
                    history.push({
                    pathname: '/usuarios/usuarios'
                });
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

                const { users } = response.data
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
                    ... this.state,
                    users: users,
                    modal,
                    form: this.clearForm(),
                    user: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito al usuario.')

                const { history } = this.props
                    history.push({
                    pathname: '/usuarios/usuarios'
                });
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

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if(title === 'Editar usuario')
            this.updateUserAxios()
        else
            this.addUserAxios()
    }

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
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

    // deleteOption = (option, arreglo) => {
    //     const { form, options } = this.state
    //     let aux = []
    //     form[arreglo].map((element, key) => {
    //         if (option.value.toString() !== element.value.toString()) {
    //             aux.push(element)
    //         } else {
    //             options[arreglo].push(element)
    //         }
    //     })
    //     form[arreglo] = aux
    //     this.setState({
    //         ... this.state,
    //         options,
    //         form
    //     })
    // }
    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        options[arreglo] = aux
        form[arreglo] = auxArray
        // console.log(aux, 'aux') // Almacena las opciones no seleccionadas
        // console.log(auxArray, 'auxArray') // Almacena las opciones ya seleccionadas
        this.setState({
            ... this.state,
            form,
            options
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
            form.tipo_empleado = 1
        }
        if(value === 'empleados'){
            this.getEmpleadosAxios()
            form.tipo_empleado = 2
        }
        if(value === 'clientes'){
            this.getClientesAxios()
            form.tipo_empleado = 3
        }
        this.setState({
            ... this.state,
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
        })
        save({
            form: auxObject,
            page: 'usuarios/usuarios'
        })
    }

    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ... this.state,
            form: formulario.form
        })
        deleteForm()
    }    

    render(){
        const { title, form, options, formeditado} = this.state
        return (
            <Layout active = { 'usuarios' }  { ...this.props } >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <RegisterUserForm
                            form={form}
                            options = { options }
                            formeditado={formeditado}   
                            onSubmit = { this.onSubmit } 
                            onChange = { this.onChange }
                            onChangeOptions =  { this.onChangeOptions }
                            deleteOption = { this.deleteOption }
                            onChangeAndAdd={this.onChangeAndAdd}
                        />
                    </Card.Body>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(UsuariosForm);