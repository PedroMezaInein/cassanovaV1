import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { ConceptoForm } from '../../../components/forms'
import { errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../../functions/alert'
import { Card } from 'react-bootstrap'
class Conceptos extends Component {

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nuevo concepto',
        options: {
            unidades: [],
            partidas: [],
            subpartidas: [],
            proveedores: [],
        },
        data: {
            conceptos: []
        },
        formeditado: 0,
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: '',
            proveedor: '',
        },
        conceptos: [],
        concepto: ''
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
                    title: 'Nuevo concepto',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.concepto) {
                        const { form, options } = this.state
                        const { concepto } = state
                        form.descripcion = concepto.descripcion
                        form.costo = concepto.costo
                        form.unidad = concepto.unidad.id.toString()
                        if (concepto.subpartida) {
                            if (concepto.subpartida.partida) {
                                form.partida = concepto.subpartida.partida.id.toString()
                                options['subarea'] = setOptions(concepto.subpartida.partida.subpartidas, 'nombre', 'id')
                                form.subpartida = concepto.subpartida.id.toString()
                                options['subpartidas'] = setOptions(concepto.subpartida.partida.subpartidas, 'nombre', 'id')
                            }
                        }
                        if (concepto.proveedor)
                            form.proveedor = concepto.proveedor.id.toString()
                        this.setState({
                            ...this.state,
                            title: 'Editar concepto',
                            form,
                            concepto: concepto,
                            options,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/presupuesto/conceptos')
                } else
                    history.push('/presupuesto/conceptos')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            form[element] = ''
            return false
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar concepto')
            this.editConceptoAxios()
        else
            this.addConceptoAxios()
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

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'conceptos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades, partidas, proveedores } = response.data
                const { options } = this.state
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
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

    async addConceptoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'conceptos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/presupuesto/conceptos' })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editConceptoAxios() {
        const { access_token } = this.props.authUser
        const { form, concepto } = this.state
        await axios.put(URL_DEV + 'conceptos/' + concepto.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'La concepto fue editado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/presupuesto/conceptos' })
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
        const { title, form, options, formeditado } = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ConceptoForm
                            form={form}
                            options={options}
                            setOptions={this.setOptions}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            formeditado={formeditado}
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);