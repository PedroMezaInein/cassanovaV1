import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, questionAlert} from '../../functions/alert'
import { update } from '../../redux/reducers/auth_user'
import { ChangePasswordForm } from '../../components/forms'
import Swal from 'sweetalert2'

class AccountSettings extends Component {

    state = {
        form: {
            oldPassword: '',
            newPassword: '',
            newPassword2: '',
            foto: '',
            avatar: '',
            adjuntos: {
                firma: {
                    value: '',
                    placeholder: 'Ingresa la firma electrónica',
                    files: []
                }
            },
            correo_empresa:''
        },
        empresas: [],
        user: '',
        activeKey: '',
        formeditado: 0
    }

    componentDidMount() {
        this.getAccountOptions()
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        console.log(name, value, 'ON CHANGE')
        this.setState({ ...this.state, form })
    }

    clearAvatar = () => {

        const { avatar } = this.props.authUser.user
        const { form } = this.state
        form.foto = avatar
        this.setState({
            ...this.state,
            form
        })
    }

    onClickEmpresa = empresa => {

        this.getAccountOptions()

        const { user, form } = this.state

        let aux = ''

        user.empleado.firmas.map((element) => {
            if (element.empresa_id.toString() === empresa.toString())
                aux = element
            return ''
        })

        if (aux !== '')
            form.adjuntos.firma.files = [{ url: aux.firma, name: 'firma.' + this.getExtension(aux.firma) }]
        else
            form.adjuntos.firma.files = []

        aux = ''

        user.empleado.correos.map((element) => {
            if (element.empresa_id.toString() === empresa.toString())
                aux = element
            return ''
        })

        if (aux !== '')
            form.correo_empresa = aux.correo
        else
            form.correo_empresa = ''

        this.setState({
            ...this.state,
            activeKey: empresa,
            form
        })
    }

    getExtension = firma => {
        let aux = firma.split('.');
        if (aux.length > 0)
            return aux[aux.length - 1]
        return ''
    }

    getAccountOptions = async () => {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users/single/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { user, empresas } = response.data
                const { form } = this.state

                form.foto = user.avatar

                this.setState({
                    ...this.state,
                    empresas: empresas,
                    form,
                    user: user
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

    async changePasswordAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'user/users/change-password', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props

                doneAlert(response.data.message !== undefined ? response.data.message : 'La contraseña fue actualizada con éxito.')
                setTimeout(() => {
                    Swal.close()
                    history.push({
                        pathname: '/login'
                    });
                }, 1500);

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendAvatar = async (e) => {
        console.log('FORM', this.state.form)
        e.preventDefault();
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'user/users/avatar', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { update } = this.props
                update({
                    access_token: response.data.access_token,
                    user: response.data.user,
                    modulos: response.data.modulos
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El avatar fue actualizado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleChange = (files, item) => {
        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIAR LA FIRMA?', () => {
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
            this.sendFirma(item) 
        })
    }

    sendFirma = async (e) => {
        // e.preventDefault();
        waitAlert();
        const { access_token } = this.props.authUser
        const { form, activeKey } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        data.append('empresa', activeKey)
        await axios.post(URL_DEV + 'user/users/firma', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                // const { activeKey } = this.state
                doneAlert('Firma actualizada con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendCorreo = async (e) => {
        // e.preventDefault();
        waitAlert();
        const { access_token } = this.props.authUser
        const { form, activeKey } = this.state
        const data = new FormData();
        data.append('correo', form.correo_empresa)
        data.append('empresa', activeKey)
        await axios.post(URL_DEV + 'user/users/correo', data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Correo actualizado con éxito.')
            },
            (error) => {
                Swal.close()
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            Swal.close()
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { form, empresas, activeKey, user, formeditado } = this.state
        return (
            <Layout {...this.props}>
                <ChangePasswordForm
                    form={form}
                    onChange={this.onChange}
                    onSubmit={(e) => { e.preventDefault(); waitAlert(); this.changePasswordAxios() }}
                    sendAvatar={this.sendAvatar}
                    clearAvatar={this.clearAvatar}
                    handleChange={this.handleChange}
                    sendCorreo={this.sendCorreo}
                    empresas={empresas}
                    user={user}
                    onClickEmpresa={this.onClickEmpresa}
                    activeKey={activeKey}
                    formeditado = { formeditado }
                />
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
    update: payload => dispatch(update(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);