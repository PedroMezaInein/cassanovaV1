import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { RegisterUserForm } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { Card } from 'react-bootstrap'
import $ from "jquery";
class UsuariosForm extends Component {

    state = {
        departamentos_disponibles:[],
        proyectos_disponibles:[],
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
            empleado: '',
            sexo: 'femenino'
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
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { match : { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const usuarios = permisos.find(function(element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ...this.state,
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
                        form.sexo = user.genero
                        if((user.tipo===1||user.tipo===2)){
                            let aux = []
                            user.departamentos.map( (depto) => {
                                aux.push({
                                    value: depto.id.toString(),
                                    name: depto.nombre
                                })
                                return false
                            })
                            form.departamentos = aux
                            if(user.empleado){
                                form.empleado = user.empleado.id.toString()
                            }
                            this.setState({
                                ...this.state,
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
                                return false
                            })
                            form.proyectos = aux
                            this.setState({
                                ...this.state,
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
                Swal.close() 
                const { tipos, departamentos, proyectos, empleados } = response.data
                const { options } = this.state

                options['departamentos'] = setOptions(departamentos, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tipos'] = setSelectOptions(tipos,'tipo' )
                options['empleados'] = setOptions(empleados, 'nombre', 'id')
                
                this.setState({
                    ...this.state,
                    options
                });
                this.showDepartamentos();
                this.showProyectos();
            },
            (error) => {
                printResponseErrorAlert(error)
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
                    ...this.state,
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
                printResponseErrorAlert(error)
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
                    ...this.state,
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
                printResponseErrorAlert(error)
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
            return false
        })
        return form;
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        }) 
        if(e.target.name==="departamento"){this.showDepartamentos();}
        if(e.target.name==="proyecto"){this.showProyectos();} 
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
            ...this.state,
            options
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        /* options[arreglo] = aux */
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
            if(element !== elemento)
                auxForm.push(elemento)
            return false
        })
        form[array] = auxForm
        this.setState({
            ...this.state,
            form
        });
        if(array==="departamentos"){this.showDepartamentos();}
        if(array==="proyectos"){  this.showProyectos();}
    }
    showDepartamentos = () => {
        const {  options, form } = this.state 
        let departamentos_disponibles=[]
        options.departamentos.forEach((departamento) => {
            let existe =false
            form.departamentos.forEach((departamentoForm) => {
                if (departamento.value ===departamentoForm.value) {
                    existe = true
                } 
            })  
            if(!existe){
                departamentos_disponibles.push(departamento)
            }
        })    
        this.setState({  ...this.state, departamentos_disponibles  })
        
    }
    
    showProyectos = () => {
        const {  options, form } = this.state 
        let proyectos_disponibles=[] 
        options.proyectos.forEach((proyecto) => {
            let existe =false
            form.proyectos.forEach((proyectoForm) => {
                if (proyecto.value ===proyectoForm.value) {
                    existe = true
                } 
            })  
            if(!existe){
                proyectos_disponibles.push(proyecto)
            }
        })    
        this.setState({   proyectos_disponibles  })
        
    }
    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
        if(arreglo==="departamentos"){this.showDepartamentos();}
        if(arreglo==="proyectos"){this.showProyectos();}
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
        const { title, form, options, formeditado,departamentos_disponibles, proyectos_disponibles} = this.state
        
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
                            departamentos_disponibles={departamentos_disponibles}
                            proyectos_disponibles={proyectos_disponibles}
                            options = {options}
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