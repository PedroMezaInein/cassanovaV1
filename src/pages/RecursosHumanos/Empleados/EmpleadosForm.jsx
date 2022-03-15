import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions} from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { EmpleadosForm as EmpleadosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { onChangeAdjunto } from '../../../functions/onChanges'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import moment from 'moment'
class EmpleadosForm extends Component {
    state = {
        formeditado: 0,
        key: 'administrativo',
        data: {
            adjuntos: []
        },
        adjuntos: [],
        title: 'Nuevo colaborador',
        form: {
            nombre: '',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo',
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            estatus_imss: 'Activo',
            puesto: '',
            vacaciones_disponibles: 0,
            fecha_alta_imss: '',
            numero_alta_imss: '',
            nomina_imss: 0.0,
            nomina_extras: 0.0,
            salario_hr: 0.0,
            salario_hr_extra: 0.0,
            email_personal: '',
            estacionamiento: 0.0,
            gimnacio: 0.0,
            estudios: 0.0,
            adjuntos: {
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
            },
            departamentos: [],
            departamento: '',
            nacionalidad: '',
            fecha_nacimiento: '',
            estado_civil: '',
            domicilio: '',
            telefono_movil: '',
            telefono_particular: '',
            salario_imss: '',
            salario_bruto:'',
            imss: 0.0,
            rcv: 0.0,
            infonavit: 0.0,
            isn: 0.0
        },
        options: {
            empresas: [],
            departamentos: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const empleado = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo colaborador',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.empleado) {
                        const { form, options} = this.state
                        const { empleado } = state
                        console.log(empleado)
                        form.nombre = empleado.nombre
                        form.curp = empleado.curp
                        form.rfc = empleado.rfc
                        form.nss = empleado.nss
                        form.nombre_emergencia = empleado.nombre_emergencia
                        form.telefono_emergencia = empleado.telefono_emergencia
                        form.banco = empleado.banco
                        form.cuenta = empleado.cuenta
                        form.clabe = empleado.clabe
                        form.tipo_empleado = empleado.tipo_empleado
                        form.estatus_empleado = empleado.estatus_empleado
                        form.nomina_imss = empleado.nomina_imss
                        form.nomina_extras = empleado.nomina_extras
                        form.salario_hr = empleado.salario_hr
                        form.salario_hr_extra = empleado.salario_hr_extra
                        form.email_personal = empleado.email_personal
                        form.estacionamiento = empleado.estacionamiento
                        form.gimnacio = empleado.gimnacio
                        form.estudios = empleado.estudios

                        if (empleado.empresa) { form.empresa = empleado.empresa.id.toString() }
                        form.fechaInicio = empleado.fecha_inicio !== null ? new Date(moment(empleado.fecha_inicio)):''
                        form.fechaFin = empleado.fecha_fin !== null ? new Date(moment(empleado.fecha_fin)):''
                        form.puesto = empleado.puesto
                        form.estatus_imss = this.showStatusImss(empleado.estatus_imss);
                        form.vacaciones_disponibles = empleado.vacaciones_disponibles
                        form.fecha_alta_imss =  new Date(empleado.fecha_alta_imss)
                        form.numero_alta_imss = empleado.numero_alta_imss
                        form.departamentos = []
                        form.nacionalidad = empleado.nacionalidad
                        if(moment(empleado.fecha_nacimiento).isValid())
                            form.fecha_nacimiento = new Date(moment(empleado.fecha_nacimiento))
                        else
                            form.fecha_nacimiento = new Date()
                        form.domicilio = empleado.domicilio
                        form.telefono_movil = empleado.telefono_movil
                        form.telefono_particular = empleado.telefono_particular
                        form.salario_imss = empleado.salario_imss
                        form.salario_bruto = empleado.salario_bruto
                        form.estado_civil = empleado.estado_civil
                        empleado.departamentos.forEach((elemento) => {
                            form.departamentos.push({
                                value: elemento.id.toString(),
                                name: elemento.nombre,
                                label: elemento.nombre
                            })
                        })
                        form.imss = empleado.imss
                        form.rcv = empleado.rcv
                        form.infonavit = empleado.infonavit
                        form.isn = empleado.isn
                        this.setState({
                            ...this.state,
                            form,
                            options,
                            empleado: empleado,
                            title: 'Editar colaborador',
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/rh/colaboradores')
                } else
                    history.push('/rh/colaboradores')
                break;
            default:
                break;
        }
        if (!empleado)
            history.push('/')
        this.getOptionsAxios();
    }
    showStatusImss(valor) {
        let texto = '';
        switch (valor) {
            case 0:
                texto = 'Inactivo'
                break;
            case 1:
                texto = 'Activo'
                break;
            default:
                break;
        }
        return texto
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, departamentos } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['departamentos'] = setOptions(departamentos, 'nombre', 'id')
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
    async addEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fecha_nacimiento':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'fechaFin':
                case 'fecha_alta_imss':
                    if (form[element])
                        data.append(element, (new Date(form[element])).toDateString())
                    else
                        data.append(element, '')
                    break;
                case 'adjuntos':
                    break;
                case 'departamentos':
                    form.departamentos.forEach((elemento) => {
                        data.append(`${element}[]`, elemento.value)
                    }) 
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
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
            return false
        })
        await axios.post(`${URL_DEV}v2/rh/empleados`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El colaborador fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/rh/colaboradores' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async updateEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, empleado } = this.state
        await axios.put(`${URL_DEV}v2/rh/empleados/${empleado.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El colaborador fue modificado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/rh/colaboradores' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    clearForm = () => {
        const { form, key } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
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
                case 'nomina_imss':
                case 'salario_hr':
                case 'salario_hr_extra':
                case 'vacaciones_tomadas':
                case 'imss':
                case 'rcv':
                case 'infonavit':
                case 'isn':
                    form[element] = 0
                    break;
                case 'tipo_empleado':
                    if (key === 'obra')
                        form[element] = 'Obra'
                    else
                        form[element] = 'Administrativo'
                    break;
                case 'departamentos':
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
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar colaborador')
            this.updateEmpleadoAxios()
        else
            this.addEmpleadoAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
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
            ...this.state,
            form
        })
    }
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }
    deleteOption = (element, array) => {
        let { form } = this.state
        let auxForm = []
        form[array].map((elemento, key) => {
            if (element !== elemento) {
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
    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { options, title, form, formeditado} = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <EmpleadosFormulario
                            formeditado={formeditado}
                            options={options}
                            form={form}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            onChangeAdjunto={ (e) => { this.setState({...this.state,form: onChangeAdjunto(e, form) });}}
                            clearFiles={this.clearFiles}
                            title={title}
                            onChangeRange={this.onChangeRange}
                            deleteOption = { this.deleteOption }
                            onChangeOptions = { this.onChangeOptions }
                            handleChange = { this.handleChange }
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(EmpleadosForm);