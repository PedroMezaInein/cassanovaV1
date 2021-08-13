import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import Swal from 'sweetalert2'
import { setOptions } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
import { DocumentosForm as DocumentosFormulario } from '../../../components/forms'
class DocumentosForm extends Component {
    state = {
        title: 'Documento nuevo',
        formeditado: 0,
        options: {
            empresas: []
        },
        form: {
            empresa: '',
            nombre: '',
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        },
        documento: ''
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
                    title: 'Documento nuevo',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.documento) {
                        const { documento } = state
                        const { form } = this.state
                        if (documento.empresa)
                            form.empresa = documento.empresa.id.toString()
                        form.nombre = documento.nombre
                        let aux = []
                        if (documento.adjuntos) {
                            documento.adjuntos.map((adj) => {
                                aux.push({
                                    url: adj.url,
                                    name: adj.name,
                                    id: adj.id
                                })
                                return false
                            })
                        }
                        form.adjuntos.adjuntos.files = aux
                        this.setState({
                            ...this.state,
                            form,
                            title: 'Editar documento',
                            documento: documento
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
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
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
    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar documento')
            this.editHerramientaAxios()
        else
            this.createDocumentoAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'documentos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async createDocumentoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
        await axios.post(URL_DEV + 'documentos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/administracion/documentos'
                });
                doneAlert('Documento credo con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async editHerramientaAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, documento } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
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
        await axios.post(URL_DEV + 'documentos/' + documento.id, data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/administracion/documentos'
                });
                doneAlert('Documento editada con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { documento } = this.state
        await axios.delete(URL_DEV + 'documentos/' + documento.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { documento } = response.data
                this.setAdjuntos(documento.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { title, form, options, formeditado } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label">
                                {title}
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <DocumentosFormulario 
                            form={form}
                            formeditado={formeditado}
                            options={options} 
                            onChange={this.onChange}
                            handleChange={this.handleChange}
                            deleteFile={this.deleteFile}
                            onSubmit={this.onSubmit}
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentosForm)