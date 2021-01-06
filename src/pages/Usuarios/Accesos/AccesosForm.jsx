import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { AccesosForm as AccesosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { setSelectOptions } from '../../../functions/setters'

class AccesosForm extends Component {

    state = {
        form: {
            plataforma: '',
            link: '',
            user: '',
            password: '',
            usuarios: [],
            email: '',
            telefono: '',
            empresas: [],
            descripcion: '',
        },
        options: {
            usuarios: [],
            empresas: [],
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const accesos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo acceso',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.acceso) {
                        const { acceso } = state
                        const { form, options } = this.state
                        form.plataforma = acceso.plataforma
                        form.link = acceso.link
                        form.user = acceso.user
                        form.password = acceso.password
                        form.usuarios = acceso.usuarios
                        form.email = acceso.email
                        form.telefono = acceso.telefono
                        form.empresas = acceso.empresas
                        form.descripcion = acceso.descripcion
                        this.setState({
                            ...this.state,
                            title: 'Editar acceso',
                            acceso: acceso,
                            form,
                            options,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/usuarios/accesos')
                } else
                    history.push('/usuarios/accesos')
                break;
            default:
                break;
        }
        if (!accesos)
            history.push('/')
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'accesos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { usuarios, empresas } = response.data
                const { options } = this.state
                options['usuarios'] = setSelectOptions(usuarios, 'name', 'id')
                options['empresas'] = setSelectOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
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
    deleteOption = (option, arreglo) => {
        const { form, options } = this.state
        let aux = []
        form[arreglo].map((element, key) => {
            if (option.value.toString() !== element.value.toString())
                aux.push(element)
            else
                options[arreglo].push(element)
            return false
        })
        form[arreglo] = aux
        this.setState({
            ...this.state,
            options,
            form
        })
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
    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        options[arreglo] = aux
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
    }
    onChangeEmpresa = empresa => {
        const { options, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        options.empresas.find(function (_aux) {
            if (_aux.value.toString() === empresa.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        options.empresas = aux
        form['empresas'] = auxEmpresa
        this.setState({
            ...this.state,
            form,
            options
        })
    }
    updateEmpresa = empresa => {
        const { form, options } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                options.empresas.push(element)
            }
            return false
        })
        form.empresas = aux
        this.setState({
            ...this.state,
            options,
            form
        })
    }
    render() {
        const { form, title, formeditado, options } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <AccesosFormulario
                            form={form}
                            formeditado={formeditado}
                            options={options}
                            onChange={this.onChange}
                            onChangeAndAdd={this.onChangeAndAdd}
                            deleteOption={this.deleteOption}
                            onChangeEmpresa={this.onChangeEmpresa}
                            updateEmpresa={this.updateEmpresa}
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

export default connect(mapStateToProps, mapDispatchToProps)(AccesosForm);