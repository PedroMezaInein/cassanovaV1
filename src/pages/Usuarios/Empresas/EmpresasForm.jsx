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
import { setSingleHeader } from "../../../functions/routers"
import moment from 'moment'

class EmpresasForm extends Component {

    state = {
        empresas: [],
        empresa: {},
        navInfo: 'info',

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
            fecha_sociedad: new Date(),
            nombre_persona: '',
            direccion_persona: '',
            rfc_persona: '',
            telefono_persona: '',
            email_persona: '',
            tipo_consta: 'indicacion',
            numero_consta: '',
            nombre_notario: '',
            numero_notario: '',
            ciudad_notario: '',
            nombre_representante: '',
            tipo_persona: 'personaMoral',
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
        options: { 
            departamentos: [],
            tipo_persona: [
                // { text: "SELECCIONA TIPO DE PERSONA", value: 'indicacion' },
                // { text: "Persona Fisica", value: "personaFisica" },
                { text: "Persona Moral", value: "personaMoral" },
            ],
            tipo_consta: [
                { text: "SELECCIONA TIPO DE ACTA CONSTITUTIVA", value: 'indicacion' },
                { text: "El libro", value: "elLibro" },
                { text: "La poliza", value: "laPoliza" },
            ]
        }
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
    getOptionsAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/usuarios/empresas`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { options } = this.state
                const { departamentos } = response.data
                options.departamentos = []
                departamentos.forEach( ( element ) => {
                    options.departamentos.push({
                        name: element.nombre,
                        value: element.id.toString(),
                        label: element.nombre
                    })
                });
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
        await axios.put(`${URL_DEV}v2/usuarios/empresas/${empresa.id}`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito la empresa.')
                const { history } = this.props
                history.push({ pathname: '/usuarios/empresas' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addEmpresaAxios = async () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        console.log(form)
        await axios.post(`${URL_DEV}v2/usuarios/empresas`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                console.log(response)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.')
                const { history } = this.props
                history.push({ pathname: '/usuarios/empresas' });
            }, (error) => { 
                console.log(error.message)
                if(error.message ==='Request failed with status code 400'){
                    errorAlert('Favor de completar todos los campos, intenta de nuevo.')
                }else{   printResponseErrorAlert(error)  }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                form.tipo_persona = empresa.tipo_persona
                form.nombre_persona = empresa.nombre_persona
                form.direccion_persona = empresa.direccion_persona
                form.rfc_persona = empresa.rfc_persona
                form.telefono_persona = empresa.telefono_persona
                form.email_persona = empresa.email_persona
                form.tipo_consta = empresa.tipo_consta
                form.numero_consta = empresa.numero_consta
                form.nombre_notario = empresa.nombre_notario
                form.numero_notario = empresa.numero_notario
                form.ciudad_notario = empresa.ciudad_notario
                form.fecha_sociedad = empresa.fecha_sociedad !== null ? new Date(moment(empresa.fecha_sociedad)):''
                form.nombre_representante = empresa.nombre_representante
                let aux = []
                empresa.tipos.forEach((tipo) => { aux.push(tipo.tipo) })
                form.tipos = aux
                aux = []
                empresa.departamentos.forEach((depto) => { 
                    aux.push({ name: depto.nombre, label: depto.nombre, value: depto.id.toString() }) 
                })
                form.departamentos = aux
                this.setState({...this.state, form, empresa:empresa})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleChange = (e) => {
        /* e.preventDefault(); */
        const { form } = this.state
        const { name, value } = e.target
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
                            // onChange={this.handleChange}
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