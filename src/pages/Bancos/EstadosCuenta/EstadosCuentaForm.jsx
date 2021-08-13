import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { waitAlert, doneAlert, errorAlert, printResponseErrorAlert, deleteAlert } from '../../../functions/alert'
import { Card } from 'react-bootstrap'
import { EstadosCuentaForm as EstadosCuentaFormulario } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions } from '../../../functions/setters'
class EstadosCuentaForm extends Component {
    state = {
        title: 'Nuevo estado de cuenta',
        formeditado: 0,
        form: {
            fecha: new Date(),
            cuenta: '',
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
        options: {
            cuentas: []
        },
        estados: [],
        data: {
            estados: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history } = this.props
        const estados = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        if (!estados)
            history.push('/')
        this.getOptionsAxios()
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo estado de cuenta',
                    formeditado: 0
                })
                break;
            default:
                break;
        }
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
        deleteAlert('DESEAS ELIMINAR EL ARCHIVO', '', () => this.deleteAdjuntoAxios(element.id))
    }
    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        this.addEstadoAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'estados-cuentas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { cuentas } = response.data
                const { options } = this.state
                options.cuentas = setOptions(cuentas, 'nombre', 'numero')
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
    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                default:
                    data.append(element, form[element]);
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
        await axios.post(URL_DEV + 'estados-cuentas', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/bancos/estados-cuenta'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
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
        waitAlert()
        const { access_token } = this.props.authUser
        const { estado } = this.state
        await axios.delete(URL_DEV + 'estados-cuenta/' + estado.id + '/adjuntos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.aux = ''
                this.setState({
                    ...this.state,
                    form
                })
                doneAlert('Adjunto eliminado con éxito')
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
        const { form, formeditado, options, title } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <EstadosCuentaFormulario
                            options={options}
                            form={form}
                            formeditado={formeditado}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange}
                            handleChange={this.handleChange}
                            deleteFile={this.deleteFile}
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
export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuentaForm);