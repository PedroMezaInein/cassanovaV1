import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { RendimientoForm as RendimientoFormulario } from '../../../components/forms'
class RendimientoForm extends Component {
    state = {
        title: 'Nuevo rendimiento',
        options: {
            proveedores: [],
            unidades: []
        },
        formeditado: 0,
        form: {
            unidad: '',
            proveedor: '',
            descripcion: '',
            materiales: '',
            costo: '',
            rendimiento: '',
            adjunto: {
                value: '',
                files: [],
                placeholder:'adjunto'
            }
        },
        rendimiento: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props

        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo rendimiento',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.rendimiento) {
                        const { rendimiento } = state
                        const { form } = this.state
                        if (rendimiento.unidad)
                            form.unidad = rendimiento.unidad.id.toString()
                        if (rendimiento.proveedor)
                            form.proveedor = rendimiento.proveedor.id.toString()

                        form.materiales = rendimiento.materiales
                        form.descripcion = rendimiento.descripcion
                        form.costo = rendimiento.costo
                        form.rendimiento = rendimiento.rendimiento
                        if (rendimiento.adjunto)
                            if (rendimiento.adjunto) {
                                form.adjunto.files = [{
                                    name: rendimiento.adjunto.name,
                                    url: rendimiento.adjunto.url
                                }]
                            }
                        this.setState({
                            ...this.state,
                            title: 'Editar rendimiento',
                            form,
                            rendimiento: rendimiento,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/presupuesto/rendimiento')
                } else
                    history.push('/presupuesto/rendimiento')
                break;
            default:
                break;
        }
        if (!egresos)
            history.push('/')
        this.getOptionsAxios()
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar rendimiento')
            this.editRendimientoAxios()
        else
            this.addRendimientoAxios()
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
        for (let counter = 0; counter < form[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form[name].value = ''
        }
        form[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rendimientos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades, proveedores } = response.data
                const { options } = this.state
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
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
    async addRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        if (form.adjunto.value !== '') {
            for (var i = 0; i < form.adjunto.files.length; i++) {
                data.append(`files_name_adjuntos[]`, form.adjunto.files[i].name)
                data.append(`files_adjuntos[]`, form.adjunto.files[i].file)
            }
        }
        await axios.post(URL_DEV + 'rendimientos', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/rendimiento'
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
    async editRendimientoAxios() {
        const { access_token } = this.props.authUser
        const { form, rendimiento } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjunto':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        if (form.adjunto.value !== '') {
            for (var i = 0; i < form.adjunto.files.length; i++) {
                data.append(`files_name_adjuntos[]`, form.adjunto.files[i].name)
                data.append(`files_adjuntos[]`, form.adjunto.files[i].file)
            }
        }
        await axios.post(URL_DEV + 'rendimientos/update/' + rendimiento.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La rendimiento fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/rendimiento'
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
        form['adjunto'].value = files
        form['adjunto'].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { formeditado, form, options, title } = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <RendimientoFormulario
                            formeditado={formeditado}
                            title={title}
                            form={form}
                            onChange={this.onChange}
                            clearFiles={this.clearFiles}
                            options={options}
                            onSubmit={this.onSubmit}
                            handleChange={this.handleChange}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RendimientoForm)