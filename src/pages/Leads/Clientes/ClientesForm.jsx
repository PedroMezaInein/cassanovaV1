import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { ClienteForm } from '../../../components/forms'
import Layout from '../../../components/layout/layout';
import { URL_DEV } from '../../../constants'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import moment from 'moment'

class ClientesForm extends Component {
    state = {
        clientes: [],
        cliente: '',
        title: 'Nuevo cliente',
        estado: '',
        municipio: '',
        data: {
            clientes: []
        },
        formeditado: 0,
        colonias: [],
        form: {
            colonias: [],
            empresa: '',
            nombre: '',
            puesto: '',
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            perfil: '',
            rfc: '',
            contacto:'',
            tipo_persona: 'indicacion',
            fecha_sociedad: new Date(),
            numero_consta: '',
            nombre_notario: '',
            numero_notario: '',
            ciudad_notario: '',
            tipo_consta: 'indicacion',
        },
        options: { 
            tipo_persona: [
                { text: "SELECCIONA TIPO DE PERSONA", value: 'indicacion' },
                { text: "Persona Fisica", value: "personaFisica" },
                { text: "Persona Moral", value: "personaMoral" },
            ],
            tipo_consta: [
                { text: "SELECCIONA TIPO DE ACTA CONSTITUTIVA", value: 'indicacion' },
                { text: "El libro", value: "elLibro" },
                { text: "La poliza", value: "laPoliza" },
            ]
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo cliente',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.cliente) {
                        const { form } = this.state                     
                        const { cliente } = state
                        if (cliente.cp) {
                            form['cp'] = cliente.cp
                            form['estado'] = cliente.estado
                            form['municipio'] = cliente.municipio
                        }
                        if (cliente.colonia) {
                            form['colonia'] = cliente.colonia
                        }
                        form['empresa'] = cliente.empresa
                        form['nombre'] = cliente.nombre
                        form['puesto'] = cliente.puesto
                        form['calle'] = cliente.calle
                        form['perfil'] = cliente.perfil
                        form['rfc'] = cliente.rfc
                        form.ciudad_notario = cliente.ciudad_notario
                        form.direccion_persona = cliente.direccion_persona
                        form.email_persona = cliente.email_persona
                        form.fecha_sociedad = cliente.fecha_sociedad !== null ? new Date(moment(cliente.fecha_sociedad)) : ''
                        form.nombre_notario = cliente.nombre_notario
                        form.nombre_persona = cliente.nombre_persona
                        form.nombre_representante = cliente.nombre_representante
                        form.numero_consta = cliente.numero_consta
                        form.numero_notario = cliente.numero_notario
                        form.rfc_persona = cliente.rfc_persona
                        form.telefono_persona = cliente.telefono_persona
                        form.tipo_consta = cliente.tipo_consta
                        form.tipo_persona = cliente.tipo_persona
                        this.setState({
                            ...this.state,
                            cliente: cliente,
                            title: 'Editar cliente',
                            form,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/leads/clientes')
                } else
                    history.push('/leads/clientes')
                break;
            default:
                break;
        }
    }
    onSubmit = e => {
        e.preventDefault();
        const { title } = this.state
        waitAlert()
        if (title === 'Editar cliente') {
            this.editClienteAxios();
        } else {
            this.addClienteAxios();
        }
    }
    async addClienteAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/clientes'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente agregado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async editClienteAxios() {
        const { access_token } = this.props.authUser
        const { cliente, form } = this.state
        await axios.put(URL_DEV + 'cliente/' + cliente.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/clientes'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente editado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    updateColonia = value => {
        this.onChange({ target: { name: 'colonia', value: value } })
    }
    onChange = event => {
        const { form } = this.state
        const { name, value } = event.target
        if (name === 'empresa') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { form, formeditado, estado, municipio, colonias, title } = this.state
        return (
            <Layout active='leads'  {...this.props} >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ClienteForm
                            formeditado={formeditado}
                            onChange={this.onChange}
                            form={form}
                            estado={estado}
                            municipio={municipio}
                            colonias={colonias}
                            // updateColonia={this.updateColonia}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientesForm)