import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { SolicitudCompraForm as SolicitudCompraFormulario } from '../../../components/forms'
import { Card, Accordion } from 'react-bootstrap'
import { Button } from '../../../components/form-components'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { RemisionCard } from '../../../components/cards'
class SolicitudCompraForm extends Component {
    state = {
        title: 'Nueva solicitud de compra',
        solicitud: '',
        remision: '',
        options: {
            proveedores: [],
            proyectos: [],
            empresas: [],
            areas: [],
            subareas: [],
            tiposPagos: []
        },
        formeditado: 0,
        form: {
            proveedor: '',
            proyecto: '',
            area: '',
            subarea: '',
            empresa: '',
            descripcion: '',
            notas: '',
            total: '',
            remision: '',
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
                    title: 'Nueva solicitud de compra',
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
                            title: 'Editar solicitud de compra',
                            formeditado: 1,
                        })
                    }
                    else
                        history.push('/proyectos/solicitud-compra')
                } else
                    history.push('/proyectos/solicitud-compra')
                break;
            case 'convert':
                if (state) {
                    if (state.remision) {
                        const { remision } = state
                        let aux = this.setRemision(remision)
                        this.setState({
                            ...this.state,
                            form: aux.form,
                            options: aux.options,
                            remision: remision,
                            title: 'Convertir remisión en solicitud de compra',
                            formeditado: 1,
                        })
                    }
                    else
                        history.push('/proyectos/solicitud-compra')
                } else
                    history.push('/proyectos/solicitud-compra')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
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
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar solicitud de compra')
            this.editSolicitudCompraAxios()
        else
            this.addSolicitudCompraAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    setSolicitud = solicitud => {
        const { form, options } = this.state
        if (solicitud.empresa)
            form.empresa = solicitud.empresa.id.toString()
        if (solicitud.tipo_pago)
            form.tipoPago = solicitud.tipo_pago.id
        if (solicitud.proveedor)
            form.proveedor = solicitud.proveedor.id.toString()
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
        form.solicitud = solicitud.notas
        if (solicitud.adjunto) {
            form.adjuntos.adjunto.files = [{
                name: solicitud.adjunto.name,
                url: solicitud.adjunto.url
            }]
        }
        let aux = [];
        aux.form = form
        aux.options = options
        return aux
    }
    setRemision = remision => {
        const { form, options } = this.state
        if (remision.proyecto)
            form.proyecto = remision.proyecto.id.toString()
        if (remision.subarea) {
            if (remision.subarea.area) {
                form.area = remision.subarea.area.id.toString()
                if (remision.subarea.area.subareas) {
                    options['subareas'] = setOptions(remision.subarea.area.subareas, 'nombre', 'id')
                    form.subarea = remision.subarea.id.toString()
                }
            }
        }
        form.descripcion = remision.descripcion
        form.fecha = new Date(remision.created_at)
        let aux = []
        aux.form = form
        aux.options = options
        return aux
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'solicitud-compra/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, areas, tiposPagos, proveedores, proyectos } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
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

    async addSolicitudCompraAxios() {
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
        await axios.post(URL_DEV + 'solicitud-compra', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/solicitud-compra'
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

    async editSolicitudCompraAxios() {
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
        await axios.post(URL_DEV + 'solicitud-compra/update/' + solicitud.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/solicitud-compra'
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
        const { form, title, options, remision, formeditado } = this.state
        console.log(options)
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <SolicitudCompraFormulario
                            title={title}
                            form={form}
                            onChange={this.onChange}
                            options={options}
                            setOptions={this.setOptions}
                            onSubmit={this.onSubmit}
                            clearFiles={this.clearFiles}
                            formeditado={formeditado}
                            className="px-3"
                            handleChange={this.handleChange}
                        >
                            {
                                remision !== '' ?
                                    <Accordion>
                                        <div className="d-flex justify-content-end">
                                            <Accordion.Toggle as={Button} icon={faEye} pulse="pulse-ring" eventKey={0} className="btn btn-icon btn-light-info pulse pulse-info" />
                                        </div>
                                        <Accordion.Collapse eventKey={0} className="px-md-5 px-2" >
                                            <div>
                                                <RemisionCard data={remision} border={"border-nav mt-4 mb-5"} />
                                            </div>
                                        </Accordion.Collapse>
                                    </Accordion>
                                    : ''
                            }
                        </SolicitudCompraFormulario>
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

export default connect(mapStateToProps, mapDispatchToProps)(SolicitudCompraForm);