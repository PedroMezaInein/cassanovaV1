import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { EmpresaForm } from '../../../components/forms'
import swal from 'sweetalert'
import { Card } from 'react-bootstrap'
import { waitAlert } from '../../../functions/alert'

class EmpresasForm extends Component {

    state = {
        empresas: [],
        empresa: {},
        form: {
            name: '',
            razonSocial: '',
            logo: '',
            file: [],
            rfc: ''
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
                placeholder: 'Logo de la empresa',
                id: 'logo_de_la_empresa',
                value: '',
                files: []
            },
            {
                placeholder: 'Footer',
                id: 'footer',
                value: '',
                files: []
            },
            {
                placeholder: 'Isotipo',
                id: 'isotipo',
                value: '',
                files: []
            },
        ],
        adjuntos: [],
        defaultactivekey:"",
    }
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const empresas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nueva empresa',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.empresa)
                    {
                        const { empresa } = state
                        const { form, options } = this.state
                        
                        form.name = empresa.name
                        form.razonSocial = empresa.razon_social
                        form.logo= ''
                        form.file= empresa.logo
                        form.rfc= empresa.rfc

                        this.setState({
                            ... this.state,
                            title: 'Editar empresa',
                            empresa: empresa,
                            form,
                            options,                            
                            formeditado:1
                        })
                    }
                    else
                        history.push('/usuarios/empresas')
                }else
                    history.push('/usuarios/empresas')
                break;
            default:
                break;
        }
        if (!empresas)
            history.push('/')
    }
    
    onSubmit = (e) => {
        e.preventDefault()
        const{ title } = this.state
        waitAlert()
        if(title === 'Editar empresa'){
            this.updateEmpresaAxios()
        }else
            this.addEmpresaAxios();
    }

    async updateEmpresaAxios(empresa) {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa/' + empresa, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { empresas: empresas } } = response
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                const { history } = this.props
                    history.push({
                    pathname: '/usuarios/empresas'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    async addEmpresaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { empresas: empresas } } = response
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                const { history } = this.props
                    history.push({
                    pathname: '/usuarios/empresas'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',

                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',

            })
        })
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form } = this.state
        if (name === 'logo') {
            form['logo'] = value
            form['file'] = e.target.files[0]
            let img = URL.createObjectURL(e.target.files[0])
            this.setState({
                ... this.state,
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
                    ... this.state,
                    form
                })
            } else {
                form[name] = value
                this.setState({
                    ... this.state,
                    form
                })
            }
        }
    }

    removeFile = (e) => {
        e.preventDefault()
        const { name, logo, file, razon_social } = this.state.empresa
        this.setState({
            ... this.state,
            form: {
                name: name,
                razonSocial: razon_social,
                logo: '',
                file: logo
            },
            img: ''
        })
    }

    deleteFile = element => {
        swal({
            title: '¿Deseas eliminar el archivo?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }

    render() {
        const { form, img, title, formeditado} = this.state
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
                            removefile={this.removeFile}
                            form={form}
                            img={img}
                            onSubmit = {this.onSubmit}
                            onChange={(e) => this.handleChange(e)}
                            title={title}
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

export default connect(mapStateToProps, mapDispatchToProps)(EmpresasForm);