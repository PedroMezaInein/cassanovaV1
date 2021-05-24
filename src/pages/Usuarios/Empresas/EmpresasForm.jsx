import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { PUSHER_OBJECT, URL_DEV } from '../../../constants'
import { EmpresaForm } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import Echo from 'laravel-echo';
import Swal from 'sweetalert2'
import { waitAlert, doneAlert, errorAlert, printResponseErrorAlert, userWarningAlert } from '../../../functions/alert'

class EmpresasForm extends Component {

    state = {
        empresas: [],
        empresa: {},
        form: {
            name: '',
            razonSocial: '',
            logo: '',
            file: [],
            rfc: '',
            tipoProyecto: '',
            tipos: [],
            direccion: '',
            telefonos: [],
            facebook: '',
            instagram: '',
            linkedin: '',
            pinterest: '',
            pagina_web:'',
            telefono:'',
            blog:'',
            departamentos: []
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        img: '',
        title: 'Nueva empresa',
        formAction: '',
        showadjuntos: [
            {
                placeholder: 'Logo de la empresa negro',
                id: 'logo_negro',
                value: '',
                files: []
            },
            {
                placeholder: 'Logo de la empresa blanco',
                id: 'logo_blanco',
                value: '',
                files: []
            },
            {
                placeholder: 'Isotipo',
                id: 'isotipo',
                value: '',
                files: []
            },
            {
                placeholder: 'Letras',
                id: 'letra',
                value: '',
                files: []
            }
        ],
        adjuntos: [],
        defaultactivekey: "",
        options: { departamentos: [] }
    }
    /* constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    } */

    tagInputChange = (nuevoTipos) => {
        const uppercased = nuevoTipos.map(tipo => tipo.toUpperCase()); 
        const { form } = this.state 
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.tipos = uppercased ? Object.keys(unico) : [];
        this.setState({
            form
        })
    }

    tagInputChangeTelefono = (nuevoTelefono) => {
        const uppercased = nuevoTelefono.map(telefono => telefono.toUpperCase());
        const { form } = this.state 
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.telefonos = uppercased ? Object.keys(unico) : [];
        this.setState({
            form
        })
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const empresas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva empresa',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.empresa) {
                        const { empresa } = state
                        this.getOneEmpresa(empresa.id)
                        this.setState({ ...this.state, title: 'Editar empresa', formeditado: 1 })
                    }
                    else
                        history.push('/usuarios/empresas')
                } else
                    history.push('/usuarios/empresas')
                break;
            default:
                break;
        }
        if (!empresas)
            history.push('/')
            this.getOptionsAxios();
        if(process.env.NODE_ENV === 'production'){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('Usuarios.Empresa').listen('Usuarios\\EmpresaEvent', (data) => {
                const { empresa } = this.state
                const { history } = this.props
                if(data.empresa.id === empresa.id)
                    userWarningAlert('Alguien más está editando lo mismo que tú.', 
                        () => { this.getOneEmpresa(empresa.id) },
                        () => { history.goBack() }
                    )
            })
        }
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { departamentos } = response.data
                const { options } = this.state
                options.departamentos = []
                departamentos.forEach( ( element ) => {
                    options.departamentos.push({
                        name: element.nombre,
                        value: element.id.toString(),
                        label: element.nombre
                    })
                });
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
            console.log(error, 'error')
        })
    }
    onSubmit = (e) => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar empresa') {
            this.updateEmpresaAxios()
        } else
            this.addEmpresaAxios();
    }

    updateEmpresaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, empresa } = this.state
        await axios.post(URL_DEV + 'empresa/' + empresa.id, form, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito la empresa.')
                const { history } = this.props
                history.push({ pathname: '/usuarios/empresas' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addEmpresaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'empresa', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.')
                const { history } = this.props
                history.push({ pathname: '/usuarios/empresas' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOneEmpresa = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/usuarios/empresas/${id}`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                const { form } = this.state
                form.name = empresa.name
                form.razonSocial = empresa.razon_social
                form.logo = ''
                form.rfc = empresa.rfc
                form.facebook = empresa.facebook
                form.instagram = empresa.instagram
                form.linkedin = empresa.linkedin
                form.pinterest = empresa.pinterest
                form.pagina_web = empresa.pagina_web
                form.direccion = empresa.direccion
                form.telefono = empresa.telefono
                form.blog = empresa.blog
                let aux = []
                empresa.tipos.map((tipo) => {
                    aux.push(tipo.tipo)
                    return false
                })
                form.tipos = aux
                this.setState({...this.state, form, empresa:empresa})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleChange = (e) => {
        /* e.preventDefault(); */
        const { name, value } = e.target
        const { form } = this.state
        if (name === 'logo') {
            form['logo'] = value
            form['file'] = e.target.files[0]
            let img = URL.createObjectURL(e.target.files[0])
            this.setState({
                ...this.state,
                form,
                img: img
            })
        }

        else {
            if (name === 'razonSocial') {
                let cadena = value.replace(/,/g, '')
                cadena = cadena.replace(/\./g, '')
                form[name] = cadena
                this.setState({
                    ...this.state,
                    form
                })
            } else {
                form[name] = value
                this.setState({
                    ...this.state,
                    form
                })
            }
        }
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
                        <EmpresaForm
                            form={form}
                            onSubmit={this.onSubmit}
                            onChange={(e) => this.handleChange(e)}
                            title={title}
                            formeditado={formeditado}
                            tagInputChange={(e) => this.tagInputChange(e)}
                            tagInputChangeTelefono={(e) => this.tagInputChangeTelefono(e)}
                            options = { options } 
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

export default connect(mapStateToProps, mapDispatchToProps)(EmpresasForm);