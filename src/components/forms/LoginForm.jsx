import React from 'react'
import axios from 'axios';
import { URL_DEV, EMAIL} from '../../constants'
import { connect } from 'react-redux'
import { login } from '../../redux/reducers/auth_user'
import { Form } from 'react-bootstrap'
import { validateAlert, errorAlert } from '../../functions/alert'
import { InputLEmail, InputLPassword } from '../../components/form-components'
import WOW from 'wowjs';
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showForgotP: false,
            showSingIn: true,
            form: {
                email: '',
                password: '',
                emailfp: ''
            },
            error: {
                email: '',
                password: '',
                emailfp: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount = () => {
        new WOW.WOW({
            live: false
        }).init();
    }
    async handleSubmit(event) {
        event.preventDefault();
        const data = this.state.form;
        // let error = this.state.error;;
        await axios.post(`${URL_DEV}user/login`, data).then(
            (response) => {
                const { history, login } = this.props
                login({
                    access_token: response.data.access_token,
                    user: response.data.user,
                    modulos: response.data.modulos
                })
                history.push('/');
            },
            (error) => {
                error['password'] = 'Ingresaste un correo o contraseña equivocado. Intenta de nuevo'
                this.setState({
                    error: error
                });
                if (error.response.status === 401) {
                } else {
                    errorAlert('Ocurrió un error desconocido, intenta de nuevo.')
                    // swal({
                    //     title: '¡Ups 😕!',
                    //     text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                    //     icon: 'error',
                    // })
                }
            }
        ).catch((error) => {
            error['password'] = 'Ingresaste un correo o contraseña equivocado catch. Intenta de nuevo'
            this.setState({
                error: error
            });
            errorAlert('Ocurrió un error desconocido, intenta de nuevo.')
            // swal({
            //     title: '¡Ups 😕!',
            //     text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
            //     icon: 'error',
            // })
        })
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        let error = this.state.error;
        let form = this.state.form;
        form[name] = value;
        this.setState({
            form: form
        })
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        switch (name) {
            case 'email':
            case 'emailfp':
                if (value.length < 1) {
                    error['email'] = 'No dejes este campo vacío.'
                    error['emailfp'] = 'No dejes este campo vacío.'
                    this.setState({
                        error: error
                    });
                } else {
                    if (!re.test(value)) {
                        error['email'] = 'Ingresa un correo electrónico válido.'
                        error['emailfp'] = 'Ingresa un correo electrónico válido.'
                        this.setState({
                            error: error
                        });
                    }
                    else {
                        error['email'] = ''
                        error['emailfp'] = ''
                        this.setState({
                            error: error
                        });
                    }
                }
                break;
            case 'password':
                if (value.length < 1) {
                    error['password'] = 'No dejes este campo vacío.'
                    this.setState({
                        error: error
                    });
                } else {
                    if (value.length < 5) {
                        error['password'] = 'La contraseña es muy corta.'
                        this.setState({
                            error: error
                        });
                    }
                    else {
                        error['password'] = ''
                        this.setState({
                            error: error
                        });
                    }
                }
                break;
            default:
                break;
        }
    }
    showForgotP() {
        const { showForgotP } = this.state
        this.setState({
            ...this.state,
            showForgotP: !showForgotP,
            showSingIn: false
        })
    }
    showSingIn() {
        const { showSingIn } = this.state
        this.setState({
            ...this.state,
            showSingIn: !showSingIn,
            showForgotP: false
        })
    }
    render() {
        const { form, error } = this.state
        return (
            <>
                <Form className={this.state.showSingIn ? 'form fv-plugins-bootstrap fv-plugins-framework' : 'd-none'} noValidate="novalidate" id="form-login"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(this.handleSubmit, e, 'form-login')
                        }
                    }>
                    <div className="pb-5 pb-lg-15 text-center">
                        <h3 className="font-weight-bolder font-size-h2 font-size-h1-lg text-im">INICIAR SESIÓN</h3>
                    </div>
                        <InputLEmail
                            name='email'
                            value={form.email}
                            placeholder='INGRESA TU CORREO ELECRÓNICO'
                            onChange={this.handleChange}
                            error={error}
                            requirevalidation={1}
                            letterCase = { false }
                            patterns={EMAIL}
                        />
                        <InputLPassword
                            name='password'
                            value={form.password}
                            placeholder='INGRESA TU CONTRASEÑA'
                            onChange={this.handleChange}
                            error={error}
                            requirevalidation={1}
                            letterCase = { false }
                        />
                    <div className="form-group d-flex flex-wrap justify-content-end align-items-end pt-2">
                        <a className="text-muted text-hover-im font-weight-bold a-hover" onClick={() => { this.showForgotP() }}>¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className="container-login  px-0">
                        <a className="btn-login btn-1" style={{ color: "#7fa1c9", fontWeight: 500 }} onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.handleSubmit, e, 'form-login')
                            }
                        }>
                            <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%" />
                            </svg>
                            INICIAR SESIÓN
                        </a>
                    </div>
                </Form>
                <Form className={this.state.showForgotP ? 'form fv-plugins-bootstrap fv-plugins-framework' : 'd-none'} noValidate="novalidate" id="form-forgotP"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(this.handleSubmit, e, 'form-forgotP')
                        }
                    }>
                    <div className="login-forgot wow fadeIn" data-wow-duration="1.5s">
                        <div className="pb-5 pb-lg-15 text-center">
                            <div className="font-weight-bolder font-size-h2 font-size-h1-lg text-im mb-5">¿Olvidaste tu contraseña?</div>
                            <div className="text-muted font-weight-bold">Ingresa tu correo electrónico para restablecer tu contraseña</div>
                        </div>
                        <InputLEmail
                            name='emailfp'
                            value={form.emailfp}
                            placeholder='INGRESA TU CORREO ELECRÓNICO'
                            onChange={this.handleChange}
                            error={error}
                            requirevalidation={1}
                            letterCase = { false }
                            patterns={EMAIL}
                        />
                        <div className="form-group d-flex flex-wrap flex-center mt-10">
                            <a className="btn btn-light btn-shadow-hover font-weight-bolder px-6 py-3">Enviar</a>
                            <a className="btn btn-light-danger font-weight-bolder px-6 py-3 ml-2" onClick={() => { this.showSingIn() }}>Cancelar</a>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}
const mapDispatchToProps = dispatch => ({
    login: payload => dispatch(login(payload))
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);


