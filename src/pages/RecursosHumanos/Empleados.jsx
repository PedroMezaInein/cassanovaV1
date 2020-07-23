import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal} from '../../components/singles' 
import { EMPLEADOS_COLUMNS, URL_DEV} from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { EmpleadosForm } from '../../components/forms'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'

class Empleados extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nuevo empleado',
        form:{
            nombre:'',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo' ,
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date,
            fechaFin: '',
            estatus_imss: 'Activo',
            puesto:'',
            vacaciones_tomadas:0, 
            fecha_alta_imss: new Date(),
            numero_alta_imss: '',
            adjuntos:{
                datosGenerales:{
                    value: '',
                    placeholder: 'Datos generales',
                    files: []
                },
                recibosNomina:{
                    value: '',
                    placeholder: 'Recibos de Nómina',
                    files: []
                },
                altasBajas:{
                    value: '',
                    placeholder: 'Altas y bajas',
                    files: []
                }
            }
        },
        options: { 
            empresas:[]
        },
        empleados:""
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const empleados = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!empleados)
            history.push('/')
            this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
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

    async addEmpleadoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                case 'fecha_alta_imss':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break; 
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        await axios.post(URL_DEV + 'rh/empleado', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El empleado fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                history.push({
                    pathname: '/rh/empleados'
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
    
    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            form: this.clearForm(),
            formeditado:0
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ... this.state,
            modal, 
            form: this.clearForm()
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fecha_alta_imss':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        datosGenerales: {
                            value: '',
                            placeholder: 'Datos generales',
                            files: []
                        },
                        recibosNomina: {
                            value: '',
                            placeholder: 'Recibos de Nómina',
                            files: []
                        },
                        altasBajas: {
                            value: '',
                            placeholder: 'Altas y bajas',
                            files: []
                        }
                    }
                    break;
                case 'estatus_empleado':
                case 'estatus_imss':
                    form[element] = 'Activo'
                    break;
                case 'vacaciones_tomadas':
                    form[element] = 0
                    break;
                case 'tipo_empleado':
                    form[element] = 'Administrativo'
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
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

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
        
    onSubmit = e => {
        e.preventDefault()
        this.addEmpleadoAxios()
    }

    render() {
        const { modal, options, title, data, form, formeditado} = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTable   
                    columns = { EMPLEADOS_COLUMNS } data = { "" } 
                    title = 'Empleados' subtitle = 'Listado de empleados'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={true} 
                    actions = {{
                    }}
                    elements = { "" }
                />

                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <EmpleadosForm
                        formeditado={formeditado}
                        className=" px-3 "   
                        options = { options }
                        form ={form}
                        onChange = { this.onChange } 
                        onSubmit = { this.onSubmit }
                        onChangeAdjunto = { this.onChangeAdjunto }
                        clearFiles = { this.clearFiles }
                    >
                    </EmpleadosForm>
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

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);