import React from 'react'
import axios from 'axios';
import { URL_DEV, EMAIL, LEADS_FRONT } from '../../constants'
import { connect } from 'react-redux'
import { login } from '../../redux/reducers/auth_user'
import { Form, Tab } from 'react-bootstrap'
import { validateAlert, errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../functions/alert'
import { InputLEmail, InputLPassword } from '../../components/form-components'
import WOW from 'wowjs';

class LoginForm extends React.Component {

    state = {
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
        },
        tab: 'login',
        token: ''
    }
    
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        new WOW.WOW({ live: false }).init();
        const { history } = this.props
        let queryString = history.location.search
        let token = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            token = params.get("token")

        }
        this.setState({
            ...this.state,
            tab: token === '' ? 'login' : 'nueva',
            token: token
        })
        if( localStorage.getItem('activeKeyTabModulo')===null){
            localStorage.setItem('activeKeyTabModulo', 'Repse')
        }
        if( localStorage.getItem('activeKeyTabColaboradores')===null){
            localStorage.setItem('activeKeyTabColaboradores', 'administrativo')
        }
    }

    validateEmail = (value) => {
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        let error = ''
        if (value.length < 1) {
            error = 'No dejes este campo vacío.'
        } else {
            if (!re.test(value)) {
                error = 'Ingresa un correo electrónico válido.'
            }
        }
        return error
    }

    validatePwd = (value) => {
        let error = ''
        if (value.length < 1) { 
            error = 'No dejes este campo vacío.' 
        } else {
            if (value.length < 5){
                error = 'La contraseña es muy corta.' 
            }
        }
        return error
    }

    sendRequestNewPassword = async() => {
        const { form, error } = this.state
        error['emailfp'] = this.validateEmail(form.emailfp)
        if( error['emailfp'] !== ''){
            this.setState({
                ...this.state,
                error
            })
        }else{
            waitAlert()
            await axios.post(`${URL_DEV}password`, form).then(
                (response) => {
                    doneAlert('Se envio un correo con las indicacione para restaurar tu contraseña.')
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { errorAlert('Ocurrió un error desconocido, intenta de nuevo.') })
        }
    }

    sendNewPassword = async() => {
        const { form, error } = this.state
        error['password'] = this.validatePwd(form.password)
        error['password2'] = this.validatePwd(form.password2)
        if(form.password !== form.password2)
            error['password2'] = 'Las contraseñas no coinciden'
        if(error['password'] !== '' || error['password2'] !== ''){
            this.setState({ ...this.state, error })
        }else{
            const { token } = this.state
            form.token = token
            await axios.post(`${URL_DEV}password/restaurar`, form).then(
                (response) => {
                    form.password = ''
                    form.password2 = ''
                    doneAlert('Contraseña actualizada con éxito.')
                    const { history } = this.props
                    history.push({
                        pathname: 'login',
                        search: ''
                    })
                    this.setState({...this.state, tab:'login', form})
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { errorAlert('Ocurrió un error desconocido, intenta de nuevo.') })
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { form, error } = this.state
         
        await axios.post(`${URL_DEV}user/login`, form, error).then(
            (response) => {
                const { history, login } = this.props
                const { access_token, user, modulos } = response.data
                login({ access_token: access_token, user: user, modulos: modulos })
                if(!user.permisos){
                    history.push('/login')
                }
                let perm = null
                let arreglo = ['calendario-tareas', 'crm', 'tareas','te-escuchamos','cuestionario-satisfaccion','incidencias']
                arreglo.forEach( (elemento) => {
                    if(!perm){
                        perm = user.permisos.find((permiso) => {
                            return permiso.modulo.slug === elemento
                        })
                    }
                })
                if(perm){
                    if(perm.modulo.slug === 'crm'){
                        window.location.href = `${LEADS_FRONT}/crm?tag=${access_token}`
                    }
                    else{
                        history.push(perm.modulo.url)
                    }
                } else  
                if(perm){
                    if(perm.modulo.slug === 'mi-proyecto'){
                        window.location.href = `${LEADS_FRONT}/mi-proyecto?tag=${access_token}`
                    }
                    else{
                        history.push(perm.modulo.url)
                    }
                }
                if(perm){
                    if(perm.modulo.slug === 'te-escuchamos'){
                        window.location.href = `${LEADS_FRONT}/mi-proyecto?tag=${access_token}`
                    }
                    else{
                        history.push(perm.modulo.url)
                    }
                }
                if(perm){
                    if(perm.modulo.slug === 'cuestionario-satisfaccion'){
                        window.location.href = `${LEADS_FRONT}/satisfaccion?tag=${access_token}`
                    }
                    else{
                        history.push(perm.modulo.url)
                    }
                }
                if(perm){
                    if(perm.modulo.slug === 'incidencias'){
                        window.location.href = `${LEADS_FRONT}/rh/incidencias?tag=${access_token}`
                    }
                    else{
                        history.push(perm.modulo.url)
                    }
                }
                else{
                    history.push(user.permisos[0].modulo.url)
                }
            },
            (e,error) => {
            error['password'] = ''
            }
        ).catch(( error) => {
            errorAlert('Ingresaste un correo o contraseña equivocado. Intenta de nuevo')
        }) 
     
   }

    handleChange(event) {
        let { error, form } = this.state
        const { name, value } = event.target
        form[name] = value;
        switch (name) {
            case 'email':
            case 'emailfp':
                error[name] = this.validateEmail(value)
                break;
            case 'password':
            case 'password2':
                error[name] = this.validatePwd(value)
                break;
            default:
                break;
        }
        this.setState({ ...this.state, form: form, error: error })
    }

    changeTab = tab => {
        const { form, error } = this.state
        form.email = ''
        form.password = ''
        form.password2 = ''
        form.emailfp = ''
        error.email = ''
        error.password = ''
        error.password2 = ''
        error.emailfp = ''
        this.setState({ ...this.state, form, error, tab: tab })
    }

    render() {
        const { form, error, tab } = this.state
        return (
            <Tab.Container activeKey = { tab } >
                <Tab.Content>
                    <Tab.Pane eventKey="login">
                        <Form className = 'form fv-plugins-bootstrap fv-plugins-framework'  noValidate="novalidate" id="form-login"
                            onSubmit = { (e) => { e.preventDefault(); validateAlert(this.handleSubmit, e, 'form-login') } }>
                            <div className="pb-5 pb-lg-15 text-center">
                                <h3 className="font-weight-bolder font-size-h2 font-size-h1-lg text-im">INICIAR SESIÓN</h3>
                            </div>
                            <InputLEmail name = 'email' value = { form.email } placeholder = 'INGRESA TU CORREO ELECRÓNICO'
                                onChange = { this.handleChange } error = { error } requirevalidation = { 1 }
                                letterCase = { false } patterns={EMAIL} />
                            <InputLPassword name = 'password' value = { form.password } placeholder = 'INGRESA TU CONTRASEÑA'
                                onChange = { this.handleChange } error = { error } requirevalidation = { 1 } letterCase = { false } />
                            <div className="form-group d-flex flex-wrap justify-content-end align-items-end pt-2">
                                <span className="text-muted text-hover-im font-weight-bold a-hover" onClick = { () => { this.changeTab('recuperar') }}>
                                    ¿Olvidaste tu contraseña?
                                </span>
                            </div>
                            <div className="container-login  px-0">
                                <span className = "btn-login btn-1" style = { { color: "#7fa1c9", fontWeight: 500 } } 
                                    onClick = { (e) => { e.preventDefault(); validateAlert(this.handleSubmit, e, 'form-login') } }>
                                    <svg> <rect x="0" y="0" fill="none" width="100%" height="100%" /> </svg>
                                    INICIAR SESIÓN
                                </span>
                            </div>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey = 'recuperar'>
                        <Form className = 'form fv-plugins-bootstrap fv-plugins-framework' noValidate="novalidate" id="form-forgotP"
                            onSubmit = { (e) => { e.preventDefault(); } }>
                            <div className="login-forgot wow fadeIn" data-wow-duration="1.5s">
                                <div className="pb-5 pb-lg-15 text-center">
                                    <div className="font-weight-bolder font-size-h2 font-size-h1-lg text-im mb-5">¿Olvidaste tu contraseña?</div>
                                    <div className="text-muted font-weight-bold">Ingresa tu correo electrónico para restablecer tu contraseña</div>
                                </div>
                                <InputLEmail name = 'emailfp' value = { form.emailfp } placeholder = 'INGRESA TU CORREO ELECRÓNICO'
                                    onChange = { this.handleChange } error = { error } requirevalidation = { 1 }
                                    letterCase = { false } patterns = { EMAIL } />
                                <div className="form-group d-flex flex-wrap flex-center mt-10">
                                    <span className = "btn btn-light-im btn-shadow-hover font-weight-bolder px-6 py-3" 
                                        onClick = { () => { this.sendRequestNewPassword() } } >
                                        Enviar
                                    </span>
                                    <span className="btn btn-light-danger font-weight-bolder px-6 py-3 ml-2" onClick={() => { this.changeTab('login') }}>
                                        Cancelar
                                    </span>
                                </div>
                            </div>
                        </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey = 'nueva'>
                        <Form className = 'form fv-plugins-bootstrap fv-plugins-framework' noValidate="novalidate" id="form-nueva"
                            onSubmit = { (e) => { e.preventDefault(); } }>
                            <div className="login-forgot wow fadeIn" data-wow-duration="1.5s">
                                <div className="pb-5 pb-lg-15 text-center">
                                    <div className="font-weight-bolder font-size-h2 font-size-h1-lg text-im mb-5">
                                        ¿Olvidaste tu contraseña?
                                    </div>
                                    <div className="text-muted font-weight-bold">
                                        Ingresa tu correo electrónico para restablecer tu contraseña
                                    </div>
                                </div>
                                <InputLPassword name = 'password' value = { form.password } placeholder = 'INGRESA UNA NUEVA CONTRASEÑA'
                                    onChange = { this.handleChange } error = { error } requirevalidation = { 1 } letterCase = { false } />
                                <InputLPassword name = 'password2' value = { form.password2 } placeholder = 'REPITE TU CONTRASEÑA'
                                    onChange = { this.handleChange } error = { error } requirevalidation = { 1 } letterCase = { false } />
                                <div className="form-group d-flex flex-wrap flex-center mt-10">
                                    <span className = "btn btn-light-im btn-shadow-hover font-weight-bolder px-6 py-3" 
                                        onClick = { () => { this.sendNewPassword() } } >
                                        Enviar
                                    </span>
                                </div>
                            </div>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ login: payload => dispatch(login(payload)) })
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
