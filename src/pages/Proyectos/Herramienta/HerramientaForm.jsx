import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Swal from 'sweetalert2'
import swal from 'sweetalert';
import Layout from '../../../components/layout/layout';
import { URL_DEV } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { setOptions } from '../../../functions/setters';
import axios from 'axios'
import { HerramientasForm as HerramientasFormulario } from '../../../components/forms'
class HerramientaForm extends Component {
    state = {
        title: 'Nueva herramienta',
        formeditado: 0,
        options: {
            empresas: [],
            proyectos: []
        },
        form: {
            nombre: '',
            serie: '',
            modelo: '',
            empresa: '',
            proyecto: '',
            descripcion: '',
            fecha: new Date(),
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        },
        herramienta: ''
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
                    title: 'Nueva herramienta',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.herramienta) {
                        const { form } = this.state
                        const { herramienta } = state
                        form.nombre = herramienta.nombre
                        form.serie = herramienta.serie
                        form.modelo = herramienta.modelo
                        form.descripcion = herramienta.descripcion
                        form.fecha = new Date(herramienta.created_at)
                        if (herramienta.adjuntos) {
                            let aux = []
                            herramienta.adjuntos.map((adjunto) => {
                                aux.push({
                                    name: adjunto.name,
                                    url: adjunto.url,
                                    id: adjunto.id
                                })
                                return false
                            })
                            form.adjuntos.adjuntos.files = aux
                        }
                        this.setState({
                            ...this.state,
                            formeditado: 1,
                            herramienta: herramienta,
                            title: 'Editar herramienta',
                            form
                        })
                    }
                    else
                        history.push('/proyectos/herramientas')
                } else
                    history.push('/proyectos/herramientas')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }
    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.map((adj) => {
            aux.push({
                name: adj.name,
                url: adj.url,
                id: adj.id
            })
            return false
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ...this.state,
            form
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
        deleteAlert('¿Deseas eliminar el archivo?', () => this.deleteAdjuntoAxios(element.id))
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar herramienta')
            this.editHerramientaAxios()
        else
            this.createHerramientaAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'herramientas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos } = response.data
                const { options, herramienta, form } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                if (herramienta !== '') {
                    if (herramienta.empresa_id)
                        form.empresa = herramienta.empresa_id.toString()
                    if (herramienta.proyecto_id)
                        form.proyecto = herramienta.proyecto_id.toString()
                }
                this.setState({
                    ...this.state,
                    options,
                    form
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
    async createHerramientaAxios() {
        waitAlert()
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
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'herramientas', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/herramientas'
                });
                doneAlert('Herramienta creda con éxito')
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
    async editHerramientaAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, herramienta } = this.state
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
        await axios.post(URL_DEV + 'herramientas/' + herramienta.id, data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/herramientas'
                });
                doneAlert('Herramienta editada con éxito')
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
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { herramienta } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { herramienta } = response.data
                this.setAdjuntos(herramienta.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
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
    render() {
        const { title, form, formeditado, options } = this.state
        return (
            <Layout active='proyectos' {...this.props} >
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label" >
                                {title}
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <HerramientasFormulario
                            onChange={this.onChange}
                            form={form}
                            formeditado={formeditado}
                            options={options}
                            onSubmit={this.onSubmit}
                            handleChange={this.handleChange}
                            deleteFile={this.deleteFile}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(HerramientaForm)