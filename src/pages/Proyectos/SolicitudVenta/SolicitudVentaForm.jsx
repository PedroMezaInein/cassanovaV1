import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions} from '../../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { SolicitudVentaForm as SolicitudVentaFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class SolicitudVentaForm extends Component {
    state = {
        title: 'Nueva solicitud de compra',
        solicitud: '',
        solicitudes: [],
        data: {
            solicitudes: [],
            clientes: []
        },
        formeditado: 0,
        options: {
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: [],
            clientes: [],
            estatusFacturas: [],
            metodosPago: [],
            formasPago: []
        },
        form: {
            cliente: '',
            rfc: '',
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            concepto: '',
            email: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            total: '',
            remision: '',
            fecha: new Date(),
            tipoPago: 0,
            factura: 'Sin factura',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
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
        const solicitud = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        })
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva solicitud de venta',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.solicitud) {
                        const { solicitud } = state
                        const { form, options } = this.state
                        if (solicitud.empresa)
                            form.empresa = solicitud.empresa.id.toString()
                        if (solicitud.tipo_pago)
                            form.tipoPago = solicitud.tipo_pago.id
                        if (solicitud.proyecto)
                            form.proyecto = solicitud.proyecto.id.toString()
                        if (solicitud.subarea) {
                            if (solicitud.subarea.area) {
                                form.area = solicitud.subarea.area.id.toString()
                                if (solicitud.subarea.area.subareas) {
                                    options['subareas'] = setOptions(solicitud.subarea.area.subareas, 'nombre', 'id')
                                    form.subarea = solicitud.subarea.id.toString()
                                }
                            }
                        }
                        if (solicitud.factura)
                            form.factura = 'Con factura'
                        else
                            form.factura = 'Sin factura'
                        form.descripcion = solicitud.descripcion
                        form.fecha = new Date(solicitud.created_at)
                        form.total = solicitud.monto
                        if (solicitud.adjunto) {
                            form.adjuntos.adjunto.files = [{
                                name: solicitud.adjunto.name,
                                url: solicitud.adjunto.url
                            }]
                        }
                        this.setState({
                            ...this.state,
                            title: 'Editar solicitud de venta',
                            formeditado: 1,
                            form,
                            options,
                            solicitud: solicitud
                        })
                    }
                    else
                        history.push('/proyectos/solicitud-venta')
                } else
                    history.push('/proyectos/solicitud-venta')
                break;
            default:
                break;
        }
        if (!solicitud)
            history.push('/')
        this.getOptionsAxios()
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'tipoPago':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'adjuntos':
                    form['adjuntos'].adjunto.value = ''
                    form['adjuntos'].adjunto.files = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar solicitud de venta')
            this.editSolicitudVentaAxios()
        else
            this.addSolicitudVentaAxios()
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
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-venta/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, areas, tiposPagos, proyectos, clientes, metodosPago, formasPago, estatusFacturas } = response.data
                const { options } = this.state
                // data.solicitudes = solicitudes
                // data.clientes = clientes
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                this.setState({
                    ...this.state,
                    options,
                    // solicitudes: this.setSolicitudes(solicitudes),
                    // data
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
    async addSolicitudVentaAxios() {
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
        await axios.post(URL_DEV + 'solicitud-venta', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                // const { solicitudes } = response.data
                // const { data } = this.state
                // data.solicitudes = solicitudes
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/solicitud-venta'
                });
                // this.setState({
                //     ...this.state,
                //     form: this.clearForm(),
                //     solicitud: '',
                //     solicitudes: this.setSolicitudes(solicitudes),
                //     title: 'Nueva solicitud de venta',
                //     data
                // })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async editSolicitudVentaAxios() {
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
        await axios.post(URL_DEV + 'solicitud-venta/update/' + solicitud.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                // const { solicitudes } = response.data
                // const { data } = this.state
                // data.solicitudes = solicitudes
                doneAlert(response.data.message !== undefined ? response.data.message : 'La solicitud fue editado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/solicitud-venta'
                });
                // this.setState({
                //     ...this.state,
                //     form: this.clearForm(),
                //     solicitud: '',
                //     solicitudes: this.setSolicitudes(solicitudes),
                //     title: 'Nueva solicitud de venta',
                //     data
                // })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
        const { title, form, options, formeditado } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <SolicitudVentaFormulario
                            title={title}
                            form={form}
                            options={options}
                            setOptions={this.setOptions}
                            onChange={this.onChange}
                            clearFiles={this.clearFiles}
                            onSubmit={this.onSubmit}
                            formeditado={formeditado}
                            className="px-3"
                            handleChange={this.handleChange}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudVentaForm);