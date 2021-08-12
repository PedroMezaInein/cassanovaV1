import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, deleteAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { RemisionForm as RemisionFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class RemisionForm extends Component {
    state = {
        title: 'Nueva remisión',
        remision: '',
        options: {
            proyectos: [],
            areas: [],
            subareas: []
        },
        form: {
            proyecto: '',
            fecha: new Date(),
            area: '',
            subarea: '',
            descripcion: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
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
                    title: 'Nueva remisión',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.remision) {
                        const { form, options } = this.state
                        const { remision } = state
                        form.proyecto = remision.proyecto ? remision.proyecto.id.toString() : ''
                        if (remision.subarea) {
                            if (remision.subarea.area) {
                                if (remision.subarea.area.subareas) {
                                    options.subareas = setOptions(remision.subarea.area.subareas, 'nombre', 'id')
                                    form.area = remision.subarea.area.id.toString()
                                    form.subarea = remision.subarea.id.toString()
                                }
                            }
                        }
                        form.fecha = new Date(remision.created_at)
                        form.descripcion = remision.descripcion
                        if (remision.adjunto) {
                            form.adjuntos.adjunto.files = [remision.adjunto]
                        }
                        this.setState({
                            ...this.state,
                            form,
                            options,
                            remision: remision,
                            title: 'Editar remisión',
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/proyectos/remision')
                } else
                    history.push('/proyectos/remision')
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
        if (title === 'Editar remisión') {
            this.editRemisionAxios()
        } else
            this.addRemisionAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
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
    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios())
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, areas } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
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
    async addRemisionAxios() {
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
        await axios.post(URL_DEV + 'remision', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/remision'
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
    async editRemisionAxios() {
        const { access_token } = this.props.authUser
        const { form, remision } = this.state
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
        await axios.post(URL_DEV + 'remision/update/' + remision.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/remision'
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
    async deleteAdjuntoAxios() {
        const { access_token } = this.props.authUser
        const { remision } = this.state
        await axios.delete(URL_DEV + 'remision/' + remision.id + '/adjuntos' , { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.adjuntos.adjunto.files = []
                form.adjuntos.adjunto.value = ''

                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')

                this.setState({
                    ...this.state,
                    form
                })
            },
            (error) => { printResponseErrorAlert(error)}
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { form, title, options } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <RemisionFormulario
                            title={title}
                            form={form}
                            onChange={this.onChange}
                            options={options}
                            setOptions={this.setOptions}
                            onSubmit={this.onSubmit}
                            clearFiles={this.clearFiles}
                            handleChange = { this.handleChange }
                            deleteFile = { this.deleteFile }
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

export default connect(mapStateToProps, mapDispatchToProps)(RemisionForm);