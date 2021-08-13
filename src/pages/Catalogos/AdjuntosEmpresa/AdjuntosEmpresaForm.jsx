import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { AdjuntosEmpresaForm as AdjuntosEmpresaFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class AdjuntosEmpresaForm extends Component {
    state = {
        title: 'Nuevo adjunto',
        adjunto: '',
        form: {
            empresa: '',
            tipo_adjunto: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa el adjunto',
                    files: []
                }
            }
        },
        options: {
            empresas: []
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const adjuntos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo adjunto',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.adjunto) {
                        const { form } = this.state
                        const { adjunto } = state
                        if (adjunto.empresa) {
                            form.empresa = adjunto.empresa.id.toString()
                        }
                        if (adjunto.tipo_adjunto)
                            form.tipo_adjunto = adjunto.tipo_adjunto.id.toString()
                        let aux = []
                        if (adjunto.adjuntos)
                            adjunto.adjuntos.map((adj) => {
                                aux.push(
                                    {
                                        name: adj.name, url: adj.url
                                    }
                                )
                                return false
                            })
                        form.adjuntos.adjunto.files = aux
                        this.setState({
                            ...this.state,
                            title: 'Editar adjunto',
                            form,
                            adjunto: adjunto
                        })
                    }
                    else
                        history.push('/catalogos/adjuntos')
                } else
                    history.push('/catalogos/adjuntos')
                break;
            default:
                break;
        }
        if (!adjuntos)
            history.push('/')
        this.getOptionsAxios();
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'catalogos/adjunto/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
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
        e.preventDefault();
        const { title } = this.state
        if (title === 'Editar adjunto')
            this.editAdjuntoAxios()
        else
            this.addAdjuntoAxios()
    }
    async addAdjuntoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'adjuntos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/catalogos/adjuntos'
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
    async editAdjuntoAxios() {
        const { access_token } = this.props.authUser
        const { form, adjunto } = this.state
        await axios.put(URL_DEV + 'adjuntos/' + adjunto.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/catalogos/adjuntos'
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
        const { form, title } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <AdjuntosEmpresaFormulario
                            onChange={this.onChange}
                            formeditado={0}
                            form={form}
                            title={title}
                            onSubmit={this.onSubmit}
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

export default connect(mapStateToProps, mapDispatchToProps)(AdjuntosEmpresaForm);