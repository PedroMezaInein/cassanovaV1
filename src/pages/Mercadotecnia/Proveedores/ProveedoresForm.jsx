import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'
import Swal from 'sweetalert2'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { MercaProveedoresForm } from '../../../components/forms'

class ProveedoresForm extends Component{

    state = {
        title: 'Agregar proveedores',
        options: { subareas: [], bancos: [], tipos: [] },
        form: {
            nombre: '', rfc: '', razonSocial: '', correo: '', telefono: '', numCuenta: '', tipo: 0, banco: 0, subarea: ''
        },
        formeditado: 0
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const proveedores = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        })

        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo proveedor',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.proveedor) {
                        const { form } = this.state
                        const { proveedor } = state
                        
                        form.razonSocial = proveedor.razon_social
                        form.rfc = proveedor.rfc
                        form.subarea = proveedor.subarea ? proveedor.subarea.id.toString() : ''
                        
                        form.nombre = proveedor.nombre
                        form.correo = proveedor.email
                        form.telefono = proveedor.telefono

                        form.numCuenta = proveedor.numero_cuenta
                        form.tipo = proveedor.tipo_cuenta ? proveedor.tipo_cuenta.id.toString() : 0
                        form.banco = proveedor.banco ? proveedor.banco.id.toString() : 0

                        this.setState({ ...this.state, title: 'Editar proveedor', formeditado: 1, form, proveedor: proveedor })
                    }
                    else
                        history.push('/leads/proveedores')
                } else
                    history.push('/leads/proveedores')
                break;
            default:
                break;
        }
        if (!proveedores)
            history.push('/')
        this.getOptionsAxios()
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        if (name === 'razonSocial') {
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

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar proveedor')
            this.updateProveedorAxios()
        else
            this.addProveedorAxios()
    }

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(URL_DEV + 'mercadotecnia/proveedores/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { subareas, bancos, tipos_cuentas } = response.data
                const { options } = this.state
                options['subareas'] = setOptions(subareas, 'nombre', 'id')
                options['bancos'] = setSelectOptions(bancos, 'nombre')
                options['tipos'] = setSelectOptions(tipos_cuentas, 'tipo')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addProveedorAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'mercadotecnia/proveedores', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/merca-proveedores' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async updateProveedorAxios() {
        const { access_token } = this.props.authUser
        const { form, proveedor } = this.state
        await axios.put(URL_DEV + 'mercadotecnia/proveedores/' + proveedor.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/mercadotecnia/merca-proveedores' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render(){
        const { title, form, options, formeditado } = this.state
        return(
            <Layout active = 'mercadotecnia' {...this.props} >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <MercaProveedoresForm form = { form } onChange = { this.onChange } options = { options } formeditado = { formeditado } 
                            title = { title } onSubmit = { this.onSubmit } />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ProveedoresForm)