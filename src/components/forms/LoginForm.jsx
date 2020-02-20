import React from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';
import {URL_DEV} from '../../constants'
import { connect } from 'react-redux'
import { login } from '../../redux/reducers/auth_user'

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

    async handleSubmit (event){
        event.preventDefault();
        const data = this.state.form;
        let error = this.state.error;;
        await axios.post(URL_DEV + 'user/login', data).then(
            (response) => {
                const { history, login } = this.props
                login({
                    access_token: response.data.access_token,
                    user: response.data.user
                })
                history.push('/');
            },
            (error) => {
                error['password'] = 'Ingresaste un correo o contraseña equivocado. Intenta de nuevo'
                this.setState({
                    error: error
                });
            }
        ).catch((error) => {
            error['password'] = 'Ingresaste un correo o contraseña equivocado catch. Intenta de nuevo'
            this.setState({
                error: error
            });
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
        switch(name){
            case 'email':
                if(value.length < 1){
                    error['email'] = 'No dejes este campo vacío.'
                    this.setState({
                        error: error
                    });
                }else{
                    if(!re.test(value)){
                        error['email'] = 'Ingresa un correo electrónico válido.'
                        this.setState({
                            error: error
                        });
                    }
                    else{
                        error['email'] = ''
                        this.setState({
                            error: error
                        });
                    }
                }
                break;
            case 'password':
                if(value.length < 1){
                    error['password'] = 'No dejes este campo vacío.'
                    this.setState({
                        error: error
                    });
                }else{
                    if(value.length < 5){
                        error['password'] = 'La contraseña es muy corta.'
                        this.setState({
                            error: error
                        });
                    }
                    else{
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Control 
                    type="text"
                    placeholder="Ingresa tu email"
                    required
                    className={this.state.error.email !== '' ? 'error ' : ''}
                    value={this.state.form.email}
                    onChange={this.handleChange}
                    name="email"/>
                    {
                        this.state.error.email !== '' &&
                            <label className="label-error">
                                {this.state.error.email}
                            </label>
                    }
                <InputGroup>
                    <Form.Control
                        type={this.state.showPassword ? 'text' : 'password'} 
                        placeholder="Ingresa tu constraseña" 
                        required
                        value={this.state.form.password}
                        onChange={this.handleChange}
                        className={this.state.error.password !== '' ? 'error' : 'mt-3'}
                        name="password"
                        />
                    <InputGroup.Prepend 
                        onClick={this.changeInputType}
                        className={this.state.error.password !== '' ? 'error' : 'mt-3'}>
                        <InputGroup.Text id="inputGroupPrepend">
                            {
                                this.state.showPassword ?
                                    <FontAwesomeIcon icon={faEye} />
                                :
                                    <FontAwesomeIcon icon={faEyeSlash} />
                            }
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                </InputGroup>
                {
                    this.state.error.password !== '' &&
                        <label className="label-error">
                            {this.state.error.password}
                        </label>
                }
                <div className="d-flex justify-content-center">
                    <Button type="submit"
                        className="mt-4 mx-auto px-4 button-enviar"
                        disabled={
                            this.state.form.email === '' ||
                            this.state.form.password === '' ||
                            this.state.error.email !== '' ||
                            this.state.error.password !== ''
                        }>
                        Enviar
                    </Button>
                </div>            
            </Form>
        )
    }
}
const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
    login: payload => dispatch(login(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);