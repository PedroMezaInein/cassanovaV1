import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert, deleteAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { SolicitudEgresosForm as SolicitudEgresosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class SolicitudEgresosForm extends Component {
    state = {
        title: 'Nueva solicitud de egreso',
        solicitud: '',
        options: {
            proveedores: [],
            empresas: [],
            subareas: [],
            tiposPagos: []
        },
        formeditado: 0,
        form: {
            proveedor: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva solicitud de egreso',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.solicitud) {
                        const { solicitud } = state
                        let aux = this.setSolicitud(solicitud)
                        this.setState({
                            ...this.state,
                            form: aux.form,
                            options: aux.options,
                            solicitud: solicitud,
                            title: 'Editar solicitud de egreso',
                            formeditado: 1,
                        })
                    }
                    else
                        history.push('/mercadotecnia/pagos')
                } else
                    history.push('/mercadotecnia/pagos')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    setSolicitud = solicitud => {
        const { form, options } = this.state
        if (solicitud.empresa)
            form.empresa = solicitud.empresa.id.toString()
        if (solicitud.tipo_pago)
            form.tipoPago = solicitud.tipo_pago.id
        if (solicitud.proveedor)
            form.proveedor = solicitud.proveedor.id.toString()
        if (solicitud.subarea)
            form.subarea = solicitud.subarea ? solicitud.subarea.id.toString() : ''
        if (solicitud.factura)
            form.factura = 'Con factura'
        else
            form.factura = 'Sin factura'
        form.descripcion = solicitud.descripcion
        form.fecha = new Date(solicitud.created_at)
        form.total = solicitud.monto
        if (solicitud.adjunto)
            form.adjuntos.adjunto.files = [ solicitud.adjunto ]
        else {
            form.adjuntos.adjunto.files = []
            form.adjuntos.adjunto.value = ''
        }
        let aux = [];
        aux.form = form
        aux.options = options
        return aux
    }
    
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({ ...this.state, form })
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
        this.setState({ ...this.state, form })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) aux.push(form['adjuntos'][name].files[counter])
        }
        if (aux.length < 1)
            form['adjuntos'][name].value = ''
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar solicitud de egreso') this.editSolicitudEgresoAxios()
        else this.addSolicitudEgresoAxios()
    }

    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }
    
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/solicitud-pagos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, subareas, tipos, proveedores } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['subareas'] = setOptions(subareas, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tipos, 'tipo')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    async addSolicitudEgresoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
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
        await axios.post(URL_DEV + 'mercadotecnia/solicitud-pagos', data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/pagos' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editSolicitudEgresoAxios() {
        const { access_token } = this.props.authUser
        const { form, solicitud } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'mercadotecnia/solicitud-pagos/update/' + solicitud.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/pagos' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAdjuntoAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { solicitud } = this.state
        waitAlert();
        await axios.delete(URL_DEV + 'mercadotecnia/solicitud-pagos/adjuntos/'+solicitud.id+'/'+id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El archivo fue eliminado con éxito.')
                const { solicitud } = response.data
                let aux = this.setSolicitud(solicitud)
                this.setState({
                    ...this.state,
                    form: aux.form,
                    solicitud: solicitud,
                    title: 'Editar solicitud de egreso',
                    formeditado: 1,
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { form, title, options, formeditado } = this.state
        return (
            <Layout active={'mercadotecnia'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <SolicitudEgresosFormulario title = { title } form = { form } onChange = { this.onChange }
                            options = { options } setOptions = { this.setOptions } onSubmit = { this.onSubmit }
                            clearFiles = { this.clearFiles } formeditado = { formeditado } className = "px-3"
                            handleChange = { this.handleChange } deleteFile = { this.deleteFile } />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudEgresosForm);