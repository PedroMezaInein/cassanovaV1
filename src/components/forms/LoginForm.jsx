import React from 'react'
import axios from 'axios';
import { URL_DEV } from '../../constants'
import { connect } from 'react-redux'
import { login } from '../../redux/reducers/auth_user'
import swal from 'sweetalert'
import '../../styles/login-3.css'
import { Form } from 'react-bootstrap'
import { validateAlert } from '../../functions/alert'
import { Button } from '../../components/form-components'
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            form: {
                email: '',
                password: ''
            },
            error: {
                email: '',
                password: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    changeInputType = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }
    async handleSubmit(event) {
        event.preventDefault();
        const data = this.state.form;
        // let error = this.state.error;;
        await axios.post(URL_DEV + 'user/login', data).then(
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
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            error['password'] = 'Ingresaste un correo o contraseña equivocado catch. Intenta de nuevo'
            this.setState({
                error: error
            });
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
            })
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
                if (value.length < 1) {
                    error['email'] = 'No dejes este campo vacío.'
                    this.setState({
                        error: error
                    });
                } else {
                    if (!re.test(value)) {
                        error['email'] = 'Ingresa un correo electrónico válido.'
                        this.setState({
                            error: error
                        });
                    }
                    else {
                        error['email'] = ''
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
    render() {
        const { form, error, showPassword } = this.state
        return (
            <Form id="form-login"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(this.handleSubmit, e, 'form-login')
                    }
                }>
                <div className="form-group">
                    <input className={"form-control h-auto text-white bg-white-o-9 rounded-pill border-0 py-3 pl-4 font-size-sm"}
                        type="text"
                        placeholder="INGRESA TU CORREO ELECRÓNICO"
                        required
                        value={form.email}
                        onChange={this.handleChange}
                        name="email"
                    />
                    {
                        error.email !== '' &&
                        <div className="text-white mt-4 font-size-sm">
                            {error.email}
                        </div>
                    }
                </div>
                <div className="form-group">
                    <input className={"form-control h-auto text-white bg-white-o-9 rounded-pill border-0 py-3 pl-4 font-size-sm"}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="INGRESA TU CONTRASEÑA"
                        required
                        value={form.password}
                        onChange={this.handleChange}
                        name="password"
                    />
                </div>
                {
                    error.password !== '' &&
                    <div className="text-white font-size-sm">
                        {error.password}
                    </div>
                }
                <div className="form-group text-center mt-10 pt-4">
                    <Button
                        icon=''
                        className="btn btn-transparent-white font-weight-bold font-weight-bold opacity-90 pl-4 pr-4 font-size-sm"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.handleSubmit, e, 'form-login')
                            }
                        }
                        text="INICIAR SESIÓN"
                    />
                </div>
            </Form>
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